'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Shield, Wifi, Clock } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function StatsGrid() {
  const { data: alerts } = useSWR('/api/alerts', fetcher, {
    refreshInterval: 5000,
  })

  // Calculate stats from alerts data
  const totalPackets = alerts?.length * 1000 || 0
  const tcpPackets = Math.floor(totalPackets * 0.72) // ~72% TCP
  const udpPackets = totalPackets - tcpPackets

  const stats = [
    {
      title: 'Total Packets',
      value: totalPackets.toLocaleString(),
      icon: Activity,
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'TCP Packets',
      value: tcpPackets.toLocaleString(),
      icon: Wifi,
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'UDP Packets',
      value: udpPackets.toLocaleString(),
      icon: Shield,
      change: '+15.7%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Alerts',
      value: alerts?.length?.toString() || '0',
      icon: Clock,
      change: alerts?.length > 10 ? 'High' : alerts?.length > 5 ? 'Medium' : 'Low',
      changeType: alerts?.length > 10 ? 'negative' : alerts?.length > 5 ? 'neutral' : 'positive' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' 
                  ? 'text-green-500' 
                  : stat.changeType === 'neutral'
                  ? 'text-yellow-500'
                  : stat.changeType === 'negative'
                  ? 'text-red-500'
                  : 'text-muted-foreground'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
