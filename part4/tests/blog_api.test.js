const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
     
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe("viewing a specific blog", () => {
  test("a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));
    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    console.log(validNonexistingId);
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of a new blog", () => {
  test("A valid blog can be added", async () => {
    const newBlog = {
      title: "fun blog",
      author: "Ivan Ivanov",
      likes: 11,
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain("fun blog");
  });

  test("A blog without likes property will default to the value 0", async () => {
    const newBlog = { 
      title: "Test Blog", 
      author: "Test Author",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const likes = response.body.map((r) => r.likes);
    expect(likes).toContain(0);
  });

  test("return 400 Bad Request if title or url is missing", async () => {
    const newBlog = {
      author: "Test Author",
      likes: 0
    };
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);
  
    expect(response.body.error).toBe("title and url are required");

  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test("fails with statuscode 204 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.delete(`/api/blogs/${validNonexistingId}`).expect(204);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api.delete(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("updating of a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedLikes = {
      likes: 100,
    };
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedLikes).expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api.put(`/api/blogs/${invalidId}`).expect(400);
  });
});


afterAll(async () => {
  await mongoose.connection.close();
});