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
      return res.role ? { role: res.role, name: res.userName } : { err: '系统繁忙' };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }
}

module.exports = AdminService;
