# Kinova Robot Control System

A comprehensive robotic control platform that bridges web technologies with ROS (Robot Operating System) for intuitive Kinova Gen3 arm control. This system combines a modern Next.js dashboard with robust ROS backend services to provide both web-based and manual joystick control.

## 🌟 System Overview

This project creates a full-stack robotics control system where web developers can easily interact with complex robotic systems through a familiar React/Next.js interface, while maintaining the power and flexibility of ROS for robot control.

## 🖼️ System Images

Below are key images illustrating the Kinova Robot Control System:

| ![Kinova Robot System Overview](./image.png) | ![Web Dashboard Screenshot](./image%20copy.png) |
|:--------------------------------------------:|:-----------------------------------------------:|
| *System Overview*                            | *Web Dashboard*                                 |

| ![Physical Robot Setup](./image%20copy%203.png) | ![ROS Node Graph](./image%20copy%202.png) |
|:-----------------------------------------------:|:-----------------------------------------:|
| *Physical Robot Setup*                          | *ROS Node Graph*                          |

### 🎯 Key Capabilities

- **Dual Control Interfaces**: Web dashboard + Xbox controller
- **Real-time Communication**: WebSocket bridge between web and ROS
- **Safety First**: Emergency stops, collision detection, joint limits  
- **Process Management**: Start/stop ROS services from web interface
- **Live Monitoring**: Real-time robot status, joint states, camera feeds
- **Motion Planning**: MoveIt integration for advanced path planning
- **Servo Control**: Real-time velocity control with smooth motion

## 🏗️ Complete System Architecture

### High-Level System Flow

```mermaid
graph TB
    subgraph "Frontend Layer"
        USER[👤 User]
        WEB[🌐 Next.js Dashboard<br/>localhost:3000]
        CONTROLLER[🎮 Xbox Controller]
    end
    
    subgraph "Communication Bridge"
        API[📡 API Routes<br/>Process Management]
        BRIDGE[🔗 ROS Bridge<br/>WebSocket Server<br/>:9090]
    end
    
    subgraph "ROS Ecosystem"
        MASTER[🧠 ROS Master<br/>:11311]
        SERVO[⚡ MoveIt Servo<br/>Real-time Control]
        DRIVER[🤖 Kortex Driver<br/>Robot Interface]
        VISION[📹 Vision System<br/>Camera Processing]
    end
    
    subgraph "Hardware Layer"
        ROBOT[🦾 Kinova Gen3<br/>Robotic Arm]
        CAMERA[📷 USB Camera]
    end
    
    USER --> WEB
    USER --> CONTROLLER
    WEB --> API
    API --> BRIDGE
    BRIDGE <--> MASTER
    CONTROLLER --> SERVO
    MASTER --> SERVO
    MASTER --> DRIVER  
    MASTER --> VISION
    SERVO --> DRIVER
    DRIVER --> ROBOT
    VISION --> CAMERA
    
    style USER fill:#e3f2fd
    style WEB fill:#f3e5f5
    style MASTER fill:#e8f5e8
    style ROBOT fill:#fff3e0
```

### Detailed Data Flow

