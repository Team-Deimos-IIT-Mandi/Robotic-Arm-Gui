# 🔧 Troubleshooting Guide

Comprehensive troubleshooting guide for the Kinova Robot Control System.

## 🚨 Emergency Procedures

### Immediate Safety Actions

If the robot is moving unexpectedly or dangerously:

1. **Physical Emergency Stop**: Press robot's physical emergency stop button
2. **Software Emergency Stop**: Click red emergency stop in web interface  
3. **Controller Emergency Stop**: Press B button on Xbox controller
4. **Power Disconnect**: Unplug robot power as last resort

```bash
# Emergency command to stop all ROS processes
pkill -f roscore
pkill -f roslaunch
pkill -f python3
```

## 🔍 Diagnostic Commands

### System Health Check

```bash
# Create system diagnostic script
cat > /root/my_main_project/diagnose-system.sh << 'EOF'
#!/bin/bash

echo "🔍 Kinova Robot Control System Diagnostics"
echo "=========================================="
echo ""

# Check ROS Master
echo "📍 Checking ROS Master..."
if pgrep -f roscore > /dev/null; then
    echo "✅ ROS Master running (PID: $(pgrep -f roscore))"
    echo "   Master URI: $ROS_MASTER_URI"
else
    echo "❌ ROS Master not running"
fi
echo ""

# Check ROS Nodes
echo "📍 Active ROS Nodes:"
if command -v rosnode &> /dev/null; then
    rosnode list 2>/dev/null || echo "❌ Cannot connect to ROS Master"
else
    echo "❌ ROS not properly installed"
fi
echo ""

# Check ROS Topics
echo "📍 Active ROS Topics:"
rostopic list 2>/dev/null | head -10 || echo "❌ Cannot list topics"
echo ""

# Check Robot Connection
echo "📍 Checking Robot Connection..."
if rostopic echo /my_gen3/joint_states -n 1 --timeout=3 &>/dev/null; then
    echo "✅ Robot responding to joint state requests"
else
    echo "❌ Robot not responding"
fi

# Check Hardware
echo "📍 Hardware Status:"
echo "USB Devices:"
lsusb | grep -i kinova || echo "   No Kinova USB device found"
echo "Network Connections:"
ping -c 1 192.168.1.10 &>/dev/null && echo "   ✅ Robot network reachable" || echo "   ❌ Robot network unreachable"
echo "Controllers:"
ls /dev/input/js* 2>/dev/null || echo "   No game controllers detected"
echo ""

# Check Web Application
echo "📍 Web Application Status:"
if pgrep -f "npm.*dev" > /dev/null; then
    echo "✅ Web server running (PID: $(pgrep -f 'npm.*dev'))"
else
    echo "❌ Web server not running"
fi

# Check ports
echo "📍 Port Status:"
netstat -tlnp 2>/dev/null | grep -E "(3000|9090|11311)" || echo "   Key ports not listening"

echo ""
echo "🏁 Diagnostic complete"
EOF

chmod +x /root/my_main_project/diagnose-system.sh
```

Run diagnostics:
```bash
/root/my_main_project/diagnose-system.sh
```

## ❌ Common Issues and Solutions

### 1. ROS Master Connection Issues

#### Symptoms:
- "Unable to connect to ROS Master" errors
- `rosnode list` fails
- Web interface shows "ROS Disconnected"

#### Diagnosis:
```bash
# Check if roscore is running
ps aux | grep roscore

# Check ROS environment variables
echo $ROS_MASTER_URI
echo $ROS_IP

# Test ROS master connectivity
rosnode list
```

#### Solutions:

**Solution 1: Start ROS Master**
```bash
# Kill any existing roscore processes
pkill -f roscore

# Start fresh roscore
roscore &

# Wait for startup
sleep 3

# Verify
rosnode list
```

**Solution 2: Fix Environment Variables**
```bash
# Set correct environment variables
export ROS_MASTER_URI=http://localhost:11311
export ROS_IP=$(hostname -I | awk '{print $1}')

# Add to bashrc permanently
echo "export ROS_MASTER_URI=http://localhost:11311" >> ~/.bashrc
echo "export ROS_IP=\$(hostname -I | awk '{print \$1}')" >> ~/.bashrc
source ~/.bashrc
```

