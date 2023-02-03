const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];
  
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe("favorite blog", () => {
  const listBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    },
    {
      title: "nwe blog",
      author: "Ivan Ivanov",
      likes: 11
    },
  ];

  test("when list has more than one blog, equals the blog with most likes", () => {
    const result = listHelper.favoriteBlog(listBlogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    });
  });
});

describe ("most blogs", () => {
  const listBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction",
      author: "ALex",
      likes: 12,
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    },
    {
      title: "nwe blog",
      author: "Ivan Ivanov",
      likes: 11
    },
    {
      title: "fun blog",
      author: "Ivan Ivanov",
      likes: 19,
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    },
    {
      title: "fun big blog",
      author: "ALex",
      likes: 19,
    }
  ];

  test("returns the author who has the largest amount of blogs, and return the number of blogs", () => {
    const result = listHelper.mostBlogs(listBlogs);
    expect(result).toEqual({
      author: "ALex",
      blogs: 2
    });
  });
});

describe ("most likes", () => {
  const listBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction",
      author: "Alex",
      likes: 12,
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    },
    {
      title: "nwe blog",
      author: "Ivan Ivanov",
      likes: 11
    },
    {
      title: "fun blog",
      author: "Ivan Ivanov",
      likes: 19,
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    },
    {
      title: "fun big blog",
      author: "Alex",
      likes: 19,
    }
  ];

  test("returns the author who has the most likes, and return the number of likes", () => {
    const result = listHelper.mostLikes(listBlogs);
    expect(result).toEqual(
      {
        author: "Alex",
        likes: 31
      }
    );
  });
});

