'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async register() {
    const { ctx, service } = this;
    const res = await service.user.register(ctx.request.body);
    ctx.body = res;
  }

  async login() {
    const { ctx, service } = this;
    const res = await service.user.login(ctx.request.body);
    ctx.body = res;
  }

  async setAction() {
    const { ctx, service } = this;
    const res = await service.user.setAction();
    ctx.body = res;
  }

  async info() {
    const { ctx, service } = this;
    const res = await service.user.info();
    ctx.body = res;
  }

  async changeInfo() {
    const { ctx, service } = this;
    const res = await service.user.changeInfo();
    ctx.body = res;
  }
}

module.exports = UserController;
