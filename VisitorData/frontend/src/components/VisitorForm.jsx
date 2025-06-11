
import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

/**
 * VisitorForm.jsx
 * ---------------
 * A stylised visitor‑registration form that:
 *  • Captures a live photo from the user's webcam (uses react‑webcam)
 *  • Records a digital signature on an HTML5 canvas
 *  • Sends the collected data to /api/visitors (JSON)
 *
 * IMPORTANT: Install the peer dependency before using this component:
 *   npm i react-webcam
 */

 // ---------- Inline SVG icon components ----------
const UserIcon = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const CameraIcon = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const FileIcon = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

const PenIcon = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const CheckIcon = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const RefreshIcon = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
      clipRule="evenodd"
    />
  </svg>
);

// ---------- Main Component ----------
export default function VisitorForm() {
  /* -------------------- State -------------------- */
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [photo, setPhoto] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [cameraError, setCameraError] = useState('');

  /* -------------------- Refs -------------------- */
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  /* -------------------- Camera handling -------------------- */
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user'
  };

  /** Capture still frame from webcam as base‑64 JPEG */
  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      setCameraOn(false);
      setCameraError('');
    } else {
      setCameraError('Could not capture photo. Please try again.');
    }
  }, []);

  const handleCameraError = useCallback((err) => {
    console.error('Webcam error:', err);
    setCameraError('Camera access was denied or is unavailable.');
    setCameraOn(false);
  }, []);

  /* -------------------- Signature handling -------------------- */
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    setSignature(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, reason, photo, signature })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Visitor Registered Successfully!');
        setName('');
        setReason('');
        setPhoto(null);
        clearSignature();
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please try again later.');
    }
  };

  /* -------------------- Styles (inline for brevity) -------------------- */
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #ec4899 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    position: 'relative'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)'
  };

  const formStyle = {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem'
  };

  const inputBase = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '1rem'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(4px)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '1.5rem'
  };

  const actionBtn = (bg) => ({
    background: bg,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  /* -------------------- Render -------------------- */
  return (
    <div style={containerStyle}>
      <div style={overlayStyle} />

      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
          Visitor Registration
        </h2>

        <div style={gridStyle}>
          {/* ------------ Left column ------------ */}
          <div>
            {/* Full name */}
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <UserIcon style={{ width: '1.25rem', height: '1.25rem', color: '#60a5fa' }} />
              &nbsp;Full Name
            </label>
            <input
              style={inputBase}
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Purpose */}
            <label
              style={{ display: 'block', marginTop: '1.5rem', marginBottom: '0.5rem' }}
            >
              <FileIcon style={{ width: '1.25rem', height: '1.25rem', color: '#4ade80' }} />
              &nbsp;Purpose of Visit
            </label>
            <textarea
              style={{ ...inputBase, minHeight: 100, resize: 'none' }}
              placeholder="Why are you visiting?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* ------------ Right column ------------ */}
          <div>
            {/* ---- Photo capture ---- */}
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <CameraIcon style={{ width: '1.25rem', height: '1.25rem', color: '#a78bfa' }} />
              &nbsp;Photo Capture
            </label>
            <div style={cardStyle}>
              {photo ? (
                /* Show captured image */
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={photo}
                    alt="Captured"
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 12,
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    style={{
                      ...actionBtn('transparent'),
                      marginTop: '0.75rem',
                      color: '#f87171'
                    }}
                  >
                    <CloseIcon style={{ width: '1rem', height: '1rem' }} />
                    Retake Photo
                  </button>
                </div>
              ) : cameraOn ? (
                /* Live webcam feed */
                <div style={{ textAlign: 'center' }}>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{
                      width: '100%',
                      borderRadius: 12,
                      marginBottom: '1rem'
                    }}
                    onUserMediaError={handleCameraError}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      style={actionBtn('#059669')}
                    >
                      Capture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCameraOn(false);
                        setCameraError('');
                      }}
                      style={actionBtn('#6b7280')}
                    >
                      Cancel
                    </button>
                  </div>
                  {cameraError && (
                    <p style={{ color: '#f87171', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      {cameraError}
                    </p>
                  )}
                </div>
              ) : (
                /* Idle state: show Take Photo button */
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setCameraOn(true)}
                    style={actionBtn('linear-gradient(135deg, #8b5cf6, #ec4899)')}
                  >
                    <CameraIcon style={{ width: '1rem', height: '1rem' }} />
                    Take Photo
                  </button>
                  {cameraError && (
                    <p style={{ color: '#f87171', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      {cameraError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ---- Signature ---- */}
            <label
              style={{ display: 'block', marginTop: '1.5rem', marginBottom: '0.5rem' }}
            >
              <PenIcon style={{ width: '1.25rem', height: '1.25rem', color: '#fbbf24' }} />
              &nbsp;Digital Signature
            </label>
            <div style={cardStyle}>
              <canvas
                ref={canvasRef}
                width={300}
                height={80}
                style={{
                  width: '100%',
                  height: 80,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'crosshair'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.75rem'
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Sign above</p>
                <button
                  type="button"
                  onClick={clearSignature}
                  style={{ ...actionBtn('transparent'), color: '#f87171' }}
                >
                  <RefreshIcon style={{ width: '1rem', height: '1rem' }} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Submit ---- */}
        <button
          type="submit"
          style={{
            ...actionBtn('linear-gradient(135deg, #059669, #10b981)'),
            width: '100%',
            fontSize: '1.125rem',
            marginTop: '2rem',
            justifyContent: 'center'
          }}
        >
          <CheckIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          Register Visitor
        </button>
      </form>
    </div>
  );
}
