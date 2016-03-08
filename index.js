#!/usr/bin/env node

var bunyan = require('bunyan');
var log = bunyan.createLogger({ name: "dmit" });

var cli = require('./lib/cli');
var config = require('./lib/config');

config((conf) => {
  var dmit = new cli({
    conf: conf,
    plugins: {
      drivers: { 'virtualbox': require('./lib/plugins/dmit-driver-virtualbox') },
      images: { 'rancher': require('./lib/plugins/dmit-image-rancher') }
    },
    logger: log
  });
});

