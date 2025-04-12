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

const CREATE_BUSINESS_PROFILE = gql`
  mutation CreateBusinessProfile(
    $ownerId: ID!
    $name: String!
    $description: String
    $category: String
    $contactInfo: ContactInfoInput
  ) {
    createBusinessProfile(
      ownerId: $ownerId
      name: $name
      description: $description
      category: $category
      contactInfo: $contactInfo
    ) {
      id
      name
      description
      category
      contactInfo {
        phone
        email
        address
      }
      createdAt
    }
  }
`;

const CreateBusinessProfile = ({ ownerId }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    email: '',
    address: '',
  });

  const [createBusinessProfile, { data, loading, error }] = useMutation(CREATE_BUSINESS_PROFILE);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBusinessProfile({
        variables: {
          ownerId,
          name: form.name,
          description: form.description,
          category: form.category,
          contactInfo: {
            phone: form.phone,
            email: form.email,
            address: form.address,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Create Business Profile
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Business Name"
              name="name"
              fullWidth
              required
              value={form.name}
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
              label="Category"
              name="category"
              fullWidth
              value={form.category}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Contact Info</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              value={form.phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form.address}
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
              {loading ? 'Creating...' : 'Create Profile'}
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
            Business "{data.createBusinessProfile.name}" created successfully!
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default CreateBusinessProfile;
