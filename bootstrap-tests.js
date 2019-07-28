
// Dojo Config
dojoConfig = {
    packages: [{
              name: 'app',
              location: 'app/'
    },{
              name: 'spec',
              location: 'spec/'
    }],
    isDebug: false,
    parseOnLoad: true
  };

// Require in specs
  require([
    'spec/base/proxyBase.specs', 
    'dojo/domReady!'], function () {

  });