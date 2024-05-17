# egg-boilerplate-rest

企业级的restful api风格的egg web应用程序，基于以往的egg项目开发经验，从工程化、业务层和持续集成部署等层面进行完善和抽离出一个egg应用骨架，助力快速进行基于egg开发的web api应用程序开发。


## 数据库
`mongodb` `egg-mongoose`

## 安装和使用方式


```bash
npm i -g egg-init
egg-init --type rest showcase
cd showcase
npm i
npm run dev
open http://localhost:7003/eggRestProject
```

### 登录业务

#### 内置jwt登录实现，优化和提供无感刷新token登录机制、登录权限校验中间件

## 其他
`环境变量支持` `egg-validate支持` `egg-mongoose支持` `egg-jwt支持` `egg-cors支持` `egg-security支持` `自定义资源白名单和登录拦截等中间件` `黑名单token支持` `基于bcryptjs加密`...

## 待写...