```mermaid
sequenceDiagram
    participant User
    participant WebDashboard
    participant APIRoute
    participant ROSBridge
    participant ROSMaster
    participant ServoServer
    participant VelocityBridge
    participant KortexDriver
    participant KinovaRobot
    
    Note over User,KinovaRobot: System Startup Flow
    User->>WebDashboard: Access localhost:3000
    WebDashboard->>APIRoute: GET /api/processes
    APIRoute->>ROSMaster: Check ROS processes
    ROSMaster-->>APIRoute: Process status
    APIRoute-->>WebDashboard: System status
    
    Note over User,KinovaRobot: Robot Control Flow
    User->>WebDashboard: Click "Start Robot"
    WebDashboard->>APIRoute: POST /api/processes {kortex_driver}
    APIRoute->>ROSMaster: roslaunch kortex_driver
    ROSMaster->>KortexDriver: Initialize driver
    KortexDriver->>KinovaRobot: Establish connection
    
    Note over User,KinovaRobot: Movement Command Flow
    User->>WebDashboard: Joystick input
    WebDashboard->>APIRoute: POST /api/robot/command
    APIRoute->>ROSBridge: Publish twist message
    ROSBridge->>ServoServer: /servo_server/delta_twist_cmds
    ServoServer->>ServoServer: Convert to joint velocities
    ServoServer->>VelocityBridge: Float64MultiArray
    VelocityBridge->>VelocityBridge: Convert message format
    VelocityBridge->>KortexDriver: Base_JointSpeeds
    KortexDriver->>KinovaRobot: Execute movement
    
    Note over User,KinovaRobot: Feedback Loop
    KinovaRobot-->>KortexDriver: Joint states
    KortexDriver-->>ROSMaster: Publish joint states
    ROSMaster-->>ROSBridge: Forward data
    ROSBridge-->>WebDashboard: WebSocket update
    WebDashboard-->>User: Real-time feedback
```

### Message Flow Architecture

```mermaid
graph LR
    subgraph "Input Sources"
        WEBJS[Web Joystick<br/>Virtual Controller]
        PHYSJS[Xbox Controller<br/>Physical Input]
        WEBUI[Web Interface<br/>Buttons/Commands]
    end
    
    subgraph "Message Translation Layer"
        JOYCTL[Joystick Controller<br/>joy → TwistStamped]
        WEBAPI[Web API<br/>HTTP → ROS Messages]
        SERVO[MoveIt Servo<br/>TwistStamped → Joint Velocities]
    end
    
    subgraph "Protocol Conversion"
        BRIDGE[Velocity Bridge<br/>Float64MultiArray → Base_JointSpeeds]
        ROSBRIDGE[ROS Bridge<br/>WebSocket ↔ ROS Topics]
    end
    
    subgraph "Robot Interface"
        DRIVER[Kortex Driver<br/>ROS → Kinova API]
        ROBOT[Kinova Gen3<br/>Physical Robot]
    end
    
    WEBJS --> WEBAPI
    PHYSJS --> JOYCTL
    WEBUI --> WEBAPI
    
    WEBAPI --> ROSBRIDGE
    JOYCTL --> SERVO
    ROSBRIDGE --> SERVO
    
    SERVO --> BRIDGE
    BRIDGE --> DRIVER
    DRIVER --> ROBOT
    
    style WEBJS fill:#e1f5fe
    style SERVO fill:#e8f5e8
    style DRIVER fill:#f3e5f5
    style ROBOT fill:#fff3e0
```

### Process Dependency Graph

```mermaid
graph TD
    subgraph "Core ROS Services"
        ROSCORE[roscore<br/>🧠 ROS Master<br/>Port 11311]
    end
    
    subgraph "Communication Services"
        ROSBRIDGE[rosbridge_server<br/>🔗 WebSocket Bridge<br/>Port 9090]
        ROSCORE --> ROSBRIDGE
    end
    
    subgraph "Robot Control Services"
        DRIVER[kortex_driver<br/>🤖 Robot Interface]
        SERVO[servo_server<br/>⚡ Motion Control]
        VELBRIDGE[velocity_bridge.py<br/>🔄 Message Converter]
        
        ROSCORE --> DRIVER
        ROSCORE --> SERVO
        SERVO --> VELBRIDGE
        VELBRIDGE --> DRIVER
    end
    
    subgraph "Input Services"
        JOYCTL[kinova_joystick_controller.py<br/>🎮 Manual Control]
        ROSCORE --> JOYCTL
        JOYCTL --> SERVO
    end
    
    subgraph "Vision Services"
        VISION[kinova_vision<br/>📹 Camera Processing]
        USBCAM[usb_cam_node<br/>📷 Camera Driver]
        
        ROSCORE --> VISION
        ROSCORE --> USBCAM
        USBCAM --> VISION
    end
    
    subgraph "Web Application"
        WEBAPP[Next.js App<br/>🌐 Web Dashboard<br/>Port 3000]
        WEBAPP --> ROSBRIDGE
    end
    
    subgraph "Hardware"
        ROBOTHW[Kinova Gen3<br/>🦾 Physical Robot]
        CONTROLLERHW[Xbox Controller<br/>🎮 Physical Input]
        CAMERAHW[USB Camera<br/>📷 Physical Sensor]
        
        DRIVER --> ROBOTHW
        JOYCTL --> CONTROLLERHW
        USBCAM --> CAMERAHW
    end
    
    style ROSCORE fill:#e1f5fe
    style WEBAPP fill:#f3e5f5
    style ROBOTHW fill:#fff3e0
    style CONTROLLERHW fill:#e8f5e8
```

