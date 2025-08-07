use pcap::{Capture, Device};
use std::error::Error;
use std::net::Ipv4Addr;

use crate::{detector, state::SharedStats};

pub fn start_capture(stats: SharedStats) -> Result<(), Box<dyn Error>> {
    let device = Device::lookup()?.ok_or("No device found")?;
    println!("📡 Capturing on device: {}\n", device.name);

    let mut cap = Capture::from_device(device.name.as_str())?
        .promisc(true)
        .snaplen(65535)
        .open()?;

    while let Ok(packet) = cap.next_packet() {
        let data = packet.data;

        if data.len() < 34 {
            continue;
        }

        let ethertype = u16::from_be_bytes([data[12], data[13]]);
        if ethertype != 0x0800 {
            continue;
        }

        let source_ip = Ipv4Addr::new(data[26], data[27], data[28], data[29]);
        let dest_ip = Ipv4Addr::new(data[30], data[31], data[32], data[33]);
        let ip_header_len = (data[14] & 0x0F) * 4;
        let protocol = data[23];

        let source_port = u16::from_be_bytes([
            data[14 + ip_header_len as usize],
            data[15 + ip_header_len as usize],
        ]);
        let dest_port = u16::from_be_bytes([
            data[16 + ip_header_len as usize],
            data[17 + ip_header_len as usize],
        ]);

        {
            let mut stats = stats.lock().unwrap();
            stats.total_packets += 1;
            match protocol {
                6 => stats.tcp_packets += 1,
                17 => stats.udp_packets += 1,
                _ => {}
            }
        }

        detector::analyze_packet(
            &source_ip,
            &dest_ip,
            source_port,
            dest_port,
            protocol,
            data.len(),
        );
    }

    Ok(())
}
