import React from 'react';
import ProfileViewer from '@/components/Profile';
import Navbar from '@/components/Navbar';
const ProfilePage = () => {
  return (
    <div className='bg-black min-h-screen'>
      <div>
        <Navbar />
      </div>
      <ProfileViewer />
    </div>
  );
};

export default ProfilePage;