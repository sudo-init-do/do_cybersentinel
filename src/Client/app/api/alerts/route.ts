import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Read the alerts.json file from the public directory
    const filePath = join(process.cwd(), 'public', 'alerts.json')
    const fileContents = readFileSync(filePath, 'utf8')
    
    // Parse as JSON array
    const alerts = JSON.parse(fileContents)
    
    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error reading alerts file:', error)
    return NextResponse.json({ error: 'Failed to load alerts' }, { status: 500 })
  }
}
