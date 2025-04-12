// src/pages/EmergencyAlertsPage.jsx
import React, { useState } from 'react';
import CreateEmergencyAlert from '../components/CreateEmergencyAlert';
import EmergencyAlertList from '../components/EmergencyAlertList';

const EmergencyAlertsPage = ({ userId, role }) => {
  const [refresh, setRefresh] = useState(false);

  const handleNewAlert = () => {
    setRefresh(!refresh); // trigger re-fetch
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🚨 Emergency Alerts</h2>
      <CreateEmergencyAlert userId={userId} onAlertCreated={handleNewAlert} />
      <EmergencyAlertList refreshFlag={refresh} />
    </div>
  );
};

export default EmergencyAlertsPage;