**Solution 3: Network Issues**
```bash
# Check network connectivity
ping localhost

# Check if port 11311 is available
netstat -tlnp | grep 11311

# If port is busy, find and kill the process
sudo lsof -ti:11311 | xargs sudo kill
```

### 2. Robot Connection Problems

#### Symptoms:
- Robot doesn't respond to commands
- No joint state messages
- "Robot unreachable" errors

#### Diagnosis:
```bash
# Check hardware connection
lsusb | grep -i kinova          # For USB connection
ping 192.168.1.10               # For network connection

# Check robot driver
rosnode list | grep kortex
rostopic list | grep my_gen3

# Check joint states
rostopic echo /my_gen3/joint_states -n 1
```

#### Solutions:

**Solution 1: USB Connection Issues**
```bash
# Check USB device permissions
ls -la /dev/ttyACM* /dev/ttyUSB*

# Add user to dialout group
sudo usermod -a -G dialout $USER

# Restart udev
sudo udevadm control --reload-rules
sudo udevadm trigger

# Reconnect robot USB cable
```

**Solution 2: Network Connection Issues**
```bash
# Check robot IP configuration
# Default robot IP: 192.168.1.10
# Set computer IP: 192.168.1.11

sudo ip addr add 192.168.1.11/24 dev eth0

# Test connectivity
ping 192.168.1.10

# Check firewall
sudo ufw status
sudo ufw allow from 192.168.1.0/24
```

**Solution 3: Driver Issues**
```bash
# Restart robot driver
rosnode kill /my_gen3/my_gen3_driver

# Relaunch driver
roslaunch kortex_driver kortex_driver.launch

# Check driver logs
tail -f ~/.ros/log/latest/my_gen3_driver*.log
```

### 3. Servo Control Problems

#### Symptoms:
- Robot doesn't move when commanded
- Servo status shows errors
- Jerky or uncontrolled movement

#### Diagnosis:
```bash
# Check servo server status
rosnode list | grep servo
rostopic echo /servo_server/status -n 1

# Check servo input/output
rostopic echo /servo_server/delta_twist_cmds -n 1
rostopic echo /servo_server/command -n 1

# Check velocity bridge
rostopic echo /my_gen3/in/joint_velocity -n 1
```

#### Solutions:

**Solution 1: Servo Server Issues**
```bash
# Restart servo server
rosnode kill /servo_server

# Relaunch servo
roslaunch kortex_examples servo.launch

# Check servo configuration
cat /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/config/servo_config.yaml
```

**Solution 2: Message Type Mismatch**
```bash
# Check if velocity bridge is running
ps aux | grep velocity_bridge

# Start velocity bridge if not running
python3 /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/scripts/velocity_bridge.py &

# Verify message conversion
rostopic info /servo_server/command
rostopic info /my_gen3/in/joint_velocity
```

**Solution 3: Joint Limits / Safety**
```bash
# Check current joint positions
rostopic echo /my_gen3/joint_states -n 1

# Check if joints are at limits
# Edit servo config to adjust limits
nano /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/config/servo_config.yaml

# Reduce velocity scaling for smoother control
# scale:
#   linear: 0.2
#   rotational: 0.3
#   joint: 0.3
```

### 4. Web Application Issues

#### Symptoms:
- Web page won't load
- "Cannot connect to ROS" errors
- Controls not responding

#### Diagnosis:
```bash
# Check web server
ps aux | grep npm
netstat -tlnp | grep 3000

# Check ROS bridge
ps aux | grep rosbridge
netstat -tlnp | grep 9090

# Check browser console for errors
# Open browser dev tools (F12)
```

#### Solutions:

**Solution 1: Web Server Issues**
```bash
# Kill existing web server
pkill -f "npm.*dev"

# Navigate to web app directory
cd /root/my_main_project/my-app

# Reinstall dependencies if needed
rm -rf node_modules package-lock.json
npm install

# Start development server
npm run dev

# Or start production server
npm run start
```

