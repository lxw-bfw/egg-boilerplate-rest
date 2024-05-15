module.exports = {
  logger: {
    level: 'DEBUG',
  },
  resourceProtect: {
    whitelist: [
      'localhost:3000',
      '192.168.193.196:3000',
      'api.example.com',
    ],
  },
  security: {
    domainWhiteList: [
      'http://localhost:3000',
      'http://192.168.193.196:3000'
    ],
  },
};
