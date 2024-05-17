# 项目说明
restful api风格的egg应用程序工程模板

## QuickStart


### Development

```bash
npm i
npm run dev
open http://localhost:7003/eggRestProject
```

### Deploy

```bash
npm start
npm stop
```

### npm scripts

- husky提交自动prettier和lint code
- husky commit-smg自动commit message的commitlint

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

## 配置

### config目录

基于`.env.*`和`config.env.js`来全局配置项目，egg-插件启动和关闭——`plugin.js`

## 业务层

`app`目录，提供最基础的`MVC`架构下的业务代码例子
`middleware`目录，封装中间件，提供资源访问权限校验和登录拦截...
`utils`目录，工具函数和类库封装
`router.js`，路由配置，提供restful api
`controller/auth.js`，提供`jwt`登录样例

### 登录业务

#### 内置jwt登录实现，优化和提供无感刷新token登录机制、登录权限校验中间件

## 工程

待写...


