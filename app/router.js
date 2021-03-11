'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/upload', controller.utils.upload);

  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/setAction', controller.user.setAction);
  router.post('/api/user/info', controller.user.info);
  router.post('/api/user/changeInfo', controller.user.changeInfo);
  router.post('/api/user/joinState', controller.user.joinState);
  router.post('/api/user/teacherJoin', controller.user.teacherJoin);
  router.post('/api/user/teacherInfo', controller.user.teacherInfo);
  router.post('/api/user/teacherInfoChange', controller.user.teacherInfoChange);
  router.post('/api/user/teacherChangeVisible', controller.user.teacherChangeVisible);
  router.post('/api/user/teacherList', controller.user.teacherList);

  router.post('/api/admin/login', controller.admin.login);
  router.post('/api/admin/getRole', controller.admin.getRole);
  router.post('/api/admin/getAction', controller.admin.getAction);
  router.post('/api/admin/getJoinTable', controller.admin.getJoinTable);
  router.post('/api/admin/changeJoinState', controller.admin.changeJoinState);
};
