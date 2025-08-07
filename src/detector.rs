use std::collections::HashMap;
use std::net::Ipv4Addr;
use std::sync::Mutex;
use std::time::{Duration, Instant};
use once_cell::sync::Lazy;

use crate::logger;

// Track IP hit counts
static IP_HITS: Lazy<Mutex<HashMap<Ipv4Addr, (u32, Instant)>>> = Lazy::new(|| Mutex::new(HashMap::new()));

// Suspicious ports (common malware, telnet, backdoor ports)
const SUSPICIOUS_PORTS: [u16; 5] = [23, 445, 1433, 3389, 31337];

pub fn analyze_packet(
    src_ip: &Ipv4Addr,
    dst_ip: &Ipv4Addr,
    src_port: u16,
    dst_port: u16,
    protocol: u8,
    size: usize,
) {
    let proto_str = match protocol {
        6 => "TCP",
        17 => "UDP",
        _ => "Other",
    };

    println!(
        "🌐 {} {}:{} -> {}:{} ({} bytes)",
        proto_str, src_ip, src_port, dst_ip, dst_port, size
    );

    // Detect suspicious destination ports
    if SUSPICIOUS_PORTS.contains(&dst_port) {
        println!("⚠️ Suspicious port detected: {} → {}", src_ip, dst_port);
        logger::log_event(
            src_ip,
            dst_ip,
            src_port,
            dst_port,
            proto_str,
            "Suspicious port access",
        );
    }

    // Detect possible port scanning or flooding
    let mut map = IP_HITS.lock().unwrap();
    let entry = map.entry(*src_ip).or_insert((0, Instant::now()));
    entry.0 += 1;

    if entry.1.elapsed() > Duration::from_secs(10) {
        // Reset counter after time window
        *entry = (1, Instant::now());
    } else if entry.0 > 50 {
        println!("🚨 Potential flood or scan from IP: {}", src_ip);
        logger::log_event(
            src_ip,
            dst_ip,
            src_port,
            dst_port,
            proto_str,
            "Port scan or flooding detected",
        );
        *entry = (0, Instant::now());
    }
}
