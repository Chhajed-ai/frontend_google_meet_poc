'use client';

import { useEffect, useState } from 'react';
import CreateMeeting from "../components/createMeeting";
import UserProfile from "../Components/UserProfile";
import ConferenceTable from "../Components/ConfereneTable";
import { format } from "date-fns";


interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

interface Meeting {
  title: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  attendees: string[];
}

interface ConferenceRecord {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  space?: string; // Optional, depending on your data
  expireTime?: string; // Optional, depending on your data
}


interface Transcript {
  transcriptId: string;
  startTime: string;
  endTime: string;
  languageCode?: string;
  documentId: string;
  exportUri: string;
  state: string;
}

interface TranscriptEntry {
  startTime: string;
  endTime: string;
  text: string;
  speaker: {
    email: string;
  };
}

export default function Dashboard() {
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<Meeting>({
    title: '',
    startTime: '',
    endTime: '',
    timeZone: 'America/Los_Angeles',
    attendees: [],
  });
  const [conferenceRecords, setConferenceRecords] = useState<ConferenceRecord[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState<string | null>(null);
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));

    const storedConferenceRecords = localStorage.getItem('conferenceRecords');
    if (storedConferenceRecords) setConferenceRecords(JSON.parse(storedConferenceRecords));

    const storedTranscripts = localStorage.getItem('transcripts');
    if (storedTranscripts) setTranscripts(JSON.parse(storedTranscripts));

    const storedTranscriptEntries = localStorage.getItem('transcriptEntries');
    if (storedTranscriptEntries) setTranscriptEntries(JSON.parse(storedTranscriptEntries));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    localStorage.setItem('conferenceRecords', JSON.stringify(conferenceRecords));
  }, [conferenceRecords]);

  useEffect(() => {
    localStorage.setItem('transcripts', JSON.stringify(transcripts));
  }, [transcripts]);

  useEffect(() => {
    localStorage.setItem('transcriptEntries', JSON.stringify(transcriptEntries));
  }, [transcriptEntries]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');

    if (auth === 'success') {
      setAuthStatus('Authentication successful!');
      fetchUserInfo();
    } else if (auth === 'failure') {
      setAuthStatus('Authentication failed. Please try again.');
    }
  }, []);

  // Fetch user profile information
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/user-info');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchConferenceRecords = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/conference-records');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log(data);
  
      // Process the data to extract the conference ID from the name field
      const processedRecords = data.conferenceRecords.map((record: ConferenceRecord) => {
        const conferenceId = record.name.split('/').pop(); // Extract the conference ID
        return {
          ...record,
          id: conferenceId,
        };
      });
  
      console.log(processedRecords);
  
      // Set the processed records in the state
      setConferenceRecords(processedRecords);
    } catch (error) {
      console.error('Error fetching conference records:', error);
    }
  };
  
  

  // Fetch transcripts for a specific conference
  const fetchTranscripts = async (conferenceId: string) => {
    try {
      const response = await fetch(
        
        `http://localhost:5001/api/conference-records/${conferenceId}/transcripts`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const mappedTranscripts: Transcript[] = data.transcripts.map((item: any) => ({
        transcriptId: item.name.split('/').pop(), // Extract transcriptId from name
        startTime: item.startTime,
        endTime: item.endTime,
        documentId: item.docsDestination.document,
        exportUri: item.docsDestination.exportUri,
        state: item.state,
      }));
      console.log(data)
      setTranscripts(mappedTranscripts);
    } catch (error) {
      console.error('Error fetching transcripts:', error);
    }
  };

  // Fetch transcript entries for a specific transcript
  const fetchTranscriptEntries = async (conferenceId: string, transcriptId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/conference-records/${conferenceId}/transcripts/${transcriptId}/entries`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setTranscriptEntries(data.entries);
    } catch (error) {
      console.error('Error fetching transcript entries:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMeetingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle attendee input changes
  const handleAttendeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMeetingDetails((prev) => ({
      ...prev,
      attendees: value.split(',').map((email) => email.trim()),
    }));
  };

  return (
    <main className="text-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      {authStatus && <p className="text-green-500 font-semibold">{authStatus}</p>}

      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfile userInfo={userInfo} />
        <CreateMeeting />
      </div>

      <div className="mt-8">
        <ConferenceTable 
          conferenceRecords={conferenceRecords}
          fetchTranscripts={fetchTranscripts}
          setSelectedConferenceId={setSelectedConferenceId}
        />
      </div>

      {selectedConferenceId && (
  <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-700">Transcripts</h2>
    <ul className="list-disc list-inside mt-2">
  {transcripts.map((transcript) => (
    <li key={transcript.transcriptId || transcript.documentId} className="mt-2">
      <p className="text-gray-600">Start Time: {format(new Date(transcript.startTime), "PPP p")}</p>
      <p className="text-gray-600">End Time: {format(new Date(transcript.endTime), "PPP p")}</p>
      <a
        href={transcript.exportUri}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-block"
      >
        Download Transcript
      </a>
    </li>
  ))}
</ul>
  </div>
)}


      {selectedTranscriptId && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Transcript Entries</h2>
          <ul className="list-disc list-inside mt-2">
            {transcriptEntries.map((entry, index) => (
              <li key={index} className="mt-2">
                <p className="font-medium">Speaker: {entry.speaker.email}</p>
                <p className="text-gray-600">Text: {entry.text}</p>
                <p className="text-gray-600">Time: {entry.startTime} - {entry.endTime}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );

}