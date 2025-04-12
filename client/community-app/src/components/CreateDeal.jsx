import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';

const CREATE_DEAL = gql`
  mutation CreateDeal(
    $businessId: ID!
    $title: String!
    $description: String
    $validUntil: String
  ) {
    createDeal(
      businessId: $businessId
      title: $title
      description: $description
      validUntil: $validUntil
    ) {
      id
      title
      description
      validUntil
      createdAt
    }
  }
`;

const CreateDeal = ({ businessId }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    validUntil: '',
  });

  const [createDeal, { data, loading, error }] = useMutation(CREATE_DEAL);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDeal({
        variables: {
          businessId,
          title: form.title,
          description: form.description,
          validUntil: form.validUntil,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Create New Deal
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              required
              value={form.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Valid Until"
              name="validUntil"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.validUntil}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      )}

      {data && (
        <Box mt={2}>
          <Alert severity="success">
            Deal "{data.createDeal.title}" created successfully!
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default CreateDeal;
