use std::io;
use std::time::{Duration, Instant};

use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};

use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Span, Line},
    widgets::{Paragraph},
    Terminal,
};

use crate::state::SharedStats;

pub fn run_dashboard(stats: SharedStats) -> Result<(), Box<dyn std::error::Error>> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let start = Instant::now();

    loop {
        let elapsed = start.elapsed();
        let stats_snapshot = {
            let s = stats.lock().unwrap();
            (
                s.total_packets,
                s.tcp_packets,
                s.udp_packets,
                s.alerts.clone(),
            )
        };

        terminal.draw(|f| {
            draw_ui(f, elapsed, stats_snapshot.0, stats_snapshot.1, stats_snapshot.2)
        })?;

        if event::poll(Duration::from_millis(500))? {
            if let Event::Key(key) = event::read()? {
                if key.code == KeyCode::Char('q') {
                    break;
                }
            }
        }
    }

    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;
    Ok(())
}

fn draw_ui(
    f: &mut ratatui::Frame,
    elapsed: Duration,
    total: u64,
    tcp: u64,
    udp: u64,
) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(1)
        .constraints([Constraint::Length(3), Constraint::Length(3), Constraint::Min(0)].as_ref())
        .split(f.size());

    let title = Paragraph::new(Line::from(vec![Span::styled(
        "CyberSentinel Dashboard (press 'q' to quit)",
        Style::default().fg(Color::Green).add_modifier(Modifier::BOLD),
    )]));
    f.render_widget(title, chunks[0]);

    let status = Paragraph::new(Line::from(vec![
        Span::raw(format!("Uptime: {:.1?} | ", elapsed)),
        Span::styled("Total: ", Style::default().fg(Color::White)),
        Span::styled(total.to_string(), Style::default().fg(Color::Yellow)),
        Span::raw(" | TCP: "),
        Span::styled(tcp.to_string(), Style::default().fg(Color::Blue)),
        Span::raw(" | UDP: "),
        Span::styled(udp.to_string(), Style::default().fg(Color::Magenta)),
    ]));
    f.render_widget(status, chunks[1]);

    let body = Paragraph::new("📊 Real-time traffic analysis underway...");
    f.render_widget(body, chunks[2]);
}
