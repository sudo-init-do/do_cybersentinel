use std::sync::{Arc, Mutex};

#[derive(Default)]
pub struct Stats {
    pub total_packets: u64,
    pub tcp_packets: u64,
    pub udp_packets: u64,
    pub alerts: Vec<String>,
}

pub type SharedStats = Arc<Mutex<Stats>>;

pub fn create_shared_state() -> SharedStats {
    Arc::new(Mutex::new(Stats::default()))
}
