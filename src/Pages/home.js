import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Nav from '../component/nav';
import Data from '../component/data';
import axios from 'axios';

function Home() {
  const [error, setError] = useState('');
  const [hasStartRecord, setHasStartRecord] = useState(false);
  const [hasEndRecord, setHasEndRecord] = useState(false);

  useEffect(() => {
    // Check if there is a "Start Shift" or "End Shift" record for the current user on the current day
    const checkRecords = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
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

        // Show alert if both "Start Shift" and "End Shift" records exist for the current day
        if (!querySnapshotStart.empty && !querySnapshotEnd.empty) {
          alert('Your shift for today is recorded.');
        }
      } catch (error) {
        setError(`Error checking records: ${error.message}`);
      }
    };

    checkRecords();
  }, []); // Run this effect only once when the component mounts

  const recordAttendance = async (inOut) => {
    try {
      // Get current logged-in user
      const user = auth.currentUser;

      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Get current date and time
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0];
      const timeString = currentDate.toLocaleTimeString();

      // Get user's geolocation
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Convert coordinates to address using Google Maps Geocoding API
          const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;

          const response = await axios.get(geocodingUrl);
          const location = response.data.results[0]?.formatted_address;

          // Create attendance record in Firestore
          const attendanceCollectionRef = collection(db, 'attendence');
          await addDoc(attendanceCollectionRef, {
            date: dateString,
            time: timeString,
            inOut: inOut,
            userId: user.uid,
            lat: latitude,
            lon: longitude,
            location: location || 'Unknown', // Use 'Unknown' if location is not available
          });

          // Update state to hide/show buttons
          if (inOut === 'in') {
            setHasStartRecord(true);
          } else {
            setHasEndRecord(true);
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
      <div className='container flex flex-col md:flex-row justify-center items-center gap-2 mt-10 w-full'>
        {!hasStartRecord && (
          <div className='flex flex-col text-center'>
            <button
              onClick={() => recordAttendance('in')}
              className='p-4 text-xl bg-green-500 text-white rounded-3xl hover:opacity-80 hover:font-semibold'
            >
              Start Shift
            </button>
          </div>
        )}
        {hasStartRecord && !hasEndRecord && (
          <div className='flex flex-col text-center mt-4 md:mt-0'>
            <button
              onClick={() => recordAttendance('out')}
              className='p-4 text-xl bg-red-500 text-white rounded-3xl hover:opacity-80 hover:font-semibold'
            >
              End Shift
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className='text-red-500 mt-4 text-center'>
          <p>{error}</p>
        </div>
      )}
      <Data />
    </div>
  );
}

export default Home;
