import { type NextRequest, NextResponse } from "next/server"

// Mock ROS topics for development/testing
const MOCK_TOPICS = [
  { topic: "/joint_states", type: "sensor_msgs/JointState" },
  { topic: "/robot_description", type: "std_msgs/String" },
  { topic: "/kinova_arm/joint_angles", type: "kinova_msgs/JointAngles" },
  { topic: "/kinova_arm/joint_velocities", type: "kinova_msgs/JointVelocity" },
  { topic: "/kinova_arm/cartesian_command", type: "kinova_msgs/KinovaPose" },
  { topic: "/camera/image_raw", type: "sensor_msgs/Image" },
  { topic: "/camera/camera_info", type: "sensor_msgs/CameraInfo" },
  { topic: "/tf", type: "tf2_msgs/TFMessage" },
  { topic: "/tf_static", type: "tf2_msgs/TFMessage" },
  { topic: "/rosout", type: "rosgraph_msgs/Log" },
]

const MOCK_SERVICES = [
  { service: "/kinova_arm/home_arm", type: "kinova_msgs/HomeArm" },
  { service: "/kinova_arm/stop", type: "kinova_msgs/Stop" },
  { service: "/kinova_arm/start", type: "kinova_msgs/Start" },
  { service: "/get_planning_scene", type: "moveit_msgs/GetPlanningScene" },
  { service: "/clear_octomap", type: "std_srvs/Empty" },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // "topics" or "services"

  // In a real implementation, this would connect to ROS and fetch actual topics/services
  // For now, return mock data

  if (type === "services") {
    return NextResponse.json({
      services: MOCK_SERVICES,
      count: MOCK_SERVICES.length,
    })
  }

  return NextResponse.json({
    topics: MOCK_TOPICS,
    count: MOCK_TOPICS.length,
  })
}

export async function POST(request: NextRequest) {
  const { action, topic, messageType, message } = await request.json()

  switch (action) {
    case "publish":
      // In a real implementation, this would publish to the ROS topic
      console.log(`Publishing to ${topic} (${messageType}):`, message)
      return NextResponse.json({
        success: true,
        message: `Published to ${topic}`,
      })

    case "subscribe":
      // In a real implementation, this would set up a subscription
      console.log(`Subscribing to ${topic} (${messageType})`)
      return NextResponse.json({
        success: true,
        message: `Subscribed to ${topic}`,
      })

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
