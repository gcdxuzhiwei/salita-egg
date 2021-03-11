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

  async joinState() {
    const { ctx, service } = this;
    const res = await service.user.joinState();
    ctx.body = res;
  }

  async teacherJoin() {
    const { ctx, service } = this;
    const res = await service.user.teacherJoin(ctx.request.body);
    ctx.body = res;
  }

  async teacherInfo() {
    const { ctx, service } = this;
    const res = await service.user.teacherInfo();
    ctx.body = res;
  }

  async teacherInfoChange() {
    const { ctx, service } = this;
    const res = await service.user.teacherInfoChange(ctx.request.body);
    ctx.body = res;
  }

  async teacherChangeVisible() {
    const { ctx, service } = this;
    const res = await service.user.teacherChangeVisible(ctx.request.body);
    ctx.body = res;
  }

  async teacherList() {
    const { ctx, service } = this;
    const res = await service.user.teacherList(ctx.request.body);
    ctx.body = res;
  }
}

module.exports = UserController;
