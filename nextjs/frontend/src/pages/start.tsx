import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DeployfactoryComponent from '@/components/DeployfactoryComponent'



const GetStartedPage = () => {
  return (
    <div>
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-col justify-center items-center my-auto">
                {/* Your page content goes here */}
                <h1 className="text-5xl font-bold mb-5">Get started with Museum Art</h1>
                <DeployfactoryComponent />
            </div>
            <Footer className="mt-auto"  />
        </div>
    </div>
  )
}

export default GetStartedPage