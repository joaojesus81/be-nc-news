const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

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
        .then((topics) => {
          expect(topics.body.topics).toEqual(expect.any(Array));
          expect(topics.body.topics[0]).toHaveProperty("slug");
          expect(topics.body.topics[0]).toHaveProperty("description");
        });
    });
  });
});
