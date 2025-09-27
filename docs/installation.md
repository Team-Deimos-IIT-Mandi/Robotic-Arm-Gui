# ⚙️ Installation Guide

Complete step-by-step installation guide for the Kinova Robot Control System.

## 📋 System Requirements

### Hardware Requirements
- **Computer**: Ubuntu 20.04.6 LTS (native installation recommended)
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: Minimum 50GB free space
- **USB Ports**: 2+ available ports
- **Network**: Ethernet port for robot connection

### Robot Hardware
- **Kinova Gen3 Robotic Arm** (6 or 7 DOF)
- **Power Supply**: Robot power adapter
- **Cables**: USB-C or Ethernet cable for robot connection
- **Xbox Controller** (optional, for manual control)
- **USB Camera** (optional, for vision features)

### Software Prerequisites
- **Operating System**: Ubuntu 20.04.6 LTS
- **ROS Version**: ROS Noetic
- **Node.js**: Version 18 or higher
- **Python**: 3.8+
- **Git**: For version control

## 🚀 Installation Process

### Step 1: System Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential cmake
```

### Step 2: ROS Noetic Installation

```bash
# Setup ROS repository
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'

# Add ROS keys
curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -

# Update package index
sudo apt update

# Install ROS Noetic Desktop Full
sudo apt install -y ros-noetic-desktop-full

# Initialize rosdep
sudo rosdep init
rosdep update
```

### Step 3: ROS Environment Setup

```bash
# Add ROS to bash profile
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Install additional ROS tools
sudo apt install -y python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool

# Install catkin tools
sudo apt install -y python3-catkin-tools
```

### Step 4: Install ROS Dependencies

```bash
# Install required ROS packages
sudo apt install -y \
    ros-noetic-rosbridge-suite \
    ros-noetic-rosbridge-server \
    ros-noetic-usb-cam \
    ros-noetic-moveit \
    ros-noetic-moveit-servo \
    ros-noetic-moveit-planners \
    ros-noetic-joint-state-publisher \
    ros-noetic-joint-state-publisher-gui \
    ros-noetic-robot-state-publisher \
    ros-noetic-rqt \
    ros-noetic-rqt-common-plugins \
    ros-noetic-rqt-image-view \
    ros-noetic-rviz \
    ros-noetic-tf2-tools \
    ros-noetic-controller-manager \
    ros-noetic-joint-trajectory-controller
```

### Step 5: Node.js Installation

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### Step 6: Clone and Setup Project

```bash
# Navigate to home directory
cd /root

# Clone the repository
git clone https://github.com/Team-Deimos-IIT-Mandi/Robotic-Arm-Gui
cd my_main_project

