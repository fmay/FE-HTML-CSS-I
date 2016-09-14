#!/bin/bash

cd /home/codio/workspace/.guides/private
RET=`casperjs test test1.js`
CODE=$?
echo "$RET" | tail -n +2
exit $CODE