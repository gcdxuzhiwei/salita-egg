'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = 'user index';
    await ctx.render('user.html', {
      id: 100,
      name: 'admin',
      lists: [
        'java',
        'php',
        'ts',
      ],
    });
  }

  async lists() {
    const { ctx, app } = this;
    console.log(app.mysql);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
    ctx.body = [{ id: 123 }];
  }

  async detail() {
    const { ctx } = this;
    const res = await ctx.service.user.detail(ctx.query.id);
    ctx.body = res;
  }

  async detail2() {
    const { ctx } = this;
    ctx.body = ctx.params.id;
  }

  async add() {
    const { ctx } = this;
    const rule = {
      name: { type: 'string' },
      age: { type: 'number' },
    };
    ctx.validate(rule);
    ctx.body = {
      status: 200,
      data: ctx.request.body,
    };
  }

  async edit() {
    const { ctx } = this;
    ctx.body = ctx.request.body;
  }

  async del() {
    const { ctx } = this;
    ctx.body = ctx.request.body.id;
  }
}

module.exports = UserController;
