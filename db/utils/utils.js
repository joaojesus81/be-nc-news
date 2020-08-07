exports.formatDates = (list) => {
  const updatedList = [...list];
  updatedList.forEach((article) => {
    if (article.created_at) {
      const date = new Date(article.created_at);
      const year = date.getFullYear();
      const realMonth = date.getMonth() + 1;
      const month = realMonth < 10 ? "0" + realMonth : realMonth;
      const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
      const hours =
        date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
      const minutes =
        date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
      const seconds =
        date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
      const miliseconds = date.getMilliseconds();
      const convertedTimeStamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${miliseconds}Z`;
      article.created_at = convertedTimeStamp;
    }
  });
  return updatedList;
};

exports.makeRefObj = (list) => {
  const refObj = {};
  list.forEach(({ article_id, title, ...object }) => {
    refObj[title] = article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  let updatedComments = module.exports.formatDates(comments);
  updatedComments = updatedComments.map(
    ({ created_by, belongs_to, ...comment }) => {
      if (articleRef === undefined) {
        return { ...comment, author: created_by, belongs_to };
      } else {
        const article_id = articleRef[belongs_to];
        return { ...comment, author: created_by, article_id };
      }
    }
  );
  return updatedComments;
};
