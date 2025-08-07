mod monitor;
mod detector;
mod logger;
mod state;
mod ui;

use std::env;
use std::thread;
use std::time::Duration;
use crate::state::create_shared_state;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    // Check if running in scan mode
    if args.len() > 1 && args[1] == "--scan" {
        run_scan_mode();
        return;
    }

    // Default TUI mode
    let stats = create_shared_state();

    let monitor_stats = stats.clone();
    thread::spawn(move || {
        if let Err(e) = monitor::start_capture(monitor_stats) {
            eprintln!("Monitor error: {}", e);
        }
    });

    if let Err(e) = ui::run_dashboard(stats) {
        eprintln!("UI error: {}", e);
    }
}

fn run_scan_mode() {
    println!("Running CyberSentinel scan...");
    
    let stats = create_shared_state();
    let monitor_stats = stats.clone();
    
    // Start packet capture in background
    thread::spawn(move || {
        if let Err(e) = monitor::start_capture(monitor_stats) {
            eprintln!("Monitor error: {}", e);
        }
    });
    
    // Run scan for 30 seconds
    thread::sleep(Duration::from_secs(30));
    
    // Convert alerts.json from line-delimited JSON to JSON array
    logger::finalize_alerts_json();
    
    println!("Scan completed successfully!");
}