## 🚀 Quick Start Guide

### Prerequisites
- Ubuntu 20.04.6 LTS
- ROS Noetic
- Node.js 18+
- Kinova Gen3 robotic arm
- Xbox controller (optional)

### One-Command Setup

```bash
# Clone and setup everything
git clone https://github.com/Team-Deimos-IIT-Mandi/Robotic-Arm-Gui
cd my_main_project

# Run automated setup
./scripts/quick-setup.sh

# Start the system
npm run start-system
```

### Manual Setup Process

```mermaid
graph TD
    START[📥 Clone Repository] --> DEPS[📦 Install Dependencies]
    DEPS --> ROS[🤖 Setup ROS Workspace] 
    ROS --> NODE[📱 Install Node.js Packages]
    NODE --> BUILD[🔨 Build Applications]
    BUILD --> CONFIG[⚙️ Configure Environment]
    CONFIG --> HARDWARE[🔌 Connect Hardware]
    HARDWARE --> RUN[🚀 Launch System]
    
    style START fill:#e3f2fd
    style RUN fill:#e8f5e8
```

### System Startup Sequence

```bash
# 1. Start ROS Core (Required first)
roscore &

# 2. Start Robot Driver
roslaunch kortex_driver kortex_driver.launch &

# 3. Start Communication Bridge  
roslaunch rosbridge_server rosbridge_websocket.launch port:=9090 &

# 4. Start Motion Control
roslaunch kortex_examples servo.launch &
python3 scripts/velocity_bridge.py &

# 5. Start Web Application
npm run dev &

# 6. Optional: Start Manual Control
python3 scripts/kinova_joystick_controller.py &
```

## 🎛️ Control Interfaces

### Web Dashboard Features

```mermaid
graph TB
    subgraph "Web Dashboard Components"
        MAIN[🏠 Main Dashboard<br/>Process Overview]
        CONTROL[🎮 Robot Control Panel<br/>Virtual Joystick]
        STATUS[📊 Status Monitor<br/>Real-time Data]
        LOGS[📝 Log Viewer<br/>System Logs]
        SAFETY[🛡️ Safety Controls<br/>Emergency Stop]
    end
    
    subgraph "Control Features"
        VJOYSTICK[Virtual Joystick<br/>Mouse/Touch Control]
        PRESETS[Preset Positions<br/>Quick Commands]
        SLIDERS[Joint Sliders<br/>Individual Control]
        EMERGENCY[Emergency Stop<br/>Immediate Halt]
    end
    
    MAIN --> CONTROL
    CONTROL --> VJOYSTICK
    CONTROL --> PRESETS
    CONTROL --> SLIDERS
    SAFETY --> EMERGENCY
    
    style MAIN fill:#e3f2fd
    style EMERGENCY fill:#ffebee
```

### Physical Controller Mapping

