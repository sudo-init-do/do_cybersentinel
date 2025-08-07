#!/bin/bash

# CyberSentinel Frontend Startup Script
# Runs only the Next.js frontend (backend scanning is triggered via API)

echo "🚀 Starting CyberSentinel Frontend Dashboard..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down CyberSentinel Frontend...${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Build Rust binary if needed
echo -e "${BLUE}Ensuring Rust binary is built...${NC}"
if [ ! -f "target/debug/cybersentinel" ]; then
    echo -e "${YELLOW}Building Rust binary...${NC}"
    cargo build
fi

# Check frontend dependencies
cd src/Client
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

echo ""
echo -e "${GREEN}🎯 CyberSentinel Dashboard Starting...${NC}"
echo -e "${BLUE}📊 Dashboard: ${NC}http://localhost:3000"
echo -e "${BLUE}⏱️  Scan Duration: ${NC}30 seconds per scan"
echo -e "${BLUE}🔧 Backend: ${NC}Triggered on-demand via 'Run Scan' button"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Start frontend
exec npx next dev --port 3000
