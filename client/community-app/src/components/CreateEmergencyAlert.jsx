// // src/components/CreateEmergencyAlert.jsx
// import React, { useState, useEffect } from 'react';
// import { gql, useMutation } from '@apollo/client';

// const CREATE_EMERGENCY_ALERT = gql`
//   mutation CreateEmergencyAlert($input: EmergencyAlertInput!) {
//     createEmergencyAlert(input: $input) {
//       id
//       type
//       description
//       location
//       reportedAt
//       reporterId
//     }
//   }
// `;

// const CreateEmergencyAlert = ({ userId, onAlertCreated }) => {
//   const [form, setForm] = useState({
//     type: '',
//     description: '',
//     location: '',
//     reporterId: '',
//   });

//   useEffect(() => {
//     if (userId) {
//       setForm((prev) => ({ ...prev, reporterId: userId }));
//     }
//   }, [userId]);

//   const [createAlert] = useMutation(CREATE_EMERGENCY_ALERT);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await createAlert({ variables: { input: form } });
//       if (data?.createEmergencyAlert) {
//         onAlertCreated();
//         setForm({ type: '', description: '', location: '', reporterId: userId });
//       }
//     } catch (err) {
//       console.error('Apollo Mutation Error:', err.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
//       <h4>🚨 Report an Emergency</h4>
//       <input name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g., Fire, Pet Lost)" required />
//       <br />
//       <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
//       <br />
//       <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
//       <br />
//       <button type="submit">Submit Alert</button>
//     </form>
//   );
// };

// export default CreateEmergencyAlert;

// src/components/CreateEmergencyAlert.jsx
import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    Snackbar,
    Alert
} from '@mui/material';

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

    const [alertMessage, setAlertMessage] = useState(''); // State to track alert creation message

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
                setAlertMessage('Alert created!'); // Show success message
                onAlertCreated();
                setForm({ type: '', description: '', location: '', reporterId: userId });
            }
        } catch (err) {
            console.error('Apollo Mutation Error:', err.message);
        }
    };

    // Close the Snackbar after a few seconds
    const handleCloseSnackbar = () => {
        setAlertMessage('');
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
                🚨 Report an Emergency
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                <Stack spacing={2}>
                    <TextField
                        label="Type (e.g., Fire, Pet Lost)"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <Button type="submit" variant="contained" color="error">
                        Submit Alert
                    </Button>
                </Stack>
            </Box>
            {/* Snackbar to show success message */}
            <Snackbar
                open={!!alertMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default CreateEmergencyAlert;
