import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { List, ListItem, ListItemText, Divider, Typography, Box, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook for navigation
import PushPinIcon from '@mui/icons-material/PushPin'; // Import push pin icon

// Define the GraphQL query
const GET_ALL_BUSINESS_PROFILES = gql`
  query {
    getAllBusinessProfiles {
      id
      name
      description
      category
      address
      createdAt
      author {
        id
        username
        email
        role
      }
      deals {
        id
        title
      }
      reviews {
        id
        comment
        rating
      }
    }
  }
`;

const ListBusinessProfiles = () => {
  const { loading, error, data } = useQuery(GET_ALL_BUSINESS_PROFILES);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [promotedBusiness, setPromotedBusiness] = useState(null);

  useEffect(() => {
    if (data) {
      console.log('Received data:', data);
      setProfiles(data.getAllBusinessProfiles);
    }
  }, [data]);

  const handleProfileClick = (id) => {
    navigate(`/business/${id}`); // Use navigate instead of history.push
  };


  const handlePromoteBusiness = (profile) => {
    if (promotedBusiness?.id === profile.id) {
      setPromotedBusiness(null); // Unpin if already promoted
    } else {
      setPromotedBusiness(profile); // Pin the selected business
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (profiles.length === 0) {
    return <Typography>No Business Profiles available.</Typography>;
  }
  
return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Business Profiles
      </Typography>
      <List>
        {profiles.map((profile) => (
          <Box key={profile.id} mb={2}>
            <ListItem button onClick={() => handleProfileClick(profile.id)}>
              <ListItemText
                primary={profile.name}
                secondary={`Category: ${profile.category} - Address: ${profile.address}`}
              />
            </ListItem>
            {/* Add the PushPinIcon button to promote/unpromote the business */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => handlePromoteBusiness(profile)}>
                <PushPinIcon
                  sx={{
                    color: promotedBusiness?.id === profile.id ? 'orange' : 'gray',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                  }}
                />
              </IconButton>
            </Box>

            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default ListBusinessProfiles;