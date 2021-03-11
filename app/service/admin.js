'use strict';

const Service = require('egg').Service;

class AdminService extends Service {
  async login(data) {
    const { app, service, ctx } = this;
    try {
      const count = await app.mysql.get('admin', {
        userName: data.user,
      });
      if (!count || service.utils.encrypt(data.password) !== count.password) {
        return { err: '账号或密码错误' };
      }
      const option = {
        encrypt: true,
        httpOnly: false,
      };
      if (data.save) {
        option.maxAge = 7 * 24 * 60 * 60 * 1000;
      }
      ctx.cookies.set('adminId', count.adminId, option);
      return { success: true };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async getRole() {
    const { app, ctx } = this;
    try {
      const cookie = ctx.cookies.get('adminId', { encrypt: true });
      const res = await app.mysql.get('admin', {
        adminId: cookie,
      });
      return res.role
        ? { role: res.role, name: res.userName, avatar: res.avatar }
        : { err: '系统繁忙' };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async getAction() {
    const { app } = this;
    try {
      const res = await app.mysql.select('action', {
        orders: [[ 'day', 'desc' ]],
        limit: 10,
      });
      const count = await app.mysql.count('user');
      return { arr: res.reverse(), count };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async getJoinTable(data) {
    const { app } = this;
    try {
      const count = await app.mysql.count('join', {
        state: 0,
      });
      const res = await app.mysql.select('join', {
        where: { state: 0 },
        order: [[ 'time', 'desc' ]],
        limit: 10,
        offset: (data.page - 1) * 10,
      });
      for (let i = 0; i < res.length; i++) {
        const info = await app.mysql.get('user', {
          userId: res[i].userId,
        });
        res[i].phone = info.phone;
      }
      return { res, count };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async changeJoinState(data) {
    const { app } = this;
    try {
      if (!data.canJoin) {
        await app.mysql.delete('join', {
          userId: data.userId,
        });
      } else {
        await app.mysql.update(
          'join',
          {
            state: 1,
          },
          {
            where: { userId: data.userId },
          }
        );
        await app.mysql.update('user', {
          role: 2,
        }, {
          where: { userId: data.userId },
        });
      }
      return { success: true };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }
}

module.exports = AdminService;
