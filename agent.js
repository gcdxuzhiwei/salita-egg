'use strict';

module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    const data = { info: 'agent send msg' };
    agent.messenger.sendToApp('agentAction', data);
  });
};
