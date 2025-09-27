#!/usr/bin/env python3

import rospy
import moveit_commander
import moveit_msgs.msg
from moveit_msgs.msg import DisplayTrajectory, RobotTrajectory, Constraints, PositionConstraint
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint
from geometry_msgs.msg import Pose
import shape_msgs.msg
import threading


class MotionPlanner:
    
    def __init__(self, robot_namespace):
        self.robot_namespace = robot_namespace
        
        # More conservative movement parameters to avoid acceleration limits
        self.press_depth = 0.0005 # Reduced from 0.03 to 1.5cm
        self.dwell_time = 0.3
        self.approach_height = 0.05  # Increased to 5cm above key
        self.safe_height = 0.005
        
        self.typing_active = False
        
       # In your MotionPlanner __init__ method

        self.workspace_bounds = {
            # Forward/backward range centered 1m from the base
            'x_min': 0.82, 'x_max': 1.18,  
            
            # Left/right range of 30cm to each side
            'y_min': -0.33, 'y_max': 0.33,
            
            # Height range starting from the table surface
            'z_min': 0.40, 'z_max': 0.63  
        }
        
        self.setup_moveit()
        
    def setup_moveit(self):
        """Initialize MoveIt components with better trajectory parameters"""
        try:
            rospy.loginfo("🔧 Setting up MoveIt...")
            
            # Initialize MoveIt commander
            moveit_commander.roscpp_initialize([])
            
            # Robot and scene
            self.robot = moveit_commander.RobotCommander(
                robot_description=f"{self.robot_namespace}/robot_description",
                ns=self.robot_namespace
            )
            self.scene = moveit_commander.PlanningSceneInterface(ns=self.robot_namespace)

            # Get available groups
            available_groups = self.robot.get_group_names()
            rospy.loginfo(f"Available planning groups: {available_groups}")
            
            # Use 'arm' group (common for Kinova)
            self.move_group = moveit_commander.MoveGroupCommander(
                "arm",
                robot_description=f"{self.robot_namespace}/robot_description",
                ns=self.robot_namespace
            )
            
            # Configure MoveIt for precise typing with conservative parameters
            self.configure_moveit_for_typing()

            self.pose = self.move_group.get_current_pose().pose

            # Reasonable velocity and acceleration for stable planning
            self.move_group.set_max_velocity_scaling_factor(0.01)  # Increased from 0.03
            self.move_group.set_max_acceleration_scaling_factor(0.01)  # Increased from 0.03
            
            rospy.loginfo("✅ MoveIt setup complete.")
            rospy.loginfo(f"   Planning Group: arm")
            rospy.loginfo(f"   Planning Frame: {self.move_group.get_planning_frame()}")
            rospy.loginfo(f"   End Effector: {self.move_group.get_end_effector_link()}")

        except Exception as e:
            rospy.logfatal(f"❌ MoveIt setup failed: {e}")
            raise
    def configure_moveit_for_typing(self):
        """Configure MoveIt parameters for precise typing with conservative settings"""
        self.move_group.set_planning_time(15.0)  # Increased planning time
        self.move_group.set_num_planning_attempts(15)  # More planning attempts
        self.move_group.allow_replanning(True)
        
        self.move_group.set_goal_position_tolerance(0.005)  # Relaxed tolerance (was 0.002)
        self.move_group.set_goal_orientation_tolerance(0.2)  # Relaxed orientation tolerance
        
        self.move_group.set_planner_id("RRTConnect")

    def execute_typing(self, text, available_coords, publish_status_callback):
        """Execute typing sequence for given text"""
        self.typing_active = True
        publish_status_callback(f"Starting to type: '{text}'")

        try:
            if not available_coords:
                publish_status_callback("❌ No keyboard coordinates available")
                return

            success_count = 0
            total_chars = len(text)
            
            for i, char in enumerate(text):
                if rospy.is_shutdown():
                    break
                    
                publish_status_callback(f"Typing {i+1}/{total_chars}: '{char}'")
                
                key_name = self.char_to_key(char)
                
                if key_name and key_name in available_coords:
                    if self.type_key(key_name, available_coords):
                        success_count += 1
                        rospy.loginfo(f"✅ Typed '{char}'")
                    else:
                        rospy.logwarn(f"❌ Failed to type '{char}'")
                else:
                    rospy.logwarn(f"⚠️ Key '{key_name}' not available for '{char}'")
                    rospy.loginfo(f"📋 Available keys: {list(available_coords.keys())}")
                
                rospy.sleep(0.8)  # Longer delay between keystrokes

            publish_status_callback(f"✅ Typing complete: {success_count}/{total_chars}")

        except Exception as e:
            rospy.logerr(f"Typing execution error: {e}")
            publish_status_callback(f"❌ Typing error: {str(e)}")
        finally:
            self.typing_active = False

    def char_to_key(self, char):
        if char == ' ':
            return 'SPACE'
        elif char == '\n':
            return 'ENTER'
        elif char == '\b':
            return 'BACKSPACE'
        elif char.isalnum():
            return char.upper()
        else:
            return char.upper()

    def type_key(self, key_name, available_coords):
        if key_name not in available_coords:
            return False

        try:
            target_pos = available_coords[key_name]['position']
            rospy.loginfo(f"⌨️ Typing key '{key_name}' at {target_pos}")

            # Try improved Cartesian approach first
            if self.type_key_improved_cartesian(key_name, target_pos):
                return True

            # Fallback to joint space approach
            if self.type_key_joint_space(key_name, target_pos):
                return True

            rospy.logwarn(f"All typing methods failed for key '{key_name}'")
            return False

        except Exception as e:
            rospy.logerr(f"Key typing error for '{key_name}': {e}")
            return False

    def type_key_improved_cartesian(self, key_name, target_pos):
        """
        CORRECTED Cartesian approach - moving in X direction to press keys (not Z).
        """
        try:
            rospy.loginfo(f"🎯 Corrected Cartesian approach for '{key_name}'")
            current_pose = self.move_group.get_current_pose().pose

            # --- Apply 6.5cm offset for pen tip distance (23cm - 16.5cm gripper offset) ---
            pen_offset = 0.065  # 6.5cm offset in X direction (forward toward keyboard)
            # actual position 0.739 0.14 0.368
            # v position with pen 0.844 0.18 0.376
            adjusted_target = [
                target_pos[0] - pen_offset,  # Move 6.5cm FORWARD in X direction (towards keyboard)
                target_pos[1]- 0.04 ,  # Same Y (left/right)
                target_pos[2]-0.012   # Same Z (up/down)
            ]
            
            rospy.loginfo(f"Original target: {target_pos}")
            rospy.loginfo(f"Adjusted target with 6.5cm X offset: {adjusted_target}")

            # --- Define motion parameters for X-direction pressing ---
            x_back_offset = 0.10  # 12cm back from keyboard (in X direction)
            waypoints = []

            # 1. Move to approach position: BACK from the keyboard (in X direction)
            approach_pose = Pose()
            approach_pose.position.x = adjusted_target[0] - x_back_offset  # Stay back from keyboard
            approach_pose.position.y = adjusted_target[1]   # Same Y position
            approach_pose.position.z = adjusted_target[2]  # Same Z position
            approach_pose.orientation = current_pose.orientation
            waypoints.append(approach_pose)
            rospy.loginfo("✅ Approach pose set")
            rospy.loginfo(f"Approach pose coordinates: x={approach_pose.position.x}, y={approach_pose.position.y}, z={approach_pose.position.z}")

            # 2. Move to pre-press position: At keyboard surface
            pre_press_pose = Pose()
            pre_press_pose.position.x = adjusted_target[0]- 0.05  # At keyboard surface
            pre_press_pose.position.y = adjusted_target[1]  # Same Y
            pre_press_pose.position.z = adjusted_target[2] # Same Z
            pre_press_pose.orientation = current_pose.orientation
            waypoints.append(pre_press_pose)
            rospy.loginfo("✅ Pre-press pose set")
            rospy.loginfo(f"Pre-press pose coordinates: x={pre_press_pose.position.x}, y={pre_press_pose.position.y}, z={pre_press_pose.position.z}")


            # 3. Press the key: Move FORWARD in X direction (into keyboard)
            press_pose = Pose()
            press_pose.position.x = adjusted_target[0]- 0.04   # Press FORWARD into keyboard
            press_pose.position.y = adjusted_target[1]  # Same Y
            press_pose.position.z = adjusted_target[2]  # Same Z
            press_pose.orientation = current_pose.orientation
            waypoints.append(press_pose)
            rospy.loginfo("✅ Press pose set")
            rospy.loginfo(f"Press pose coordinates: x={press_pose.position.x}, y={press_pose.position.y}, z={press_pose.position.z}")


            # 4. Release: Move back to pre-press position
            waypoints.append(pre_press_pose)
            
            # 5. Retract: Move back to approach position
            waypoints.append(approach_pose)

            rospy.loginfo("Computing X-direction Cartesian path...")
            (plan, fraction) = self.move_group.compute_cartesian_path(
                waypoints,
                eef_step=0.01,  # Increased for better planning
                avoid_collisions=True
            )

            rospy.loginfo(f"Cartesian path: {fraction*100:.1f}% complete")

            if fraction > 0.5:  # Lowered threshold
                if hasattr(plan, 'joint_trajectory'):
                    self.scale_trajectory_timing(plan.joint_trajectory)
                
                rospy.loginfo("Executing X-direction Cartesian trajectory...")
                success = self.move_group.execute(plan, wait=True)
                
                if success:
                    rospy.loginfo(f"✅ X-direction Cartesian typing successful for '{key_name}'")
                    rospy.sleep(0.5) 
                    self.move_group.stop()
                    return True
                else:
                    rospy.logwarn("X-direction Cartesian execution failed")
            else:
                rospy.logwarn(f"X-direction Cartesian path only {fraction*100:.1f}% valid, trying step-by-step")
                if self.execute_waypoints_stepwise(waypoints):
                    return True

        except Exception as e:
            rospy.logerr(f"X-direction Cartesian typing error: {e}")
        finally:
            self.move_group.stop()
            self.move_group.clear_pose_targets()

        return False
    def scale_trajectory_timing(self, joint_trajectory):
        """Scale trajectory timing to reduce velocities and accelerations"""
        try:
            # Scale time stamps to make movement slower
            time_scale_factor = 3.0  # Make 3x slower
            
            for i, point in enumerate(joint_trajectory.points):
                if i == 0:
                    continue  # Skip first point
                
                # Scale time
                point.time_from_start = rospy.Duration(
                    point.time_from_start.to_sec() * time_scale_factor
                )
                
                # Reduce velocities
                if point.velocities:
                    point.velocities = [v / time_scale_factor for v in point.velocities]
                
                # Reduce accelerations  
                if point.accelerations:
                    point.accelerations = [a / (time_scale_factor * time_scale_factor) for a in point.accelerations]
                    
        except Exception as e:
            rospy.logerr(f"Trajectory scaling error: {e}")

    def execute_waypoints_stepwise(self, waypoints):
        """Execute waypoints one by one instead of as a single trajectory"""
        try:
            rospy.loginfo("Executing waypoints step-by-step...")
            
            for i, waypoint in enumerate(waypoints):
                rospy.loginfo(f"Moving to waypoint {i+1}/{len(waypoints)}")
                
                self.move_group.set_pose_target(waypoint)
                self.move_group.set_planning_time(10.0)
                
                plan = self.move_group.plan()
                
                if plan[0]:  # If planning succeeded
                    success = self.move_group.execute(plan[1], wait=True)
                    if success:
                        rospy.loginfo(f"✅ Reached waypoint {i+1}")
                        
                        # Add dwell time for press waypoint
                        if i == 2:  # Press waypoint (0-indexed)
                            rospy.sleep(self.dwell_time)
                    else:
                        rospy.logwarn(f"❌ Failed to reach waypoint {i+1}")
                        return False
                else:
                    rospy.logwarn(f"❌ Planning failed for waypoint {i+1}")
                    return False
                
                rospy.sleep(0.2)  # Small delay between waypoints
            
            rospy.loginfo("✅ Step-by-step execution completed")
            return True
            
        except Exception as e:
            rospy.logerr(f"Step-by-step execution error: {e}")
            return False
            
        finally:
            self.move_group.stop()
            self.move_group.clear_pose_targets()

    def type_key_joint_space(self, key_name, target_pos):
        """
        CORRECTED: Joint space typing with X-direction motion for key pressing.
        """
        try:
            # --- Apply 8cm offset for pen tip distance (23cm - 16.5cm gripper offset) ---
            pen_offset = 0.08  # 8cm offset in X direction (forward toward keyboard)
            adjusted_target = [
                target_pos[0] + pen_offset,  # Move 8cm FORWARD in X direction (towards keyboard)
                target_pos[1],  # Same Y (left/right)
                target_pos[2]   # Same Z (up/down)
            ]
            
            rospy.loginfo(f"Original target: {target_pos}")
            rospy.loginfo(f"Adjusted target with 6.5cm X offset: {adjusted_target}")

            # Remove workspace constraints to avoid "Box dimensions must be non-negative" error
            # Let MoveIt plan freely without constraints

            rospy.loginfo(f"🔧 Corrected Joint Space approach for '{key_name}' - X direction motion")
            
            current_pose = self.move_group.get_current_pose().pose
            
            # Set reasonable motion parameters
            self.move_group.set_max_velocity_scaling_factor(0.2)
            self.move_group.set_max_acceleration_scaling_factor(0.2)
            self.move_group.set_planning_time(5.0)
            self.move_group.set_num_planning_attempts(10)
            
            x_back_offset = 0.05  # 5cm back from keyboard (in X direction)
            
            # 1. Approach position: Back from the keyboard (in X direction)
            approach_pose = Pose()
            approach_pose.position.x = adjusted_target[0] - x_back_offset  # Stay back from keyboard
            approach_pose.position.y = adjusted_target[1]  # Same Y
            approach_pose.position.z = adjusted_target[2]  # Same Z
            approach_pose.orientation = current_pose.orientation
            
            self.move_group.set_pose_target(approach_pose)
            
            rospy.loginfo("Planning approach movement (back from keyboard in X direction)...")
            approach_plan = self.move_group.plan()
            
            if approach_plan[0]: 
                rospy.loginfo("Executing approach...")
                if self.move_group.execute(approach_plan[1], wait=True):
                    rospy.loginfo("✅ Reached approach position")
                    rospy.sleep(0.5)
                    
                    # 2. Press position: Move FORWARD in X direction (into keyboard)
                    press_pose = Pose()
                    press_pose.position.x = adjusted_target[0] + self.press_depth  # Press FORWARD into keyboard
                    press_pose.position.y = adjusted_target[1]  # Same Y
                    press_pose.position.z = adjusted_target[2]  # Same Z
                    press_pose.orientation = current_pose.orientation
                    
                    self.move_group.set_pose_target(press_pose)
                    press_plan = self.move_group.plan()
                    
                    if press_plan[0]:
                        rospy.loginfo("Executing key press (forward in X direction into keyboard)...")
                        if self.move_group.execute(press_plan[1], wait=True):
                            rospy.loginfo(f"✅ Pressed key '{key_name}' in X direction")
                            rospy.sleep(self.dwell_time)
                            
                            # 3. Retract: Move BACK in X direction (away from keyboard)
                            self.move_group.set_pose_target(approach_pose)
                            retract_plan = self.move_group.plan()
                            if retract_plan[0]:
                                self.move_group.execute(retract_plan[1], wait=True)
                                rospy.loginfo("✅ Retracted from key (back in X direction)")
                            
                            return True
                    else:
                        rospy.logwarn("Press movement planning failed")
                else:
                    rospy.logwarn("Approach movement execution failed")
            else:
                rospy.logwarn("Approach planning failed")
                    
        except Exception as e:
            rospy.logerr(f"Joint space typing error: {e}")
            
        finally:
            # Reset to default values
            self.move_group.set_max_velocity_scaling_factor(0.1)
            self.move_group.set_max_acceleration_scaling_factor(0.1)
            self.move_group.stop()
            self.move_group.clear_pose_targets()
            
        return False
    def get_robot_status(self, current_joint_state):
        try:
            status = {
                'timestamp': rospy.Time.now().to_sec(),
                'typing_active': self.typing_active,
                'current_pose': None,
                'joint_states': None
            }
            
            try:
                current_pose = self.move_group.get_current_pose().pose
                status['current_pose'] = {
                    'position': [current_pose.position.x, current_pose.position.y, current_pose.position.z],
                    'orientation': [current_pose.orientation.x, current_pose.orientation.y, 
                                  current_pose.orientation.z, current_pose.orientation.w]
                }
            except:
                pass
                
            if current_joint_state:
                status['joint_states'] = {
                    'names': list(current_joint_state.name),
                    'positions': list(current_joint_state.position)
                }
                
            return status
            
        except Exception as e:
            rospy.logerr(f"Robot status error: {e}")
            return {}

    def emergency_stop(self, publish_status_callback):
        rospy.logwarn("🛑 Emergency stop!")
        try:
            self.move_group.stop()
            self.move_group.clear_pose_targets()
            self.typing_active = False
            publish_status_callback("🛑 Emergency stop activated")
            rospy.logwarn("All robot motion stopped")
        except Exception as e:
            rospy.logerr(f"Emergency stop error: {e}")

    def shutdown(self):
        rospy.loginfo("🔄 Shutting down Motion Planner...")
        
        try:
            self.typing_active = False
            
            self.move_group.stop()
            self.move_group.clear_pose_targets()
            
            moveit_commander.roscpp_shutdown()
            
            rospy.loginfo("✅ Motion Planner shutdown complete")
            
        except Exception as e:
            rospy.logerr(f"Motion Planner shutdown error: {e}")