**Solution 2: ROS Bridge Issues**
```bash
# Check if rosbridge is running
rosnode list | grep rosbridge

# Restart rosbridge
rosnode kill /rosbridge_websocket
roslaunch rosbridge_server rosbridge_websocket.launch port:=9090

# Test WebSocket connection
# In browser console:
# ws = new WebSocket('ws://localhost:9090')
# ws.onopen = () => console.log('Connected')
```

**Solution 3: Port Conflicts**
```bash
# Check what's using ports
sudo netstat -tlnp | grep -E "(3000|9090)"

# Kill processes using required ports
sudo lsof -ti:3000 | xargs sudo kill
sudo lsof -ti:9090 | xargs sudo kill

# Restart services
```

### 5. Joystick/Controller Issues

#### Symptoms:
- Controller input not detected
- Joystick node crashes
- Robot doesn't respond to controller

#### Diagnosis:
```bash
# Check controller detection
ls /dev/input/js*
jstest /dev/input/js0

# Check joystick node
rosnode list | grep joy
rostopic echo /joy -n 5
```

#### Solutions:

**Solution 1: Controller Detection**
```bash
# Install joystick tools
sudo apt install -y jstest-gtk joystick

# Check permissions
sudo chmod 666 /dev/input/js*

# Test controller
jstest /dev/input/js0

# If no controller detected:
# 1. Reconnect USB receiver
# 2. Press Xbox button to turn on controller
# 3. Check battery level
```

**Solution 2: Joystick Node Issues**
```bash
# Check if joy node is running
rosnode list | grep joy

# Start joy node if missing
rosrun joy joy_node &

# Check joystick controller
ps aux | grep kinova_joystick_controller

# Restart joystick controller
python3 /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/scripts/kinova_joystick_controller.py
```

### 6. Build and Compilation Issues

#### Symptoms:
- catkin_make fails
- Missing dependencies
- Import errors

#### Diagnosis:
```bash
# Check build errors
cd /root/my_main_project/ros_ws
catkin_make 2>&1 | tee build.log

# Check for missing dependencies
rosdep check --from-paths src --ignore-src
```

#### Solutions:

**Solution 1: Dependency Issues**
```bash
# Update package lists
sudo apt update

# Install missing dependencies
rosdep install --from-paths src --ignore-src -r -y

# Clean and rebuild
catkin clean -y
catkin_make
```

**Solution 2: Python Path Issues**
```bash
# Check Python path
echo $PYTHONPATH

# Fix Python path
export PYTHONPATH=/root/my_main_project/ros_ws/devel/lib/python3/dist-packages:$PYTHONPATH

# Add to bashrc
echo "export PYTHONPATH=/root/my_main_project/ros_ws/devel/lib/python3/dist-packages:\$PYTHONPATH" >> ~/.bashrc
```

**Solution 3: Permission Issues**
```bash
# Fix ownership
sudo chown -R $USER:$USER /root/my_main_project

# Fix permissions
chmod -R 755 /root/my_main_project
chmod +x /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/scripts/*.py
```

## 🛠️ Advanced Debugging

### Logging and Monitoring

#### Enable Detailed Logging
```bash
# Set ROS log level
export ROSCONSOLE_CONFIG_FILE=/root/my_main_project/debug_logging.conf

cat > /root/my_main_project/debug_logging.conf << 'EOF'
log4j.logger.ros=DEBUG
log4j.logger.ros.servo_server=DEBUG
log4j.logger.ros.kortex_driver=DEBUG
EOF
```

#### Monitor System Resources
```bash
# Create monitoring script
cat > /root/my_main_project/monitor-system.sh << 'EOF'
#!/bin/bash

while true; do
    clear
    echo "🖥️  System Resource Monitor"
    echo "=========================="
    echo ""
    
    # CPU and Memory
    echo "💻 CPU & Memory:"
    top -bn1 | grep "Cpu\|Mem\|Swap" | head -3
    echo ""
    
    # ROS Processes
    echo "🤖 ROS Processes:"
    ps aux | grep -E "(roscore|roslaunch|python3.*ros)" | grep -v grep | awk '{print $2, $3, $4, $11, $12, $13}' | head -10
    echo ""
    
    # Network Connections
    echo "🌐 Network Status:"
    netstat -tlnp 2>/dev/null | grep -E "(3000|9090|11311)" | head -5
    echo ""
    
    # ROS Topics Activity
    echo "📡 ROS Topic Activity:"
    timeout 2 rostopic hz /my_gen3/joint_states /servo_server/command 2>/dev/null || echo "Cannot measure topic rates"
    echo ""
    
    sleep 5
done
EOF

chmod +x /root/my_main_project/monitor-system.sh
```

