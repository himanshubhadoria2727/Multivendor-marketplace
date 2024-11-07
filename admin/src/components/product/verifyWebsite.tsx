import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../ui/button';

interface WebsiteVerificationProps {
  websiteUrl: any;
  metaName: any;
  metaContent: any;
  onVerificationComplete: (found: boolean, message: string) => void;
}

const WebsiteVerification: React.FC<WebsiteVerificationProps> = ({ websiteUrl, metaName, metaContent, onVerificationComplete }) => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleVerification = async (event: any) => {
    event.stopPropagation();
    setLoading(true); // Start loading

    try {
      const formattedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      const response = await fetch(`/api/fetch-html?url=${encodeURIComponent(formattedUrl)}&metaName=${encodeURIComponent(metaName)}&metaContent=${encodeURIComponent(metaContent)}`);
      const data = await response.json();

      if (data.found) {
        toast.success(data.message);
        setResult(data.message);
        onVerificationComplete(true, data.message);
      } else {
        toast.info(data.message);
        setResult(data.message);
        onVerificationComplete(false, data.message);
      }
    } catch (error) {
      const errorMessage = 'Website or meta tag not found';
      toast.error(errorMessage);
      setResult(errorMessage);
      onVerificationComplete(false, errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <Button type="button" onClick={handleVerification} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify Website'}
      </Button>
      <ToastContainer />
    </div>
  );
};

export default WebsiteVerification;
