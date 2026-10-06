# Security Policy

## 🔒 Security & Privacy Model

The **Athletic Diagnostic System (ADS)** is engineered under a zero-trust, client-side execution model.

### Air-Gapped Architectural Guarantees
1. **Zero External Telemetry**: The application contains no remote endpoints, analytics trackers, error loggers, or AI/LLM network APIs.
2. **Strict Content Security Policy (CSP)**: In production builds, the static export enforces `<meta http-equiv="Content-Security-Policy" content="connect-src 'none';">`. All outbound network requests are rejected by the browser runtime.
3. **Local Storage Privacy**: Assessment data is saved strictly in local browser `localStorage` and never leaves the user's client machine.
4. **Purge Control**: A dedicated purge mechanism (`clearData()`) provides full in-browser memory and storage scrubbing on demand.

### Environment & Secret Policy
- This repository does not require or accept private API keys or cloud database secrets.
- All `.env*` files are strictly excluded from version control via `.gitignore`.
- If you notice any unintended secret or credential in any commit history, please follow responsible disclosure below.

## 🛡️ Reporting a Vulnerability

If you discover a potential security vulnerability or Content Security Policy bypass, please report it privately:

1. Open a confidential security advisory on GitHub via the **Security > Advisories** tab.
2. Provide a clear description and reproduction steps.
3. We will review and address the issue promptly.