#### Debug ROS Message Flow
```bash
# Monitor message flow
echo "Monitoring ROS message flow..."

# Terminal 1: Monitor joint states
rostopic echo /my_gen3/joint_states

# Terminal 2: Monitor servo input
rostopic echo /servo_server/delta_twist_cmds

# Terminal 3: Monitor servo output  
rostopic echo /servo_server/command

# Terminal 4: Monitor robot velocity commands
rostopic echo /my_gen3/in/joint_velocity
```

## 📊 Performance Optimization

### System Performance Issues

#### Symptoms:
- Slow response times
- High CPU usage
- Memory leaks

#### Solutions:

**Optimize ROS Performance**
```bash
# Reduce message rates
# Edit servo config
nano /root/my_main_project/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/config/servo_config.yaml

# Increase publish_period for lower frequency
# publish_period: 0.05  # 20Hz instead of 50Hz

# Reduce log verbosity
export ROSCONSOLE_CONFIG_FILE=""
```

**Optimize Web Application**
```bash
# Build for production
cd /root/my_main_project/my-app
npm run build
npm run start  # Instead of npm run dev
```

**System Resource Management**
```bash
# Increase system limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize network buffers
echo 'net.core.rmem_max = 134217728' | sudo tee -a /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 🆘 Getting Help

### Information to Collect Before Asking for Help

When reporting issues, please include:

1. **System Information**
```bash
# Run this command and include output
cat > /root/my_main_project/system-info.sh << 'EOF'
#!/bin/bash
echo "System Information Report"
echo "========================"
echo "Date: $(date)"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "ROS: $(rosversion -d)"
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo ""
echo "Environment Variables:"
echo "ROS_MASTER_URI: $ROS_MASTER_URI"
echo "ROS_IP: $ROS_IP"
echo ""
echo "Running Processes:"
ps aux | grep -E "(roscore|roslaunch|npm|python3)" | grep -v grep
echo ""
echo "Network Status:"
netstat -tlnp | grep -E "(3000|9090|11311)"
echo ""
echo "Hardware:"
lsusb | grep -i kinova
ls /dev/input/js* 2>/dev/null || echo "No controllers detected"
EOF

chmod +x /root/my_main_project/system-info.sh
/root/my_main_project/system-info.sh
```

2. **Error Logs**
```bash
# Collect recent logs
tail -n 100 ~/.ros/logs/latest/*.log
journalctl -xe | tail -50
```

3. **Specific Error Messages** - Copy exact error text

### Where to Get Help

- **GitHub Issues**: [Project Issues](https://github.com/Team-Deimos-IIT-Mandi/Robotic-Arm-Gui/issues)
- **ROS Community**: [ROS Answers](https://answers.ros.org/)
- **Kinova Support**: [Kinova Documentation](https://github.com/Kinovarobotics/ros_kortex)
- **Web Development**: [Next.js Documentation](https://nextjs.org/docs)

### Quick Recovery Procedures

#### Complete System Reset
```bash
# Nuclear option - restart everything
sudo reboot

# After reboot:
cd /root/my_main_project
./start-system.sh
```

#### Selective Service Restart
```bash
# Restart only ROS components
pkill -f roscore
pkill -f roslaunch
sleep 2
roscore &
sleep 3
roslaunch kortex_driver kortex_driver.launch &
roslaunch rosbridge_server rosbridge_websocket.launch port:=9090 &
```

---

**🔧 Remember**: Most issues can be resolved by systematically checking each component in the stack. Start with the basics (ROS Master, hardware connections) and work your way up to the application layer.

**⚠️ Safety First**: Always ensure the robot is in a safe state before attempting any troubleshooting procedures that might affect robot motion.