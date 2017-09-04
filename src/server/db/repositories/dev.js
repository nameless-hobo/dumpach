const Promise = require('bluebird');

const getThreads = async (db) => {
  const threadsWithPosts = [];
  const threads = await db.any(
    'SELECT * FROM dev_threads ORDER BY updated_at DESC'
  );

  await Promise.map(threads, async (thread) => {
    const posts = await db.any(
      `SELECT * FROM dev_posts WHERE dev_posts.thread_id=${thread.id} ORDER BY created_at ASC`
    );

    if (posts.length > 2) {
      thread.posts = [
        posts[0],
        posts[posts.length - 2],
        posts[posts.length - 1],
      ];
    } else if (posts.length > 1) {
      thread.posts = [posts[0], posts[posts.length - 1]];
    } else {
      thread.posts = [];
      thread.posts[0] = posts[0];
    }

    thread.all_posts = posts.length;
    
    threadsWithPosts.push(thread);
  });

  return threads;
};

const getThread = async (db, threadId) => {
  const thread = await db.one('SELECT * FROM dev_threads WHERE id = $1', [
    threadId,
  ]);
  thread.posts = await db.any(
    'SELECT * FROM dev_posts WHERE thread_id = $1 ORDER BY created_at ASC',
    [threadId]
  );
  return thread;
};

const createThread = async (db, post) => {
  const thread = await db.one(
    'INSERT INTO dev_threads DEFAULT VALUES RETURNING id'
  );
  await db.query(
    'INSERT INTO dev_posts(thread_id, title, text) VALUES($1, $2, $3)',
    [thread.id, post.title, post.text]
  );
  return thread.id;
};

const answerInThread = async (db, threadId, post) => {
  const posts = await db.any(
    'SELECT * FROM dev_posts WHERE thread_id = $1 ORDER BY created_at ASC',
    [threadId]
  );

  if (post.sage === false && posts.length < 500) {
    await db.query('UPDATE dev_threads SET updated_at=DEFAULT WHERE id=$1', [
      threadId,
    ]);
  }

  await db.query(
    'INSERT INTO dev_posts(thread_id, title, text, sage) VALUES($1, $2, $3, $4)',
    [threadId, post.title, post.text, post.sage]
  );

  const thread = await getThread(db, threadId);

  return thread;
};

module.exports = {
  getThreads,
  getThread,
  createThread,
  answerInThread,
};
