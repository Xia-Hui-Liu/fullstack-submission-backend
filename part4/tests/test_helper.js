const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Alex",
    likes: 12,
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon", author: "Ivan Ivanov", likes: 11 });
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const createTestUser = async () => {
  const user = new User({
    name: "Test User",
    username: "testuser",
    password: "testpassword"
  });

  await user.save();
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  createTestUser
};