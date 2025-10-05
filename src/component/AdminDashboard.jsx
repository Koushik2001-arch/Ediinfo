import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit3 } from 'lucide-react';



export default function AdminDashboard() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [qna, setQna] = useState([]);
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', type: 'Full-time', experience: '0-2 yrs', desc: '', email: '' });
  const [qForm, setQForm] = useState({ q: '', a: '' });
  const [editingQIndex, setEditingQIndex] = useState(-1);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [contactsRes, jobsRes, qnaRes] = await Promise.all([
      fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/qna').then(r => r.json())
    ]);
    setContacts(contactsRes || []);
    setJobs(jobsRes || []);
    setQna(qnaRes || []);
  };

  const addJob = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(jobForm),
    });
    if (response.ok) {
      const data = await response.json();
      setJobs([data.job, ...jobs]);
      setJobForm({ title: '', company: '', location: '', type: 'Full-time', experience: '0-2 yrs', desc: '', email: '' });
      fetchData();
    }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setJobs(jobs.filter(j => j.id !== id));
  };

  const saveQ = async (e) => {
    e.preventDefault();
    const method = editingQIndex >= 0 ? 'PUT' : 'POST';
    const url = editingQIndex >= 0 ? `/api/qna/${qna[editingQIndex]._id}` : '/api/qna';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(qForm),
    });
    if (response.ok) {
      fetchData();
      setQForm({ q: '', a: '' });
      setEditingQIndex(-1);
    }
  };

  const editQ = (i) => {
    setEditingQIndex(i);
    setQForm({ q: qna[i].q, a: qna[i].a });
  };

  const deleteQ = async (i) => {
    if (!confirm('Delete this question?')) return;
    await fetch(`/api/qna/${qna[i]._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setQna(qna.filter((_, idx) => idx !== i));
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-8 p-4 bg-white rounded shadow">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </header>

      {/* Contacts */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-2xl mb-4">Contact Requests</h2>
        <ul className="space-y-2">
          {contacts.map(contact => (
            <li key={contact._id} className="p-4 border rounded">
              <strong>{contact.name}</strong> ({contact.type}) - {contact.email} - {new Date(contact.timestamp).toLocaleString()} <br />
              <span className="text-sm">{contact.message}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Jobs Management */}
      <section className="mb-8 p-4 bg-white rounded shadow">
        <h2 className="text-2xl mb-4">Manage Jobs</h2>
        <form onSubmit={addJob} className="space-y-2 mb-4">
          <input placeholder="Title" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="form-input" required />
          <input placeholder="Company" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="form-input" required />
          <input placeholder="Location" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="form-input" />
          <input placeholder="Type" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="form-input" />
          <input placeholder="Experience" value={jobForm.experience} onChange={e => setJobForm({...jobForm, experience: e.target.value})} className="form-input" />
          <textarea placeholder="Description" value={jobForm.desc} onChange={e => setJobForm({...jobForm, desc: e.target.value})} className="form-input h-20" />
          <input placeholder="Email" value={jobForm.email} onChange={e => setJobForm({...jobForm, email: e.target.value})} className="form-input" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Job</button>
        </form>
        <ul className="space-y-2">
          {jobs.map(job => (
            <li key={job.id} className="flex justify-between items-center p-2 border rounded">
              <span>{job.title} - {job.company}</span>
              <button onClick={() => deleteJob(job._id)} className="text-red-500"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      </section>

      {/* Q&A Management */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-2xl mb-4">Manage Q&A</h2>
        <form onSubmit={saveQ} className="space-y-2 mb-4">
          <input placeholder="Question" value={qForm.q} onChange={e => setQForm({...qForm, q: e.target.value})} className="form-input" required />
          <textarea placeholder="Answer" value={qForm.a} onChange={e => setQForm({...qForm, a: e.target.value})} className="form-input h-20" required />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editingQIndex >= 0 ? 'Update' : 'Add Q&A'}</button>
          {editingQIndex >= 0 && <button type="button" onClick={() => {setEditingQIndex(-1); setQForm({q:'',a:''});}} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>}
        </form>
        <ul className="space-y-2">
          {qna.map((qa, i) => (
            <li key={qa.id} className="flex justify-between items-center p-2 border rounded">
              <span>Q: {qa.q}</span>
              <div>
                <button onClick={() => editQ(i)} className="text-blue-500 mr-2"><Edit3 size={16} /></button>
                <button onClick={() => deleteQ(i)} className="text-red-500"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}