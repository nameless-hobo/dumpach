const fs = require('fs');
const asyncBusboy = require('async-busboy');
const thumbsMaker = require('./thumbsMaker');
const config = require('../../config/config');

const parseFormData = async (req) => {
  const { boardId } = req.params;
  const { fields, files } = await asyncBusboy(req);
  const post = fields;

  console.log(post);

  console.log(post.replies !== '');

  post.replies =
    post.replies !== ''
      ? post.replies.split(',').map((reply) => parseInt(reply))
      : [];
  console.log(post);

  post.files = await files.map((file) => {
    const newFullFileName = `${config.app.uploadDir}/${boardId}/${
      file.path.split('/')[2]
    }`;
    file.pipe(fs.createWriteStream(newFullFileName)).on('finish', () => {
      thumbsMaker.makeImageThumb(
        `${config.app.uploadDir}/${boardId}`,
        file.path.split('/')[2]
      );
    });
    return file.path.split('/')[2];
  });
  return post;
};

module.exports = {
  parseFormData,
};
