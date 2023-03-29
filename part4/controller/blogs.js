const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {url:1, username: 1, name: 1 });
    response.json(blogs);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body;
    const user = request.user;

    if (!user) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    if (!body.title || !body.url) {
      return response.status(400).json({ error: "title and url are required" });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (!user || !blog) {
      return response.status(404).end();
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: "unauthorized" });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes: request.body.likes }, { new: true });
    response.json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});


module.exports = blogsRouter;
