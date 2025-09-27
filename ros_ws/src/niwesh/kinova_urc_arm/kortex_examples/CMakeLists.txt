cmake_minimum_required(VERSION 3.0.2)
project(kortex_examples)

add_compile_options(-std=c++11)
add_definitions(-D_OS_UNIX)

## Find catkin and any catkin packages
## We've added python_setup to the components list
find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
  message_generation
  actionlib_msgs
  actionlib
  kortex_driver
)

## This command invokes your setup.py file
catkin_python_setup()

## Declare a catkin package
catkin_package()

include_directories(include ${catkin_INCLUDE_DIRS})
include_directories(include ${PROJECT_SOURCE_DIR}/src)
include_directories(include ${PROJECT_SOURCE_DIR}/../kortex_api/include/client)
include_directories(include ${PROJECT_SOURCE_DIR}/../kortex_api/include/client_stubs)
include_directories(include ${PROJECT_SOURCE_DIR}/../kortex_api/include/messages)
include_directories(include ${PROJECT_SOURCE_DIR}/../kortex_api/include/common)

add_executable(example_actuator_configuration_cpp src/actuator_config/example_actuator_configuration.cpp)
add_dependencies(example_actuator_configuration_cpp ${catkin_EXPORTED_TARGETS})
target_link_libraries(example_actuator_configuration_cpp ${catkin_LIBRARIES} )

add_executable(example_vision_configuration_cpp src/vision_config/example_vision_configuration.cpp)
add_dependencies(example_vision_configuration_cpp ${catkin_EXPORTED_TARGETS})
target_link_libraries(example_vision_configuration_cpp ${catkin_LIBRARIES} )

add_executable(example_full_arm_movement_cpp src/full_arm/example_full_arm_movement.cpp)
add_dependencies(example_full_arm_movement_cpp ${catkin_EXPORTED_TARGETS})
target_link_libraries(example_full_arm_movement_cpp ${catkin_LIBRARIES} )

add_executable(example_cartesian_poses_with_notifications_cpp src/full_arm/example_cartesian_poses_with_notifications.cpp)
add_dependencies(example_cartesian_poses_with_notifications_cpp ${catkin_EXPORTED_TARGETS})
target_link_libraries(example_cartesian_poses_with_notifications_cpp ${catkin_LIBRARIES} )

add_executable(example_waypoint_action_client_cpp src/full_arm/example_waypoint_action_client.cpp)
add_dependencies(example_waypoint_action_client_cpp ${catkin_EXPORTED_TARGETS})
target_link_libraries(example_waypoint_action_client_cpp ${catkin_LIBRARIES} )

if(CATKIN_ENABLE_TESTING)
  find_package(rostest REQUIRED)
  catkin_add_gtest(kortex_examples_tests src/tests/kortex_examples_tests.cc)
    target_link_libraries(kortex_examples_tests ${catkin_LIBRARIES})
endif()

# Install Section

## This now ONLY installs the main executable node from the scripts folder
catkin_install_python(PROGRAMS
  scripts/robotic_typing_controller.py
  DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)

## Mark C++ executables and/or libraries for installation
install(TARGETS
  example_actuator_configuration_cpp
  example_vision_configuration_cpp
  example_full_arm_movement_cpp
  example_cartesian_poses_with_notifications_cpp
  example_waypoint_action_client_cpp
  ARCHIVE DESTINATION ${CATKIN_PACKAGE_LIB_DESTINATION}
  LIBRARY DESTINATION ${CATKIN_PACKAGE_LIB_DESTINATION}
  RUNTIME DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)