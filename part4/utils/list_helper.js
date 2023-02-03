const _ = require("lodash");
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};
// const listBlogs = [
//   {
//     _id: "5a422aa71b54a676234d17f8",
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//     __v: 0
//   },
//   {
//     title: "Canonical string reduction",
//     author: "Alex",
//     likes: 12,
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//   },
//   {
//     title: "nwe blog",
//     author: "Ivan Ivanov",
//     likes: 11
//   },
//   {
//     title: "fun blog",
//     author: "Ivan Ivanov",
//     likes: 19,
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//   },
//   {
//     title: "fun big blog",
//     author: "Alex",
//     likes: 19,
//   }
// ];
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