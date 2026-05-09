import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #030810 0%, #0d2035 50%, #030810 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          padding: "20px",
          textAlign: "center",
        }}>
          {/* Error Icon */}
          <div style={{
            width: "80px",
            height: "80px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            fontSize: "40px",
          }}>
            ⚠️
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "48px",
            fontWeight: "300",
            color: "white",
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}>
            Oops! Something <span style={{ fontStyle: "italic", color: "#EF4444" }}>broke</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "15px",
            maxWidth: "500px",
            lineHeight: "1.7",
            marginBottom: "8px",
            fontWeight: "300",
          }}>
            Don't worry, it happens sometimes. Our team has been notified.
          </p>
          
          <p style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "13px",
            marginBottom: "40px",
          }}>
            Try refreshing the page or going back home.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "14px 28px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "1px",
                transition: "all 0.3s",
              }}
              onMouseOver={e => {
                e.target.style.borderColor = "#1D9E75";
                e.target.style.color = "#1D9E75";
              }}
              onMouseOut={e => {
                e.target.style.borderColor = "rgba(255,255,255,0.2)";
                e.target.style.color = "rgba(255,255,255,0.8)";
              }}
            >
              🔄 Refresh Page
            </button>

            <button
              onClick={this.handleReset}
              style={{
                background: "linear-gradient(135deg, #1D9E75, #0d7a5a)",
                color: "white",
                border: "none",
                padding: "14px 28px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "1px",
                transition: "all 0.3s",
              }}
              onMouseOver={e => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 10px 25px rgba(29,158,117,0.4)";
              }}
              onMouseOut={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              🏠 Go to Home
            </button>
          </div>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details style={{
              marginTop: "48px",
              padding: "20px",
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "8px",
              maxWidth: "600px",
              textAlign: "left",
            }}>
              <summary style={{ 
                color: "#EF4444", 
                cursor: "pointer", 
                fontSize: "13px",
                marginBottom: "12px",
              }}>
                🔍 Error Details (Dev Mode)
              </summary>
              <pre style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "11px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                marginTop: "12px",
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;