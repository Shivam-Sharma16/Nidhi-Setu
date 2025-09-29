import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, RotateCcw, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';

const FaceVerification = ({ user, setUser }) => {
  const [isActive, setIsActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [faceAngle, setFaceAngle] = useState('center');
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const angles = ['left', 'center', 'right'];
  const [currentAngleIndex, setCurrentAngleIndex] = useState(1);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startVerification = async () => {
    if (user.verificationCount >= 20) {
      alert('Daily verification limit reached. Please try again tomorrow.');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsActive(true);
      setVerificationStatus('detecting');
      simulateAngleDetection();
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopVerification = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsActive(false);
    setVerificationStatus('idle');
    setCurrentAngleIndex(1);
    setLivenessPassed(false);
  };

  const simulateAngleDetection = () => {
    let angleIndex = 0;
    const angleInterval = setInterval(() => {
      if (angleIndex < angles.length) {
        setCurrentAngleIndex(angleIndex);
        setFaceAngle(angles[angleIndex]);
        angleIndex++;
      } else {
        clearInterval(angleInterval);
        setTimeout(() => {
          setLivenessPassed(true);
          setTimeout(() => {
            const success = Math.random() > 0.1;
            if (success) {
              setVerificationStatus('success');
              setUser(prev => ({ ...prev, verificationCount: prev.verificationCount + 1 }));
            } else {
              setVerificationStatus('failed');
            }
            setTimeout(() => {
              stopVerification();
            }, 3000);
          }, 2000);
        }, 1000);
      }
    }, 3000);
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'detecting': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'detecting': return <RotateCcw className="w-5 h-5 animate-spin" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'failed': return <AlertTriangle className="w-5 h-5" />;
      default: return <Camera className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3 transition-all duration-700">
          Face Verification
        </h1>
        <p className="text-gray-600 text-lg">Multi-angle face recognition with liveness detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Feed */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-500 hover:shadow-xl">
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-blue-600 w-48 h-60 rounded-lg relative animate-pulse">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 px-3 py-1 rounded text-white text-sm shadow-md">
                      Face Detected
                    </div>
                  </div>
                </div>
              )}
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Camera feed will appear here</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              {!isActive ? (
                <button
                  onClick={startVerification}
                  disabled={user.verificationCount >= 20}
                  className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Verification</span>
                </button>
              ) : (
                <button
                  onClick={stopVerification}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Pause className="w-5 h-5" />
                  <span>Stop Verification</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Verification Progress */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-500 hover:shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className={getStatusColor()}>{getStatusIcon()}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Verification Status</h3>
                <p className={`text-sm ${getStatusColor()}`}>
                  {verificationStatus === 'idle' && 'Ready to start'}
                  {verificationStatus === 'detecting' && 'Analyzing facial features...'}
                  {verificationStatus === 'success' && 'Verification successful!'}
                  {verificationStatus === 'failed' && 'Verification failed. Please try again.'}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Multi-angle Detection</span>
                <div className="flex space-x-1">
                  {angles.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < currentAngleIndex || verificationStatus === 'success'
                          ? 'bg-blue-600'
                          : index === currentAngleIndex && isActive
                          ? 'bg-blue-600 animate-pulse'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Liveness Detection</span>
                <div className={`w-3 h-3 rounded-full ${livenessPassed || verificationStatus === 'success' ? 'bg-green-600' : 'bg-gray-300'}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Face Matching</span>
                <div className={`w-3 h-3 rounded-full ${verificationStatus === 'success' ? 'bg-green-600' : verificationStatus === 'failed' ? 'bg-red-600' : 'bg-gray-300'}`} />
              </div>
            </div>
          </div>

          {isActive && (
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-500 hover:shadow-xl">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Current Detection Angle</h4>
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
                    faceAngle === 'center' ? 'bg-blue-100 border-2 border-blue-600' :
                    faceAngle === 'left' ? 'bg-yellow-100 border-2 border-yellow-600' :
                    'bg-purple-100 border-2 border-purple-600'
                  }`}
                >
                  <Square
                    className={`w-8 h-8 ${
                      faceAngle === 'center' ? 'text-blue-600' :
                      faceAngle === 'left' ? 'text-yellow-600' :
                      'text-purple-600'
                    }`}
                  />
                </div>
                <p className="text-gray-800 font-medium capitalize">{faceAngle} Angle</p>
                <p className="text-gray-500 text-sm">
                  {faceAngle === 'center' && 'Looking straight ahead'}
                  {faceAngle === 'left' && 'Turn head slightly left'}
                  {faceAngle === 'right' && 'Turn head slightly right'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-500 hover:shadow-xl">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Daily Usage</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Verifications</span>
              <span className="text-gray-800 font-bold">{user.verificationCount}/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${user.verificationCount >= 20 ? 'bg-red-600' : 'bg-blue-600'}`}
                style={{ width: `${(user.verificationCount / 20) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-500 text-sm mt-2">Resets daily at midnight</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceVerification;
