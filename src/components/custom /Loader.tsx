import './loader.css';

export const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader-container">
        <div className="pulse-ring pulse-ring-1"></div>
        <div className="pulse-ring pulse-ring-2"></div>
        <div className="pulse-ring pulse-ring-3"></div>

        <div className="loader-center">
          <div className="medical-cross">
            <div className="cross-horizontal"></div>
            <div className="cross-vertical"></div>
          </div>
        </div>
      </div>

      <div className="loader-text">
        <span className="dot-1">•</span>
        <span className="dot-1">•</span>
        <span className="loading-label">Operazione in corso</span>
        <span className="dot-2">•</span>
        <span className="dot-3">•</span>
      </div>
    </div>
  );
};
