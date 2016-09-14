#!/bin/bash

if [ "$1" = "" ]; then
  echo 'No test parameter supplied'
  exit
fi

rm /home/codio/workspace/$1/*.png >/dev/null 2>&1
cd /home/codio/workspace/.guides/private
RET=`casperjs test test.js --folder=$1`
CODE=$?
echo "$RET" | tail -n +2
exit $CODE