'use client'

import { useState } from 'react'
import { Shield, Search, Download, Play, Loader2 } from 'lucide-react'
import { saveAs } from 'file-saver'
import { Parser } from '@json2csv/plainjs'
import useSWR, { mutate } from 'swr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatsGrid from '@/components/StatsGrid'
import AlertFeed from '@/components/AlertFeed'
import PacketChart from '@/components/PacketChart'
import TopIpsTable from '@/components/TopIpsTable'
import { useToast } from '@/hooks/use-toast'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()
  
  const { data: alerts } = useSWR('/api/alerts', fetcher, {
    refreshInterval: 5000,
  })

  const filteredAlerts = alerts?.filter((alert: any) =>
    searchQuery === '' ||
    alert.source_ip.includes(searchQuery) ||
    alert.dest_ip.includes(searchQuery) ||
    alert.alert.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const exportToCSV = () => {
    if (!filteredAlerts.length) return
    
    const parser = new Parser()
    const csv = parser.parse(filteredAlerts)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `cybersentinel-alerts-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const runScan = async () => {
    setIsScanning(true)
    
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Revalidate the alerts data
        await mutate('/api/alerts')
        
        toast({
          title: "Scan Completed",
          description: `Successfully scanned and found ${result.alertsCount} alerts.`,
          variant: "success",
        })
      } else {
        throw new Error(result.error || 'Scan failed')
      }
    } catch (error) {
      console.error('Scan failed:', error)
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">CyberSentinel</h1>
              </div>
              <div className="text-sm text-muted-foreground">
                Real-time Network Security Monitor
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search alerts by IP or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
              
              <Button 
                onClick={runScan} 
                disabled={isScanning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Scan
                  </>
                )}
              </Button>
              
              <Button variant="outline" size="sm" onClick={exportToCSV} disabled={!filteredAlerts.length}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV ({filteredAlerts.length})
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <StatsGrid />

        {/* Charts and Data */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PacketChart />
              <TopIpsTable />
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertFeed searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PacketChart />
                  <TopIpsTable />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
