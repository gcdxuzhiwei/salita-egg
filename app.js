'use strict';

module.exports = app => {
  console.log('egg init');
  app.messenger.on('agentAction', data => {
    console.log(data);
  });
};
