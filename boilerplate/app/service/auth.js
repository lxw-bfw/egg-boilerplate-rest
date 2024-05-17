// app/service/Auth.js
const Service = require('egg').Service;
const { encryptedHandle, validateCiphertext } = require('../utils/hashEncrypt');

class AuthService extends Service {
  async register(body) {
    const { ctx } = this;
    const { password, ...userInfo } = body;
    const accountInfo = {
      accountName: userInfo.userName,
      password: encryptedHandle(password),
    };

    try {
      const accountResult = await ctx.model.CmsAccount.create(accountInfo);
      userInfo.accountId = accountResult._id;
      const userResult = await ctx.model.CmsUser.create(userInfo);
      return userResult;
    } catch (error) {
      if (error.code !== 11000) {
        throw new Error(error);
      } else {
        return { code: 11000, message: '账号已经存在' };
      }
    }
  }
  async validAccount(body) {
    const { ctx } = this;
    const { accountName, password } = body;
    const account = await ctx.model.CmsAccount.findOne({
      accountName,
    });
    if (!account || !validateCiphertext(password, account.password)) {
      this.logger.info('登录账号校验不通过，登录失败');
      return false;
    }
    const userInfo = await ctx.model.CmsUser.findOne({
      accountId: account._id,
    });
    return userInfo;
  }
}

module.exports = AuthService;
