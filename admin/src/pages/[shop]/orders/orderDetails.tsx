import React from 'react';
import { Modal } from 'antd';

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  details: any;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ open, onClose, details }) => (
  <Modal
    visible={open}
    onCancel={onClose}
    footer={null}
    title="Details"
    className="bg-white rounded-lg shadow-lg"
    bodyStyle={{ padding: 0 }}
    centered
    width={800} // Adjust the width of the modal
  >

    <div className="p-6">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full table-auto border-collapse">
          <tbody>
            {details?.title && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Title:</td>
                <td className="p-3">{details.title}</td>
              </tr>
            )}
            {details?.ancor && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Ancor:</td>
                <td className="p-3">{details.ancor}</td>
              </tr>
            )}
            {details?.postUrl && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Post URL:</td>
                <td className="p-3">
                  <a href={details.postUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    {details.postUrl}
                  </a>
                </td>
              </tr>
            )}
            {details?.link_url && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Link URL:</td>
                <td className="p-3">
                  <a href={details.link_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    {details.link_url}
                  </a>
                </td>
              </tr>
            )}
            {details?.selectedNiche && details.selectedNiche !== 'none' && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Selected Niche:</td>
                <td className="p-3">{details.selectedNiche}</td>
              </tr>
            )}
            {details?.selectedForm && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Selected Form:</td>
                <td className="p-3">{details.selectedForm}</td>
              </tr>
            )}
            {details?.instructions && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Instructions:</td>
                <td className="p-3">{details.instructions}</td>
              </tr>
            )}
            {details?.content && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">Content:</td>
                <td className="p-3">{details.content}</td>
              </tr>
            )}
            {details?.file && (
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-100">File:</td>
                <td className="p-3">
                  <a href={details.file} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
);

export default DetailsModal;
