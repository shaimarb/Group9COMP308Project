// // src/components/EmergencyAlertList.jsx
// import React, { useEffect } from 'react';
// import { gql, useQuery } from '@apollo/client';

// const GET_ALERTS = gql`
//   query GetEmergencyAlerts {
//     getEmergencyAlerts {
//       id
//       type
//       description
//       location
//       reportedAt
//     }
//   }
// `;

// const EmergencyAlertList = ({ refreshFlag }) => {
//   const { loading, error, data, refetch } = useQuery(GET_ALERTS);

//   useEffect(() => {
//     refetch();
//   }, [refreshFlag]);

//   if (loading) return <p>Loading alerts...</p>;
//   if (error) return <p>Error loading alerts: {error.message}</p>;

//   return (
//     <div style={{ marginTop: '30px' }}>
//       <h4>📢 Latest Alerts</h4>
//       {data?.getEmergencyAlerts?.length === 0 ? (
//         <p>No alerts found.</p>
//       ) : (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {data.getEmergencyAlerts.map((alert) => {
//             let displayDate = 'Unknown';
//             try {
//               console.log("Raw reportedAt:", alert.reportedAt); // ✅ for debugging
//               const date = new Date(Number(alert.reportedAt));
//               if (!isNaN(date.getTime())) {
//                 displayDate = date.toLocaleString('en-US', {
//                   dateStyle: 'medium',
//                   timeStyle: 'short',
//                 });
//               }
//             } catch (err) {
//               console.error("Date parsing failed:", err);
//             }

//             return (
//               <li
//                 key={alert.id}
//                 style={{
//                   background: '#fff5f5',
//                   padding: '10px',
//                   marginBottom: '15px',
//                   borderRadius: '8px',
//                   border: '1px solid #f1cfcf',
//                 }}
//               >
//                 <strong>{alert.type}</strong> - {alert.description}
//                 <br />
//                 📍 {alert.location} | 🕒 {displayDate}
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default EmergencyAlertList;

// src/components/EmergencyAlertList.jsx
import React, { useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Divider,
    IconButton,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const GET_ALERTS = gql`
  query GetEmergencyAlerts {
    getEmergencyAlerts {
      id
      type
      description
      location
      reportedAt
      reporterId
    }
  }
`;

const DELETE_EMERGENCY_ALERT = gql`
  mutation DeleteEmergencyAlert($id: ID!) {
    deleteEmergencyAlert(id: $id) {
      id
    }
  }
`;

const EmergencyAlertList = ({ refreshFlag, userId }) => {
    const { loading, error, data, refetch } = useQuery(GET_ALERTS);
    // const [deleteAlert] = useMutation(DELETE_EMERGENCY_ALERT, {
    //     onCompleted: (data) => {
    //         if (data.deleteEmergencyAlert) {
    //             // Success: The alert was deleted
    //             console.log('Alert deleted successfully');
    //             refetch(); // Refresh the alerts list
    //         } else {
    //             // Failure: The deletion failed
    //             console.error('Failed to delete alert');
    //         }
    //     },
    //     onError: (err) => console.error('Delete error:', err.message),
    // });

    useEffect(() => {
        refetch();
    }, [refreshFlag]);

    // const handleDelete = (alertId) => {
    //     deleteAlert({ variables: { id: alertId } });
    // };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error loading alerts: {error.message}</Typography>;

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                📢 Latest Alerts
            </Typography>
            {data?.getEmergencyAlerts?.length === 0 ? (
                <Typography>No alerts found.</Typography>
            ) : (
                <List>
                    {data.getEmergencyAlerts.map((alert) => {
                        let displayDate = 'Unknown';
                        try {
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

                        // const canDelete = userId && alert.reporterId === userId;
                        // console.log("canDelete:", canDelete); // Log the canDelete value

                        return (
                            <Paper
                                key={alert.id}
                                sx={{
                                    marginBottom: 2,
                                    padding: 2,
                                    border: '1px solid #f1cfcf',
                                    background: '#fff5f5',
                                }}
                            >
                                {/* <ListItem
                                    secondaryAction={
                                        canDelete && (
                                            <IconButton edge="end" onClick={() => handleDelete(alert.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        )
                                    }
                                > */}
                                    <ListItemText
                                        primary={`${alert.type} - ${alert.description}`}
                                        secondary={`📍 ${alert.location} | 🕒 ${displayDate}`}
                                    />
                            </Paper>
                        );
                    })}
                </List>
            )}
            <Divider sx={{ mt: 3 }} />
        </Box>
    );
};

export default EmergencyAlertList;
