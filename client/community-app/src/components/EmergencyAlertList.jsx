// src/components/EmergencyAlertList.jsx
import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_ALERTS = gql`
  query GetEmergencyAlerts {
    getEmergencyAlerts {
      id
      type
      description
      location
      reportedAt
    }
  }
`;

const EmergencyAlertList = ({ refreshFlag }) => {
  const { loading, error, data, refetch } = useQuery(GET_ALERTS);

  useEffect(() => {
    refetch();
  }, [refreshFlag]);

  if (loading) return <p>Loading alerts...</p>;
  if (error) return <p>Error loading alerts: {error.message}</p>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h4>📢 Latest Alerts</h4>
      {data?.getEmergencyAlerts?.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.getEmergencyAlerts.map((alert) => {
            let displayDate = 'Unknown';
            try {
              console.log("Raw reportedAt:", alert.reportedAt); // ✅ for debugging
              const date = new Date(Number(alert.reportedAt));
              if (!isNaN(date.getTime())) {
                displayDate = date.toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });
              }
            } catch (err) {
              console.error("Date parsing failed:", err);
            }

            return (
              <li
                key={alert.id}
                style={{
                  background: '#fff5f5',
                  padding: '10px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  border: '1px solid #f1cfcf',
                }}
              >
                <strong>{alert.type}</strong> - {alert.description}
                <br />
                📍 {alert.location} | 🕒 {displayDate}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default EmergencyAlertList;
