var util = require('util');
var cmdln = require('cmdln');
var dm = require('nodedm').dm;
var Share = require('./nfs');
var l = () => {};

var dmit = function(opt) {
  var self = this;
  cmdln.Cmdln.call(self, {
      name: 'dmit',
      desc: 'Tool for interacting with docker-machines'
  });

  self.cfg = opt.conf;
  self.logger = opt.logger;
  self.plugins = opt.plugins;

  self.shares = new Share({
    conf: self.cfg,
    dm: dm,
  //
  });

  l = self.logger;

  cmdln.main(self);

  return self;
}
util.inherits(dmit, cmdln.Cmdln);

module.exports = dmit;

dmit.prototype.do_image = function do_image(subcmd, opts, args, cb) {
  var self = this;

  var images = self.plugins.images ? self.plugins.images : {};

  if('list' in opts) {
    // Print list of available images
    console.log(Object.keys(images).join("\n"));
    return cb();
  }

  if(args.length === 0){
    // Show currently set default image
    var default_image = self.cfg.get('default_image');
    console.log(default_image);
    return cb();
  }
    
  if(args.length === 1){
    // Set current default image
    var default_image = self.cfg.get('default_image');
    var imgs = new Set(Object.keys(images));
    if(imgs.has(args[0])){
      self.cfg.set('default_image', args[0]);
      return self.cfg.save((err) => {
        if(err) return console.log('Unable to save to config file: '+err);
        console.log('Set "' + args[0] + '" as default image.');
        return cb();
      });
    } else {
      console.log('Unknown image "' + args[0] + '", please choose another or install plugin.');
      return cb();
    }

  }
};

dmit.prototype.do_image.help = 'List/Get/Set images for docker-machines';
dmit.prototype.do_image.options = [
  { names: ['list', 'l'], type: 'bool', help: 'List available images' },
];


dmit.prototype.do_driver = function do_driver(subcmd, opts, args, cb) {
  var self = this;
  
  var drivers = self.plugins.drivers ? self.plugins.drivers : {};
  
  if('list' in opts) {
    // Print list of available drivers
    var drivs = Object.keys(drivers);
    return console.log(drivs.sort().join("\n"));
  }

  if(args.length === 0){
    // Show currently set default driver
    var default_driver = self.cfg.get('default_driver');
    console.log(default_driver);
    return cb();
  }
    
  if(args.length === 1){
    // Set current default driver
    var default_driver = self.cfg.get('default_driver');
    var drivs = new Set(Object.keys(drivers));
    if(drivs.has(args[0])){
      self.cfg.set('default_driver', args[0]);
      return self.cfg.save((err) => {
        if(err) return console.log('Unable to save to config file: '+err);
        console.log('Set "' + args[0] + '" as default driver.');
        return cb();
      });
    } else {
      console.log('Unknown driver "' + args[0] + '", please choose another or install plugin.');
      return cb();
    }
  }

}

dmit.prototype.do_driver.help = 'List/Get/Set drivers for docker-machines';
dmit.prototype.do_driver.options = [
  { names: ['list', 'l'], type: 'bool', help: 'List available drivers' }
];


dmit.prototype.do_export = function do_export(subcmd, opts, args, cb) {
  var self = this;
  var exports = self.cfg.get('exports') ? self.cfg.get('exports') : {};

  self.shares.init(() => {

    if('list' in opts) {
      // Print list of available drivers

      return cb();
    }

    if(args.length === 0){
      // Ensure nfs server is running with current values
      //
      console.log('Shared exports are now running');
      return cb();
    }

    if(args.length === 2){
      // Set up export
      return cb();
    }
  });

}
dmit.prototype.do_export.help = 'Configure shared folders'
dmit.prototype.do_export.options = [
  { names: ['list', 'l'], type: 'bool', help: 'List available drivers' },
  { names: ['machine', 'm'], type: 'string', help: 'Set export for specific machine' } 
];


dmit.prototype.do_enter = function do_enter(subcmd, opts, args, cb) {
  var self = this;
  if(args.length === 0) {
    // ?
    console.log('Machine name is required.');
    return cb();
  } else 
  
  if (args.length === 1) {
    // Exec with the correct docker settings
    dm.ls().then((machines) => {
      if((new Set(machines)).has(args[0])){
        execSh(
            'eval "$(docker-machine env ' + args[0] + ')" && ' + process.env.SHELL, 
            {}, 
            function(err) {
              return cb();
            }
        );

      } else {
        console.log('Unknown machine "' + args[0] + '", please try another');
        return cb();
      }
    });
  }
}

dmit.prototype.do_enter.help = 'Gain a shell with docker settings initialized';

dmit.prototype.do_list = function do_list(subcmd, opts, args, cb) {
  var self = this;
  // List available machines
  dm.ls().then((machines) => {
    console.log(machines.sort().join("\n"));
    return cb();
  });
}
dmit.prototype.do_list.help = 'List current docker machines';


dmit.prototype.do_create = function do_create(subcmd, opts, args, cb) {
  var self = this;
  // create stuff
}
