#!/bin/sh

if [ -n "$DESTDIR" ] ; then
    case $DESTDIR in
        /*) # ok
            ;;
        *)
            /bin/echo "DESTDIR argument must be absolute... "
            /bin/echo "otherwise python's distutils will bork things."
            exit 1
    esac
fi

echo_and_run() { echo "+ $@" ; "$@" ; }

echo_and_run cd "/root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples"

# ensure that Python install destination exists
echo_and_run mkdir -p "$DESTDIR/root/ros_ws/install/lib/python3/dist-packages"

# Note that PYTHONPATH is pulled from the environment to support installing
# into one location when some dependencies were installed in another
# location, #123.
echo_and_run /usr/bin/env \
    PYTHONPATH="/root/ros_ws/install/lib/python3/dist-packages:/root/ros_ws/build/kortex_examples/lib/python3/dist-packages:$PYTHONPATH" \
    CATKIN_BINARY_DIR="/root/ros_ws/build/kortex_examples" \
    "/usr/bin/python3" \
    "/root/ros_ws/src/niwesh/kinova_urc_arm/kortex_examples/setup.py" \
     \
    build --build-base "/root/ros_ws/build/kortex_examples" \
    install \
    --root="${DESTDIR-/}" \
    --install-layout=deb --prefix="/root/ros_ws/install" --install-scripts="/root/ros_ws/install/bin"
