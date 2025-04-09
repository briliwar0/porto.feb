#!/bin/bash

# Build the frontend
echo "Building frontend..."
npm run build

# Create functions-build directory
mkdir -p functions-build

# Build serverless functions
echo "Building serverless functions..."
esbuild functions/server.js --platform=node --packages=external --bundle --outfile=functions/server.js

echo "Build completed successfully!"