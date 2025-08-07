use std::fs::{OpenOptions, File};
use std::io::{Write, BufRead, BufReader};
use std::net::Ipv4Addr;
use chrono::Utc;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct LogEntry {
    timestamp: String,
    source_ip: String,
    dest_ip: String,
    source_port: u16,
    dest_port: u16,
    protocol: String,
    alert: String,
}

pub fn log_event(
    src_ip: &Ipv4Addr,
    dst_ip: &Ipv4Addr,
    src_port: u16,
    dst_port: u16,
    protocol: &str,
    alert: &str,
) {
    let entry = LogEntry {
        timestamp: Utc::now().to_rfc3339(),
        source_ip: src_ip.to_string(),
        dest_ip: dst_ip.to_string(),
        source_port: src_port,
        dest_port: dst_port,
        protocol: protocol.to_string(),
        alert: alert.to_string(),
    };

    let json = serde_json::to_string(&entry).unwrap();

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("alerts.json")
        .unwrap();

    writeln!(file, "{}", json).unwrap();
}

pub fn finalize_alerts_json() {
    // Read all line-delimited JSON entries
    let file = match File::open("alerts.json") {
        Ok(file) => file,
        Err(_) => {
            // No alerts file exists, create empty array
            let mut file = File::create("alerts.json").unwrap();
            writeln!(file, "[]").unwrap();
            return;
        }
    };
    
    let reader = BufReader::new(file);
    let mut alerts = Vec::new();
    
    for line in reader.lines() {
        if let Ok(line) = line {
            let line = line.trim();
            if !line.is_empty() {
                if let Ok(alert) = serde_json::from_str::<LogEntry>(&line) {
                    alerts.push(alert);
                }
            }
        }
    }
    
    // Write as proper JSON array
    let json_array = serde_json::to_string_pretty(&alerts).unwrap();
    let mut file = File::create("alerts.json").unwrap();
    writeln!(file, "{}", json_array).unwrap();
}
