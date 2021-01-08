'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/upload', controller.utils.upload);

  router.post('/user/register', controller.user.register);
  router.post('/user/login', controller.user.login);
};
