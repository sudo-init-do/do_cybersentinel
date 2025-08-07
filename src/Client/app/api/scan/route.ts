import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

export async function POST() {
  try {
    const alertsPath = join(process.cwd(), 'public', 'alerts.json')
    
    // Path to the Rust binary
    const rustBinaryPath = join(process.cwd(), '..', '..', 'target', 'debug', 'cybersentinel')
    
    if (!existsSync(rustBinaryPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'CyberSentinel binary not found. Please build the project first with: cargo build' 
      }, { status: 500 })
    }

    // Clear the alerts file before running scan
    writeFileSync(alertsPath, '[]')
    
    console.log('Starting CyberSentinel scan...')
    
    return new Promise((resolve) => {
      // Run the scan command with --scan flag
      const child = spawn(rustBinaryPath, ['--scan'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 35000, // 35 second timeout (30s scan + 5s buffer)
        cwd: join(process.cwd(), 'public'), // Run in public directory so alerts.json is created there
      })

      let stdout = ''
      let stderr = ''

      child.stdout?.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('close', (code) => {
        if (code === 0) {
          try {
            // Read the updated alerts.json file
            const updatedAlerts = readFileSync(alertsPath, 'utf8')
            const alertsData = JSON.parse(updatedAlerts)
            
            resolve(NextResponse.json({ 
              success: true, 
              message: 'Scan completed successfully',
              alertsCount: alertsData.length,
              alerts: alertsData,
              output: stdout
            }))
          } catch (error) {
            console.error('Error reading alerts file:', error)
            resolve(NextResponse.json({ 
              success: false, 
              error: 'Failed to read scan results',
              details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 }))
          }
        } else {
          console.error('Scan failed with code:', code)
          console.error('stderr:', stderr)
          resolve(NextResponse.json({ 
            success: false, 
            error: `Scan failed with exit code ${code}`,
            details: stderr || stdout
          }, { status: 500 }))
        }
      })

      child.on('error', (error) => {
        console.error('Failed to start scan process:', error)
        resolve(NextResponse.json({ 
          success: false, 
          error: 'Failed to start scan process',
          details: error.message
        }, { status: 500 }))
      })

      // Close stdin to signal end of input
      child.stdin?.end()
    })
  } catch (error) {
    console.error('Scan endpoint error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
