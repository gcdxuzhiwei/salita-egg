/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606564613341_1718';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  config.ejs = {};

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mysql = {
    app: true,
    agent: false,
    client: {
      host: '47.103.217.181',
      port: '3306',
      user: 'xuzhiwei',
      password: 'Xzw1048134347',
      database: 'teach',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
