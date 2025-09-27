import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  const { action, parameters } = await request.json()

  try {
    let command = ""
    
    switch (action) {
      case "home_position":
        command = "rosservice call /my_gen3/base/play_cartesian_trajectory_position '{}'"
        break
      case "move_to_pose":
        const { x, y, z, rx, ry, rz } = parameters
        command = `rosservice call /my_gen3/base/play_cartesian_trajectory_position '{
          input: {
            target_pose: {
              x: ${x}, y: ${y}, z: ${z},
              theta_x: ${rx}, theta_y: ${ry}, theta_z: ${rz}
            }
          }
        }'`
        break
      case "emergency_stop":
        command = "rosservice call /my_gen3/base/stop '{}'"
        break
      case "get_joint_angles":
        command = "rosservice call /my_gen3/base/get_measured_joint_angles '{}'"
        break
      case "get_joint_states":
        command = "rostopic echo /my_gen3/joint_states -n 1"
        break
      case "gripper_open":
        command = "rosservice call /my_gen3/base/send_gripper_command '{input: {mode: 1}}'"
        break
      case "gripper_close":
        command = "rosservice call /my_gen3/base/send_gripper_command '{input: {mode: 2}}'"
        break
      case "send_text":
        command = `rostopic pub -1 /type_text std_msgs/String "data: '${parameters.message}'"`
        break
      case "keyboard_control":
        command = "rosrun kortex_examples keyboard.py"
        break
      case "launch_examples":
        command = "roslaunch /root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/launch/run_all_examples.launch"
        break
      case "get_camera_info":
        command = "rostopic echo /camera/color/camera_info -n 1"
        break
      case "get_camera_image":
        command = "rostopic echo /camera/color/image_raw -n 1"
        break
      case "get_depth_image":
        command = "rostopic echo /camera/depth/image_raw -n 1"
        break
      case "move_group_plan":
        command = "rostopic pub -1 /my_gen3/move_group/goal moveit_msgs/MoveGroupActionGoal '{}'"
        break
      case "set_planning_scene":
        command = "rostopic pub -1 /my_gen3/planning_scene moveit_msgs/PlanningScene '{}'"
        break
      case "get_base_feedback":
        command = "rostopic echo /my_gen3/base_feedback/joint_state -n 1"
        break
      case "annotated_keyboard":
        command = "rostopic echo /annotated_keyboard -n 1"
        break
      case "click_point":
        command = "rostopic echo /clicked_point -n 1"
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const sourceCmd = "source /opt/ros/noetic/setup.bash && source /root/ros_ws/devel/setup.bash"
    const fullCommand = `bash -c "${sourceCmd} && ${command}"`

    const result = await execAsync(fullCommand, {
      env: { 
        ...process.env, 
        ROS_MASTER_URI: "http://localhost:11311",
        ROS_PACKAGE_PATH: "/root/ros_ws/src:/opt/ros/noetic/share"
      },
      timeout: 30000 // 30 second timeout
    })

    return NextResponse.json({
      success: true,
      action,
      result: result.stdout,
      command
    })

  } catch (error) {
    console.error("Robot command error:", error)
    return NextResponse.json({ 
      error: "Robot command failed", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}