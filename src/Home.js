import './App.css';
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import OtherAlertSound from './otherDriverAlert.wav';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { getDistance } from 'geolib';
import Sound from 'react-sound';
import { useNavigate } from "react-router-dom";
import OtherDriverModal from './OtherDriverModal';
import predict from './predict';
import * as faceapi from 'face-api.js';
import Activity from './Activity';


const Home = () => {
  const navigate = useNavigate();

  const userSessionId = Math.random().toString(36).substring(7);

  const webcamRef = useRef(null);
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  const [otherPlayStatus, setOtherPlayStatus] = useState('STOPPED');
  const [showAlert, setShowAlert] = useState(false);
  const [ready, setReady] = useState(false);
  const [dozedOffTimes, setDozedOffTimes] = useState([]);


  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  const alertOtherDrivers = () => {
    // get user location
    navigator.geolocation.getCurrentPosition(function (position) {
      // send alert to firebase
      firebase.database().ref(`alerts/${userSessionId}`).set({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now()
      });
    });

  }

  const drowsyClassfier = async () => {
    const screenshot = webcamRef.current.video;
    // first need to find the eye from the face
    const landmarks = await faceapi.detectSingleFace(screenshot).withFaceLandmarks();
    if (!landmarks) {
      return 1;
    }
    const leftEye = landmarks.landmarks.getLeftEye()
    const rightEye = landmarks.landmarks.getRightEye()

    // for each eye, find the average x and y
    const leftEyeX = leftEye.map((point) => point.x)
    const leftEyeY = leftEye.map((point) => point.y)
    const rightEyeX = rightEye.map((point) => point.x)
    const rightEyeY = rightEye.map((point) => point.y)

    const leftEyeAvgX = leftEyeX.reduce((a, b) => a + b, 0) / leftEyeX.length;
    const leftEyeAvgY = leftEyeY.reduce((a, b) => a + b, 0) / leftEyeY.length;
    const rightEyeAvgX = rightEyeX.reduce((a, b) => a + b, 0) / rightEyeX.length;
    const rightEyeAvgY = rightEyeY.reduce((a, b) => a + b, 0) / rightEyeY.length;

    // crop the image to be the eye by going 64 pixels in each direction
    // create new canvas and draw the image on it
    const leftCanvas = document.createElement('canvas');
    leftCanvas.width = 64;
    leftCanvas.height = 64;
    const leftCtx = leftCanvas.getContext('2d');
    leftCtx.drawImage(screenshot, leftEyeAvgX - 32, leftEyeAvgY - 32, 64, 64, 0, 0, 64, 64);

    const rightCanvas = document.createElement('canvas');
    rightCanvas.width = 64;
    rightCanvas.height = 64;
    const rightCtx = rightCanvas.getContext('2d');
    rightCtx.drawImage(screenshot, rightEyeAvgX - 32, rightEyeAvgY - 32, 64, 64, 0, 0, 64, 64);

    // const leftImageSrc = leftCanvas.toDataURL('image/png');
    // const rightImageSrc = rightCanvas.toDataURL('image/png');

    // randomnly choose left or right eye to check
    const random = Math.random();
    if (random > 0.5) {
      const prediction = await predict(leftCanvas);
      console.log(prediction);
      return prediction;
    } else {
      const prediction = await predict(rightCanvas);
      return prediction;
    }

  }

  const detectDrowsy = async () => {
    const drowsy1 = (await drowsyClassfier()) < 0.7;
    // wait 5 seconds
    await new Promise(r => setTimeout(r, 5000));
    const drowsy2 = (await drowsyClassfier()) < 0.7;
    if (drowsy1 && drowsy2) {
      alertOtherDrivers();
      localStorage.setItem('dozedOffTimes', JSON.stringify([...dozedOffTimes, Date.now()]));
      setDozedOffTimes([...dozedOffTimes, Date.now()])
      navigate('/doze-alert/alert')
    }
  }


  const distance = (lat1, lon1, lat2, lon2) => {
    const distance = getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    // in meters
    return distance;
  }

  const listenForAlerts = () => {
    firebase.database().ref('alerts').on('value', (snapshot) => {
      // iterate through each person in the snapshot
      console.log('something changed')
      snapshot.forEach((childSnapshot) => {
        const alert = childSnapshot.val();
        navigator.geolocation.getCurrentPosition(function (position) {
          const distanceToAlert = distance(position.coords.latitude, position.coords.longitude, alert.latitude, alert.longitude);
          if (distanceToAlert < 1000 && alert.timestamp > Date.now() - 30000) {
            console.log('another driver is dozing off!')
            setShowAlert(true);
            setOtherPlayStatus('PLAYING');
            // wait 3 seconds, then stop
            setTimeout(() => {
              setOtherPlayStatus('STOPPED');
            }, 3000);

          }
        });
      });
    });
  }


  const loadFaceApiModels = async () => {
    await faceapi.loadSsdMobilenetv1Model('/doze-alert/models');
    await faceapi.loadFaceLandmarkModel('/doze-alert/models');
    setReady(true);
  }

  useEffect(() => {

    // load dozed off times from local storage
    const storageTimes = JSON.parse(localStorage.getItem('dozedOffTimes'));
    if (storageTimes) {
      setDozedOffTimes(storageTimes);
    }

    // load face detection model
    loadFaceApiModels();

    // get current user location (this is only to make sure that the browser asks for permission)
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
    });

    listenForAlerts();

    // every 5 seconds, take a screenshot and classify it as drowsy or not
    const interval = setInterval(() => {
      detectDrowsy();
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="App" >
      {
        showAlert &&
        <OtherDriverModal
          handleClose={() => setShowAlert(false)}
        />
      }
      <Sound url={OtherAlertSound} playStatus={otherPlayStatus} />
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
      {
        !ready && <div className="loading">Loading machine learning models...</div>
      }

      <Activity times={dozedOffTimes} />

    </div>
  );
}

export default Home;