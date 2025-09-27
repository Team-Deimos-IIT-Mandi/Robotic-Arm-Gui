#!/usr/bin/env python3

import rospy
from std_msgs.msg import Float64MultiArray
import importlib
import sys

# Try to import the correct message type
try:
    # Try different possible locations for the message
    from kortex_driver.msg import Base_JointSpeeds, JointSpeed
    print("Found Base_JointSpeeds in kortex_driver.msg")
except ImportError:
    try:
        # Search in generated messages
        sys.path.append('/root/ros_ws/src/niwesh/kinova_urc_arm/kortex_driver/src/generated')
        from kortex_driver.msg import Base_JointSpeeds, JointSpeed
        print("Found Base_JointSpeeds in generated")
    except ImportError:
        print("ERROR: Cannot find Base_JointSpeeds message type")
        # Let's see what's available
        rospy.logfatal("Cannot import Base_JointSpeeds. Available message types:")
        import kortex_driver.msg as kdm
        print(dir(kdm))
        sys.exit(1)

class VelocityBridge:
    def __init__(self):
        rospy.init_node('velocity_bridge')
        
        # Subscribe to servo output
        rospy.Subscriber('/servo_server/command', Float64MultiArray, self.servo_callback)
        
        # Publish to robot using correct message type
        self.joint_vel_pub = rospy.Publisher('/my_gen3/in/joint_velocity', Base_JointSpeeds, queue_size=1)
        
        rospy.loginfo("Velocity bridge initialized - converting Float64MultiArray to Base_JointSpeeds")
        
    def servo_callback(self, msg):
        """Convert Float64MultiArray to Base_JointSpeeds"""
        joint_speeds = Base_JointSpeeds()
        joint_speeds.joint_speeds = []
        
        # Convert each velocity to JointSpeed message
        for i, velocity in enumerate(msg.data):
            if i < 7:  # Only use first 7 joints (arm joints, not gripper)
                joint_speed = JointSpeed()
                joint_speed.joint_identifier = i
                joint_speed.value = float(velocity)
                joint_speeds.joint_speeds.append(joint_speed)
        
        # Publish to robot
        self.joint_vel_pub.publish(joint_speeds)
        rospy.logdebug(f"Published joint velocities: {[js.value for js in joint_speeds.joint_speeds]}")

if __name__ == '__main__':
    try:
        bridge = VelocityBridge()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass
    except Exception as e:
        rospy.logfatal(f"Bridge failed: {e}")