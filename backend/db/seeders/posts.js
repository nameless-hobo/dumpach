/* eslint max-len: 0 */
const generatePosts = (threadId) => {
  let data = [];
  const posts = [
    {
      title: 'Short test title',
      text: 'Short test text',
      is_sage: false,
      thread_id: threadId,
    },
    {
      title:
        'Average test title, test title, test title, test title, test title, test title',
      text:
        'Average test text, test text, test text, test text, test text, test text',
      is_sage: false,
      thread_id: threadId,
    },
    {
      title:
        'Long test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title',
      text:
        'Long test text, test text, test text, test text, test text, test text, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title, test title',
      is_sage: false,
      thread_id: threadId,
    },
    {
      title: 'Lorem Ipsum',
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vestibulum nisl eu justo semper ultrices. Proin dignissim ex nec libero cursus mattis. Aenean metus sapien, ultricies pretium ultrices in, venenatis sit amet augue. In nec magna pulvinar, rutrum ante ut, fermentum mauris. Mauris nisi risus, finibus nec luctus at, sollicitudin a risus. Mauris vel libero at purus ultricies facilisis. Vivamus fermentum aliquet sem, eget commodo risus fringilla quis. Curabitur vitae felis nec dolor convallis vehicula. Mauris rhoncus ipsum vehicula, venenatis quam sit amet, venenatis nisl. Sed leo sem, lobortis eget eleifend ut, semper a risus. Praesent consequat tellus nunc. Sed vitae fringilla metus, in porttitor tortor. Pellentesque justo elit, hendrerit non nulla nec, gravida imperdiet ante.\n\nUt vel dolor vulputate, porta nibh ut, sagittis diam. Phasellus nec nisi feugiat, eleifend neque vel, blandit neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus gravida iaculis orci, id hendrerit nisl venenatis a. Etiam dignissim nunc ut lectus rutrum tincidunt. Nunc orci est, facilisis sit amet velit quis, sagittis faucibus tellus. Nullam fringilla non orci vitae congue. Aenean mollis, lacus vitae lacinia pulvinar, odio tellus efficitur massa, nec maximus nibh eros quis mi. Integer auctor ipsum quis quam blandit interdum vitae eget eros.\n\nPellentesque commodo eget purus sit amet ultricies. Nullam eleifend, augue sit amet ultrices maximus, enim tellus varius dui, nec molestie lorem orci malesuada urna. Praesent in sagittis leo. Suspendisse vulputate ac dui sit amet hendrerit. Proin non imperdiet ligula. Morbi rutrum metus ac ultrices commodo. Aliquam maximus vestibulum turpis, eu hendrerit tellus dapibus ut. Quisque viverra non magna at feugiat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris eros libero, maximus eget justo sed, efficitur commodo ante.',
      is_sage: false,
      thread_id: threadId,
    },
    {
      title: 'Short test title with sage',
      text: 'Short test text with sage',
      is_sage: true,
      thread_id: threadId,
    },
  ];

  for (let i = 0; i < 50; i += 1) {
    data = data.concat(posts);
  }

  return data;
};

const generate = () => {
  let data = [];

  for (let i = 1; i < 51; i += 1) {
    data = data.concat(generatePosts(i));
  }

  return data;
};

const posts = generate();

module.exports = posts;
