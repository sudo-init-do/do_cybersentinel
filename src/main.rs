mod monitor;
mod detector;
mod logger;

fn main() {
    println!("🚨 CyberSentinel: Starting packet capture...\n");

    if let Err(e) = monitor::start_capture() {
        eprintln!("❌ Error: {}", e);
    }
}
