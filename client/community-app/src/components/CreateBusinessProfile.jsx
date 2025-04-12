
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { TextField, Button, Container, Grid, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';

const CREATE_BUSINESS_PROFILE = gql`
  mutation createBusinessProfile(
    $name: String!, 
    $description: String!, 
    $category: String!, 
    $address: String!, 
    $author: ID!
  ) {
    createBusinessProfile(
      name: $name,
      description: $description,
      category: $category,
      address: $address,
      author: $author
    ) {
      id
      name
      description
      category
      address
      createdAt
    }
  }
`;

const CreateBusinessProfile = ({ userId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [author, setAuthor] = useState('');  // Use a valid user ID here
  const [errorMessage, setErrorMessage] = useState('');
  const [createBusinessProfile, { loading, data, error }] = useMutation(CREATE_BUSINESS_PROFILE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!name || !description || !category || !address || !userId) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
        console.log({author: userId, name: name, description: description, category: category, address: address})
        const { data } = await createBusinessProfile({
        variables: { name:name, description:description, category:category, address:address, author: userId }
      });
      console.log('Business created:', data.createBusinessProfile);
    } catch (err) {
      setErrorMessage('Error creating business profile. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" sx={{ mb: 3 }}>Creat a Business Profile</Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Business Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit" 
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {data && !error && (
        <Alert severity="success">Business Profile created successfully!</Alert>
      )}
      {error && (
        <Alert severity="error">Error: {error.message}</Alert>
      )}
    </Container>
  );
};

export default CreateBusinessProfile;
