import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Sound from 'react-sound';
import AlertSound from './alert.wav';
import Map from './Map';

function App() {

  const webcamRef = useRef(null);
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT);

  const [playStatus, setPlayStatus] = useState('STOPPED');

  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  const drowsyClassfier = (imageSrc) => {
    return 0.6;
  }

  const detectDrowsy = async (imageSrc) => {
    const drowsy = drowsyClassfier(imageSrc) > 0.5;

    if (drowsy) {
      setPlayStatus('PLAYING');
      // wait 3 seconds, then stop
      setTimeout(() => {
        setPlayStatus('STOPPED');
      }, 3000);

    }

  }

  useEffect(() => {
    const interval = setInterval(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      detectDrowsy(imageSrc);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="App">
      <Sound url={AlertSound} playStatus={playStatus} />
      <Webcam
        ref={webcamRef}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: "100%",
        }}
        videoConstraints={{
          ...videoConstraints,
          facingMode
        }}
        mirrored={facingMode === FACING_MODE_USER}
      />
      <Map />

    </div>
  );
}

export default App;
