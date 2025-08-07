#!/bin/bash

# CyberSentinel Startup Script
# Runs both the Rust backend (TUI) and Next.js frontend simultaneously

echo "🚀 Starting CyberSentinel Dashboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down CyberSentinel...${NC}"
    # Kill all background jobs
    jobs -p | xargs -r kill
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Check if Rust binary exists, build if needed
echo -e "${BLUE}Checking Rust binary...${NC}"
if [ ! -f "target/debug/cybersentinel" ]; then
    echo -e "${YELLOW}Building Rust binary...${NC}"
    cargo build
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to build Rust binary${NC}"
        exit 1
    fi
fi

# Check if Node.js dependencies are installed
echo -e "${BLUE}Checking frontend dependencies...${NC}"
cd src/Client
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Node.js dependencies${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""
echo -e "${GREEN}🎯 CyberSentinel Services Starting...${NC}"
echo -e "${BLUE}📊 Frontend Dashboard: ${NC}http://localhost:3000"
echo -e "${BLUE}🖥️  TUI Dashboard: ${NC}Available via Rust binary"
echo -e "${BLUE}⏱️  Scan Duration: ${NC}30 seconds per scan"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Start Next.js development server in background
echo -e "${GREEN}Starting Frontend (Next.js)...${NC}"
npx next dev --port 3000 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Go back to root directory for Rust binary
cd ../..

# Start Rust TUI in background (optional, comment out if you don't want TUI)
echo -e "${GREEN}Starting Backend TUI (Rust)...${NC}"
./target/debug/cybersentinel &
BACKEND_PID=$!

echo ""
echo -e "${GREEN}🚀 All services started successfully!${NC}"
echo ""
echo -e "${BLUE}Services running:${NC}"
echo -e "  • Frontend: PID $FRONTEND_PID"
echo -e "  • Backend:  PID $BACKEND_PID"
echo ""
echo -e "${GREEN}🌐 Open your browser to: ${NC}http://localhost:3000"
echo -e "${GREEN}🔧 Click 'Run Scan' to start a 30-second network scan${NC}"
echo ""

# Keep script running and show logs
wait