# Make scripts executable
chmod +x scripts/*.sh scripts/*.py
```

### Step 7: ROS Workspace Setup

```bash
# Navigate to ROS workspace
cd ros_ws

# Install workspace dependencies
rosdep install --from-paths src --ignore-src -r -y

# Build the workspace
catkin_make

# Source the workspace
source devel/setup.bash

# Add workspace to bash profile
echo "source /root/my_main_project/ros_ws/devel/setup.bash" >> ~/.bashrc
```

### Step 8: Web Application Setup

```bash
# Navigate to web application
cd ../my-app

# Install Node.js dependencies
npm install

# Install additional development dependencies (optional)
npm install -D @types/node @types/react typescript

# Build the application
npm run build
```

### Step 9: Hardware Connection

#### Kinova Robot Connection

```bash
# Connect robot via USB-C or Ethernet
# For USB connection:
lsusb | grep Kinova  # Should show Kinova device

# For Ethernet connection (if using):
# Set robot IP: 192.168.1.10
# Set computer IP: 192.168.1.11
ping 192.168.1.10    # Should respond
```

#### Xbox Controller Setup (Optional)

```bash
# Install joystick tools
sudo apt install -y jstest-gtk joystick

# Connect controller and test
jstest /dev/input/js0  # Should show controller input
```

#### USB Camera Setup (Optional)

```bash
# Check for camera
ls /dev/video*  # Should show /dev/video0 or similar

# Test camera
sudo apt install -y cheese
cheese  # Should show camera feed
```

### Step 10: Environment Configuration

```bash
# Create environment configuration
cat >> ~/.bashrc << 'EOF'

# ROS Environment Variables
export ROS_MASTER_URI=http://localhost:11311
export ROS_IP=$(hostname -I | awk '{print $1}')
export KINOVA_IP=192.168.1.10  # Adjust if different

# Project Paths
export PROJECT_ROOT=/root/my_main_project
export ROS_WORKSPACE=/root/my_main_project/ros_ws

# Aliases for convenience
alias start-roscore='roscore &'
alias start-robot='roslaunch cortex_examples basic_cartesian_action_cpp.launch'
alias start-web='cd /root/my_main_project/my-app && npm run dev'
alias build-ros='cd /root/my_main_project/ros_ws && catkin_make'

EOF

# Reload bash configuration
source ~/.bashrc
```

### Step 11: Verification and Testing

```bash
# Test ROS installation
roscore &
sleep 3
rosnode list  # Should show /rosout
pkill -f roscore

# Test Node.js setup
cd /root/my_main_project/my-app
npm run build  # Should complete without errors

# Test ROS workspace
cd /root/my_main_project/ros_ws
catkin_make    # Should complete without errors
```

## 🔧 Post-Installation Setup

### Configure Robot Parameters

```bash
# Navigate to robot configuration
cd /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/config

# Edit robot configuration (if needed)
nano robot_config.yaml
```

### Setup Servo Configuration

```bash
# Edit servo configuration for your specific needs
nano servo_config.yaml

# Key parameters to adjust:
# - scale.linear: 0.2-0.6 (movement speed)
# - scale.rotational: 0.3-0.8 (rotation speed)  
# - max_velocity: 0.8-1.3963 (joint velocity limits)
```

### Web Application Configuration

```bash
# Navigate to web app
cd /root/my_main_project/my-app

# Create environment file
cat > .env.local << 'EOF'
# ROS Bridge Configuration
NEXT_PUBLIC_ROS_BRIDGE_URL=ws://localhost:9090
NEXT_PUBLIC_ROS_MASTER_URI=http://localhost:11311

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Robot Configuration
NEXT_PUBLIC_ROBOT_NAMESPACE=my_gen3
NEXT_PUBLIC_ROBOT_IP=192.168.1.10

# Development Settings
NODE_ENV=development
EOF
```

## 🧪 Installation Verification

### Automated Test Script

Create a test script to verify installation:

```bash
# Create test script
cat > /root/my_main_project/test-installation.sh << 'EOF'
#!/bin/bash

echo "🧪 Testing Kinova Robot Control System Installation"
echo "================================================="

# Test 1: ROS Installation
echo "📍 Testing ROS Installation..."
source /opt/ros/noetic/setup.bash
if command -v roscore &> /dev/null; then
    echo "✅ ROS Noetic installed successfully"
else
    echo "❌ ROS installation failed"
    exit 1
fi

# Test 2: Node.js Installation  
echo "📍 Testing Node.js Installation..."
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo "✅ Node.js $(node --version) installed successfully"
else
    echo "❌ Node.js installation failed"
    exit 1
fi

# Test 3: ROS Workspace
echo "📍 Testing ROS Workspace..."
cd /root/my_main_project/ros_ws
source devel/setup.bash
if [ -f "devel/setup.bash" ]; then
    echo "✅ ROS workspace built successfully"
else
    echo "❌ ROS workspace build failed"
    exit 1
fi

# Test 4: Web Application
echo "📍 Testing Web Application..."
cd /root/my_main_project/my-app
if [ -d "node_modules" ] && [ -f "package.json" ]; then
    echo "✅ Web application dependencies installed"
else
    echo "❌ Web application setup failed"
    exit 1
fi

# Test 5: Hardware Connections
echo "📍 Testing Hardware Connections..."
if lsusb | grep -i kinova &> /dev/null; then
    echo "✅ Kinova robot detected via USB"
elif ping -c 1 192.168.1.10 &> /dev/null; then
    echo "✅ Kinova robot detected via network"
else
    echo "⚠️  Kinova robot not detected (connect hardware)"
fi

if ls /dev/input/js* &> /dev/null; then
    echo "✅ Game controller detected"
else
    echo "⚠️  No game controller detected (optional)"
fi

echo ""
echo "🎉 Installation verification complete!"
echo "Next steps:"
echo "1. Connect your Kinova robot"
echo "2. Run: cd /root/my_main_project && ./scripts/start-system.sh"
echo "3. Open browser: http://localhost:3000"

EOF

# Make executable and run
chmod +x /root/my_main_project/test-installation.sh
/root/my_main_project/test-installation.sh
```

## 🔄 Quick Start After Installation

### Method 1: Automated Startup

```bash
# Create startup script
cat > /root/my_main_project/start-system.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Kinova Robot Control System"
echo "======================================"

# Source ROS environment
source /opt/ros/noetic/setup.bash
source /root/my_main_project/ros_ws/devel/setup.bash

# Start ROS core
echo "📍 Starting ROS core..."
roscore &
sleep 3

# Start robot driver
echo "📍 Starting robot driver..."
roslaunch kortex_driver kortex_driver.launch &
sleep 5

# Start ROS bridge
echo "📍 Starting ROS bridge..."
roslaunch rosbridge_server rosbridge_websocket.launch port:=9090 &
sleep 3

# Start servo system
echo "📍 Starting servo system..."
roslaunch kortex_examples servo.launch &
python3 /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/scripts/velocity_bridge.py &
sleep 3

# Start web application
echo "📍 Starting web application..."
cd /root/my_main_project/my-app
npm run dev &

echo ""
echo "🎉 System started successfully!"
echo "🌐 Web interface: http://localhost:3000"
echo "🔗 ROS bridge: ws://localhost:9090"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo "Stopping services..."; pkill -f roscore; pkill -f roslaunch; pkill -f python3; pkill -f npm; exit 0' INT
wait
EOF

chmod +x /root/my_main_project/start-system.sh
```

### Method 2: Manual Startup

```bash
# Terminal 1: ROS Core
roscore

# Terminal 2: Robot Driver  
roslaunch kortex_driver kortex_driver.launch

# Terminal 3: ROS Bridge
roslaunch rosbridge_server rosbridge_websocket.launch port:=9090

# Terminal 4: Servo System
roslaunch kortex_examples servo.launch

# Terminal 5: Velocity Bridge
python3 /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/scripts/velocity_bridge.py

# Terminal 6: Web Application
cd /root/my_main_project/my-app && npm run dev

# Terminal 7: Manual Controller (Optional)
python3 /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/scripts/kinova_joystick_controller.py
```

## 🆘 Installation Troubleshooting

### Common Issues and Solutions

#### Issue 1: ROS Installation Problems
```bash
# Solution: Clean and reinstall ROS
sudo apt remove ros-noetic-*
sudo apt autoremove
sudo apt clean
# Then repeat Step 2
```

#### Issue 2: Catkin Build Failures
```bash
# Solution: Clean and rebuild workspace
cd /root/my_main_project/ros_ws
catkin clean -y
rosdep install --from-paths src --ignore-src -r -y
catkin_make
```

#### Issue 3: Node.js Permission Issues
```bash
# Solution: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### Issue 4: Robot Connection Issues
```bash
# For USB connection issues:
sudo usermod -a -G dialout $USER
sudo udevadm control --reload-rules
sudo udevadm trigger

# For network connection issues:
sudo systemctl restart networking
ping 192.168.1.10  # Test robot connectivity
```

### Getting Additional Help

- **ROS Issues**: Check [ROS Answers](https://answers.ros.org/)
- **Kinova Issues**: See [Kinova Documentation](https://github.com/Kinovarobotics/ros_kortex)
- **Web App Issues**: Check [Next.js Documentation](https://nextjs.org/docs)
- **Project Issues**: Create issue on [GitHub Repository](https://github.com/Team-Deimos-IIT-Mandi/Robotic-Arm-Gui/issues)

## ✅ Installation Complete

After successful installation, you should have:

- ✅ ROS Noetic with all required packages
- ✅ Functional ROS workspace with robot drivers
- ✅ Working web application with dependencies
- ✅ Hardware connections established
- ✅ Environment properly configured

**Next Steps:**
1. Review the [Main README](../README.md) for system overview
2. Check [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues
3. Explore [API Reference](./API_REFERENCE.md) for development
4. Start the system and access http://localhost:3000

---

**Need Help?** If you encounter issues during installation, please check the troubleshooting guide or create an issue in the GitHub repository with your error logs and system information.