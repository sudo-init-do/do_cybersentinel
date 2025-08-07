'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

// Sample data for packet activity over time
const data = [
  { time: '00:00', tcp: 4000, udp: 2400, total: 6400 },
  { time: '04:00', tcp: 3000, udp: 1398, total: 4398 },
  { time: '08:00', tcp: 2000, udp: 9800, total: 11800 },
  { time: '12:00', tcp: 2780, udp: 3908, total: 6688 },
  { time: '16:00', tcp: 1890, udp: 4800, total: 6690 },
  { time: '20:00', tcp: 2390, udp: 3800, total: 6190 },
  { time: '24:00', tcp: 3490, udp: 4300, total: 7790 },
]

export default function PacketChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Packet Activity (24h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tcp" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="TCP Packets"
              />
              <Line 
                type="monotone" 
                dataKey="udp" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="UDP Packets"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Total Packets"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
