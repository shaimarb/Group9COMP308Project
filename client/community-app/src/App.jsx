import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import CommunityPage from "./pages/CommunityPage";
import DiscussionPage from "./pages/DiscussionPage";
import CommunityChatbot from "./components/CommunityChatBot";
import CreateBusinessProfile from "./components/CreateBusinessProfile";
import CreateDeal from "./components/CreateDeal";
import EmergencyAlertsPage from "./pages/EmergencyAlertsPage"; // ✅ Import added

// Set up Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4002/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

function App({ role, userId }) {
  // const rolePassed = role || "community_organizer";
  // const userIdPassed = userId || "67d3c8fc6de12c1b9becc489";
  const rolePassed = role;
  const userIdPassed = userId;

  console.log("Community app", { userId, role }, { userIdType: typeof userId, roleType: typeof role });

  return (
    <ApolloProvider client={client}>
      <Router>
        <CommunityChatbot userId={userIdPassed} />
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={<CommunityPage role={rolePassed} userId={userIdPassed} />}
          />
          
          {/* Discussion Page */}
          <Route path="/discussion/:id" element={<DiscussionPage />} />
          
          {/* ✅ Emergency Alerts Page */}
          <Route
            path="/emergency-alerts"
            element={<EmergencyAlertsPage role={rolePassed} userId={userIdPassed} />}
          />

          {/* 404 Page Not Found */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
