import { useNavigate } from "react-router-dom";
import "./ErrorState.css";

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  showHomeButton = true,
}) {
  const navigate = useNavigate();

  return (
    <div className="error-state">
      <div className="error-state-icon">
        ⚠️
      </div>

      <h2>Oops! Something went wrong</h2>

      <p>{message}</p>

      <div className="error-state-actions">
        {onRetry && (
          <button
            className="error-retry-btn"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}

        {showHomeButton && (
          <button
            className="error-home-btn"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        )}
      </div>
    </div>
  );
}