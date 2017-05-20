"use strict";

import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';

import PostsNumerationCollection from './PostsNumerationCollection';


////////////////////////////////////////////
///////////DB CONNECTION FUNCTIONS//////////
////////////////////////////////////////////

import mongoose from 'mongoose';
const db_url = 'mongodb://localhost/dumpach';

mongoose.connect(db_url);
mongoose.Promise = Promise;

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + db_url);
});

PostsNumerationCollection.createFirstDocument();

////////////////////////////////////////////
////////////MONGO SCHEMA CREATION///////////
////////////////////////////////////////////

let threadsSchema = mongoose.Schema({
    posts: Array,
	updateTime: Number
});


let ThreadsCollection = mongoose.model('Threads', threadsSchema);



////////////////////////////////////////////
//////////MONGO COLLECTION METHODS//////////
////////////////////////////////////////////

ThreadsCollection.getAllThreads = () => {
    console.log('getAllThreads');

    return new Promise((resolve, reject) => {
		ThreadsCollection.find({}, {posts: {$slice: 3}}).sort({updateTime: -1}).lean().exec((err, threads) => {
			if (err) {
				console.error('Get threads error', err);
				resolve(err);
			} else {
				resolve(threads);
			}
		});
	});
}

ThreadsCollection.getThreadById = (threadId) => {
    console.log('getThreadById');

    return new Promise((resolve, reject) => {
		if (threadId.match(/^[0-9a-fA-F]{24}$/)) {
			ThreadsCollection.findById(threadId).lean().exec((err, thread) => {
				if (err) {
					console.error('Get thread by id error', err);
					resolve(err);
				} else {
					resolve(thread);
				}
			});
		} else {
			resolve({error: 'Thread not found!'});
		}
	});
}

ThreadsCollection.createNewThread = (thread) => {
	console.log('createNewThread');
	console.log(thread);

	let _newThread = new ThreadsCollection({
		posts: thread.posts,
		updateTime: Date.now()
	});

	return new Promise((resolve, reject) => {

		PostsNumerationCollection.incrementPostsNumeration().then((postNumeration) => {
			_newThread.posts[0].postNumeration = postNumeration;
			_newThread.posts[0].time = Date.now();

			_newThread.save((err, thread) => {
				if (err) {
					console.error('Create new thread error', err);
					resolve(err);
				} else {
					deleteOldThread();
					resolve(thread);
				}
			})
		});

	});
}

ThreadsCollection.postInThread = (threadId, post) => {
	console.log('postInThread', threadId);
	let _postsLength, _updateParameters;

	post.time = Date.now();

	return new Promise((resolve, reject) => {
		if (threadId.match(/^[0-9a-fA-F]{24}$/)) {

			ThreadsCollection.findById(threadId).lean().exec((err, thread) => {

				_postsLength = thread.posts.length;
				_updateParameters = getThreadUpdateTimeParameters(post, _postsLength, thread);

				PostsNumerationCollection.incrementPostsNumeration().then((postNumeration) => {
					post.postNumeration = postNumeration;

					ThreadsCollection.findByIdAndUpdate(
						threadId,
						{$push: { "posts": post }, $set: _updateParameters},
						{safe: true, upsert: true, new: true},
						(err, thread) => {
							if (err) {
								console.error('Get thread by id error', err);
								resolve(err);
							} else {
								resolve(thread.posts);
							}
						}
					);

				});
			
			});

		} else {
			resolve(null);
		}
	});
}

function getThreadUpdateTimeParameters(post, postsLength, thread){
	let _parameters = {updateTime: post.time};
	
	if(post.sage === 'true' || postsLength > 500){
		_parameters.updateTime = thread.updateTime;
	}
	
	return _parameters;
}

function deleteOldThread(){
	ThreadsCollection.find({}).lean().exec((err, threads) => {
		if(threads.length > 50){
			ThreadsCollection.find().sort({updateTime: -1}).exec((err, threads) => {
				if(threads.length > 50){
					for(let threadIndex = 50; threadIndex < threads.length; threadIndex++){
						deleteOldThreadFiles(threads[threadIndex].posts);

						ThreadsCollection.remove({ _id: threads[threadIndex]._id }, function(err) {
							if (err) {
								console.log('error:', err);
							}
						});
					}
				}
			});
		}
	});
}

function deleteOldThreadFiles(posts){
	let _fileExtension;

	posts.map((post) => {
		post.files.map((file) => {
			fs.unlink(path.join(__dirname, '../../../uploads/', file), (err) => {
				_fileExtension = file.split('.')[file.split('.').length - 1];

				if(err){
					console.error(err);
				} else {
					if(_fileExtension !== 'webm' && _fileExtension !== 'WEBM'){
						fs.unlink(path.join(__dirname, '../../../uploads/', file), (err) => {
							if(err){
								console.error(err);
							} else {
								console.log('Old image deleted');
							}
						});
					} else {
						console.log('Old video deleted');
					}
				}
			});
		})
	});
}

////////////////////////////////////////////
/////////////MONGO MODEL EXPORT/////////////
////////////////////////////////////////////

module.exports = ThreadsCollection;
