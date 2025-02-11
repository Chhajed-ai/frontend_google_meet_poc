"use client"; // Required for Next.js 13+ with App Router

import { useState } from "react";

const CreateMeeting = () => {
  const [showForm, setShowForm] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    title: "",
    startTime: "",
    endTime: "",
    timeZone: "America/Los_Angeles",
    attendees: [],
  });
  const [meetLink, setMeetLink] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttendeesChange = (e) => {
    setMeetingDetails((prev) => ({
      ...prev,
      attendees: e.target.value.split(",").map((email) => email.trim()),
    }));
  };

  const createMeeting = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/create-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingDetails),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setMeetLink(data.meetLink);
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "12px 18px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          transition: "0.3s",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {showForm ? "Hide Create Meeting Form" : "Show Create Meeting Form"}
      </button>

      {showForm && (
        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "10px",
            marginTop: "1.5rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "450px",
            margin: "auto",
            textAlign: "left",
          }}
        >
          <h2 style={{ color: "#333", textAlign: "center" }}>Create a Google Meet Meeting</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMeeting();
            }}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <label style={{ fontWeight: "bold" }}>Title:</label>
            <input type="text" name="title" value={meetingDetails.title} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />

            <label style={{ fontWeight: "bold" }}>Start Time:</label>
            <input type="datetime-local" name="startTime" value={meetingDetails.startTime} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />

            <label style={{ fontWeight: "bold" }}>End Time:</label>
            <input type="datetime-local" name="endTime" value={meetingDetails.endTime} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />

            <label style={{ fontWeight: "bold" }}>Time Zone:</label>
            <select name="timeZone" value={meetingDetails.timeZone} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="UTC">UTC</option>
            </select>

            <label style={{ fontWeight: "bold" }}>Attendees (comma-separated emails):</label>
            <input type="text" name="attendees" value={meetingDetails.attendees.join(", ")} onChange={handleAttendeesChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} />

            <button type="submit" style={{ padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", transition: "0.3s", fontSize: "1rem" }}>Create Meeting</button>
          </form>

          {meetLink && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <h3>Google Meet Link:</h3>
              <a href={meetLink} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", fontSize: "1.1rem" }}>{meetLink}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;