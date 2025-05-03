import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to the console for debugging
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12 text-red-600 font-bold">
          Er is iets misgegaan in dit onderdeel.<br />
          Probeer het later opnieuw of neem contact op met support.<br />
          <pre className="text-xs mt-4 text-gray-500 overflow-x-auto">{this.state.error?.toString()}</pre>
          {this.state.errorInfo && (
            <details className="text-xs text-gray-400 mt-2 whitespace-pre-wrap">
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
