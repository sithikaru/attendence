import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Nav from '../component/nav';
import axios from 'axios';
import Data from './data';

function Home() {
  const [error, setError] = useState('');
  const [hasStartRecord, setHasStartRecord] = useState(false);
  const [hasEndRecord, setHasEndRecord] = useState(false);
  const [shiftRecorded, setShiftRecorded] = useState(false);

  useEffect(() => {
    const checkRecords = async () => {
      try {
        const user = auth.currentUser;
    
        if (!user) {
          setError('User not authenticated');
          return;
        }
    
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
    
        const attendanceCollectionRef = collection(db, 'attendence');
        const qStart = query(
          attendanceCollectionRef,
          where('userId', '==', user.uid),
          where('date', '==', dateString),
          where('inOut', '==', 'in')
        );
    
        const qEnd = query(
          attendanceCollectionRef,
          where('userId', '==', user.uid),
          where('date', '==', dateString),
          where('inOut', '==', 'out')
        );
    
        const querySnapshotStart = await getDocs(qStart);
        const querySnapshotEnd = await getDocs(qEnd);
    
        setHasStartRecord(!querySnapshotStart.empty);
        setHasEndRecord(!querySnapshotEnd.empty);
    
        if (!querySnapshotStart.empty && !querySnapshotEnd.empty) {
          setShiftRecorded(true);
        }
      } catch (error) {
        setError(`Error checking records: ${error.message}`);
      }
    };
    

    checkRecords();
  }, []);

  const recordAttendance = async (inOut) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setError('User not authenticated');
        return;
      }

      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0];
      const timeString = currentDate.toLocaleTimeString();

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;

          const response = await axios.get(geocodingUrl);
          const location = response.data.results[0]?.formatted_address;

          const attendanceCollectionRef = collection(db, 'attendence');
          await addDoc(attendanceCollectionRef, {
            date: dateString,
            time: timeString,
            inOut: inOut,
            userId: user.uid,
            lat: latitude,
            lon: longitude,
          });

          if (inOut === 'in') {
            setHasStartRecord(true);
          } else {
            setHasEndRecord(true);
          }

          if (inOut === 'out') {
            setShiftRecorded(true);
          }
        },
        (error) => {
          setError(`Geolocation error: ${error.message}`);
        }
      );
    } catch (error) {
      setError(`Error recording attendance: ${error.message}`);
    }
  };

  return (
    <div>
      <Nav />
      <div className='container mx-auto mt-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
          {!hasStartRecord && !shiftRecorded && (
            <div className='text-center'>
              <button
                onClick={() => recordAttendance('in')}
                className='px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:opacity-80'
              >
                Start Shift
              </button>
            </div>
          )}
          {hasStartRecord && !hasEndRecord && !shiftRecorded && (
            <div className='text-center'>
              <button
                onClick={() => recordAttendance('out')}
                className='px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:opacity-80'
              >
                End Shift
              </button>
            </div>
          )}
        </div>
        {shiftRecorded && (
          <div className='text-green-500 text-center mt-4'>
            <p>Your shift for today is recorded.</p>
          </div>
        )}
      </div>
      {error && (
        <div className='text-red-500 mt-4 text-center'>
          <p>{error}</p>
        </div>
      )}
      <Data/>
    </div>
  );
}

export default Home;
