import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="icon" aria-hidden="true">⚠️</div>
          <h2>حدث خطأ غير متوقع</h2>
          <p>يرجى تحديث الصفحة والمحاولة مرة أخرى</p>
          <button className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>
            تحديث الصفحة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
