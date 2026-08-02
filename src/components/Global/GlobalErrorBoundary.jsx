import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("Global Error Caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Resetting location/state if necessary
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <AlertOctagon size={64} color="#EF4444" style={{ marginBottom: '16px' }} />
          <h1 style={styles.title}>Oops! Something went wrong.</h1>
          <p style={styles.subtitle}>
            We encountered an unexpected error. Our engineering team has been notified.
          </p>
          <div style={styles.errorBox}>
            {this.state.error && this.state.error.toString()}
          </div>
          <button style={styles.button} onClick={this.handleReset}>
            <RefreshCw size={18} style={{ marginRight: '8px' }} />
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
    backgroundColor: '#f8fafc',
    textAlign: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 12px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    maxWidth: '400px',
    margin: '0 0 24px 0',
    lineHeight: '1.5'
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'monospace',
    marginBottom: '32px',
    maxWidth: '100%',
    wordBreak: 'break-all'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
  }
};

export default GlobalErrorBoundary;
