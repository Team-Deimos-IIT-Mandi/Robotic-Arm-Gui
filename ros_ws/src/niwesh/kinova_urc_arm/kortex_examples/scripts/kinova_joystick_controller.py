#!/usr/bin/env python3

import rospy
from std_msgs.msg import Int8, Bool
from geometry_msgs.msg import TwistStamped
from control_msgs.msg import JointJog
from sensor_msgs.msg import Joy
from kortex_driver.srv import *
from kortex_driver.msg import *
import threading
import sys
import time

class KinovaServoJoystickController:
    def __init__(self, robot_namespace="my_gen3"):
        self.robot_namespace = robot_namespace
        
        # Movement parameters - REDUCED for smoother control
        self.linear_scale = 0.3   # Much smaller for precise control
        self.angular_scale = 0.4  # Much smaller for precise control
        
        # Control modes
        self.TRANSLATION_MODE = 0
        self.ROTATION_MODE = 1
        self.current_mode = self.TRANSLATION_MODE
        
        # Button mappings for Xbox controller
        self.buttons = {
            'mode_switch': 0,    # A button - switch between translation/rotation
            'emergency_stop': 1, # B button - emergency stop
            'gripper_open': 4,   # LB button - open gripper
            'gripper_close': 5,  # RB button - close gripper
            'servo_start': 6,    # Back button - start servo
            'servo_stop': 7,     # Start button - stop servo
        }
        
        # Axis mappings for Xbox controller
        self.axes = {
            'left_x': 0,     # Left stick horizontal
            'left_y': 1,     # Left stick vertical
            'right_x': 3,    # Right stick horizontal  
            'right_y': 4,    # Right stick vertical
            'lt': 2,         # Left trigger (up/down in translation, roll in rotation)
            'rt': 5,         # Right trigger 
        }
        
        # State variables
        self.last_joy_msg = None
        self.emergency_stopped = False
        self.mode_button_pressed = False
        self.servo_active = True
        self.servo_status = 0
        self.last_command_time = rospy.Time.now()
        self.command_timeout = 0.1  # Send zero command if no input for 100ms
        
        self.setup_ros()
        self.setup_gripper_services()
        
        # Start watchdog timer for sending zero commands
        self.watchdog_timer = rospy.Timer(rospy.Duration(0.05), self.watchdog_callback)
        
        rospy.loginfo("Kinova MoveIt Servo Joystick Controller initialized")
        rospy.loginfo(f"Current mode: {'TRANSLATION' if self.current_mode == self.TRANSLATION_MODE else 'ROTATION'}")
        rospy.loginfo("Servo should already be running - ready to control!")

    def setup_ros(self):
        """Setup ROS subscribers and publishers"""
        # Subscribe to joystick
        self.joy_sub = rospy.Subscriber('/joy', Joy, self.joy_callback, queue_size=1)
        
        # MoveIt Servo publishers
        self.twist_pub = rospy.Publisher(
            '/servo_server/delta_twist_cmds', 
            TwistStamped, 
            queue_size=1
        )
        
        self.joint_pub = rospy.Publisher(
            '/servo_server/delta_joint_cmds',
            JointJog,
            queue_size=1
        )
        
        # Subscribe to servo status (using Int8 instead of ServoStatus)
        self.servo_status_sub = rospy.Subscriber(
            '/servo_server/status',
            Int8,
            self.servo_status_callback,
            queue_size=1
        )
        
        rospy.loginfo("ROS topics setup complete")

    def setup_gripper_services(self):
        """Setup Kortex gripper services"""
        try:
            # Wait for services
            base_service = f"/{self.robot_namespace}/base"
            
            rospy.wait_for_service(f"{base_service}/send_gripper_command", timeout=5.0)
            
            self.send_gripper_command = rospy.ServiceProxy(
                f"{base_service}/send_gripper_command", 
                SendGripperCommand
            )
            
            rospy.loginfo("Gripper services setup complete")
            
        except rospy.ROSException as e:
            rospy.logwarn(f"Gripper services not available: {e}")
            self.send_gripper_command = None

    def servo_status_callback(self, msg):
        """Handle servo status updates"""
        self.servo_status = msg.data
        rospy.loginfo_throttle(5.0, f"Servo status: {msg.data}")

    def watchdog_callback(self, timer_event):
        """Send zero command if no joystick input received recently"""
        current_time = rospy.Time.now()
        if (current_time - self.last_command_time).to_sec() > self.command_timeout:
            # Send zero velocity command
            zero_twist = TwistStamped()
            zero_twist.header.stamp = current_time
            zero_twist.header.frame_id = "base_link"
            # All velocities are already zero by default
            self.twist_pub.publish(zero_twist)

    def joy_callback(self, msg):
        """Process joystick input"""
        if len(msg.axes) < 6 or len(msg.buttons) < 8:
            rospy.logwarn_throttle(5.0, "Xbox controller doesn't have expected axes/buttons")
            return
            
        self.last_joy_msg = msg
        self.last_command_time = rospy.Time.now()
        
        # Handle button presses
        self.handle_buttons(msg)
        
        # Skip movement if emergency stopped
        if self.emergency_stopped:
            return
            
        # Process movement commands
        self.handle_servo_control(msg)

    def handle_buttons(self, msg):
        """Handle button presses"""
        # Emergency stop (B button)
        if msg.buttons[self.buttons['emergency_stop']]:
            if not self.emergency_stopped:
                self.emergency_stop()
        
        # Mode switching (A button - on press, not hold)
        if msg.buttons[self.buttons['mode_switch']]:
            if not self.mode_button_pressed:
                self.toggle_control_mode()
                self.mode_button_pressed = True
        else:
            self.mode_button_pressed = False
            
        # Gripper control
        if msg.buttons[self.buttons['gripper_open']]:
            self.control_gripper(True)
        elif msg.buttons[self.buttons['gripper_close']]:
            self.control_gripper(False)

    def handle_servo_control(self, msg):
        """Handle servo-based control"""
        twist_stamped = TwistStamped()
        twist_stamped.header.stamp = rospy.Time.now()
        twist_stamped.header.frame_id = "base_link"
        
        # Apply LARGER deadzone for better control
        deadzone = 0.15  # Increased deadzone
        left_x = self.apply_axis_deadzone(msg.axes[self.axes['left_x']], deadzone)
        left_y = self.apply_axis_deadzone(msg.axes[self.axes['left_y']], deadzone)
        right_x = self.apply_axis_deadzone(msg.axes[self.axes['right_x']], deadzone)
        right_y = self.apply_axis_deadzone(msg.axes[self.axes['right_y']], deadzone)
        
        # Process trigger values (they range from 1 to -1, with 1 being not pressed)
        lt_val = (1.0 - msg.axes[self.axes['lt']]) / 2.0  # Convert to 0-1
        rt_val = (1.0 - msg.axes[self.axes['rt']]) / 2.0  # Convert to 0-1
        trigger_diff = rt_val - lt_val  # Range: -1 to 1
        trigger_diff = self.apply_axis_deadzone(trigger_diff, 0.1)
        
        # Apply exponential scaling for smoother control
        left_x = self.exponential_scale(left_x)
        left_y = self.exponential_scale(left_y)
        right_x = self.exponential_scale(right_x)
        right_y = self.exponential_scale(right_y)
        trigger_diff = self.exponential_scale(trigger_diff)
        
        if self.current_mode == self.TRANSLATION_MODE:
            # Translation mode: Left stick for X/Y, triggers for Z
            twist_stamped.twist.linear.x = left_y * self.linear_scale    # Forward/back
            twist_stamped.twist.linear.y = -left_x * self.linear_scale   # Left/right (inverted)
            twist_stamped.twist.linear.z = trigger_diff * self.linear_scale  # Up/down
            
            # No rotation in translation mode
            twist_stamped.twist.angular.x = 0.0
            twist_stamped.twist.angular.y = 0.0
            twist_stamped.twist.angular.z = 0.0
            
        else:  # ROTATION_MODE
            # Rotation mode: Right stick for pitch/yaw, triggers for roll
            twist_stamped.twist.linear.x = 0.0
            twist_stamped.twist.linear.y = 0.0
            twist_stamped.twist.linear.z = 0.0
            
            twist_stamped.twist.angular.x = trigger_diff * self.angular_scale    # Roll
            twist_stamped.twist.angular.y = -right_y * self.angular_scale        # Pitch (inverted)
            twist_stamped.twist.angular.z = -right_x * self.angular_scale        # Yaw (inverted)
        
        # ALWAYS publish - even zero commands are important for stopping
        self.twist_pub.publish(twist_stamped)
        
        # Log only non-zero commands
        if (abs(twist_stamped.twist.linear.x) > 0.001 or 
            abs(twist_stamped.twist.linear.y) > 0.001 or 
            abs(twist_stamped.twist.linear.z) > 0.001 or
            abs(twist_stamped.twist.angular.x) > 0.001 or 
            abs(twist_stamped.twist.angular.y) > 0.001 or 
            abs(twist_stamped.twist.angular.z) > 0.001):
            rospy.loginfo_throttle(1.0, f"Publishing twist: lin=[{twist_stamped.twist.linear.x:.3f}, {twist_stamped.twist.linear.y:.3f}, {twist_stamped.twist.linear.z:.3f}] ang=[{twist_stamped.twist.angular.x:.3f}, {twist_stamped.twist.angular.y:.3f}, {twist_stamped.twist.angular.z:.3f}]")

    def apply_axis_deadzone(self, value, deadzone=0.15):
        """Apply deadzone to axis value with smooth transition"""
        if abs(value) < deadzone:
            return 0.0
        # Smooth transition after deadzone
        sign = 1 if value > 0 else -1
        return sign * (abs(value) - deadzone) / (1.0 - deadzone)

    def exponential_scale(self, value, exponent=2.0):
        """Apply exponential scaling for finer control"""
        if value == 0.0:
            return 0.0
        sign = 1 if value > 0 else -1
        return sign * (abs(value) ** exponent)

    def toggle_control_mode(self):
        """Switch between translation and rotation modes"""
        self.current_mode = 1 - self.current_mode  # Toggle between 0 and 1
        mode_name = 'TRANSLATION' if self.current_mode == self.TRANSLATION_MODE else 'ROTATION'
        rospy.loginfo(f"Switched to {mode_name} mode")

    def control_gripper(self, open_gripper):
        """Control Kortex gripper"""
        if self.send_gripper_command is None:
            rospy.logwarn_throttle(2.0, "Gripper service not available")
            return
            
        try:
            gripper_command = GripperCommand()
            gripper_command.mode = 1  # Use numeric value instead of constant
            
            if open_gripper:
                gripper_command.position = 0.0  # Fully open
                rospy.loginfo("Opening gripper")
            else:
                gripper_command.position = 1.0  # Fully closed
                rospy.loginfo("Closing gripper")
                
            gripper_command.speed = 0.5
            gripper_command.force = 1.0
            
            request = SendGripperCommandRequest()
            request.input = gripper_command
            
            response = self.send_gripper_command(request)
            
        except Exception as e:
            rospy.logwarn(f"Gripper control error: {e}")

    def emergency_stop(self):
        """Emergency stop - halt all movement"""
        rospy.logwarn("EMERGENCY STOP ACTIVATED!")
        self.emergency_stopped = True
        
        try:
            # Publish zero velocity multiple times
            zero_twist = TwistStamped()
            zero_twist.header.stamp = rospy.Time.now()
            zero_twist.header.frame_id = "base_link"
            for _ in range(5):
                self.twist_pub.publish(zero_twist)
                rospy.sleep(0.01)
            
        except Exception as e:
            rospy.logerr(f"Emergency stop error: {e}")

    def print_instructions(self):
        """Print control instructions"""
        rospy.loginfo("=" * 60)
        rospy.loginfo("KINOVA SERVO JOYSTICK CONTROLLER")
        rospy.loginfo("=" * 60)
        rospy.loginfo("CONTROLS:")
        rospy.loginfo("  A Button:     Toggle Translation/Rotation mode")
        rospy.loginfo("  B Button:     Emergency stop")
        rospy.loginfo("  LB Button:    Open gripper")
        rospy.loginfo("  RB Button:    Close gripper")
        rospy.loginfo("")
        rospy.loginfo("TRANSLATION MODE:")
        rospy.loginfo("  Left Stick:   Move X/Y (forward/back, left/right)")
        rospy.loginfo("  Triggers:     Move Z (up/down)")
        rospy.loginfo("")
        rospy.loginfo("ROTATION MODE:")
        rospy.loginfo("  Right Stick:  Pitch/Yaw rotation")
        rospy.loginfo("  Triggers:     Roll rotation")
        rospy.loginfo("=" * 60)

    def run(self):
        """Main control loop"""
        self.print_instructions()
        
        # Wait a bit for everything to initialize
        rospy.sleep(2.0)
        
        rospy.loginfo("Ready to control! MoveIt Servo should be running.")
        rospy.loginfo("Current mode: TRANSLATION")
        rospy.loginfo("Use A button to switch modes, B for emergency stop")
        
        try:
            rospy.spin()
        except KeyboardInterrupt:
            rospy.loginfo("Shutting down joystick controller")

def main():
    rospy.init_node('kinova_servo_joystick_controller')
    
    # Get robot namespace from parameter
    robot_namespace = rospy.get_param('~robot_namespace', 'my_gen3')
    
    try:
        controller = KinovaServoJoystickController(robot_namespace)
        controller.run()
    except Exception as e:
        rospy.logfatal(f"Failed to start servo joystick controller: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()