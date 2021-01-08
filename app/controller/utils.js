'use strict';

const Controller = require('egg').Controller;
// 文件存储
const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');

class UtilsController extends Controller {
  async upload() {
    const parts = this.ctx.multipart({ autoFields: true });
    let stream;
    const img_list = []; // 图片访问地址集合
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      // 文件名为：时间戳+随机字符串+.文件后缀
      const filename = (new Date()).getTime() + Math.random().toString(36).substr(2) + path.extname(stream.filename).toLocaleLowerCase();
      // 上传图片的目录
      const target = './' + filename;
      img_list.push('./' + filename);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
    }
    this.ctx.body = {
      url: img_list,
      fields: parts.field,
    };
  }
}

module.exports = UtilsController;
