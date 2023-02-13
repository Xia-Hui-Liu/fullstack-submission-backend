const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

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

blogsRouter.post("/", async(request, response) => {
// a valid blog can be added
  const body = request.body;
  // a blog without likes property will default to the value 0
  if (body.likes === undefined) {
    body.likes = 0;
  }
  // return 400 Bad Request if title or url is missing
  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: "title and url are required" });
  }
  const blog = new Blog(body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
  
});

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

blogsRouter.put("/:id", (request, response, next) => {
  Blog.findByIdAndUpdate(request.params.id, {$inc:{ likes: 10}}, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});


module.exports = blogsRouter;