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

  async getAction() {
    const { ctx, service } = this;
    const res = await service.admin.getAction();
    ctx.body = res;
  }

  async getJoinTable() {
    const { ctx, service } = this;
    const res = await service.admin.getJoinTable(ctx.request.body);
    ctx.body = res;
  }

  async changeJoinState() {
    const { ctx, service } = this;
    const res = await service.admin.changeJoinState(ctx.request.body);
    ctx.body = res;
  }
}

module.exports = AdminController;
