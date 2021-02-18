'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class UserService extends Service {
  async register(data) {
    const { app, service } = this;
    try {
      if (
        await app.mysql.get('user', {
          phone: data.phone,
        })
      ) {
        return { err: '该手机号已被注册' };
      }
      const res = await app.mysql.insert('user', {
        userId: service.utils.uuid(),
        phone: data.phone,
        password: service.utils.encrypt(data.password),
      });
      if (res.affectedRows === 1) {
        return { success: true };
      }
      return { err: '系统繁忙' };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async login(data) {
    const { app, service, ctx } = this;
    try {
      const count = await app.mysql.get('user', {
        phone: data.phone,
      });
      if (!count || service.utils.encrypt(data.password) !== count.password) {
        return { err: '手机号或密码错误' };
      }
      const option = {
        encrypt: true,
        httpOnly: false,
      };
      if (data.save) {
        option.maxAge = 7 * 24 * 60 * 60 * 1000;
      }
      ctx.cookies.set('umiId', count.userId, option);
      return { success: true };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async setAction() {
    const { ctx, app } = this;
    try {
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.update(
        'user',
        {
          lastLogin: moment().format(),
        },
        {
          where: {
            userId: cookie,
          },
        }
      );
      const { role } = await app.mysql.get('user', {
        userId: cookie,
      });
      return res.affectedRows === 1
        ? { success: true, role }
        : { err: '系统繁忙' };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async info() {
    try {
      const { ctx, app } = this;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.get('user', {
        userId: cookie,
      });
      if (!res.password) {
        return { err: '系统繁忙' };
      }
      delete res.password;
      delete res.userId;
      return res;
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async changeInfo() {
    try {
      const { ctx, app } = this;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.update('user', ctx.request.body, {
        where: {
          userId: cookie,
        },
      });
      if (res.affectedRows === 1) {
        return { success: true };
      }
      return { err: '系统繁忙' };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async joinState() {
    try {
      const { ctx, app } = this;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.get('user', {
        userId: cookie,
      });
      if (res.role === 2) {
        return { state: 2 };
      }

      const flag = await app.mysql.get('join', {
        userId: cookie,
      });

      return { state: flag ? 1 : 0 };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }
}

module.exports = UserService;
