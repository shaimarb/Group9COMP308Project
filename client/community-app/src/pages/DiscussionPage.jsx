import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Container, Paper, Typography, Box, CircularProgress,Button,IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GET_DISCUSSION = gql`
  query GetDiscussionById($postId: ID!) {
    getDiscussionById(postId: $postId) {
      id
      content
      title
      createdAt
      category
      author {
        username
        email
        id
        role
      }
      aiSummary
    }
  }
`;

const DiscussionPage = () => {
    const navigate = useNavigate()
    const { id: postId } = useParams();
    
    const { error, data, loading } = useQuery(GET_DISCUSSION, {
        variables: { postId },
        onCompleted: (data) => {
            console.log(data);
        },
    });

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" mt={5}>
                Error loading discussion. Id not found.
            </Typography>
        );
    }

    const discussion = data?.getDiscussionById;
    const handleBack= ()=>{
        navigate("/")
    }
    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <IconButton onClick={handleBack} sx={{mb:3}}>
                <ArrowBackIcon/>
            </IconButton>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {discussion?.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                    By {discussion?.author?.username} | {new Date(parseInt(discussion?.createdAt)).toLocaleString()}
                </Typography>

                <Box sx={{ backgroundColor: "#f4f6f8", p: 2, borderRadius: 2, mb: 2 }}>
                    <Typography variant="body1">{discussion?.content}</Typography>
                </Box>

                {discussion?.aiSummary && (
                    <Box sx={{ mt: 3, p: 2, borderLeft: "5px solid #1976d2", bgcolor: "#e3f2fd", borderRadius: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            AI Summary:
                        </Typography>
                        <Typography variant="body2">{discussion.aiSummary}</Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default DiscussionPage;

/*
import { useParams, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Container, Card, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft } from 'react-bootstrap-icons';

const GET_DISCUSSION = gql`
  query GetDiscussionById($postId: ID!) {
    getDiscussionById(postId: $postId) {
      id
      content
      title
      createdAt
      category
      author {
        username
        email
        id
        role
      }
      aiSummary
    }
  }
`;

const DiscussionPage = () => {
  const navigate = useNavigate();
  const { id: postId } = useParams();

  const { error, data, loading } = useQuery(GET_DISCUSSION, {
    variables: { postId },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center mt-5">
        Error loading discussion. Id not found.
      </Alert>
    );
  }

  const discussion = data?.getDiscussionById;

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Container className="container mt-5">
      <Card className="section-content p-4 shadow-sm">
        <Button
          variant="link"
          onClick={handleBack}
          className="mb-3 text-decoration-none navbar-link">
          <ArrowLeft size={20} /> Back
        </Button>
        <h2 className="fw-bold">{discussion?.title}</h2>
        <small className="text-muted mb-3 d-block">
          By {discussion?.author?.username} | {new Date(parseInt(discussion?.createdAt)).toLocaleString()}
        </small>

        <div className="bg-light p-3 rounded mb-3">
          <p>{discussion?.content}</p>
        </div>

        {discussion?.aiSummary && (
          <div className="p-3 border-start border-primary bg-light rounded">
            <h5 className="fw-bold">AI Summary:</h5>
            <p className="mb-0">{discussion.aiSummary}</p>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default DiscussionPage;*/
