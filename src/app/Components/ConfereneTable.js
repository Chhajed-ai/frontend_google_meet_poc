"use client"; // Required for Next.js App Router
import { format } from "date-fns";

const ConferenceTable = ({ conferenceRecords, fetchTranscripts, setSelectedConferenceId }) => {
  if (!conferenceRecords || conferenceRecords.length === 0) {
    return <p>No conference records found.</p>;
  }

  return (
    <table border="1" style={{ marginTop: "1rem", width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Conference Name</th>
          <th>Conference ID</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {conferenceRecords.map((record) => (
          <tr key={record.id}>
            <td>{record.name}</td>
            <td>{record.id}</td>
            <td>{format(new Date(record.startTime), "PPP p")}</td>
            <td>{format(new Date(record.endTime), "PPP p")}</td>
            <td>
              <button
                onClick={() => {
                  setSelectedConferenceId(record.id);
                  fetchTranscripts(record.id);
                }}
              >
                Fetch Transcripts
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConferenceTable;
