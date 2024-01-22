import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Data() {
  const [attendenceList, setAttendenceList] = useState([]);

  const AttendenceCollectionRef = collection(db, "attendence");

  useEffect(() => {
    const getAttendence = async () => {
      try {
        // Get the current user's ID
        const currentUserId = auth.currentUser.uid;

        // Query documents from "attendence" collection where userId is the current user's ID
        const q = query(AttendenceCollectionRef, where("userId", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        // Extract data from querySnapshot and update state
        const attendenceData = [];
        querySnapshot.forEach((doc) => {
          attendenceData.push({ id: doc.id, ...doc.data() });
        });

        setAttendenceList(attendenceData);
      } catch (error) {
        console.error("Error fetching attendence data:", error);
      }
    };

    // Call the getAttendence function
    getAttendence();
  }, []); // Make sure to pass an empty dependency array to run the effect only once

  const openGoogleMaps = (lat, lon) => {
    // Create a link to open the location on Google Maps
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(googleMapsLink, "_blank");
  };

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-4">Attendence Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Time</th>
            </tr>
          </thead>
          <tbody>
            {attendenceList.map((attendence) => (
              <tr key={attendence.id}>
                <td
                  className="py-2 px-4 border-b cursor-pointer text-blue-500"
                  onClick={() => openGoogleMaps(attendence.lat, attendence.lon)}
                >
                  {`${attendence.lat}, ${attendence.lon}`}
                </td>
                <td className="py-2 px-4 border-b">{attendence.date}</td>
                <td className="py-2 px-4 border-b">{attendence.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Data;
