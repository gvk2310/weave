#!/bin/sh

 set -e

 # Replacing environment variables globally in build folder
 find ./build -type f -exec sed -i 's|###REACT_APP_PLATFORM_URL###|'${REACT_APP_PLATFORM_URL}'|gI' {} \;
 find ./build -type f -exec sed -i 's|###MYWD_KEY###|'${MYWD_KEY}'|gI' {} \;
 find ./build -type f -exec sed -i 's|###MYWD_IV###|'${MYWD_IV}'|gI' {} \;
 find ./build -type f -exec sed -i 's|###service_user###|'${service_user}'|gI' {} \;
 find ./build -type f -exec sed -i 's|###service_key###|'${service_key}'|gI' {} \;

#Starting the server

 echo "Starting DevNetOps Application"

 node server.js
