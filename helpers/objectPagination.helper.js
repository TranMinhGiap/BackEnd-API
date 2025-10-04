module.exports.objectPagination = (query, totalRecord) => {
  const objectPagination = {
    currPage: 1,
    limit: 2,
    skip: null,
    totalPage: null,
    page_next: 2,
    page_prev: null
  }
  if(query.limit){
    objectPagination.limit = parseInt(query.limit);
  }
  if (query.page) {
    objectPagination.currPage = parseInt(query.page);
    objectPagination.skip = (objectPagination.currPage - 1) * objectPagination.limit;
    objectPagination.totalPage = Math.ceil(totalRecord / objectPagination.limit);
    if(objectPagination.currPage + 1 <= objectPagination.totalPage){
      objectPagination.page_next = objectPagination.currPage + 1;
    }else{
      objectPagination.page_next = null;
    }
    if(objectPagination.currPage - 1 >= 1){
      objectPagination.page_prev = objectPagination.currPage - 1;
    }else{
      objectPagination.page_prev = null;
    }
  }
  return objectPagination;
}