import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

import './PostPreview.scss';

const PostPreview = ({ post, index }) => (
  <Paper className="post-preview">
    <p className="post-preview__time">{post.createdAt}</p>
    {index === 0 ? (
      <Link to={`${window.location.href}/${post.id}`}>Open</Link>
    ) : null}
    <br />
    {post.text.split('\n').map(row => (
      <p className="post-preview__text" key={row}>
        {row}
      </p>
    ))}
  </Paper>
);

export default PostPreview;
