import { useState } from 'react';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import {
  useVerifyEmailMutation,
  useVerifyEmailVerificationMutation,
} from '@/data/user';

interface EmailVerificationProps {
  website: string; // This will be passed as a prop (e.g., 'dota2.com')
  onSuccess: () => void; // Callback when verification is successful
  onFailure: (message: string) => void; // Callback when verification fails
}

const EmailVerification = ({
  website,
  onSuccess,
  onFailure,
}: EmailVerificationProps) => {
  const { t } = useTranslation();
  const { mutate: verifyEmail, isLoading } = useVerifyEmailMutation();
  const { mutate: verifyEmailToken, isLoading: verifying } =
    useVerifyEmailVerificationMutation();

  const [errorMsg, setErrorMsg] = useState<string | null | undefined>('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [token, setToken] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');

  const domain = website;

  const handleEmailSubmit = () => {
    if (!emailPrefix) {
      setErrorMsg('Email is required');
      return;
    }

    const email = `${emailPrefix}@${domain}`;
    verifyEmail(
      { email },
      {
        onSuccess: (data) => {
          if (data?.success) {
            setVerifiedEmail(email);
            setErrorMsg(null);
          } else {
            setErrorMsg(data?.message);
            onFailure(data?.message || 'Unknown error');
          }
        },
      },
    );
  };

  const handleTokenSubmit = () => {
    if (!token) {
      setErrorMsg('Token is required');
      return;
    }

    verifyEmailToken(
      { email: verifiedEmail, token },
      {
        onSuccess: (data) => {
          if (data?.success) {
            setVerifiedToken(token);
            setErrorMsg(null);
            onSuccess(); // Notify parent about success
          } else {
            setErrorMsg(data?.message);
            onFailure(data?.message || 'Unknown error');
          }
        },
      },
    );
  };

  return (
    <>
      {errorMsg && (
        <Alert
          variant="error"
          message={t(`common:${errorMsg}`)}
          className="mb-6"
          closeable={true}
          onClose={() => setErrorMsg('')}
        />
      )}

      <h2 className="text-xl font-bold mb-4 text-center sm:text-left">
        {t('common:email_verification')}
      </h2>

      {/* Show email field even after submission */}
      <div className="mb-4 flex flex-col sm:flex-row items-center sm:items-stretch max-md:gap-3">
        <input
          type="text"
          id="email"
          value={emailPrefix}
          onChange={(e) => setEmailPrefix(e.target.value)}
          placeholder="Enter email prefix"
          required
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <span className="bg-gray-200 text-gray-600 md:mr-5 px-3 py-2 rounded w-full sm:w-auto text-center">
          @{domain}
        </span>
        <button
          onClick={handleEmailSubmit}
          type="button"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* Token field appears only after email verification */}
      {verifiedEmail && !verifiedToken && (
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            placeholder="Enter token"
            className="border p-2 rounded w-full md:w-[15rem]" // Adjust the width here
          />
          <button
            onClick={handleTokenSubmit}
            type="button"
            disabled={verifying}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      )}
    </>
  );
};

export default EmailVerification;
