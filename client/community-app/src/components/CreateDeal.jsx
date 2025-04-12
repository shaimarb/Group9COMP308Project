import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { TextField, Button, Box, Typography } from '@mui/material';
import { format } from 'date-fns';

const CREATE_DEAL = gql`
  mutation CreateDeal($businessId: ID!, $title: String!, $description: String!, $validUntil: String!) {
    createDeal(businessId: $businessId, title: $title, description: $description, validUntil: $validUntil) {
      id
      title
      validUntil
    }
  }
`;

const CreateDeal = ({ businessId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const [createDeal, { loading, error }] = useMutation(CREATE_DEAL, {
    refetchQueries: ['GetBusinessById'], // Refresh business data after deal is added
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a Date object from the validUntil string
    const validUntilDate = new Date(validUntil);

    // Log the date for debugging purposes
    console.log("Valid Until Date:", validUntilDate);

    // Check if the date is valid
    if (isNaN(validUntilDate)) {
      console.error('Invalid date format');
      return; // Stop submission if the date is invalid
    }

    // Convert the validUntil date to an ISO string
    const validUntilISO = validUntilDate.toISOString();
    console.log("Valid Until ISO:", validUntilISO);

    try {
      // Call the mutation to create the deal
      await createDeal({
        variables: {
          businessId,
          title,
          description,
          validUntil: validUntilISO,  // Pass the ISO string to backend
        },
      });

      // Clear form after submission
      setTitle('');
      setDescription('');
      setValidUntil('');
    } catch (err) {
      console.error('Error creating deal:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Create a New Deal</Typography>

      <TextField
        label="Title"
        fullWidth
        required
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Description"
        fullWidth
        required
        multiline
        rows={3}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        label="Valid Until (YYYY-MM-DD)"
        fullWidth
        required
        type="date"
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={validUntil}
        onChange={(e) => setValidUntil(e.target.value)}
      />

      <Button variant="contained" color="primary" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Deal'}
      </Button>

      {error && (
        <Typography color="error" mt={1}>
          Error: {error.message}
        </Typography>
      )}
    </Box>
  );
};

export default CreateDeal;
