import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Data() {
  const [attendenceList, setAttendenceList] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // Default sort by date
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending

  const AttendenceCollectionRef = collection(db, "attendence");

  useEffect(() => {
    const getAttendence = async () => {
      try {
        const currentUser = auth.currentUser;
    
        if (!currentUser) {
          console.error("User not authenticated");
          return;
        }
    
        const currentUserId = currentUser.uid;
    
        console.log("Current User ID:", currentUserId);
    
        const q = query(
          AttendenceCollectionRef,
          where("userId", "==", currentUserId),
          orderBy(sortBy, sortOrder)
        );
    
        const querySnapshot = await getDocs(q);
    
        const attendenceData = [];
        querySnapshot.forEach((doc) => {
          attendenceData.push({ id: doc.id, ...doc.data() });
        });
    
        setAttendenceList(attendenceData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    

    getAttendence();
  }, [sortBy, sortOrder]); // Update the effect when sortBy or sortOrder changes

  const openGoogleMaps = (lat, lon) => {
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(googleMapsLink, "_blank");
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Data", 20, 10);

    const tableData = attendenceList.map((attendence) => [
      `${attendence.lat}, ${attendence.lon}`,
      attendence.date,
      attendence.time,
    ]);

    doc.autoTable({
      head: [["Location", "Date", "Time"]],
      body: tableData,
    });

    doc.save("attendance.pdf");
  };

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-4">Attendance Data</h2>
      <div className="flex mb-4">
        <button className="mr-2" onClick={() => handleSort("date")}>
          Sort by Date
        </button>
        <button onClick={() => handleSort("time")}>Sort by Time</button>
        <button className="ml-4" onClick={handlePrintPDF}>
          Print as PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("lat")}>
                Location
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("date")}>
                Date
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("time")}>
                Time
              </th>
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
