import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../ui/button';

function WebsiteVerification({ websiteUrl, searchString, onVerificationComplete }) {
  const handleVerification = async (event:any) => {
    event.stopPropagation(); // Prevent event from bubbling up

    try {
      const response = await fetch(`/api/fetch-html?url=${encodeURIComponent(websiteUrl)}&searchString=${encodeURIComponent(searchString)}`);
      const data = await response.json();

      if (data.found) {
        toast.success(data.message);
        onVerificationComplete(true);
      } else {
        toast.info(data.message);
        onVerificationComplete(false);
      }
    } catch (error) {
      console.error('Error fetching URL:', error.message);
      toast.error('An error occurred while fetching the URL.');
      onVerificationComplete(false, 'An error occurred while fetching the URL.');
    }
  };

  return (
    <div>
      <Button type="button" onClick={handleVerification}>Verify Website</Button>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default WebsiteVerification;