import React from "react";
import { Paper, Typography, Box, Avatar } from "@mui/material";

function Post({ content, timestamp, avatarSrc }) {
  return (
    <Paper sx={{ p: 2, my: 2, display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: 56, height: 56, marginRight: 2 }} src={avatarSrc} />
      <Box>
        <Typography variant="subtitle2">{timestamp}</Typography>
        <Typography variant="body1">{content}</Typography>
      </Box>
    </Paper>
  );
}

export default Post;
