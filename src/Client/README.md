# CyberSentinel Dashboard

A professional cybersecurity dashboard built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

- **Real-time monitoring**: Live updates of network traffic and security alerts
- **Dark theme**: Professional dark mode interface
- **Responsive design**: Works on desktop and mobile devices
- **Interactive charts**: Packet activity visualization using Recharts
- **Alert management**: Search, filter, and export security alerts
- **Live updates**: Auto-refresh every 5 seconds using SWR

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Data Fetching**: SWR
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/Client/
├── app/
│   ├── api/alerts/route.ts     # API endpoint for alerts
│   ├── globals.css             # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── AlertFeed.tsx         # Live alerts feed
│   ├── PacketChart.tsx       # Packet activity chart
│   ├── StatsGrid.tsx         # Statistics cards
│   └── TopIpsTable.tsx       # Top IPs table
├── lib/
│   └── utils.ts              # Utility functions
└── public/
    └── alerts.json           # Sample alert data
```

## API Endpoints

- `GET /api/alerts` - Returns all security alerts

## Environment

The dashboard automatically refreshes alert data every 5 seconds and provides:
- Total packet counts
- TCP/UDP packet statistics
- System uptime
- Live security alerts
- Top source IPs by activity
- Interactive packet activity charts

## Deployment

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```
