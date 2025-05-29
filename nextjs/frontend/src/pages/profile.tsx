import React from 'react';
import ProfileViewer from '@/components/Profile';
import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
const ProfilePage = () => {
    const { address } = useAccount();
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