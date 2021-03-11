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
        const actionInfo = await app.mysql.get('action', {
          day: moment().format('YYYYMMDD'),
        });
        if (actionInfo) {
          app.mysql.update(
            'action',
            {
              register: actionInfo.register + 1,
            },
            {
              where: {
                day: moment().format('YYYYMMDD'),
              },
            }
          );
        } else {
          app.mysql.insert('action', {
            day: moment().format('YYYYMMDD'),
            action: 1,
            online: 1,
          });
        }
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
      let willAction = false;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const { lastLogin: oldAction } = await app.mysql.get('user', {
        userId: cookie,
      });
      if (
        moment(oldAction).format('YYYYMMDD') !== moment().format('YYYYMMDD')
      ) {
        willAction = true;
      }
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

      const actionInfo = await app.mysql.get('action', {
        day: moment().format('YYYYMMDD'),
      });
      if (actionInfo) {
        const option = willAction
          ? {
            action: actionInfo.action + 1,
            online: actionInfo.online + 1,
          }
          : {
            action: actionInfo.action + 1,
          };
        app.mysql.update('action', option, {
          where: {
            day: moment().format('YYYYMMDD'),
          },
        });
      } else {
        app.mysql.insert('action', {
          day: moment().format('YYYYMMDD'),
          action: 1,
          online: 1,
        });
      }

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

  async teacherJoin(data) {
    try {
      const { ctx, app } = this;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.insert('join', {
        userId: cookie,
        isTeacher: data.isTeacher,
        imageUrl: data.imageUrl,
        school: data.school,
        profession: data.profession,
        level: data.level,
        time: new Date().getTime(),
      });
      if (res.affectedRows === 1) {
        return { success: true };
      }
      return { err: '系统繁忙' };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async teacherInfo() {
    try {
      const { ctx, app } = this;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.get('join', {
        userId: cookie,
      });
      return {
        res: {
          visible: res.visible,
          group1: res.group1,
          group2: res.group2,
          introduce: res.introduce,
        },
      };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async teacherInfoChange(data) {
    try {
      const { ctx, app } = this;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.update(
        'join',
        {
          visible: data.visible,
          group1: data.group1,
          group2: data.group2,
          introduce: data.introduce,
        },
        {
          where: { userId: cookie },
        }
      );
      return res.affectedRows === 1 ? { success: true } : { err: '修改失败' };
    } catch (e) {
      return { err: '服务器异常' };
    }
  }

  async teacherChangeVisible(data) {
    try {
      const { ctx, app } = this;
      const cookie = ctx.cookies.get('umiId', { encrypt: true });
      const res = await app.mysql.get('user', {
        userId: cookie,
      });
      if (data.visible === 0) {
        const change = await app.mysql.update(
          'join',
          {
            visible: data.visible,
          },
          {
            where: { userId: cookie },
          }
        );
        return change.affectedRows === 1 ? { success: true } : { err: '发布失败' };
      }
      if (!res.age || !res.name || !res.area) {
        return { err: '请先去我的页面完善个人基本信息' };
      }
      if (data.visible === 1) {
        const change = await app.mysql.update(
          'join',
          {
            visible: data.visible,
          },
          {
            where: { userId: cookie },
          }
        );
        return change.affectedRows === 1 ? { success: true } : { err: '发布失败' };
      }
    } catch (e) {
      return { err: '服务器异常' };
    }
  }
}

module.exports = UserService;
