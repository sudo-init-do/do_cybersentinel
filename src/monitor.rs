use pcap::{Capture, Device};
use std::error::Error;

pub fn start_capture() -> Result<(), Box<dyn Error>> {
    // Find the default network device
    let device = Device::lookup()?.name;
    println!("📡 Capturing on device: {}\n", device);

    let mut cap = Capture::from_device(device.as_str())?
        .promisc(true)
        .snaplen(65535)
        .open()?;

    while let Ok(packet) = cap.next() {
        println!(
            "📦 Packet received: {} bytes at {:?}",
            packet.data.len(),
            packet.header.ts
        );
    }

    Ok(())
}
