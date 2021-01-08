'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class UserService extends Service {
  async register(data) {
    const { app, service } = this;
    if (
      await app.mysql.get('user', {
        phone: data.phone,
      })
    ) {
      return { err: '该手机号已被注册' };
    }
    console.log(data.phone - 0);
    const res = await app.mysql.insert('user', {
      userId: service.utils.uuid(),
      phone: data.phone,
      password: service.utils.encrypt(data.password),
      lastLogin: moment().format(),
    });
    if (res.affectedRows === 1) {
      return { success: true };
    }
    return { err: '系统繁忙' };
  }

  async login(data) {
    const { app, service, ctx } = this;
    const count = await app.mysql.get('user', {
      phone: data.phone,
    });
    if (!count) {
      return { err: '用户不存在' };
    } else if (service.utils.encrypt(data.password) !== count.password) {
      return { err: '密码错误' };
    }
    const option = {
      encrypt: true,
    };
    if (data.save) { option.maxAge = 7 * 24 * 60 * 60 * 1000; }
    ctx.cookies.set('umiId', count.userId, option);
    return { success: true };
  }
}

module.exports = UserService;
