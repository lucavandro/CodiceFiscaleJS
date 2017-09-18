#!/bin/bash

echo
if which node > /dev/null
then
    echo "Node.js installed, you can proceed"
else
    echo "Visit https://nodejs.org to install Node.js (required to create JSON)"
fi
echo
