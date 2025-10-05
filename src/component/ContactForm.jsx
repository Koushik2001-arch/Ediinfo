import React, { useState } from 'react';


export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (type) => {
    const data = { ...formData, type };
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert(`${type === 'call' ? 'Call' : 'Info'} request sent successfully!`);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      alert('Error submitting request');
    }
  };

  return (
    <form className="space-y-4">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Full name" className="form-input" required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="form-input" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98xxxxxxx" className="form-input" required />
      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Which course are you interested in?" className="form-input h-20" required />
      <div className="flex space-x-2">
        <button type="button" onClick={() => handleSubmit('info')} className="flex-1 bg-blue-500 text-white p-2 rounded">Request Info</button>
        <button type="button" onClick={() => handleSubmit('call')} className="flex-1 bg-green-500 text-white p-2 rounded">Book Free Call</button>
      </div>
    </form>
  );
}