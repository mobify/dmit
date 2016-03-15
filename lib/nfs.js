
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
        return; // self.update(cb);
      }
      console.log(
          "ERROR: Currently in context for machine '" 
          + self.current_context
          + "' but it is currently not running."
      );
    });
  }
  return cb(null);
}

Share.prototype.update = function update (cb){
  var self = this;

  process.stdout.write("Updating machine for NFS...\t\t");
  async.series([
     ($cb) => { self.write_exports($cb) },
     ($cb) => { self.call_unfsd($cb) }
  ], 
  (err, results) => {
    console.log("OK!");
    cb(err);
  });
}

Share.prototype.call_unfsd = function call_unfsd (cb) {
  var self = this;

  async.each(
    Object.keys(self.current_exports),
    (machine, $cb) => {
      var cmd_path = path.resolve(__dirname, '../unfs/docker-machine-unfs');
 
      var shares = [];
      self.current_exports[machine].forEach((share) => {
        shares.push("--shared-folder=" + share);
      });

      var foo = child_process.spawn(cmd_path, [ machine ].concat(shares), { stdio: 'ignore' });
      foo.on('close', (code) => {
        return $cb(code);
      });
    },
    (err) => {
      if(err) {
        return cb(new Error("Problems occured while trying to start unfs processes: " + err));
      }
      return cb(null);
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
      if(!Array.isArray(current_exports[item.machine])) current_exports[item.machine] = [];
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
        return $cb((status == MachineStatus.RUNNING) ? true : false);
      });

    },
    (results) => {
      results.forEach((machine) => {
        if(!Array.isArray(self.current_exports[machine])) self.current_exports[machine] = [];
        self.current_exports[machine] = current_exports[machine];
        if(for_all.length > 0) self.current_exports[machine].push(for_all);
        return cb(null);
      }); 
    }
  );

}

Share.prototype.add_export = function add_export (opts, cb){
  var self = this;

  var exports = self.cfg.get('exports');
  var share_is_new = true;
  exports.forEach((share) => {
    if(share.machine == opts.machine && share.dest_dir == opts.dest && share.src_dir == opts.src) {
      // XXX - handle this better!
      share_is_new = false;
    }
  });

  if(share_is_new) {
    exports.push({ src_dir: opts.src, dest_dir: opts.dest, machine: opts.machine });
  }

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
