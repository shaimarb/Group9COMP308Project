import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Typography, Box, List, ListItem, ListItemText, Divider, TextField, Button, Rating, Grid, Paper, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import CreateDeal from '../components/CreateDeal'; // Make sure this path is correct

// Define the GraphQL query for fetching a single business by ID
const GET_BUSINESS_BY_ID = gql`
  query GetBusinessById($id: ID!) {
    getBusinessProfile(id: $id) {
      id
      name
      description
      category
      address
      deals {
        id
        title
        description
        validUntil
      }
      reviews {
        id
        comment
        rating
        sentiment
        response
      }
      author {
        id
        username
        role
      }
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($businessId: ID!, $author: ID!, $rating: Int!, $comment: String!) {
    createReview(
      businessId: $businessId
      author: $author
      rating: $rating
      comment: $comment
    ) {
      id
      rating
      comment
      sentiment
      author {
        id
        username
      }
    }
  }
`;

const ADD_RESPONSE_TO_REVIEW = gql`
  mutation AddResponseToReview($reviewId: ID!, $response: String!, $author: ID!) {
    addResponseToReview(reviewId: $reviewId, response: $response, author: $author) {
      id
      response
    }
  }
`;


const BusinessPage = ({ role, userId }) => {
    const canLeaveReview = role === 'resident' || role === 'community_organizer';
    const isBusinessOwner = role === 'business_owner';
    const { id } = useParams(); // Get the business ID from the URL
    const { loading, error, data } = useQuery(GET_BUSINESS_BY_ID, {
        variables: { id },
    });
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [createReview, { loading: submitting, error: submitError }] = useMutation(CREATE_REVIEW, {
        refetchQueries: ['GetBusinessById'], // So the new review appears after submitting
    });
    const [addResponseToReview] = useMutation(ADD_RESPONSE_TO_REVIEW, {
        refetchQueries: ['GetBusinessById'],
    });
    const [responseTexts, setResponseTexts] = useState({});

    useEffect(() => {
        if (data) {
            console.log('Business data:', data);
        }
    }, [data]);

    const handleReviewSubmit = async () => {
        try {
            await createReview({
                variables: {
                    businessId: id,    // from useParams
                    author: userId,    // passed as prop to BusinessPage
                    rating: rating,
                    comment: reviewText,
                },
            });

            setReviewText('');
            setRating(0);
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    const handleResponseChange = (reviewId, value) => {
        setResponseTexts(prev => ({ ...prev, [reviewId]: value }));
    };

    const handleResponseSubmit = async (reviewId) => {
        try {
            await addResponseToReview({
                variables: {
                    reviewId,
                    response: responseTexts[reviewId],
                    author: userId,
                },
            });
            setResponseTexts(prev => ({ ...prev, [reviewId]: '' }));
        } catch (err) {
            console.error('Error adding response:', err);
        }
    };


    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error: {error.message}</Typography>;

    const { getBusinessProfile: profile } = data;

    return (
        <Container maxWidth="md"> {/* 'md' gives a centered, medium-width layout */}
            <Box sx={{ paddingTop: 3 }}>      <Typography variant="h3" gutterBottom>{profile.name}</Typography>
                <Typography variant="h6" color="textSecondary">{profile.category}</Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>{profile.description}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    Address: {profile.address}
                </Typography>

                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>Deals</Typography>
                    <List>
  {profile.deals.map((deal) => (
    <ListItem key={deal.id} alignItems="flex-start">
      <ListItemText
        primary={deal.title}
        secondary={
          <>
            <Typography variant="body2" color="textSecondary">
              {deal.description}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Valid Until: {new Date(deal.validUntil).toLocaleDateString() || 'Invalid Date'}
            </Typography>
          </>
        }
      />
    </ListItem>
  ))}
</List>


                    {isBusinessOwner && userId === profile?.author?.id && (
                        <Box mt={2}>
                            <CreateDeal businessId={id} />
                        </Box>
                    )}

                </Box>

                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>Reviews</Typography>
                    <List>
                        {profile.reviews.map((review) => (
                            <Paper key={review.id} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                                <Typography variant="h6">Rating:</Typography>
                                <Rating value={review.rating} readOnly />
                                <Typography variant="body1" sx={{ marginTop: 1 }}>
                                    {review.comment}
                                </Typography>
                                {isBusinessOwner && userId === profile?.author?.id && review.sentiment && (
                                    <Typography variant="body2" color="textSecondary">
                                        Sentiment: {review.sentiment}
                                    </Typography>
                                )}

                                {review.response ? (
                                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                                        Business Owner Response: {review.response}
                                    </Typography>
                                ) : (
                                    isBusinessOwner && userId === profile?.author?.id
                                    && (
                                        <Box sx={{ marginTop: 2 }}>
                                            <TextField
                                                label="Write a response"
                                                fullWidth
                                                value={responseTexts[review.id] || ''}
                                                onChange={(e) => handleResponseChange(review.id, e.target.value)}
                                            />
                                            <Button
                                                variant="outlined"
                                                sx={{ marginTop: 1 }}
                                                onClick={() => handleResponseSubmit(review.id)}
                                            >
                                                Submit Response
                                            </Button>
                                        </Box>
                                    )
                                )}

                            </Paper>
                        ))}
                    </List>
                </Box>

                {/* Review Form for Residents and Community Organizers */}
                {(role === 'resident' || role === 'community_organizer') && (
                    <Box mt={4}>
                        <Typography variant="h5" gutterBottom>Leave a Review</Typography>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Write a comment"
                                        multiline
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Rating
                                        name="rating"
                                        value={rating}
                                        onChange={(e, newValue) => setRating(newValue)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        onClick={handleReviewSubmit}
                                        sx={{ width: '100%' }}
                                    >
                                        Submit Review
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                )}

                <Divider sx={{ marginTop: 4 }} />
            </Box>
        </Container>
    );
};

export default BusinessPage;
