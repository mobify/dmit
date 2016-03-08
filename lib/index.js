
var cmdln = require('cmdln');

var dmit = function() {
    cmdln.Cmdln.call(this, {
        name: 'dmit',
        desc: 'Tool for interacting with docker-machines'
    });
}
util.inherits(Conan, cmdln.Cmdln);

dmit.prototype.do_image = function do_image(subcmd, opts, args, cb) {
  if('list' in opts) {
    // Print list of available images
  }
  if(args.length === 0){
    // Show currently set default image
  } else if(args.length === 1){
    // Set current default image
  }
};

dmit.prototype.do_image.options = [
  { names: ['list', 'l'], type: 'bool', help: 'List available images' },
];


dmit.prototype.do_driver = function do_driver(subcmd, opts, args, cb) {
  if('list' in opts) {
    // Print list of available drivers
  }
  if(args.length === 0){
    // Show currently set default driver
  } else if(args.length === 1){
    // Set current default driver
  }

}

dmit.prototype.do_driver.options = [
  { names: ['list', 'l'], type: 'bool', help: 'List available drivers' }
];


dmit.prototype.do_export = function do_export(subcmd, opts, args, cb) {
  if('list' in opts) {
    // Print list of available drivers
  }
  if(args.length === 2){
    // Set up export
  }

}

dmit.prototype.do_export.options = [
  { names: ['list', 'l'], type: 'bool', help: 'List available drivers' }
];


dmit.prototype.do_enter = function do_enter(subcmd, opts, args, cb) {
  if(args.length === 0) {
    // ?
  } else if (args.length === 1) {
    // Exec with the correct docker settings
  }
}


dmit.prototype.do_list = function do_list(subcmd, opts, args, cb) {
  // List available machines
}


dmit.prototype.do_create = function do_create(subcmd, opts, args, cb) {
  // create stuff
}
