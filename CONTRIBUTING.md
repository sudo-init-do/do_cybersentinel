# 🤝 Contributing to CyberSentinel

We're thrilled that you're interested in contributing to CyberSentinel! This guide will help you get started with contributing to our cybersecurity monitoring platform.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How to Contribute](#-how-to-contribute)
- [Development Setup](#-development-setup)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Testing Guidelines](#-testing-guidelines)
- [Issue Guidelines](#-issue-guidelines)
- [Security Policy](#-security-policy)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 How to Contribute

### Types of Contributions

- **🐛 Bug Reports**: Help us identify and fix issues
- **✨ Feature Requests**: Suggest new functionality
- **📝 Documentation**: Improve our docs and examples
- **🔧 Code Contributions**: Fix bugs or implement features
- **🧪 Testing**: Add test cases or improve test coverage
- **🎨 UI/UX**: Enhance the user interface and experience

### What We're Looking For

- **Security Features**: Enhanced threat detection algorithms
- **Performance Improvements**: Optimization for packet processing
- **Protocol Support**: Additional network protocol analysis
- **Dashboard Features**: New visualization components
- **Mobile Support**: Responsive design improvements
- **Accessibility**: Making the app more accessible
- **Documentation**: Clear, helpful documentation

## 🛠️ Development Setup

### Prerequisites

- **Rust** 1.70+ with Cargo
- **Node.js** 18+ with npm
- **Git** for version control
- **libpcap** development libraries

### Initial Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/do_cybersentinel.git
   cd cybersentinel
   ```

2. **Setup Development Environment**
   ```bash
   # Install Rust dependencies and build
   cargo build
   
   # Setup frontend
   cd src/Client
   npm install
   cd ../..
   
   # Make scripts executable
   chmod +x start.sh start-frontend.sh
   ```

3. **Verify Setup**
   ```bash
   # Test Rust build
   cargo test
   
   # Test frontend build
   cd src/Client && npm run build && cd ../..
   
   # Run the application
   ./start-frontend.sh
   ```

## 🔄 Pull Request Process

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** for significant changes
3. **Fork the repository** and create a feature branch
4. **Set up your development environment**

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Rust tests
   cargo test
   cargo clippy
   
   # Frontend tests
   cd src/Client
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new threat detection algorithm"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for refactoring
   - `perf:` for performance improvements

### Submitting Your PR

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use our PR template
   - Link to related issues
   - Provide clear description
   - Include screenshots for UI changes

3. **PR Review Process**
   - Automated checks must pass
   - Code review by maintainers
   - Address feedback promptly
   - Merge when approved

## 📝 Coding Standards

### Rust Code Style

```rust
// Use explicit error types
#[derive(Debug, thiserror::Error)]
pub enum NetworkError {
    #[error("Device not found: {device}")]
    DeviceNotFound { device: String },
    
    #[error("Permission denied")]
    PermissionDenied,
}

// Document public functions
/// Captures network packets and analyzes them for threats
/// 
/// # Arguments
/// * `device` - Network interface to monitor
/// * `filter` - BPF filter expression
/// 
/// # Returns
/// * `Ok(())` on successful completion
/// * `Err(NetworkError)` on failure
pub fn start_monitoring(device: &str, filter: &str) -> Result<(), NetworkError> {
    // Implementation
}

// Use meaningful variable names
let threat_detection_enabled = true;
let packet_processing_timeout = Duration::from_secs(30);
```

### TypeScript Code Style

```typescript
// Use explicit types
interface AlertData {
  readonly id: string;
  readonly timestamp: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly sourceIp: string;
  readonly destinationIp: string;
}

// Use functional components with hooks
export function AlertFeed({ alerts }: { alerts: AlertData[] }) {
  const [filter, setFilter] = useState<string>('');
  
  const filteredAlerts = useMemo(() => 
    alerts.filter(alert => 
      alert.sourceIp.includes(filter) ||
      alert.severity === filter
    ), [alerts, filter]
  );
  
  return (
    <div className="space-y-4">
      {filteredAlerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}

// Export types for reuse
export type { AlertData };
```

### File Organization

```
src/
├── Rust modules (snake_case)
│   ├── network_monitor.rs
│   ├── threat_detector.rs
│   └── alert_logger.rs
└── Client/
    ├── components/ (PascalCase)
    │   ├── AlertFeed.tsx
    │   └── SecurityDashboard.tsx
    ├── hooks/ (camelCase)
    │   └── useAlerts.ts
    └── utils/ (camelCase)
        └── formatters.ts
```

## 🧪 Testing Guidelines

### Rust Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_threat_detection() {
        let detector = ThreatDetector::new();
        let packet = create_test_packet();
        
        let result = detector.analyze(&packet);
        
        assert!(result.is_some());
        assert_eq!(result.unwrap().severity, Severity::High);
    }
    
    #[test]
    fn test_json_serialization() {
        let alert = Alert::new("Test", Severity::Low);
        let json = serde_json::to_string(&alert).unwrap();
        let deserialized: Alert = serde_json::from_str(&json).unwrap();
        
        assert_eq!(alert.message, deserialized.message);
    }
}
```

### Frontend Testing

```typescript
// Component tests
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertFeed } from '../AlertFeed';

test('filters alerts by search term', () => {
  const alerts = [
    { id: '1', sourceIp: '192.168.1.1', severity: 'high' },
    { id: '2', sourceIp: '10.0.0.1', severity: 'low' }
  ];
  
  render(<AlertFeed alerts={alerts} />);
  
  const searchInput = screen.getByPlaceholderText(/search/i);
  fireEvent.change(searchInput, { target: { value: '192.168' } });
  
  expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
  expect(screen.queryByText('10.0.0.1')).not.toBeInTheDocument();
});

// API tests
test('scan endpoint returns success', async () => {
  const response = await fetch('/api/scan', { method: 'POST' });
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
});
```

### Test Coverage

- **Unit Tests**: Test individual functions/components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Benchmark critical paths

Aim for:
- **80%+ code coverage** for new code
- **All edge cases** covered
- **Error scenarios** tested

## 🐛 Issue Guidelines

### Bug Reports

Use our bug report template and include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, Rust version, etc.)
- **Log output** if applicable
- **Screenshots** for UI issues

Example:
```
**Bug Description**
Dashboard crashes when clicking "Run Scan" button

**Steps to Reproduce**
1. Start the application with `./start.sh`
2. Open browser to localhost:3000
3. Click "Run Scan" button
4. Dashboard becomes unresponsive

**Environment**
- OS: macOS 14.1
- Rust: 1.70.0
- Node.js: 18.17.0
- Browser: Chrome 119.0
```

### Feature Requests

Include:

- **Clear use case** for the feature
- **Detailed description** of desired behavior
- **Mockups or examples** if applicable
- **Priority level** and justification

### Security Issues

**Do not** open public issues for security vulnerabilities. Instead:

1. Email security@cybersentinel.dev
2. Include detailed description
3. Wait for acknowledgment before disclosure

## 🔒 Security Policy

### Reporting Vulnerabilities

We take security seriously. If you discover a security vulnerability:

1. **Do not** open a public issue
2. **Email** security@cybersentinel.dev
3. **Include** detailed reproduction steps
4. **Wait** for our response before disclosure

### Security Best Practices

When contributing:

- **Validate all inputs** from external sources
- **Use safe Rust practices** (avoid `unsafe` unless necessary)
- **Follow OWASP guidelines** for web security
- **Keep dependencies updated**
- **Use secure defaults**

## 📚 Resources

### Learning Materials

- **Rust**: [The Rust Programming Language](https://doc.rust-lang.org/book/)
- **Network Programming**: [Rust Network Programming](https://doc.rust-lang.org/std/net/)
- **React**: [React Documentation](https://react.dev/)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools

- **Code Formatting**: `cargo fmt`, `prettier`
- **Linting**: `cargo clippy`, `eslint`
- **Testing**: `cargo test`, `jest`
- **Documentation**: `cargo doc`, `typedoc`

## 🎉 Recognition

Contributors will be:

- **Listed** in our AUTHORS file
- **Mentioned** in release notes
- **Invited** to join our Discord community
- **Eligible** for maintainer status

## 💬 Getting Help

- **Discord**: [Join our community](https://discord.gg/cybersentinel)
- **GitHub Discussions**: Ask questions and share ideas
- **Email**: maintainers@cybersentinel.dev

## 📄 License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

**Thank you for contributing to CyberSentinel! 🛡️**

*Together, we're building the future of network security monitoring.*
