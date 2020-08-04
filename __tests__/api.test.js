const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

function requestApp(method, path, status = 200) {
  if (method === "get") {
    return request(app).get(`/api/${path}`).expect(status);
  } else if (method === "post") {
    return request(app).post(`/api/${path}`).expect(status);
  }
}

describe("/api", () => {
  afterAll(() => {
    return connection.destroy();
  });
  describe("/api/topics", () => {
    it("GET 200 - Responds with code 200", () => {
      return request(app).get("/api/topics").expect(200);
    });
    it("GET 200 - Responds with an array of topics with both properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toEqual(expect.any(Array));
          expect(body.topics).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              }),
            ])
          );
        });
    });
    it("GET 400 - Responds with 400 if the path is incorrect", () => {
      return request(app)
        .get("/api/topic")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Path does not exist.");
        });
    });
  });
  describe("/api/users", () => {
    it("GET 200 - Expect 200 from the server", () => {
      return request(app).get("/api/users").expect(200);
    });
    it("GET 200 - Expect an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .then(({ body }) => {
          expect(body.users).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String),
              }),
            ])
          );
        });
    });
    it("GET 200 - Expect an user when requested by its username", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String),
              }),
            ])
          );
          expect(body.user.length).toBe(1);
        });
    });
    it("GET 400 - Expect an error when the username doesnt exist", () => {
      return requestApp("get", "users/docker", 400).then(({ body }) => {
        expect(body).toEqual({ msg: "User not found" });
      });
    });
  });
  describe("/api/articles", () => {
    it("GET 200 - Responds with 200 from the server", () => {
      return requestApp("get", "articles", 200);
    });
    it("GET 200 - Responds with an array of articles", () => {
      return requestApp("get", "articles", 200).then(({ body }) => {
        expect(body.articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            }),
          ])
        );
      });
    });
  });
});
