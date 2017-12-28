import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon, Checkbox } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { openSnackbar, closeSnackbar } from '../modules/Snackbar/duck';
import { editAnswerForm, clearAnswerForm } from './duck';
import { answerInThread } from '../modules/Thread/duck';
import { createThread } from '../modules/Threads/duck';

import './AnswerForm.scss';

class AnswerForm extends React.PureComponent {
  handleInputChange = (event) => {
    this.props.editAnswerForm('title', event.target.value);
  };

  handleTextareaChange = (value) => {
    this.props.editAnswerForm('text', value);
  };

  handleCheckboxChange = (event, { checked }) => {
    this.props.editAnswerForm('sage', checked);
  };

  handleDrop = (acceptedFiles, rejectedFiles) => {
    this.props.editAnswerForm('files', acceptedFiles.slice(0, 6));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      match,
      isAnswer,
      openSnackbar,
      closeSnackbar,
      createThread,
      answerInThread,
      clearAnswerForm,
    } = this.props;
    const { text, files } = this.props.answerForm;

    const repliesFindRegexp = /(&gt;&gt;\d+)/g;
    const replies = text
      .match(repliesFindRegexp)
      .reduce((prev, curr) => [...prev, parseInt(curr.replace('&gt;&gt;', ''))], []);

    if ((text === '' || text === '<p><br></p>') && files.length === 0) {
      openSnackbar('Post text or files can\'t be empty');
      setTimeout(() => closeSnackbar(), 5000);
    } else {
      isAnswer === true
        ? answerInThread(
            match.params.boardId,
            match.params.threadId,
            { ...this.props.answerForm, replies },
            clearAnswerForm
          )
        : createThread(match.params.boardId, this.state);
    }
  };

  clearForm = () => {
    this.setState({
      title: '',
      text: '',
      sage: false,
      files: [],
    });
  };

  renderDropzoneContent() {
    let content = <Icon name="attach" size="huge" className="attach-icon" />;

    if (this.props.answerForm.files.length > 0) {
      content = this.renderDropzoneFilesPreview();
    }

    return content;
  }

  renderDropzoneFilesPreview() {
    return this.props.answerForm.files.map((file) => (
      <div key={file.preview} className="file-preview-container">
        <img className="file-preview" src={file.preview} alt="file-preview" />
      </div>
    ));
  }

  render() {
    const { title, text, sage } = this.props.answerForm;
    const { isAnswer } = this.props;

    return (
      <div className="answer-form">
        <div className="answer-form__content">
          <Form onSubmit={this.handleSubmit}>
            <h3 className="header">Take a dump, please</h3>
            <Input
              name="title"
              placeholder="Title"
              onChange={this.handleInputChange}
              fluid
              className="post-text-input"
              value={title}
            />

            <ReactQuill
              value={text}
              placeholder="Text"
              onChange={this.handleTextareaChange}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ script: 'sub' }, { script: 'super' }],
                  ['video'],
                ],
              }}
              formats={[
                'bold',
                'italic',
                'underline',
                'strike',
                'blockquote',
                'list',
                'bullet',
                'script',
                'video',
              ]}
            />

            <Dropzone
              className="dropzone"
              accept={'image/*'}
              onDrop={this.handleDrop}
              maxSize={6291456}
            >
              <div className="dropzone__content">{this.renderDropzoneContent()}</div>
            </Dropzone>
            {isAnswer === true ? (
              <Checkbox
                name="sage"
                checked={sage}
                onChange={this.handleCheckboxChange}
                label="Sage"
              />
            ) : null}
            <div className="submit-button-container">
              <Button type="submit" primary>
                {isAnswer === true ? 'Answer in thread' : 'Create thread'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  answerForm: state.answerForm,
});

export default connect(mapStateToProps, {
  editAnswerForm,
  clearAnswerForm,
  openSnackbar,
  closeSnackbar,
  answerInThread,
  createThread,
})(AnswerForm);