```mermaid
graph LR
    subgraph "Xbox Controller Layout"
        subgraph "Translation Mode"
            LS[Left Stick<br/>↕️ Forward/Back<br/>↔️ Left/Right]
            TRIG[Triggers<br/>🔼 Up/Down Movement]
        end
        
        subgraph "Rotation Mode" 
            RS[Right Stick<br/>↕️ Pitch<br/>↔️ Yaw]
            TRIGR[Triggers<br/>🔄 Roll Rotation]
        end
        
        subgraph "Control Buttons"
            A[A Button<br/>🔄 Toggle Mode]
            B[B Button<br/>🛑 E-Stop]
            LB[LB/RB<br/>✋ Gripper Control]
        end
    end
    
    style A fill:#e8f5e8
    style B fill:#ffebee
    style LB fill:#f3e5f5
```

## 📂 Project Structure & Documentation

```
my_main_project/
├── 📁 my-app/                       # Next.js Web Application
│   ├── 📄 README.md                 # 🔗 Web App Documentation
│   ├── 📁 app/
│   │   ├── 📁 api/                  # API Route handlers
│   │   └── 📄 page.tsx              # Main dashboard
│   ├── 📁 components/
│   │   ├── 📁 kinova/               # Robot-specific UI
│   │   └── 📁 ui/                   # Reusable components  
│   └── 📁 lib/
│       └── 📄 rosbridge.ts          # ROS WebSocket client
├── 📁 ros_ws/                       # ROS Workspace
│   ├── 📄 README.md                 # 🔗 ROS Documentation
│   └── 📁 src/
│       └── 📁 niwesh/kinova_urc_arm/
│           └── 📁 kortex_examples/
│               ├── 📁 config/       # Robot configurations
│               ├── 📁 launch/       # ROS launch files
│               └── 📁 scripts/      # Control scripts
├── 📄 README.md                     # 📖 This main documentation
└── 📁 docs/                         # Additional documentation
    ├── 📄 INSTALLATION.md           # 🔗 Detailed setup guide
    ├── 📄 TROUBLESHOOTING.md        # 🔗 Problem solving
    └── 📄 API_REFERENCE.md          # 🔗 API documentation
```

## 🔗 Detailed Documentation Links

