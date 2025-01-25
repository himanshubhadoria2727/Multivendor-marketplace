import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import { HttpClient } from '@/data/client/http-client';
import { SendMessageGhostIcon } from '@/components/icons/send-message';

const ContactAdminForm: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await HttpClient.post('/contact-us', formData);
      // Reset form
      setFormData({ name: '', email: '', subject: '', description: '' });
      toast.success('Message sent successfully!'); // Show success toast
      onClose(); // Close form
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitError('Failed to send message. Please try again.');
      toast.error('Failed to send message.'); // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div 
        className={`fixed right-4 top-1/4 w-80 bg-white rounded-xl shadow-lg border border-blue-100 z-50 transition-all duration-300 ease-in-out 
          ${isOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'}`}
      >
        <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
          <h2 className="text-md font-semibold">Contact Admin</h2>
          <button 
            onClick={onClose} 
            className="hover:bg-blue-500 p-1 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-2 text-sm border border-blue-100 rounded-lg focus:ring-1 focus:ring-blue-300 focus:outline-none transition-all"
            required
            disabled={isSubmitting}
          />
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-2 text-sm border border-blue-100 rounded-lg focus:ring-1 focus:ring-blue-300 focus:outline-none transition-all"
            required
            disabled={isSubmitting}
          />
          <input 
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full p-2 text-sm border border-blue-100 rounded-lg focus:ring-1 focus:ring-blue-300 focus:outline-none transition-all"
            required
            disabled={isSubmitting}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your issue"
            className="w-full h-24 p-2 text-sm border border-blue-100 rounded-lg focus:ring-1 focus:ring-blue-300 focus:outline-none transition-all resize-none"
            required
            disabled={isSubmitting}
          />
          {submitError && (
            <div className="text-red-500 text-sm">{submitError}</div>
          )}
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-2 text-sm rounded-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}<SendMessageGhostIcon/>
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactAdminForm;
