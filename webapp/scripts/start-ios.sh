#!/bin/sh

# Open the Xcode project
open ../ios/quantum-example.xcodeproj

# Navigate back to the root directory (if needed) and start the React development server
cd - > /dev/null
pwd
npm run start