| Component | Documentation | Description |
|-----------|---------------|-------------|
| **Web Dashboard** | [📱 my-app/README.md](./my-app/README.md) | Next.js application setup, components, and API routes |
| **ROS System** | [🤖 ros_ws/README.md](./ros_ws/README.md) | ROS nodes, topics, services, and configurations |
| **Installation** | [⚙️ docs/INSTALLATION.md](./docs/INSTALLATION.md) | Step-by-step installation and setup |
| **Troubleshooting** | [🔧 docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common issues and solutions |
| **API Reference** | [📚 docs/API_REFERENCE.md](./docs/API_REFERENCE.md) | Complete API documentation |

## 🛠️ Development Workflow

### For Web Developers

```mermaid
graph LR
    subgraph "Web Dev Workflow"
        EDIT[📝 Edit Components<br/>React/TypeScript]
        TEST[🧪 Test in Browser<br/>localhost:3000]
        API[📡 Use ROS APIs<br/>HTTP/WebSocket]
        DEBUG[🐛 Debug with<br/>Browser DevTools]
    end
    
    EDIT --> TEST
    TEST --> API  
    API --> DEBUG
    DEBUG --> EDIT
    
    style EDIT fill:#e3f2fd
    style TEST fill:#e8f5e8
```

### For Robotics Developers

```mermaid
graph LR
    subgraph "ROS Dev Workflow"
        CODE[📝 Write ROS Nodes<br/>Python/C++]
        BUILD[🔨 catkin_make<br/>Build Workspace]
        LAUNCH[🚀 roslaunch<br/>Test Nodes]
        DEBUG[🐛 rostopic/rosnode<br/>Debug Tools]
    end
    
    CODE --> BUILD
    BUILD --> LAUNCH
    LAUNCH --> DEBUG  
    DEBUG --> CODE
    
    style CODE fill:#f3e5f5
    style LAUNCH fill:#e8f5e8
```

## 🚦 System Status Indicators

The system provides comprehensive status monitoring:

### Web Dashboard Status

```mermaid
graph TD
    subgraph "Status Indicators"
        CONN[🔗 Connection Status<br/>WebSocket Health]
        ROS[🤖 ROS Status<br/>Master & Nodes]
        ROBOT[🦾 Robot Status<br/>Joint States]
        SAFETY[🛡️ Safety Status<br/>Emergency Systems]
    end
    
    CONN --> |Connected| ACTIVE[🟢 System Active]
    ROS --> |Running| ACTIVE
    ROBOT --> |Responsive| ACTIVE
    SAFETY --> |Armed| ACTIVE
    
    CONN --> |Disconnected| ERROR[🔴 System Error]
    ROS --> |Failed| ERROR
    ROBOT --> |Unresponsive| ERROR
    SAFETY --> |Triggered| ERROR
    
    style ACTIVE fill:#e8f5e8
    style ERROR fill:#ffebee
```

## 🔒 Safety Systems

### Multi-Layer Safety Architecture

```mermaid
graph TB
    subgraph "Safety Layers"
        WEB[🌐 Web Emergency Stop<br/>Instant UI Button]
        CTRL[🎮 Controller E-Stop<br/>Hardware Button]
        SOFT[💻 Software Limits<br/>Joint/Velocity Limits]
        HARD[🔒 Hardware Limits<br/>Robot Internal Safety]
    end
    
    subgraph "Safety Response"
        DETECT[⚠️ Detect Unsafe Condition]
        STOP[🛑 Immediate Motion Stop]
        RESET[🔄 Manual Reset Required]
    end
    
    WEB --> DETECT
    CTRL --> DETECT
    SOFT --> DETECT
    HARD --> DETECT
    
    DETECT --> STOP
    STOP --> RESET
    
    style DETECT fill:#fff3e0
    style STOP fill:#ffebee
```

## 📊 System Monitoring

### Real-time Metrics

- **🔄 Update Rate**: 50Hz servo control, 30Hz web updates
- **⚡ Latency**: <50ms web to robot command
- **📡 Communication**: WebSocket + ROS topics
- **🛡️ Safety**: <10ms emergency stop response

### Key Topics for Monitoring

```bash
# Robot state
/my_gen3/joint_states          # Current joint positions/velocities
/my_gen3/base_feedback         # Robot base status

# Control commands  
/servo_server/delta_twist_cmds # Cartesian velocity commands
/my_gen3/in/joint_velocity     # Joint velocity commands

# System status
/servo_server/status           # Servo system status
/rosout                        # System log messages
```

## 🤝 Contributing

We welcome contributions from both web developers and robotics engineers!

### Contribution Areas

- **🌐 Frontend**: React components, UI/UX improvements
- **📡 Backend**: API endpoints, WebSocket handling  
- **🤖 ROS**: New robot capabilities, safety features
- **📚 Documentation**: Tutorials, examples, guides
- **🧪 Testing**: Unit tests, integration tests
- **🐛 Bug Fixes**: Issue resolution, performance optimization

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/Robotic-Arm-Gui
cd my_main_project

# Setup development environment
./scripts/dev-setup.sh

# Create feature branch
git checkout -b feature/your-amazing-feature

# Make changes and test
npm run dev        # Test web changes
catkin_make        # Test ROS changes

# Submit PR
git push origin feature/your-amazing-feature
```

## 📞 Support & Community

- **🐛 Issues**: [GitHub Issues](https://github.com/Team-Deimos-IIT-Mandi/Robotic-Arm-Gui/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Team-Deimos-IIT-Mandi/Robotic-Arm-Gui/discussions)
- **📖 ROS Help**: [ROS Answers](https://answers.ros.org/)
- **📚 Kinova Docs**: [Official Documentation](https://github.com/Kinovarobotics/ros_kortex)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⚠️ Safety Notice**: This system controls physical robotic hardware. Always ensure proper safety measures are in place, including emergency stops, workspace barriers, and trained operators. Never operate the robot in an unsafe environment or without proper supervision.

**🎯 Mission**: Bridging the gap between web development and robotics, making advanced robotic control accessible to developers from all backgrounds.