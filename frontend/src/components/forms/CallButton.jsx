import React, { useEffect } from "react";
import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  useEffect(() => {
    // Inject the CSS once when component mounts
    const style = document.createElement("style");
    style.textContent = `
      .call-button-container {
        position: absolute;
        top: 0;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 12px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background-color: #ffffff;
        z-index: 10;
        box-sizing: border-box;
      }

      .video-call-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #22c55e;
        color: white;
        padding: 8px 16px;
        border: none;
        font-size: 14px;
        font-weight: 600;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .video-call-btn:hover {
        background-color: #16a34a;
      }

      .video-icon {
        width: 20px;
        height: 20px;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="call-button-container">
      <button onClick={handleVideoCall} className="video-call-btn">
        <VideoIcon className="video-icon" />
        <span>Video Call</span>
      </button>
    </div>
  );
}

export default CallButton;
