const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});
blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

blogsRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);
  // if blog.title and blog.url are undefined, return 400 Bad Request
  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).json({ error: "title and url are required" });
  } else if (blog.likes === undefined) {
    blog.likes = 0;
  }
  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => next(error));
});

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

blogsRouter.put("/:id", (request, response, next) => {
//   const body = request.body;

  //   const blog = {
  //     title: body.title,
  //     author: body.author,
  //     url: body.url,
  //     likes: body.likes
  //   };
  // update likes property of the blog with the given id
  Blog.findByIdAndUpdate(request.params.id, {$inc:{ likes: 10}}, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});


module.exports = blogsRouter;