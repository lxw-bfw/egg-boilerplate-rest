'use strict';

const Controller = require('../utils/baseController');

let forbidTokensLocalStorage = null;
const forbidTokenListPath = process.env.FORBIDTOKEN_STORAGE_PATH;
try {
  const LocalStorage = require('node-localstorage').LocalStorage;
  forbidTokensLocalStorage = new LocalStorage(
    `../localStoreData/${forbidTokenListPath}.js`,
  );
} catch (error) {
  forbidTokensLocalStorage = null;
}

const LoginBodyRule = {
  accountName: 'string',
  password: 'string?', // 账号密码登录形式
  code: 'string?', // 验证码登录形式
};

class AuthController extends Controller {
  async loginByPassowrd() {
    const { ctx, app } = this;
    const validateBodyRes = await this.parameterValidate(
      LoginBodyRule,
      ctx.request.body,
    );
    if (!validateBodyRes) {
      return;
    }
    try {
      const isValidAccount = await ctx.service.auth.validAccount(
        ctx.request.body,
      );
      if (isValidAccount) {
        // 登录成功处理
        const token = app.jwt.sign(
          {
            accountName: ctx.request.body.accountName,
          },
          app.config.jwt.secret,
          { expiresIn: '24h' },
        );
        this.success({ token, accountId: isValidAccount });
      } else {
        // 登录失败处理
        this.loginFail(null);
      }
    } catch (error) {
      this.serviceErrorHandle('Auth', 'loginByPassowrd', error);
    }
  }

  async logout() {
    const { ctx } = this;
    try {
      const token = ctx.headers.authorization.split(' ')[1];
      let forbidTokenList = forbidTokensLocalStorage.getItem('forbidTokens');
      forbidTokenList = forbidTokenList ? JSON.parse(forbidTokenList) : [];
      forbidTokenList.push(token);
      forbidTokensLocalStorage.setItem(
        'forbidTokens',
        JSON.stringify(forbidTokenList),
      );
      this.success(null);
    } catch (error) {
      this.serviceErrorHandle('Auth', 'logout', error);
    }
  }

  async refreshCsrfToken() {
    this.success(null);
  }
}

module.exports = AuthController;
