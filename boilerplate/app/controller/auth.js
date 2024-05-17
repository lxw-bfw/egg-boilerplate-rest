'use strict';

const Controller = require('../utils/baseController');
const { getStorage } = require('../utils/baseLStorage');
const { getFutureTimestamp } = require('../utils/common');
const RESULT = require('../utils/responeResult');
const REFRESHSECRET = process.env.JWT_REFRESH_SECRET;

let forbidTokensLocalStorage = null;
const forbidTokenListPath = process.env.FORBIDTOKEN_STORAGE_PATH;
try {
  forbidTokensLocalStorage = getStorage(forbidTokenListPath);
} catch (error) {
  console.error('读取黑名单失败', error);
  forbidTokensLocalStorage = null;
}

const ACCESSTOKENVALIDTIME = '5m';

const registerBodyRule = {
  userName: 'string',
  password: 'string',
  roleId: { type: 'string', required: true, allowEmpty: false },
  roleName: { type: 'string', required: true, allowEmpty: false },
  avatar: 'string?',
  nickName: 'string?',
  phone: 'string?',
  email: 'string?',
  sex: 'number?',
  status: 'number?',
  remark: 'string?',
};

const LoginBodyRule = {
  accountName: 'string',
  password: 'string?', // 账号密码登录形式
  code: 'string?', // 验证码登录形式
};

class AuthController extends Controller {
  async register() {
    const { ctx } = this;
    const validateBodyRes = await this.parameterValidate(
      registerBodyRule,
      ctx.request.body,
    );
    if (!validateBodyRes) {
      return;
    }
    try {
      const result = await ctx.service.auth.register(ctx.request.body);
      if (result.code && result.code === 11000) {
        this.accountRepeat(null);
        return;
      }
      this.success(null);
    } catch (error) {
      this.serviceErrorHandle('Auth', 'register', error);
    }
  }
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
      const userInfo = await ctx.service.auth.validAccount(ctx.request.body);
      if (userInfo) {
        // 登录成功处理
        const user = { userName: userInfo.userName };
        const accessToken = app.jwt.sign(user, app.config.jwt.secret, {
          expiresIn: ACCESSTOKENVALIDTIME,
        });
        const refreshToken = app.jwt.sign(user, REFRESHSECRET, {
          expiresIn: '7d',
        });
        this.success({
          accessToken,
          refreshToken,
          tokenExpiresIn: getFutureTimestamp(ACCESSTOKENVALIDTIME),
          userInfo,
        });
      } else {
        // 登录失败处理
        this.loginFail(null);
      }
    } catch (error) {
      this.serviceErrorHandle('Auth', 'loginByPassowrd', error);
    }
  }

  // 注销操作需要同时加黑access tokne和refresh token
  async logout() {
    const { ctx } = this;
    const token = ctx.headers.authorization.split(' ')[1];
    const refreshToken = ctx.request.headers['x-refresh-token'];
    if (!token || !refreshToken) {
      this.error400({ message: '两个token必须都携带' });
      return;
    }
    try {
      let forbidTokenList = forbidTokensLocalStorage.getItem('forbidTokens');
      forbidTokenList = forbidTokenList ? JSON.parse(forbidTokenList) : [];
      forbidTokenList.push(token);
      forbidTokenList.push(refreshToken);
      forbidTokensLocalStorage.setItem(
        'forbidTokens',
        JSON.stringify(forbidTokenList),
      );
      this.success(null);
    } catch (error) {
      this.serviceErrorHandle('Auth', 'logout', error);
    }
  }
  // 检查access token是否过期
  async checkToken() {
    const { ctx, app } = this;
    let token = '';
    if (
      ctx.headers.authorization &&
      ctx.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = ctx.headers.authorization.split(' ')[1];
    } else if (ctx.query.accesstoken) {
      token = ctx.query.accesstoken;
    } else if (ctx.request.body.accesstoken) {
      token = ctx.request.body.accesstoken;
    }
    if (!token) {
      this.error400({ message: '没有带上token,无法检查' });
      return;
    }
    let decode = '';
    try {
      // 解码access token
      decode = app.jwt.verify(token, app.config.jwt.secret);

      // 判断是否解码
      if (!decode) {
        this.success({ isValid: false });
        return;
      }
      this.success({ isValid: true });
    } catch (error) {
      this.success({ isValid: false });
    }
  }

  // 根据refreshToken来刷新access token
  async refreshCsrfToken() {
    const { ctx, app } = this;

    const oldRefreshToken = ctx.request.headers['x-refresh-token'];

    if (!oldRefreshToken) {
      this.error400({ message: '必须携带refreshToken' });
      return;
    }

    // Verify refresh token, if it is invalid, return 401 code.
    try {
      const user = app.jwt.verify(oldRefreshToken, REFRESHSECRET);
      console.log('oldRefreshToken', oldRefreshToken, 'user', user);
      if (!user) {
        ctx.status = 401;
        RESULT.UNLOGIN.data = { message: 'Token 无效，请重新登录' };
        ctx.body = RESULT.UNLOGIN;
        return;
      }
      delete user.exp;
      user.iat = Math.floor(Date.now() / 1000);
      // refreshToken还有效，继续刷新access token
      const token = app.jwt.sign(user, app.config.jwt.secret, {
        expiresIn: ACCESSTOKENVALIDTIME,
      });

      this.success({ accessToken: token });
    } catch (err) {
      console.error(err);
      ctx.status = 401;
      RESULT.UNLOGIN.data = { message: 'Token 无效，请重新登录' };
      ctx.body = RESULT.UNLOGIN;
    }
  }
}

module.exports = AuthController;
