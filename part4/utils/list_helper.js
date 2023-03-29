const _ = require("lodash");
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    if (favorite.likes > blog.likes) {
      return favorite;
    }
    return blog;
  };
  return blogs.reduce(reducer);
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, "author");
  const topAuthor = _.maxBy(_.keys(authors), (o) => authors[o]);
  return {
    author: topAuthor,
    blogs: authors[topAuthor]
  };
};

const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, "author");
  const likes = _.mapValues(authors, (o) => totalLikes(o));
  const topAuthor = _.maxBy(_.keys(likes), (o) => likes[o]);
  return {
    author: topAuthor,
    likes: likes[topAuthor],
  };
};
 

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};