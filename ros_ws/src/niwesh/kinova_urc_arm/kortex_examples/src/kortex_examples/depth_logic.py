#!/usr/bin/env python3

import rospy
import numpy as np
from geometry_msgs.msg import PointStamped
from tf2_geometry_msgs import do_transform_point
import tf2_ros


# Camera parameters
color_info_matrix = {
    'K': [1297.672904, 0.0, 620.914026, 0.0, 1298.631344, 238.280325, 0.0, 0.0, 1.0]
}

depth_info_matrix = {
    'K': [360.01333, 0.0, 243.87228, 0.0, 360.013366699, 137.9218444, 0.0, 0.0, 1.0]
}


class DepthLogic:
    
    def __init__(self, tf_buffer, base_frame, camera_frame):
        self.tf_buffer = tf_buffer
        self.base_frame = base_frame
        self.camera_frame = camera_frame
        
        # Workspace bounds
        self.workspace_bounds = {
            # Forward/backward range centered 1m from the base
            'x_min': 0.82, 'x_max': 1.18,  
            
            # Left/right range of 30cm to each side
            'y_min': -0.33, 'y_max': 0.33,
            
            # Height range starting from the table surface
            'z_min': 0.40, 'z_max': 0.63  
        }


    def compute_3d_coordinates_from_uv(self, u, v, depth, depth_camera_info):
        """
        Computes 3D coordinates in the depth camera's frame.

        Args:
            u (int): The horizontal pixel coordinate in the *depth* image.
            v (int): The vertical pixel coordinate in the *depth* image.
            depth (float): The depth value in meters.
            depth_camera_info: The camera info message for the depth camera.
        
        Returns:
            A tuple (X, Y, Z) of the 3D coordinates or None if input is invalid.
        """
        if depth <= 0 or np.isnan(depth) or np.isinf(depth):
            return None

        # rospy.loginfo(f"Computing 3D for pixel ({u}, {v}) with depth {depth:.3f} m")

        # Intrinsics from the depth camera info's K matrix
        fx = depth_info_matrix['K'][0]
        fy = depth_info_matrix['K'][4]
        cx = depth_info_matrix['K'][2]
        cy = depth_info_matrix['K'][5]

        # Convert the depth pixel to a 3D point
        X = (u - cx) * depth / fx
        Y = (v - cy) * depth / fy
        Z = depth
        
        return X, Y, Z

    def depth_helper(self, x_rgb, y_rgb, depth_image, color_camera_info=None, depth_camera_info=None):
        """
        Gets 3D coordinates by projecting a color pixel to the depth map, sampling depth,
        and then calculating the 3D point.

        Args:
            x_rgb (int): The horizontal pixel coordinate in the *color* image.
            y_rgb (int): The vertical pixel coordinate in the *color* image.
            depth_image: The raw depth image (e.g., in uint16 millimeters).
            color_camera_info: The camera info for the RGB camera.
            depth_camera_info: The camera info for the depth camera.

        Returns:
            A tuple (X, Y, Z) of the 3D coordinates or None on failure.
        """
        try:

            # rospy.loginfo(f" x type: {type(x_rgb)}")
            # rospy.loginfo(f" y type: {type(y_rgb)}")
            # --- 1. Extract camera intrinsics for both cameras ---

            # rospy.loginfo("Depth helper called 0")
            # rospy.loginfo(f"color_info_matrix matrix: {color_info_matrix}")
            # rospy.loginfo(f"color_info_matrix type: {type(color_info_matrix)}")
            # rospy.loginfo(f"color_info_matrix shape: {color_info_matrix.shape if hasattr(color_info_matrix, 'shape') else 'N/A'}")


            # rospy.loginfo(f"Color K: {color_info_matrix['K']}")

            # if color_info_matrix is None or depth_info_matrix is None:
            #     rospy.logdebug("Missing camera info for depth helper")
            #     return None

            fx_rgb, cx_rgb = color_info_matrix['K'][0], color_info_matrix['K'][2]
            # rospy.loginfo("Depth helper called 1")

            fy_rgb, cy_rgb = color_info_matrix['K'][4], color_info_matrix['K'][5]

            fx_depth, cx_depth = depth_info_matrix['K'][0], depth_info_matrix['K'][2]
            fy_depth, cy_depth = depth_info_matrix['K'][4], depth_info_matrix['K'][5]

            # rospy.loginfo("Depth helper called 2")


            # rospy.loginfo(f"Color fx: {fx_rgb}, fy: {fy_rgb}, cx: {cx_rgb}, cy: {cy_rgb}")
            # rospy.loginfo(f"Depth fx: {fx_depth}, fy: {fy_depth}, cx: {cx_depth}, cy: {cy_depth}")
            # rospy.loginfo(f"x_rgb: {x_rgb}, y_rgb: {y_rgb}")


            # --- 2. Project the RGB pixel coordinate to the depth image space ---


            u_depth = int((((x_rgb - cx_rgb) / fx_rgb) * fx_depth) + cx_depth)

            # rospy.loginfo("Depth helper called 3")

            # if u_depth is None:
            #     rospy.loginfo(" u_depth is None")



            # rospy.loginfo(f" u_depth: {u_depth}")
            v_depth = int(((y_rgb - cy_rgb) / fy_rgb * fy_depth) + cy_depth)

            # rospy.loginfo(f"Depth helper projecting RGB ({x_rgb}, {y_rgb}) to Depth ({u_depth}, {v_depth})")

            # rospy.logdebug(f"RGB ({x_rgb}, {y_rgb}) -> Depth ({u_depth}, {v_depth})")
            # rospy.loginfo("\n")
            # rospy.loginfo("\n")



            # --- 3. Validate and sample the depth at the projected coordinate ---
            if not (0 <= u_depth < depth_image.shape[1] and 0 <= v_depth < depth_image.shape[0]):
                rospy.logdebug(f"Projected depth coordinates ({u_depth}, {v_depth}) are out of bounds.")
                return None

            # Robust multi-point depth sampling
            depth_samples = []
            sample_radius = 3
            
            for dx in range(-sample_radius, sample_radius + 1):
                for dy in range(-sample_radius, sample_radius + 1):
                    px, py = u_depth + dx, v_depth + dy
                    if (0 <= px < depth_image.shape[1] and 0 <= py < depth_image.shape[0]):
                        depth_val_mm = depth_image[py, px]
                        # Check for valid depth (0 is often used for no-return)
                        if depth_val_mm > 0:
                            depth_m = float(depth_val_mm) / 1000.0  # Convert mm to meters
                            # Check for a reasonable depth range
                            if 0.1 < depth_m < 3.0:
                                depth_samples.append(depth_m)

            if len(depth_samples) < 3:  # Ensure we have enough valid points for a reliable median
                rospy.logdebug(f"Insufficient valid depth samples at projected ({u_depth}, {v_depth})")
                return None

            # Use the median for robustness against outliers
            median_depth = np.median(depth_samples)
            
            # --- 4. Compute the final 3D point ---
            # Use the projected depth coordinates (u_depth, v_depth) and the median depth

            # rospy.loginfo(f"Median depth at ({u_depth}, {v_depth}): {median_depth:.3f} m")
            camera_coords = self.compute_3d_coordinates_from_uv(
                u=u_depth, 
                v=v_depth, 
                depth=median_depth, 
                depth_camera_info=depth_camera_info
            )

            # rospy.loginfo(f"Camera coordinates for ({x_rgb}, {y_rgb}): {camera_coords}")
            return camera_coords
            
        except Exception as e:
            rospy.logdebug(f"Depth helper failed: {e}")
            return None

    def calculate_3d_positions(self, keypoints_2d, camera_info, depth_image, color_image):
        """Enhanced 3D position calculation with better validation"""
        keypoints_3d = {}
        
        if camera_info is None:
            rospy.logwarn("No camera info available for 3D calculation")
            return keypoints_3d
            
        if depth_image is None:
            rospy.logwarn("No depth image available for 3D calculation")
            return keypoints_3d

        # rospy.loginfo(f"Computing 3D positions for {len(keypoints_2d)} keys")
        # rospy.loginfo(f"Depth image shape: {depth_image.shape}")
        # rospy.loginfo(f"Color image shape: {color_image.shape}")
        # rospy.loginfo("Hello from depth logic\n\n")


        for key, (x, y) in keypoints_2d.items():

            # rospy.loginfo(f"Key '{key}' at ({x}, {y})")
            # rospy.loginfo("HIIIIIIIIIIII")

            try:
                # Validate input coordinates
                if not (0 <= x < color_image.shape[1] and 0 <= y < color_image.shape[0]):
                    rospy.logwarn(f"Key '{key}' coordinates ({x}, {y}) out of color image bounds")
                    continue
                # rospy.loginfo(f"key x here")
                # rospy.loginfo(f"Key '{key}' at ({x}, {y})")

                camera_coords = self.depth_helper(x, y, depth_image, camera_info)

                # if camera_coords is None:
                #     rospy.loginfo(f"❌ No valid depth for key '{key}' at ({x}, {y})")

                if camera_coords is not None:
                    keypoints_3d[key] = [camera_coords[0], camera_coords[1], camera_coords[2]]

                    # Enhanced logging
                    # rospy.loginfo(f"✅ 3D calc for '{key}': "
                    #             f"2D({x}, {y}) -> "
                    #             f"3D({camera_coords[0]:.3f}, {camera_coords[1]:.3f}, {camera_coords[2]:.3f})")
                # else:
                    # rospy.logwarn(f"❌ No valid depth for key '{key}' at ({x}, {y})")
                    
                    # Debug: Check what's at that pixel
                    if (0 <= x < depth_image.shape[1] and 0 <= y < depth_image.shape[0]):
                        raw_depth = depth_image[y, x]
                        # rospy.loginfo(f"   Raw depth at ({x}, {y}): {raw_depth}")

                # else:
                #     rospy.logwarn(f"❌ No valid depth for key '{key}' at ({x}, {y})")
                                
            except Exception as e:
                rospy.logerr(f"3D position error for '{key}': {e}")

        # rospy.loginfo(f"Successfully calculated 3D positions for {len(keypoints_3d)}/{len(keypoints_2d)} keys")
        return keypoints_3d

    def transform_to_base_frame(self, point_camera):
        try:
            camera_point = PointStamped()
            camera_point.header.frame_id = self.camera_frame
            camera_point.header.stamp = rospy.Time(0)
            camera_point.point.x = point_camera[0]
            camera_point.point.y = point_camera[1]
            camera_point.point.z = point_camera[2]

            transform = self.tf_buffer.lookup_transform(
                self.base_frame, self.camera_frame,
                rospy.Time(0), rospy.Duration(2.0)
            )

            base_point = do_transform_point(camera_point, transform)
            result = np.array([base_point.point.x, base_point.point.y, base_point.point.z])

            return result

        except Exception as e:
            rospy.logerr_throttle(5, f"Transform error ({self.camera_frame} -> {self.base_frame}): {e}")
            return None

    def validate_workspace(self, position):
        """Validate if position is within robot's safe workspace"""
        try:

            rospy.loginfo(f"Validating position: {position}")
            rospy.loginfo(f"type of position: {type(position)}")

            rospy.loginfo(f"Workspace bounds: {self.workspace_bounds}")
            x, y, z = position
            
            in_bounds = (
                self.workspace_bounds['x_min'] <= x <= self.workspace_bounds['x_max'] and
                self.workspace_bounds['y_min'] <= y <= self.workspace_bounds['y_max'] and
                self.workspace_bounds['z_min'] <= z <= self.workspace_bounds['z_max']
            )
            
            if not in_bounds:
                rospy.logdebug_throttle(10, f"Position {position} outside workspace bounds")
                
            return in_bounds
            
        except Exception as e:
            rospy.logerr(f"Workspace validation error: {e}")
            return False