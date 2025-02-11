'use client';

export default function Home() {
  const handleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`;
  };

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Google OAuth2 Integration</h1>
      <p>Authenticate to access your Google Meet sessions and transcripts.</p>
      <button
        onClick={handleAuth}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Authenticate with Google
      </button>
    </main>
  );
}
