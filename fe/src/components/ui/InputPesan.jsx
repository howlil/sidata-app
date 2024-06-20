import React, { useState } from 'react';
import v from '../../../public/vector.svg';

export default function InputPesan({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full flex border pr-4 rounded-lg">
      <input
        type="text"
        className="w-full py-1.5 text-sm text-neutral-900 outline-none pl-4 ring-0 rounded-l-lg"
        value={message}
        placeholder="Ajukan pertanyaan apapun"
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress} // Add this line
      />
      <img onClick={handleSendMessage} src={v} alt="send" className="cursor-pointer" />
    </div>
  );
}