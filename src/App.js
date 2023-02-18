import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const alertSound = new Audio('./alert.wav');

function App() {
  const webcamRef = useRef(null);
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT);

  const videoConstraints = {
    facingMode: FACING_MODE_USER,
    // aspectRatio: 1,
  };

  const detectDrowsy = (imageSrc) => {
    const drowsy = true;

    if (drowsy) {
      console.log("drowsy");
      // play noise to alert user that they are drowsy
      alertSound.play();
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
    </div>
  );
}

export default App;
