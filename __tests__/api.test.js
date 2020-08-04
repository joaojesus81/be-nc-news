const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

function requestApp(method, path, status = 200, sendObj) {
  if (method === "get") {
    return request(app).get(`/api/${path}`).expect(status);
  } else if (method === "post") {
    return request(app).post(`/api/${path}`).expect(status);
  } else if (method === "patch") {
    return request(app).patch(`/api/${path}`).send(sendObj).expect(status);
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
    it("GET 200 - Responds with one article", () => {
      return requestApp("get", "articles/1", 200).then(({ body }) => {
        expect(body.article.length).toBe(1);
        expect(body.article).toEqual(
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
    it("GET 400 - Respondes with error if article doesnt exist", () => {
      return requestApp("get", "articles/999", 400).then(({ body }) => {
        expect(body.msg).toBe("The selected article does not exist.");
      });
    });
    it("PATCH 200 - Responds with 200 to a patch request", () => {
      return requestApp("patch", "articles/1", 200, {
        inc_votes: 1,
      });
    });
    it("PATCH 200 - Responds with the correct article and updated vote count if provided with a positive number", () => {
      return requestApp("get", "articles/1", 200)
        .then(({ body }) => {
          const previousVotes = body.article[0].votes;
          return previousVotes;
        })
        .then((previousVotes) => {
          const sendObj = {
            inc_votes: 1,
          };
          return requestApp("patch", "articles/1", 200, sendObj).then(
            ({ body }) => {
              const newVotes = previousVotes + sendObj.inc_votes;
              expect(body.article.length).toBe(1);
              expect(body.article[0].votes).toBe(newVotes);
            }
          );
        });
    });
    it("PATCH 200 - Responds with the correct article and updated vote count if provided with a negative number", () => {
      return requestApp("get", "articles/1", 200)
        .then(({ body }) => {
          const previousVotes = body.article[0].votes;
          return previousVotes;
        })
        .then((previousVotes) => {
          const sendObj = {
            inc_votes: -1000,
          };
          return requestApp("patch", "articles/1", 200, sendObj).then(
            ({ body }) => {
              const newVotes = previousVotes + sendObj.inc_votes;
              expect(body.article.length).toBe(1);
              expect(body.article[0].votes).toBe(newVotes);
            }
          );
        });
    });
    it("PATCH 400 - Responds with an error if the input is incorrect", () => {});
  });
});
