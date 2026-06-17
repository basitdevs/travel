import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-light px-5 py-10">
          <div className="card-premium max-w-md p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 text-accent" size={54} />
            <h1 className="font-display text-3xl font-semibold text-primary">Something went wrong</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              An unexpected error occurred. Please refresh the page or return home.
            </p>
            <Link to="/" className="btn-primary mt-7">Return Home</Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
