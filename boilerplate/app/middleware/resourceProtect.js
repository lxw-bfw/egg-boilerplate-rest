module.exports = options => {
  return async function resourceProtect(ctx, next) {
    // 白名单，允许访问资源的网页域名
    const whitelist = options.whitelist;

    const referer = ctx.get('referer');
    const origin = ctx.get('Origin');
    let validUrlHost = '';
    try {
      validUrlHost = origin ? new URL(origin).host : new URL(referer).host;
    } catch (error) {
      validUrlHost = '';
    }

    console.log('防盗连接------------------------------------');
    console.log('referer: ', referer);
    console.log('host: ', origin);
    // 检查 referer 是否在白名单内

    if (!whitelist.includes(validUrlHost)) {
      //   ctx.status = 403;
      //   ctx.body = '禁止非法请求';
      //   return;
    }

    await next();
  };
};
