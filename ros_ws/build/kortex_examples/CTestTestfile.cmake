# CMake generated Testfile for 
# Source directory: /root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples
# Build directory: /root/ros_ws/build/kortex_examples
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(_ctest_kortex_examples_gtest_kortex_examples_tests "/root/ros_ws/build/kortex_examples/catkin_generated/env_cached.sh" "/usr/bin/python3" "/opt/ros/noetic/share/catkin/cmake/test/run_tests.py" "/root/ros_ws/build/kortex_examples/test_results/kortex_examples/gtest-kortex_examples_tests.xml" "--return-code" "/root/ros_ws/devel/.private/kortex_examples/lib/kortex_examples/kortex_examples_tests --gtest_output=xml:/root/ros_ws/build/kortex_examples/test_results/kortex_examples/gtest-kortex_examples_tests.xml")
set_tests_properties(_ctest_kortex_examples_gtest_kortex_examples_tests PROPERTIES  _BACKTRACE_TRIPLES "/opt/ros/noetic/share/catkin/cmake/test/tests.cmake;160;add_test;/opt/ros/noetic/share/catkin/cmake/test/gtest.cmake;98;catkin_run_tests_target;/opt/ros/noetic/share/catkin/cmake/test/gtest.cmake;37;_catkin_add_google_test;/root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/CMakeLists.txt;54;catkin_add_gtest;/root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/CMakeLists.txt;0;")
subdirs("gtest")
