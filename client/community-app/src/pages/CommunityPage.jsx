
import React, { useState } from 'react';
import { Navbar, Nav, Button, Container, Row, Col } from 'react-bootstrap';
import CreateCommunityPost from '../components/CreateCommunityPost.jsx';
import CreateHelpRequest from '../components/CreateHelpRequest.jsx';
import HelpRequestList from '../components/HelpRequestList.jsx';
import ListCommunityPosts from '../components/ListCommunityPosts.jsx';
import NewsFeed from '../components/NewsFeed.jsx';
import { useMutation, gql } from '@apollo/client';
import './CommunityPage.css';
import CreateBusinessProfile from '../components/CreateBusinessProfile.jsx';
import CreateDeal from '../components/CreateDeal.jsx';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const CommunityPage = ({ role, userId }) => {
  console.log("Community page: ", { role, userId });

  if (!role || !userId) {
    return <h1>Role or user Id not found, check login</h1>
  }

  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      window.location.reload();
    },
  });

  const handleLogout = () => {
    logout();
  };

  // Sections available per role
  const sectionsByRole = {
    resident: [
      { name: 'Create Post', component: <CreateCommunityPost userId={userId} /> },
      { name: 'Create Help Request', component: <CreateHelpRequest userId={userId} /> },
      { name: 'Help Requests', component: <HelpRequestList userId={userId} role={role} /> },
      { name: 'Community Posts', component: <ListCommunityPosts userId={userId} /> },
    ],
    business_owner: [
      { name: 'Create Post', component: <CreateCommunityPost userId={userId} /> },
      { name: 'News Feed', component: <NewsFeed userId={userId} /> },
      { name: 'Help Requests', component: <HelpRequestList userId={userId} role={role} /> },
      { name: 'Community Posts', component: <ListCommunityPosts userId={userId} /> },
      {name: 'Create a Business Profile', component: <CreateBusinessProfile userId={userId}/>},
      {name: 'Create Deal', component: <CreateDeal userId={userId} /> }

    ],
    community_organizer: [
      { name: 'Create Post', component: <CreateCommunityPost userId={userId} /> },
      { name: 'Create Help Request', component: <CreateHelpRequest userId={userId} /> },
      { name: 'Help Requests', component: <HelpRequestList userId={userId} role={role} /> },
      { name: 'News Feed', component: <NewsFeed userId={userId} /> },
      { name: 'Community Posts', component: <ListCommunityPosts userId={userId} /> },
    ],
  };

  const sections = sectionsByRole[role] || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar bg="light" expand="lg" className="mb-3">
        <Navbar.Brand className="me-5">Welcome to the Community Panel!</Navbar.Brand>
        <div class="green-dot">.</div>
        <Nav className="mr-auto">
          {sections.map((section, index) => (
            <Nav.Link
              key={index}
              active={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            >
              {section.name}
            </Nav.Link>
          ))}
          <Nav.Link
            onClick={handleLogout}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </Nav.Link>
        </Nav>
      </Navbar>

      {/* Content */}
      <Container>
        <Row>
          <Col>
            <h4>Community Page</h4>
            {sections[selectedIndex]?.component}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CommunityPage;
