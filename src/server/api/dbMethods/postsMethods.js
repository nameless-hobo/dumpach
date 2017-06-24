const Promise = require('bluebird');
const assert = require('assert');

const countersMethods = require('./countersMethods');

const getPostsByThreadId = (db, threadId) => {
    return new Promise((resolve, reject) => {
        db
        .collection('posts')
        .find({threadId: threadId})
        .toArray((err, posts) => {
            assert.equal(null, err);
            
            resolve(posts);
        });
    });
}

const createPost = (db, post, threadId) => {
    post.time = Date.now();
    
    return new Promise((resolve, reject) => {
        countersMethods
        .incrementNumeration(db, 'posts')
        .then((id) => {
            post._id = id;
            post.threadId = threadId;

            db
            .collection('posts')
            .insert(post, (err, result) => {
                assert.equal(null, err);

                if(post.replyId !== undefined){
                    db
                    .collection('posts')
                    .findOneAndUpdate(
                        { _id: parseInt(post.replyId) },
                        { $push: { repliesId: id } },
                        {
                            returnOriginal: false
                        }
                    , (err, result) => {
                        assert.equal(null, err);
                        
                        resolve(post)   
                    });
                } else {
                    resolve(post);
                }

            });
        });
    });
}

const replyPost = (db, post) => {
    return new Promise((resolve, reject) => {
        db
        .collection('posts')
        .findOneAndUpdate(
            { _id: parseInt(post.replyId) },
            { $push: { repliesId: id } },
            {
                returnOriginal: false
            }
        , (err, result) => {
            assert.equal(null, err);
            
            resolve(post)   
        });
    });
}

module.exports = {
    getPostsByThreadId: getPostsByThreadId,
    createPost: createPost,
};