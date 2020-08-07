const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("should return an empty array if given an empty array", () => {
    const expectedOutput = formatDates([{}]);
    expect(expectedOutput).toEqual([{}]);
  });
  test("should not mutate the original array of objects", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const expectedOutput = formatDates(input);
    expect(expectedOutput).not.toBe(input);
    expect(expectedOutput).toEqual(expect.any(Array));
  });
  test("should be able to update the created_at without changing anything else", () => {
    const pattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/;
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1468087638932,
        votes: 100,
      },
    ];
    const expectedOutput = formatDates(input);
    const regexTest = pattern.test(expectedOutput[0].created_at);
    expect(expectedOutput).not.toBe(input);
    expect(typeof expectedOutput[0].created_at).not.toEqual("number");
    expect(regexTest).toBe(true);
    expect(expectedOutput[0]).toHaveProperty("topic");
  });
});
describe("makeRefObj", () => {
  test("should return an empty object given an empty array", () => {
    expect(makeRefObj([])).toEqual({});
  });
  test("should not mutate the original array", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const expectedOutput = formatDates(input);
    expect(expectedOutput).not.toBe(input);
    expect(expectedOutput).toEqual(expect.any(Object));
  });
  test("should return an object with a key of the title and article_id as value", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171,
      },
    ];
    const actualOutput = makeRefObj(input);
    const expectedOutput = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
    };
    expect(actualOutput).toEqual(expectedOutput);
  });
});
describe("formatComments", () => {
  test("should return an empty object given an empty array", () => {
    expect(formatComments([])).toEqual([]);
  });
  test("should not mutate the original array", () => {
    const inputArray = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
      },
    ];
    const expectedOutput = {
      "Living in the shadow of a great man": 1,
    };
    const actualOutput = formatComments(inputArray);
    expect(actualOutput).not.toBe(inputArray);
    expect(expectedOutput).toEqual(expect.any(Object));
  });
  test("should return an object with the key created_by renamed to author", () => {
    const inputArray = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
      },
    ];
    const actualOutput = formatComments(inputArray);
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        author: "butter_bridge",
        votes: 16,
      },
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });
  test("should return an object with the key created_by renamed to author and with the id instead of title", () => {
    const inputArray = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
      },
    ];
    const objRef = { "They're not exactly dogs, are they?": 1 };
    const actualOutput = formatComments(inputArray, objRef);
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
      },
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });
  test("should return the date formated to JS", () => {
    const inputArray = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const objRef = { "They're not exactly dogs, are they?": 1 };
    const actualOutput = formatComments(inputArray, objRef);
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: "2017-11-22T12:36:03.389Z",
      },
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });
});
