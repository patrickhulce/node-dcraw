var chai = require('chai');
var sinon = require('sinon');
chai.should();

chai.use(require('sinon-chai'));

global.relativeRequire = file => require('../lib/' + file);
global.defineTest = (file, func) => {
  describe(file, function () {
    func(require('../lib/' + file));
  });
};
