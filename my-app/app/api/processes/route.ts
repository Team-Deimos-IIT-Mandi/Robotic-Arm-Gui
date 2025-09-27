import { type NextRequest, NextResponse } from "next/server"
import { spawn, exec, type ChildProcess } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// Store active processes
const activeProcesses = new Map<string, ChildProcess>()
const processInfo = new Map<string, { pid: number; startTime: Date; command: string }>()

// ROS Process definitions - Updated with your actual Kinova commands
const ROS_PROCESSES = {
  roscore: "roscore",
  kortex_driver: "roslaunch kortex_driver kortex_driver.launch",
  kinova_vision: "roslaunch kinova_vision kinova_vision.launch", 
  keyboard_control: "rosrun kortex_examples keyboard.py",
  image_viewer: "rosrun rqt_image_view rqt_image_view",
  rosbridge: "roslaunch rosbridge_server rosbridge_websocket.launch port:=9090",
  run_all_examples: "roslaunch /root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/launch/run_all_examples.launch",
  rviz: "rosrun rviz rviz",
  moveit_planning: "roslaunch my_gen3_move_it_config move_group.launch",
}

export async function GET() {
  const status: Record<string, any> = {}

  for (const [key, command] of Object.entries(ROS_PROCESSES)) {
    const process = activeProcesses.get(key)
    const info = processInfo.get(key)

    if (process && !process.killed && info) {
      status[key] = {
        status: "running",
        pid: info.pid,
        uptime: Math.floor((Date.now() - info.startTime.getTime()) / 1000),
        command: info.command,
      }
    } else {
      status[key] = {
        status: "stopped",
        command,
      }
    }
  }

  return NextResponse.json(status)
}

export async function POST(request: NextRequest) {
  const { action, processKey, processKeys, message } = await request.json()

  try {
    switch (action) {
      case "start":
        return await startProcess(processKey)
      case "stop":
        return await stopProcess(processKey)
      case "start-all":
        return await startAllProcesses(processKeys || Object.keys(ROS_PROCESSES))
      case "stop-all":
        return await stopAllProcesses(processKeys || Object.keys(ROS_PROCESSES))
      case "emergency-stop":
        return await emergencyStop()
      case "send-text":
        return await sendTextMessage(message)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Process management error:", error)
    return NextResponse.json({ error: "Process management failed" }, { status: 500 })
  }
}

async function startProcess(processKey: string) {
  const command = ROS_PROCESSES[processKey as keyof typeof ROS_PROCESSES]
  if (!command) {
    return NextResponse.json({ error: "Invalid process key" }, { status: 400 })
  }

  if (activeProcesses.has(processKey)) {
    return NextResponse.json({ error: "Process already running" }, { status: 400 })
  }

  try {
    await execAsync("which roscore")
  } catch (error) {
    return NextResponse.json({ error: "ROS environment not available" }, { status: 500 })
  }

  const rosEnv = {
    ...process.env,
    ROS_MASTER_URI: "http://localhost:11311",
    ROS_PACKAGE_PATH: "/root/ros_ws/src:/opt/ros/noetic/share",
    CMAKE_PREFIX_PATH: "/root/ros_ws/devel:/opt/ros/noetic",
    PYTHONPATH: "/root/ros_ws/devel/lib/python3/dist-packages:/opt/ros/noetic/lib/python3/dist-packages",
    PATH: `${process.env.PATH}:/opt/ros/noetic/bin:/root/ros_ws/devel/bin`,
  }

  const sourceCmd = "source /opt/ros/noetic/setup.bash && source /root/ros_ws/devel/setup.bash"
  const fullCommand = `bash -c "${sourceCmd} && ${command}"`
  
  const childProcess = spawn("bash", ["-c", fullCommand], {
    stdio: ["pipe", "pipe", "pipe"],
    env: rosEnv,
    cwd: "/root/ros_ws",
  })

  childProcess.on("error", (error) => {
    console.error(`Process ${processKey} error:`, error)
    activeProcesses.delete(processKey)
    processInfo.delete(processKey)
  })

  childProcess.on("exit", (code) => {
    console.log(`Process ${processKey} exited with code ${code}`)
    activeProcesses.delete(processKey)
    processInfo.delete(processKey)
  })

  childProcess.stdout?.on("data", (data) => {
    console.log(`${processKey} stdout:`, data.toString())
  })

  childProcess.stderr?.on("data", (data) => {
    console.error(`${processKey} stderr:`, data.toString())
  })

  activeProcesses.set(processKey, childProcess)
  processInfo.set(processKey, {
    pid: childProcess.pid!,
    startTime: new Date(),
    command,
  })

  return NextResponse.json({
    success: true,
    pid: childProcess.pid,
    message: `Started ${processKey}`,
  })
}

async function sendTextMessage(message: string) {
  try {
    const rosEnv = {
      ...process.env,
      ROS_MASTER_URI: "http://localhost:11311",
    }

    const command = `rostopic pub -1 /type_text std_msgs/String "data: '${message}'"`
    const sourceCmd = "source /opt/ros/noetic/setup.bash && source /root/ros_ws/devel/setup.bash"
    const fullCommand = `bash -c "${sourceCmd} && ${command}"`

    const result = await execAsync(fullCommand, { env: rosEnv })

    return NextResponse.json({
      success: true,
      message: `Sent text: ${message}`,
      output: result.stdout
    })
  } catch (error) {
    console.error("Send text error:", error)
    return NextResponse.json({ 
      error: "Failed to send text message",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

async function stopProcess(processKey: string) {
  const process = activeProcesses.get(processKey)
  if (!process) {
    return NextResponse.json({ error: "Process not running" }, { status: 400 })
  }

  process.kill("SIGTERM")
  setTimeout(() => {
    if (!process.killed) {
      process.kill("SIGKILL")
    }
  }, 5000)

  activeProcesses.delete(processKey)
  processInfo.delete(processKey)

  return NextResponse.json({
    success: true,
    message: `Stopped ${processKey}`,
  })
}

async function startAllProcesses(processKeys: string[]) {
  const results = []
  for (const key of processKeys) {
    try {
      await startProcess(key)
      results.push({ processKey: key, success: true })
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      results.push({ processKey: key, success: false, error: error })
    }
  }

  return NextResponse.json({
    success: true,
    results,
    message: "Batch start completed",
  })
}

async function stopAllProcesses(processKeys: string[]) {
  const results = []
  for (const key of processKeys) {
    try {
      await stopProcess(key)
      results.push({ processKey: key, success: true })
    } catch (error) {
      results.push({ processKey: key, success: false, error: error })
    }
  }

  return NextResponse.json({
    success: true,
    results,
    message: "Batch stop completed",
  })
}

async function emergencyStop() {
  try {
    for (const [key, process] of activeProcesses.entries()) {
      process.kill("SIGKILL")
      activeProcesses.delete(key)
      processInfo.delete(key)
    }

    return NextResponse.json({
      success: true,
      message: "Emergency stop completed",
    })
  } catch (error) {
    return NextResponse.json({ error: "Emergency stop failed" }, { status: 500 })
  }
}