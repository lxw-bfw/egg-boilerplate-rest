// 一些每个集合的文档都必须要的字段
const commonFiles = {
  createdTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
};

module.exports = commonFiles;
