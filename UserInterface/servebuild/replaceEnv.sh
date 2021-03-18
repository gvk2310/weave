#!/bin/sh

 set -e

 # Replacing environment variables globally in build folder
 find ./build -type f -exec sed -i 's|###REACT_APP_PLATFORM_URL###|'${REACT_APP_PLATFORM_URL}'|gI' {} \;
 find ./build -type f -exec sed -i 's|###MYWD_KEY###|'${MYWD_KEY}'|gI' {} \;
 find ./build -type f -exec sed -i 's|###MYWD_IV###|'${MYWD_IV}'|gI' {} \;

#Starting the server

 echo "Starting DevNetOps Application"

 node server.js
