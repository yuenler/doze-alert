import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.css';
import AlertSound from './alert.wav';
import Sound from 'react-sound';
import Stop from './stop.png';

const Alert = () => {
  const navigate = useNavigate();
  const [playStatus, setPlayStatus] = useState('STOPPED');


  useEffect(() => {
    setPlayStatus('PLAYING');
    // wait 3 seconds, then stop
    setTimeout(() => {
      setPlayStatus('STOPPED');
    }, 1500);

    // flash the stop sign
    const interval = setInterval(() => {
      const image = document.getElementById('stop');
      image.style.visibility = image.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }
      , 500);
    return () => clearInterval(interval);


  }, []);


  return (
    <div >
      <Sound url={AlertSound} playStatus={playStatus} />
      <div>
        <FaArrowLeft
          size={30}
          onClick={() => {
            navigate('/')
          }}
        />
      </div>
      < div style={{
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        <h1>Alert</h1>
      </div >
      It looks like you dozed off! To avoid car injury, stop by a near rest stop or pull aside.
      <div style={{ marginTop: 40 }}>
        <img
          id="stop"
          src={Stop}
          alt="stop"
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '50%',
            visibility: 'visible',
          }}
        />
      </div>


    </div>
  );
};

export default Alert;