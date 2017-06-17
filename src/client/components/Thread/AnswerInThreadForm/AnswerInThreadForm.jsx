import React, {Component} from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Dropzone from 'react-dropzone';

import axios from 'axios';

import {settingsActions} from '../../../actions/settingsActions';
import {threadActions} from '../../../actions/threadActions';

class AnswerInThreadForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            open: false,
            answerButtonDisabled: false,
            text: '',
            sage: false,
            files: []
        };

        this.toggleOpen = this.toggleOpen.bind(this);

        this.changeText = this.changeText.bind(this);
        this.changeSage = this.changeSage.bind(this);
        this.onDrop = this.onDrop.bind(this);

        this.answerInThread = this.answerInThread.bind(this);
    }

    toggleOpen() {
        this.setState({open: !this.state.open});
    }

    changeText(event, value) {
        this.setState({text: value});
    }

    changeSage(event, value) {
        this.setState({sage: value});
    }

    onDrop(acceptedFiles, rejectedFiles) {
        this.setState({files: acceptedFiles.slice(0, 10)});
    }

    answerInThread() {
        let _data = new FormData();
        const _this = this;
        
        if(this.state.text !== '' || this.state.files.length > 0){
            _data.append('text', this.state.text);
            _data.append('sage', this.state.sage);
            this.state.files.map((file, fileIndex) => {
                _data.append('uploads[]', file, file.name);
            });

            let _config = {
                onUploadProgress(progressEvent) {
                    console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    _this.props.changeRequestReadiness((progressEvent.loaded * 100) / progressEvent.total);
                }
            };

            this.setState({answerButtonDisabled: true}, () => {

                axios.post('/api/threads/' + this.props.threadId, _data, _config)
                .then((response) => {
                    this.props.dispatch(threadActions.threadUpdate(response.data));
                    this.props.dispatch(settingsActions.snackbarUpdate('Posted succesfully'));
                    this.setState({
                        open: false, 
                        title: '', 
                        text: '', 
                        files: [], 
                        answerButtonDisabled: false
                    });
                    this.props.changeRequestReadiness(0);
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({answerButtonDisabled: false});
                });

            });
            
        }
    }

    renderDropzoneContent() {
        let _content = <i className="material-icons">attach_file</i>;

        if(this.state.files.length > 0){
            _content = this.renderDropzoneFilesPreview();
        }

        return _content;
    }

    renderDropzoneFilesPreview() {
        return this.state.files.map((file, fileIndex) => {
            return (
                <div key={file + fileIndex} className="file-preview-container">
                    {this.renderFileByType(file)}
                </div>
            );
        });
    }

    renderFileByType(file) {
        let _fileType = file.type.split('/'),
            _fileElement = null;

        if(_fileType[0] === 'image'){
            _fileElement = (
                <img 
                    key={file.preview} 
                    className="file-preview" 
                    src={file.preview} 
                />
            );
        } else {
            _fileElement = (
                <video 
                    key={file.preview} 
                    className="file-preview"
                >
                    <source src={file.preview} />
                </video>
            );
        }

        return _fileElement;
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.toggleOpen}
            />,
            <FlatButton
                label="Answer in thread"
                primary={true}
                onTouchTap={this.answerInThread}
                disabled={this.state.answerButtonDisabled}
            />,
        ];

        return (
            <div className="answer-in-thread-form-container">
                <FlatButton className="open-answer-in-thread-form-button"
                    label="Answer in thread" 
                    onTouchTap={this.toggleOpen} 
                />

                <Dialog
                    className="answer-in-thread-form-dialog"
                    title="Answer in thread"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.toggleOpen}
                    autoScrollBodyContent={true}
                >

                    <TextField
                        className="answer-in-thread-form-dialog-textfield"
                        multiLine={true}
                        floatingLabelText="Post text"
                        value={this.state.text}
                        onChange={this.changeText}
                    />

                    <Checkbox
                        label="Sage"
                        className="answer-in-thread-form-dialog-checkbox"
                        labelPosition="left"
                        onCheck={this.changeSage}
                    />

                    <Dropzone
                        className="answer-in-thread-form-dropzone"
                        accept={'image/*, video/webm'}
                        onDrop={this.onDrop}
                    >
                        <div className="dropzone-content">
                            {this.renderDropzoneContent()}
                        </div>
                    </Dropzone>

                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return state.thread;
}

export default connect(mapStateToProps)(AnswerInThreadForm);