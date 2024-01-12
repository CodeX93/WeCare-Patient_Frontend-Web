import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import {
  CssBaseline,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import LeftNavBar from "../Components/LeftNavBar"; // Your custom navbar code

function Newsfeed() {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch("http://localhost:4000/forum/getPost");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        console.log(data);

        // Assuming the response data is an array of posts
        setPosts(data); // Update the posts state with the received data
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts(); // Call the fetchPosts function when the component mounts
  }, []);

  // Handles the text input for new post
  const handlePostChange = (event) => {
    setPostText(event.target.value);
  };

  // Define the function to create a new post using Axios
  const createPost = async (postContent, authorId, authorName) => {
    try {
      // Create a new post object with the provided data
      console.log(authorId, authorName, postContent);
      const newPost = {
        PostContent: postContent,
        authorId: authorId,
        authorName: authorName,
      };

      // Send a POST request to your backend API using Axios
      const response = await axios.post(
        "http://localhost:4000/forum/createPost",
        newPost
      );

      if (!response.data || response.status !== 200) {
        throw new Error("Failed to create a new post");
      }

      // Assuming the response contains the newly created post data,
      // you can update the state with the received data
      const createdPost = response.data;
      setPosts([createdPost, ...posts]);
      console.log(posts);

      // Clear the text field
      setPostText("");
    } catch (error) {
      console.error("Error creating a new post:", error);
    }
  };

  const layoutStyle = {
    display: "flex",
    marginTop: "20px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
  };

  const PaperPost = ({ post }) => (
    <Paper
      elevation={3}
      sx={{ p: 2, mt: 2, display: "flex", flexDirection: "column" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <Avatar
          alt={post.authorName}
          src={post.avatarSrc}
          sx={{ width: 40, height: 40, marginRight: "10px" }}
        />
      </div>
      <Typography variant="h6" gutterBottom>
        {post.authorName}
      </Typography>
      <Typography variant="body1">{post.PostContent}</Typography>
      <Divider sx={{ mt: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
        {post.Date}
      </Typography>
    </Paper>
  );

  return (
    <>
      <CssBaseline />
      <Box style={layoutStyle}>
        <LeftNavBar />
        <Container style={contentStyle}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="What's on your mind?"
                  value={postText}
                  onChange={handlePostChange}
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const token = getAuth().currentUser.uid;
                    const name = getAuth().currentUser.displayName;
                    createPost(postText, token, name);
                    console.log(posts);
                  }}
                >
                  Post
                </Button>
              </Paper>
              {isLoading ? (
                <Typography>Loading posts...</Typography>
              ) : (
                posts.map((post, index) => (
                  <PaperPost key={index} post={post} />
                ))
              )}
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper sx={{ p: 2, display: { xs: "block", md: "block" } }}>
                {/* Hide user stats on small screens */}
                <Typography variant="h6">Your Posts</Typography>
                <Box>
                  <Typography variant="body1">
                    Username: {getAuth().currentUser.displayName}
                  </Typography>
                  <Typography variant="body1">
                    Total Posts: {posts.length}
                  </Typography>
                </Box>
              </Paper>
              {/* Placeholders for other components like hashtags or trending tags */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Newsfeed;
