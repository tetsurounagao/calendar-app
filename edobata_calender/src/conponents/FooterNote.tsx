import { useState } from 'react';

export default function FooterNote() {
  const [note, setNote] = useState('Wed, Thu, Sun 11:30-19:00\nFri, Sat 11:30-22:00');
  const [phone, setPhone] = useState('080-9675-5426');

  return (
    <div className="mt-auto w-full px-4">
      <textarea
        className="w-full text-right text-sm leading-relaxed resize-none outline-none"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <input
        type="text"
        className="w-full text-right mt-2 text-lg opacity-90 outline-none"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>
  );
}
