// const blogsRouter = require("express").Router();
// const Blog = require("../models/blog");
// const User = require("../models/user");
// const dotenv = require("dotenv");
// dotenv.config();

// const jwt = require("jsonwebtoken");


// blogsRouter.get("/", async (request, response) => {
//   const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
//   response.json(blogs);
// });
// blogsRouter.get("/:id", (request, response, next) => {
//   Blog.findById(request.params.id)
//     .then(blog => {
//       if (blog) {
//         response.json(blog);
//       } else {
//         response.status(404).end();
//       }
//     })
//     .catch(error => next(error));
// });

// blogsRouter.post("/", async(request, response) => {
//   if (!request.token) {
//     return response.status(401).json({ error: "token missing" });
//   }
//   const body = request.body;

//   // const decodedToken = jwt.verify(request.token, process.env.SECRET);
 
//   // if (!decodedToken.id) {
//   //   return response.status(401).json({ error: "token invalid" });
//   // }
//   const user = await User.findById(request.id);
//   // a blog without likes property will default to the value 0
//   if (body.likes === undefined) {
//     body.likes = 0;
//   }
//   // return 400 Bad Request if title or url is missing
//   if (body.title === undefined || body.url === undefined) {
//     return response.status(400).json({ error: "title and url are required" });
//   }
//   const blog = new Blog({
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes,
//     user: user._id
//   });
//   const savedBlog = await blog.save();
//   user.blogs = user.blogs.concat(savedBlog._id);
//   await user.save();

//   response.status(201).json(savedBlog);
// });

// blogsRouter.delete("/:id", async (request, response) => {
//   const token = request.token;
//   const decodedToken = jwt.verify(token, process.env.SECRET);
//   const userId = decodedToken.id;
//   const blogId = request.params.id;

//   Blog.findById(blogId, (err, blog) => {
//     if (err) {
//       return response.status(500).send({ error: "Server error" });
//     } else if(!blog){
//       return response.status(404).send({ error: "Blog not found" });
//     } else {
//       if (blog.userId && blog.userId.toString() !== userId) {
//         return response.status(403).send({ message: "You are not authorized to delete this blog" });
//       } else {
//         Blog.findByIdAndRemove(blogId, (err) => {
//           if (err) {
//             return response.status(500).send({ error: "Server error" });
//           } else {
//             return response.status(200).send({ message: "Blog deleted successfully" });
//           }
//         });
//       }
//     }
//   });
// });

// blogsRouter.put("/:id", (request, response, next) => {
//   Blog.findByIdAndUpdate(request.params.id, {$inc:{ likes: 10}}, { new: true })
//     .then(updatedBlog => {
//       response.json(updatedBlog);
//     })
//     .catch(error => next(error));
// });

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
