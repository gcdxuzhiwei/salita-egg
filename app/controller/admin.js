'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async login() {
    const { ctx, service } = this;
    const res = await service.admin.login(ctx.request.body);
    ctx.body = res;
  }

  async getRole() {
    const { ctx, service } = this;
    const res = await service.admin.getRole();
    ctx.body = res;
  }
}

module.exports = AdminController;
