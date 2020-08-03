const { formatDates, makeRefObj, formatComments } = require("../utils");

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
    const pattern = /^[0-9]+-[0-9]+-[0-9]+T[0-9]+:[0-9]+:[0-9]+.[0-9]+Z$/;
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
    const regexTest = pattern.test(expectedOutput[0].created_at);
    expect(expectedOutput).not.toBe(input);
    expect(typeof expectedOutput[0].created_at).not.toEqual("number");
    expect(regexTest).toBe(true);
  });
});
