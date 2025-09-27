#!/usr/bin/env python3
# filepath: /root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/scripts/copy_robot_description.py

import rospy
import sys
import argparse

def copy_robot_description(source_ns, target_ns):
    """Copy robot description parameters from source to target namespace"""
    
    try:
        # Get the robot description from source namespace
        source_robot_desc = f"/{source_ns}/robot_description"
        source_robot_desc_semantic = f"/{source_ns}/robot_description_semantic"
        
        print(f"📋 Copying robot description from {source_ns} to {target_ns}")
        
        # Wait for source parameters to be available
        max_wait = 30
        wait_count = 0
        
        while wait_count < max_wait:
            try:
                robot_desc = rospy.get_param(source_robot_desc)
                robot_desc_semantic = rospy.get_param(source_robot_desc_semantic)
                break
            except KeyError:
                rospy.sleep(1)
                wait_count += 1
                if wait_count % 5 == 0:
                    print(f"⏳ Still waiting for robot description... ({wait_count}/{max_wait})")
        
        if wait_count >= max_wait:
            print("❌ Timeout waiting for robot description parameters!")
            return False
        
        # Set the parameters in target namespace
        target_robot_desc = f"/{target_ns}/robot_description"
        target_robot_desc_semantic = f"/{target_ns}/robot_description_semantic"
        
        rospy.set_param(target_robot_desc, robot_desc)
        rospy.set_param(target_robot_desc_semantic, robot_desc_semantic)
        
        print("✅ Robot description copied successfully!")
        print(f"   Source: {source_robot_desc}")
        print(f"   Target: {target_robot_desc}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error copying robot description: {e}")
        return False

def main():
    rospy.init_node('copy_robot_description', anonymous=True)
    
    # Use rospy parameters instead of argparse to avoid conflicts with ROS launch
    source_ns = rospy.get_param('~source_ns', 'my_gen3')
    target_ns = rospy.get_param('~target_ns', 'servo_server')
    
    success = copy_robot_description(source_ns, target_ns)
    
    if success:
        print("🎯 Robot description copy completed successfully!")
    else:
        print("❌ Failed to copy robot description!")
        sys.exit(1)

if __name__ == '__main__':
    main()