const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

function requestApp(method, path, status = 200, sendObj) {
  if (method === "get" || method === "del") {
    return request(app)[method](`/api/${path}`).expect(status);
  } else {
    return request(app)[method](`/api/${path}`).send(sendObj).expect(status);
  }
}

describe("/api", () => {
  afterAll(() => {
    return connection.destroy();
  });
  it("INVALID METHODS /api/", () => {
    const invalidMethods = ["put", "post", "patch"];
    const promises = invalidMethods.map((method) => {
      return requestApp(method, "", 405).then(({ body: { msg } }) => {
        expect(msg).toBe("Method not allowed.");
      });
    });
    return Promise.all(promises);
  });
  it("GET 200 - Returns 200 response from server", () => {
    return requestApp("get", "", 200);
  });
  it("GET 200 - Returns the JSON with endpoint", () => {
    return requestApp("get", "", 200).then(({ body: { endpoints } }) => {
      console.log(endpoints);
      expect(endpoints).toEqual(expect.any(Object));
    });
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
    it("INVALID METHODS /api/users", () => {
      const invalidMethods = ["put", "post", "patch"];
      const promises = invalidMethods.map((method) => {
        return requestApp(method, "users", 405).then(({ body: { msg } }) => {
          expect(msg).toBe("Method not allowed.");
        });
      });
      return Promise.all(promises);
    });
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
    it("GET 200 - Responds with articles sorted by default created_at", () => {
      return requestApp("get", "articles", 200).then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
    });
    it("GET 200 - Responds with articles sorted in the default direction", () => {
      return requestApp("get", "articles", 200).then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
    });
    it("GET 200 - Responds with articles sorted in the ascending direction", () => {
      return requestApp("get", "articles?order=asc", 200).then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
    });
    it("GET 400 - Reponds with error if incorrect direction.", () => {
      return requestApp("get", "articles?order=north", 400).then(
        ({ body: { msg } }) => {
          expect(msg).toBe("Please select either asc or desc for direction.");
        }
      );
    });
    it("GET 200 - Responds with the articles of one specific user", () => {
      return requestApp("get", "articles?author=butter_bridge", 200).then(
        ({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({ author: "butter_bridge" })
            );
          });
        }
      );
    });
    it("GET 200 - Responds with no articles of a specific user", () => {
      return requestApp("get", "articles?author=lurker", 200).then(
        ({ body: { articles } }) => {
          expect(articles.length).toBe(0);
        }
      );
    });
    it("GET 400 - Responds with error if specific user doesnt exist", () => {
      return requestApp("get", "articles?author=potato", 400).then(
        ({ body: { msg } }) => {
          expect(msg).toBe("No such author or topic available.");
        }
      );
    });
    it("GET 200 - Responds with the articles of one specific topic", () => {
      return requestApp("get", "articles?topic=mitch", 200).then(
        ({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({ topic: "mitch" })
            );
          });
        }
      );
    });
    it("GET 200 - Reponds with no articles of a specific topic", () => {
      return requestApp("get", "articles?topic=paper", 200).then(
        ({ body: { articles } }) => {
          expect(articles.length).toBe(0);
        }
      );
    });
    it("GET 400 - Responds with error if topic doesnt exist", () => {
      return requestApp("get", "articles?topic=potatoe", 400).then(
        ({ body: { msg } }) => {
          expect(msg).toBe("No such author or topic available.");
        }
      );
    });
    describe("/api/articles/:article_id", () => {
      it("INVALID METHODS /api/articles/:article_id", () => {
        const invalidMethods = ["put"];
        const promises = invalidMethods.map((method) => {
          return requestApp(method, "articles/1", 405).then(
            ({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed.");
            }
          );
        });
        return Promise.all(promises);
      });
      it("GET 200 - Responds with articles sorted by article_id", () => {
        return requestApp("get", "articles?sort_by=article_id", 200).then(
          ({ body }) => {
            expect(body.articles).toBeSortedBy("article_id", {
              descending: true,
            });
          }
        );
      });
      it("GET 400 - Responds with error if sorted by non existing column", () => {
        return requestApp("get", "articles?sort_by=potatoes", 400).then(
          ({ body: { msg } }) => {
            expect(msg).toBe("That option is not available");
          }
        );
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
      it("GET 400 - Responds with error if article doesnt exist", () => {
        return requestApp("get", "articles/999", 400).then(({ body }) => {
          expect(body.msg).toBe("The selected article does not exist.");
        });
      });
      it("GET 400 - Responds with error if article doesnt exist", () => {
        return requestApp("get", "articles/dog", 400).then(({ body }) => {
          expect(body.msg).toBe("Invalid input sintax.");
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
      it("PATCH 400 - Responds with an error if the input is incorrect", () => {
        const sendObj = { inc_votes: 1 };
        return requestApp("patch", "articles/b", 400, sendObj).then(
          ({ body: { msg } }) => {
            expect(msg).toBe("Invalid input sintax.");
          }
        );
      });
      it("PATCH 400 - Responds with an error if the req.body is inadequate", () => {
        const sendObj = { in_votes: "b" };
        return requestApp("patch", "articles/1", 400, sendObj).then(
          ({ body: { msg } }) => {
            expect(msg).toBe("Incorrect value in object.");
          }
        );
      });
      describe("/api/articles/:article_id/comments", () => {
        it("POST 201 - Responds with 201 from server with post request", () => {
          const sendComment = {
            username: "butter_bridge",
            body: "this is my comment",
          };
          return requestApp("post", "articles/1/comments", 201, sendComment);
        });
        it("POST 201 - Responds with 201 from server and returns the created comment", () => {
          const sendComment = {
            username: "butter_bridge",
            body: "this is my comment",
          };
          return requestApp(
            "post",
            "articles/1/comments",
            201,
            sendComment
          ).then(({ body }) => {
            expect(body.comment).toEqual(expect.any(Array));
            expect(body.comment[0]).toHaveProperty("body");
          });
        });
        it("POST 400 - Responds with 400 with incorrect username", () => {
          const sendComment = {
            username: "toffee",
            body: "this is my comment",
          };
          return requestApp(
            "post",
            "articles/1/comments",
            400,
            sendComment
          ).then(({ body: { msg } }) => {
            expect(msg).toBe("That user doesn't exist.");
          });
        });
        it("POST 400 - Responds with 400 with no body", () => {
          const sendComment = {
            username: "butter_bridge",
            body: "",
          };
          return requestApp(
            "post",
            "articles/1/comments",
            400,
            sendComment
          ).then(({ body: { msg } }) => {
            expect(msg).toBe("Please insert body to comment.");
          });
        });
        it("GET 200 - Responds with 200 for the comments in an article", () => {
          return requestApp("get", "articles/1/comments", 200);
        });
        it("GET 200 - Responds with all comments from an article", () => {
          return requestApp("get", "articles/1/comments", 200).then(
            ({ body }) => {
              expect(body.comments).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                  }),
                ])
              );
            }
          );
        });
        it("GET 400 - Incorrect article id", () => {
          return requestApp("get", "articles/999/comments", 400).then(
            ({ body: { msg } }) => {
              expect(msg).toBe("Could not find that article");
            }
          );
        });
        it("GET 200 - Return comments sorted by created_at", () => {
          return requestApp(
            "get",
            "articles/1/comments?sort_by=created_at",
            200
          ).then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
        });
        it("GET 200 - Return comments sorted by comment_id", () => {
          return requestApp(
            "get",
            "articles/1/comments?sort_by=comment_id",
            200
          ).then(({ body }) => {
            expect(body.comments).toBeSortedBy("comment_id", {
              descending: true,
            });
          });
        });
        it("GET 400 - Return error if the sort_by doesnt exist", () => {
          return requestApp(
            "get",
            "articles/1/comments?sort_by=potatoes",
            400
          ).then(({ body: { msg } }) => {
            expect(msg).toBe("That option is not available");
          });
        });
        it("GET 200 - Return comments in the default direction of sort", () => {
          return requestApp("get", "articles/1/comments", 200).then(
            ({ body }) => {
              expect(body.comments).toBeSortedBy("created_at", {
                descending: true,
              });
            }
          );
        });
        it("GET 200 - Return comments in selected direction of sort", () => {
          return requestApp("get", "articles/1/comments?order=asc", 200).then(
            ({ body }) => {
              expect(body.comments).toBeSortedBy("created_at", {
                ascending: true,
              });
            }
          );
        });
        it("GET 400 - Return error with incorect direction", () => {
          return requestApp("get", "articles/1/comments?order=north", 400).then(
            ({ body: { msg } }) => {
              expect(msg).toBe(
                "Please select either asc or desc for direction."
              );
            }
          );
        });
      });
    });
  });
  describe("/api/comments", () => {
    it("INVALID METHODS /api/comments", () => {
      const invalidMethods = ["put", "post"];
      const promises = invalidMethods.map((method) => {
        return requestApp(method, "comments/1", 405).then(
          ({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed.");
          }
        );
      });
      return Promise.all(promises);
    });
    it("PATCH 200 - Responds ok from server", () => {
      const sendObj = {};
      return requestApp("patch", "comments/1", 200, sendObj);
    });
    it("PATCH 200 - Responds with the updated comment", () => {
      return requestApp("get", "comments/1", 200).then(
        ({ body: { comment } }) => {
          const oldVote = comment[0].votes;
          const sendObj = { inc_votes: -50 };
          const newVote = oldVote + sendObj.inc_votes;
          return requestApp("patch", "comments/1", 200, sendObj).then(
            ({ body: { comment } }) => {
              expect(comment.length).toBe(1);
              expect(comment).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({ comment_id: 1, votes: newVote }),
                ])
              );
            }
          );
        }
      );
    });
    it("PATCH 400 - Errors out if id doesnt exist", () => {
      const sendObj = { inc_votes: 10 };
      return requestApp("patch", "comments/999", 400, sendObj).then(
        ({ body: { msg } }) => {
          expect(msg).toBe("No such comment.");
        }
      );
    });
    it("PATCH 400 - Errors out if not a number", () => {
      const sendObj = { inc_votes: "b" };
      return requestApp("patch", "comments/1", 400, sendObj).then(
        ({ body: { msg } }) => {
          expect(msg).toBe("Invalid input sintax.");
        }
      );
    });
    it("DEL 204 - Reponds ok from server", () => {
      return requestApp("del", "comments/1", 204).then(() => {
        return requestApp("get", "comments/1", 200).then(
          ({ body: { comment } }) => {
            expect(comment.length).toBe(0);
          }
        );
      });
    });
  });
});
