'use strict';
const { getStorage } = require('../utils/baseLStorage.js');
const RESULT = require('../utils/responeResult.js');

const forbidTokenListPath = process.env.FORBIDTOKEN_STORAGE_PATH;
let localStorage = null;
try {
  localStorage = getStorage(forbidTokenListPath);
} catch (error) {
  localStorage = null;
  console.error('读取黑名单失败', error);
}

module.exports = options => {
  return async function loginInterceptor(ctx, next) {
    const { method, path } = ctx.request;
    const whitelist = options.whitelist;
    

    const shouldSkip = whitelist.some(item => {
      if (item.method) {
        if (item.routerType === 'dynamicRoute') {
          let isLimitKeyword = '';
          if (Array.isArray(item.limitKeyWrods)) {
            isLimitKeyword = item.limitKeyWrods.find(
              keyWord => path.indexOf(keyWord) !== -1,
            );
          }
          console.log('isLimitKeyword', isLimitKeyword);
          return (
            item.method === method &&
            !isLimitKeyword &&
            path.startsWith(item.path)
          );
        }
        return item.method === method && path === item.path;
      }
      if (item.routerType === 'dynamicRoute') {
        let isLimitKeyword = '';
        if (Array.isArray(item.limitKeyWrods)) {
          isLimitKeyword = item.limitKeyWrods.find(
            keyWord => path.indexOf(keyWord) !== -1,
          );
        }

        console.log('isLimitKeyword', isLimitKeyword);
        return !isLimitKeyword && path.startsWith(item.path);
      }
      return path === item.path;
    });
    if (shouldSkip) {
      await next();
      return;
    }
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
    let decode = '';
    if (token) {
      console.log('当前access token', token);
      try {
        let forbidTokenList = localStorage.getItem('forbidTokens');
        forbidTokenList = forbidTokenList ? JSON.parse(forbidTokenList) : [];
        if (forbidTokenList.includes(token)) {
          ctx.status = 401;
          RESULT.UNLOGIN.data = { message: 'Token 无效，请重新登录' };
          ctx.body = RESULT.UNLOGIN;
          return;
        }
      } catch (error) {
        // 跳过黑名单机制继续
        ctx.logger.error('node-localstorage-error', error);
      }
      try {
        // 解码access token
        decode = ctx.app.jwt.verify(token, options.secret);

        // 判断是否解码
        if (!decode) {
          ctx.status = 401;
          RESULT.UNLOGIN.data = { message: 'Token 无效，请重新登录' };
          ctx.body = RESULT.UNLOGIN;
          return;
        }

        // 解码的数据绑定在请求上
        ctx.request.decode = decode;
        await next();
      } catch (error) {
        ctx.logger.error('token解码错误', error);
        ctx.status = 401;
        RESULT.UNLOGIN.data = { message: 'token无效，请重新上传' };
        ctx.body = RESULT.UNLOGIN;
        return;
      }
    } else {
      ctx.status = 401;
      RESULT.UNLOGIN.data = { message: '没有token,请上传token' };
      ctx.body = RESULT.UNLOGIN;
      return;
    }
  };
};
