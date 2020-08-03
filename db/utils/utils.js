exports.formatDates = (list) => {
  const updatedList = [...list];
  updatedList.forEach((article) => {
    if (article.created_at) {
      const date = new Date(article.created_at);
      const year = date.getFullYear();
      const month =
        String(date.getMonth()).length === 2
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      const day =
        String(date.getDate()).length === 2
          ? date.getDate()
          : "0" + date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
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
