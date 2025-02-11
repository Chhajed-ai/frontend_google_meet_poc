"use client"; // Necessary for Next.js App Router

const UserProfile = ({ userInfo }) => {
  if (!userInfo) {
    return <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>Loading user information...</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <img
        src={userInfo.picture}
        alt="Profile Picture"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '1rem',
          border: '3px solid #007bff',
        }}
      />
      <h2 style={{ color: '#333', fontSize: '1.5rem' }}>{userInfo.name}</h2>
      <p style={{ color: '#555', fontSize: '1rem', marginBottom: '0.5rem' }}>{userInfo.email}</p>
    </div>
  );
};

export default UserProfile;
