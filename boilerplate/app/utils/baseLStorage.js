const LSTORAGEBASEPATH = '../localStoreData';

const getStorage = filePath => {
  if (filePath === '') {
    throw new Error('获取本地缓存，文件名不能为空');
  }
  let localStorage = null;
  try {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage(`${LSTORAGEBASEPATH}/${filePath}.js`);
    console.log(`读取${LSTORAGEBASEPATH}/${filePath}.js文件成功`);
  } catch (error) {
    localStorage = null;
    console.error('node-localstorage读取token黑名单列表错误', error);
  }
  return localStorage;
};

module.exports = {
  getStorage,
};
