/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const subRouter = router.namespace(`/${process.env.PROJECT_NAME}`);
  subRouter.get('/', controller.home.index);
  subRouter.get('/tokenTag/paginate', controller.tokenTag.paginate);
  subRouter.post('/auth/register', controller.auth.register);
  subRouter.post('/auth/loginByPassowrd', controller.auth.loginByPassowrd);
  subRouter.post('/auth/logout', controller.auth.logout);
  subRouter.post('/auth/refreshCsrfToken', controller.auth.refreshCsrfToken);
  subRouter.post('/auth/checkToken', controller.auth.checkToken);

  // restful api 风格的增删改查
  subRouter.resources('tokenTag', '/tokenTag', controller.tokenTag);
};
