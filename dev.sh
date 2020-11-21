#!/usr/bin/env bash
oldPid=`lsof -i:4455 | grep 'node' | awk '{printf $2}'`

echo 'lsof -i:4455 > '$oldPid

if [[ ! $oldPid ]]; then

    echo 'start...'

else

    echo 'kill -9 '$oldPid

    kill -9 $oldPid

    echo 'restart...'

fi

echo 'npm start'

npm start

newPid=`lsof -i:4455 | grep 'node' | awk '{printf $2}'`

if [[ ! $newPid ]]; then

    echo 'run lsof -i:4455 to check'

else

    echo 'pid: '$newPid

fi
