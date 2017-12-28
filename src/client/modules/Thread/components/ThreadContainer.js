import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getThread } from '../duck';
import { addReplyAnswerForm } from '../../../components/duck';
import Post from './Post';

class ThreadContainer extends Component {
  state = {
    replyId: null,
  };

  componentDidMount() {
    const { boardId, threadId } = this.props.match.params;
    this.props.getThread(boardId, threadId);
  }
  componentWillReceiveProps(nextProps) {
    const { boardId, threadId } = nextProps.match.params;
    if (
      boardId !== this.props.match.params.boardId &&
      threadId !== this.props.match.params.threadId
    ) {
      this.props.getThread(boardId, threadId);
    }
  }

  handleReplyClick = (replyId) => {
    if (replyId === this.state.replyId) {
      this.setState({ replyId: null });
    } else {
      console.log(replyId);
      this.props.addReplyAnswerForm(replyId);
      this.setState({ replyId });
    }
  };

  render() {
    const { thread, getThread, match } = this.props;
    const { boardId, threadId } = match.params;
    const { replyId } = this.state;
    return (
      <div className="thread" style={{ padding: '0 10px 0 10px' }}>
        {thread.posts !== undefined
          ? thread.posts.map((post, index) => {
              const textWithLinks = post.text.replace(
                /(&gt;&gt;)(\d+)/g,
                `<a href="#post$2">>>$2</a>`
              );
              return (
                <Post
                  boardId={boardId}
                  match={match}
                  post={{ ...post, text: textWithLinks }}
                  index={index}
                  key={post.id}
                  replyId={replyId}
                  handleReplyClick={this.handleReplyClick}
                />
              );
            })
          : null}

        <div
          className="thread__update-thread-link-container"
          style={{ margin: '2em 0' }}
        >
          <Link
            to="#"
            style={{ cursor: 'pointer', fontSize: '1.3em' }}
            onClick={(e) => {
              e.preventDefault();
              getThread(boardId, threadId);
            }}
          >
            Update thread
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  thread: state.thread,
});

export default connect(mapStateToProps, { getThread, addReplyAnswerForm })(
  ThreadContainer
);
