import React, {Component} from 'react';

import Post from '../../Thread/Post/Post';

export default class ThreadPreview extends Component {
    constructor(props) {
        super(props);
    }

    renderPosts() {
        const {posts, threadTitle} = this.props.thread;

        if(posts.length > 0){
            return posts.map((post, postIndex) => {
                return (
                    <Post 
                        key={post + postIndex}  
                        postIndex={postIndex}
                        threadTitle={threadTitle}
                        post={post}
                        threadId={this.props.thread.threadId}
                    />
                );
            });
        }
    }

    render() {
        return (
            <li className="threads-list-element">

                <ul className="thread-posts-list">
                    {this.renderPosts()}
                </ul>
                
                {this.props.lastThread === false ? <hr className="threads-separator"/> : null}
            </li>
        );
    }
}
