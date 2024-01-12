import React from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Avatar, makeStyles, Box } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "flex-start",
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2),
  },
}));

function Post({ content, timestamp, avatarSrc }) {
  const classes = useStyles();

  // Convert timestamp to a human-readable date
  const date = new Date(timestamp * 1000).toLocaleDateString();

  return (
    <Paper className={classes.paper} elevation={3}>
      <Avatar className={classes.avatar} alt="User Avatar" src={avatarSrc} />
      <Box>
        <Typography variant="body1">{content}</Typography>
        <Typography variant="caption" color="textSecondary">
          {date}
        </Typography>
      </Box>
    </Paper>
  );
}

Post.propTypes = {
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  avatarSrc: PropTypes.string.isRequired,
};

export default Post;
