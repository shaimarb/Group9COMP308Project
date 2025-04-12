// src/components/CreateEmergencyAlert.jsx
import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_EMERGENCY_ALERT = gql`
  mutation CreateEmergencyAlert($input: EmergencyAlertInput!) {
    createEmergencyAlert(input: $input) {
      id
      type
      description
      location
      reportedAt
      reporterId
    }
  }
`;

const CreateEmergencyAlert = ({ userId, onAlertCreated }) => {
  const [form, setForm] = useState({
    type: '',
    description: '',
    location: '',
    reporterId: '',
  });

  useEffect(() => {
    if (userId) {
      setForm((prev) => ({ ...prev, reporterId: userId }));
    }
  }, [userId]);

  const [createAlert] = useMutation(CREATE_EMERGENCY_ALERT);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createAlert({ variables: { input: form } });
      if (data?.createEmergencyAlert) {
        onAlertCreated();
        setForm({ type: '', description: '', location: '', reporterId: userId });
      }
    } catch (err) {
      console.error('Apollo Mutation Error:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h4>🚨 Report an Emergency</h4>
      <input name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g., Fire, Pet Lost)" required />
      <br />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <br />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <br />
      <button type="submit">Submit Alert</button>
    </form>
  );
};

export default CreateEmergencyAlert;
