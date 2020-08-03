exports.formatDates = (list) => {
  const updatedList = list.map(({ created_at, ...article }) => {
    if (created_at) {
      const date = new Date(created_at);
      return { ...article, created_at: date.toGMTString() };
    } else {
      return { ...article };
    }
  });
  console.log(updatedList);
  return updatedList;
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
