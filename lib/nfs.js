
var path = require('path');
var child_process = require('child_process');
var fs = require('fs');
var async = require('async');

var MachineStatus = require('nodedm').MachineStatus;

function Share (opts) {
  var self = this;

  self.cfg = opts.conf;
  self.dm = opts.dm;
  self.current_context = opts.context;

  return self;
}

Share.prototype.init = function init(cb) {
  var self = this;

  if(self.current_context) {
    
    self.dm.status(self.current_context).then((status) => {
      
      if(status === MachineStatus.RUNNING) {
        return self.update(cb);
      }
      console.log(
          "ERROR: Currently in context for machine '" 
          + self.current_context
          + "' but it is currently not running."
      );
      process.exit(1);
      
    });
  }
}

Share.prototype.update = function update (cb){
  var self = this;

  // SIGHUP to unfsd causes it to reload exports, etc.
  async.series([
     ($cb) => { self.write_exports($cb) },
     ($cb) => { self.call_unfsd($cb) }
  ], 
  (err, results) => {
    cb(err);
  });
}

Share.prototype.call_unfsd = function call_unfsd (cb) {
  var self = this;

  async.each(
    Object.keys(self.current_exports),
    (machine, $cb) => {
      var cmd_path = path.resolve(path.join(__dirname, './unfs/docker-machine-unfs'));
      var cmd = cmd_path + " " + machine;
    
      self.current_exports[machine].forEach((share) => {
        cmd += " --shared-folder='" + share + "'";
      });

      child_process.exec(cmd, (err, stdout, stderr) => {
        $cb(err);
      });
    },
    (err) => {
      if(err) {
        return cb(new Error("Problems occured while trying to start unfs processes"));
      }
      return cb();
    }
  );
}

Share.prototype.write_exports = function (cb) {
  var self = this;
  var exports = self.cfg.get('exports');

  var current_exports = {}
  var for_all = [];
  exports.forEach((item) => {
    var share = item.src_dir + ':' + item.dest_dir;
    if('machine' in item) {
      if(typeof(item.machine) != 'array') current_exports = [];
      current_exports[ item.machine ].push(share);
    } else {
      for_all.push(share);
    }
  });

  self.current_exports = {};
  async.filter(
    Object.keys(current_exports),
    (machine, $cb) => {
      self.dm.status(machine).then((status) => {
        $cb(null, ((status === MachineStatus.RUNNING) ? true : false));
      });
    },
    (results) => {
      results.forEach((machine) => {
        if(typeof(self.current_exports[machine]) != 'array') self.current_exports[machine] = [];
        self.current_exports[machine].concat(current_exports[machine]);
        self.current_exports[machine].concat(for_all);
        return cb();
      }); 
    }
  );

}

Share.prototype.add_export = function add_export (opts, cb){
  var self = this;

  var exports = self.cfg.get('exports');
  exports.push({ src_dir: opts.src, dest_dir: opts.dest, machine: opts.machine });

  self.cfg.set('exports', exports);
  self.cfg.save((err) => {
    return self.update((err) => {
      // TODO - Handle errors
      return cb(err);
    });
  });
  
}

Share.prototype.remove_export = function remove_export (opts, cb) {
  var self = this;

  var exports = self.cfg.get('exports');
  // TODO - Handle removing exports
  console.log("Not yet supported. Sorry");
  return cb(new Error('TODO'));
}

module.exports = Share;
