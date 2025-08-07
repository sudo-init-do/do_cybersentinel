'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Shield, Zap } from 'lucide-react'

interface Alert {
  timestamp: string
  source_ip: string
  dest_ip: string
  source_port: number
  dest_port: number
  protocol: string
  alert: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const getAlertSeverity = (alert: string) => {
  if (alert.toLowerCase().includes('critical') || alert.toLowerCase().includes('attack')) {
    return 'high'
  }
  if (alert.toLowerCase().includes('warning') || alert.toLowerCase().includes('suspicious')) {
    return 'medium'
  }
  return 'low'
}

const getAlertIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertTriangle
    case 'medium':
      return Shield
    default:
      return Zap
  }
}

const getBadgeVariant = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    default:
      return 'secondary'
  }
}

interface AlertFeedProps {
  searchQuery: string
}

export default function AlertFeed({ searchQuery }: AlertFeedProps) {
  const { data: alerts, error } = useSWR<Alert[]>('/api/alerts', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  })

  const filteredAlerts = alerts?.filter((alert) =>
    searchQuery === '' ||
    alert.source_ip.includes(searchQuery) ||
    alert.dest_ip.includes(searchQuery) ||
    alert.alert.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Alerts Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load alerts</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Live Alerts Feed
          <Badge variant="secondary">{filteredAlerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => {
              const severity = getAlertSeverity(alert.alert)
              const Icon = getAlertIcon(severity)
              
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getBadgeVariant(severity) as any}>
                        {alert.alert}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Source:</span>
                        <span className="ml-2 font-mono">{alert.source_ip}:{alert.source_port}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Destination:</span>
                        <span className="ml-2 font-mono">{alert.dest_ip}:{alert.dest_port}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Protocol:</span>
                      <span className="ml-2 font-mono">{alert.protocol}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredAlerts.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No alerts match your search criteria
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
