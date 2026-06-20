const React = require('react');
const { View } = require('react-native');
module.exports = function SvgMock() {
  return React.createElement(View);
};
module.exports.default = module.exports;
