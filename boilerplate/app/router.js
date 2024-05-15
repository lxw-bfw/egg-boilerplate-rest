/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const subRouter = router.namespace(`/${process.env.PROJECT_NAME}`);
  subRouter.get('/', controller.home.index);
  subRouter.get('/tokenTag/paginate', controller.tokenTag.paginate);
  // restful api 风格的增删改查
  subRouter.resources('tokenTag', '/tokenTag', controller.tokenTag);
};
