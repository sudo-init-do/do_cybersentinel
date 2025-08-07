'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Network } from 'lucide-react'

// Sample data for top source IPs
const topIps = [
  { ip: '192.168.1.100', packets: 1234, threats: 3, country: 'US' },
  { ip: '10.0.0.50', packets: 987, threats: 1, country: 'CA' },
  { ip: '172.16.0.25', packets: 856, threats: 0, country: 'UK' },
  { ip: '192.168.1.200', packets: 743, threats: 2, country: 'DE' },
  { ip: '10.1.1.10', packets: 654, threats: 0, country: 'FR' },
  { ip: '172.20.0.100', packets: 567, threats: 1, country: 'JP' },
]

const getThreatLevel = (threats: number) => {
  if (threats >= 3) return 'high'
  if (threats >= 1) return 'medium'
  return 'low'
}

const getThreatBadge = (threats: number) => {
  const level = getThreatLevel(threats)
  switch (level) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    default:
      return 'secondary'
  }
}

export default function TopIpsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Top Source IPs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP Address</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Packets</TableHead>
              <TableHead className="text-right">Threats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topIps.map((item) => (
              <TableRow key={item.ip}>
                <TableCell className="font-mono">{item.ip}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.country}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.packets.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={getThreatBadge(item.threats) as any}>
                    {item.threats}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
