'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
// had enabled by egg
// static: {
//   enable: true,
// }
// };

const path = require('path');

exports.info = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-info'),
};
