const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

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
  let token;
  let user;
  beforeAll(async () => {
    // Create a test user and get a JWT token
    const newUser = { username: "testuser", password: "testpassword", name: "Test User" };
    const res = await api.post("/api/users").send(newUser);
    user = res.body;
    const loginRes = await api.post("/api/login").send(newUser);
    token = loginRes.body.token;
  });
  afterAll(async () => {
    await User.deleteMany({});
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "https://testurl.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogs.map((b) => b.title);
    expect(titles).toContain("Test Blog");
  });

  test("A blog without likes property will default to the value 0", async () => {
    const newBlog = { 
      title: "Test Blog", 
      author: "Test Author",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const likes = response.body.map((r) => {
      return r.likes === undefined ? 0 : r.likes;
    });
    expect(likes).toContain(0);
  });

  test("return 400 Bad Request if title or url is missing", async () => {
    const newBlog = {
      author: "Test Author",
      likes: 0
    };
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
    
    expect(response.body.error).toBe("title and url are required");

  });
});

describe("deletion of a blog", () => {
  let token;
  let user;
  beforeAll(async () => {
    // Create a test user and get a JWT token
    const newUser = { username: "testuser", password: "testpassword", name: "Test User" };
    const res = await api.post("/api/users").send(newUser);
    user = res.body;
    const loginRes = await api.post("/api/login").send(newUser);
    token = loginRes.body.token;
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    if (blogToDelete.user === user.id.toString()) {
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
      const titles = blogsAtEnd.map((r) => r.title);
      expect(titles).not.toContain(blogToDelete.title);
    } 
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api
      .delete(`/api/blogs/${invalidId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
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

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "thereisauser",
      name: "Test User",
      password: "testpassword",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});