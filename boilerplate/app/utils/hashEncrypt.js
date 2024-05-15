const bcryptjs = require('bcryptjs');
// 生成一个 salt (盐)，通常使用 10 个 rounds
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);

const encryptedHandle = text => {
  // 加密
  const hashedText = bcryptjs.hashSync(text, salt);

  return hashedText;
};

const validateCiphertext = (originText, hasText) => {
  const result = bcryptjs.compareSync(originText, hasText);
  return result;
};

module.exports = {
  encryptedHandle,
  validateCiphertext,
};
