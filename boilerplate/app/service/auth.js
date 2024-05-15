// app/service/Auth.js
const Service = require('egg').Service;
const { validateCiphertext } = require('../utils/hashEncrypt');

class AuthService extends Service {
  async validAccount(body) {
    const { ctx } = this;
    const { accountName, password } = body;
    const account = await ctx.model.Account.findOne({
      accountName,
    });
    if (!account || !validateCiphertext(password, account.password)) {
      this.logger.info('登录账号校验不通过，登录失败');
      return false;
    }
    return account._id;
  }
}

module.exports = AuthService;
