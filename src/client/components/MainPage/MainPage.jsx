import React, {Component} from 'react';
import {connect} from 'react-redux';
import Promise from 'bluebird';
import axios from 'axios';
import Masonry from 'react-masonry-component';

import FlatButton from 'material-ui/FlatButton';

import {threadsActions} from '../../actions/threadsActions';

import CreateThreadForm from './CreateThreadForm/CreateThreadForm';
import ThreadPreview from './ThreadPreview/ThreadPreview';
import Menu from '../Menu/Menu';

class MainPage extends Component {
    constructor(props) {
        super(props);

        this.updateThreads = this.updateThreads.bind(this);
    }

    componentDidMount() {
        this.getInitialThreads();
    }
    
    getInitialThreads() {
        this.getThreads()
            .then((threads) => {
                this.props.dispatch(threadsActions.threadsInit(threads));
            });
    }

    getThreads() {
        return new Promise((resolve, reject) => {
            axios.get('/api/threads')
                .then((response) =>{
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }

    updateThreads(){
        this.getThreads()
            .then((threads) => {
                this.props.dispatch(threadsActions.threadsUpdate(threads));
            });
    }

    renderThreadsPreview() {
        let _lastThread = false;

        return this.props.threads.map((thread, threadIndex) => {
            if(threadIndex === this.props.threads.length - 1){
                _lastThread = true;
            }
            return <ThreadPreview key={thread + threadIndex} thread={thread} lastThread={_lastThread} />;
        });
    }

    render() {
        return (
            <div className="main-page-container">

                <div className="main-page-controls">
                    <CreateThreadForm />

                    <FlatButton className="update-threads-button"
                        label="Update threads" 
                        onTouchTap={this.updateThreads} 
                    />         

                    <Menu />       
                </div>

                <ul className="threads-list">
                    {this.renderThreadsPreview()}
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return state.threads;
}

export default connect(mapStateToProps)(MainPage);
