/* eslint valid-jsdoc: "off" */

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  const envFile = `.env.${appInfo.env}`;
  require('dotenv').config({ path: path.resolve(__dirname, envFile) });

  const listenPort = process.env.PORT;
  const projectName = process.env.PROJECT_NAME;
  const cookieSignKey = process.env.COOKI_SIGN_KEY;
  console.log('默认端口', listenPort);

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + cookieSignKey;

  // TODO:loginInterceptor不能全局使用，要排除某些请求
  config.middleware = ['resourceProtect', 'loginInterceptor'];

  config.loginInterceptor = {
    secret: process.env.JWT_SECRET,
    whitelist: [
      {
        path: `/${projectName}/shareConversation`,
        method: 'GET',
        routerType: 'dynamicRoute',
        limitKeyWrods: ['paginate'],
      },
    ],
    match: new RegExp(
      `^(?!\/${projectName}\/auth\/(register|loginByPassowrd|checkToken|refreshCsrfToken|loginBySMSCode|sendSMSCode|getRandomSlideVerify|validateSliderCaptcha))`,
    ),
  };

  config.cluster = {
    listen: {
      port: parseInt(listenPort),
    },
  };

  config.mongoose = {
    url: process.env.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };
  config.validate = {
    convert: true,
    widelyUndefined: true,
  };
  config.jwt = {
    secret: process.env.JWT_SECRET,
  };
  config.security = {
    csrf: {
      enable: false, // 关闭csrf校验
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      ignore: [
        `/${projectName}/auth/register`,
        `/${projectName}/auth/loginByPassowrd`,
        `/${projectName}/auth/loginBySMSCode`,
        `/${projectName}/auth/sendSMSCode`,
      ],
    },
  };
  // 跨域配置
  config.cors = {
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.static = {
    // 静态资源文件的文件夹位置
    dir: path.join(__dirname, '../public'),
    // 静态资源的 URL 前缀
    prefix: '/public/',
    // 是否开启静态资源的动态ETag生成
    dynamic: true,
    // 如果你的静态资源文件名包含版本号，可以开启这个，将忽略URL版本号（例如 "/public/js/jquery-1.12.0.js" 将视为 "/public/js/jquery.js"）
    preload: false,
    // 生产环境建议开启此配置以提升用户体验
    buffer: process.env.NODE_ENV === 'prod',
    maxFiles: 0, // 配置静态文件缓存数量，将部分静态文件缓存到内存中，加快访问速度，这里我的静态资源无需如此，并且我当前部署的服务器内存不是很多
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
