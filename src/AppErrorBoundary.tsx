import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default class AppErrorBoundary extends Component<
  Props,
  { hasError: boolean }
> {
  constructor(props: Props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>The app has crashed 😱.</h2>
          <p>Hopefully, reloading the app will fix it.</p>
          <button type="button" onClick={() => location.reload()}>
            Reload the app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
