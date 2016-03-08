
var which = require('which');
var path = require('path');
var child_process = require('child_process');
var fs = require('fs');
var async = require('async');

var unfsd_path;

try {
  unfsd_path = which.sync('unfsd');
} catch (e) {
  console.log('Unable to locate "unfsd" executable, ensure it is installed and in PATH');
  process.exit(1);
}

function Share (opts) {
  var self = this;

	self.cfg = opts.conf;
  self.dm = opts.dm;
  self.driver = opts.driver;
  self.exports_path = path.join(self.cfg.get('user_dir'), 'exports');
  self.pidfile_path = path.join(self.cfg.get('user_dir'), 'unfsd.pid');

  self.unfs3_version = child_process.execSync(
    unfsd_path + " -h | head -n 1 | awk '{print $3}'",
    { shell: process.env.SHELL }
  );

  return self;
};

Share.prototype.init = function init(cb) {
  var self = this;

  var next = '';

  async.waterfall([
    
    ($cb) => {
      fs.readFile(self.pidfile_path, (err, pid) => {
        if(!pid){
          next = 'start_daemon';
          return $cb(null, next);
        }

        // The file doesn't exist or is otherwise unreadable
        if(err) next = 'start_daemon';

        // The file exists, but there's nothing in it.
        if(!err && !pid) next = 'start_daemon';

        // The file exists and we have a pid
        if(pid !== undefined && process.kill(pid, 0)) {
          try {
            process.kill(pid, 0);
          } catch(e) {
            next = 'start_daemon';
            return $cb(null, next);
          }

          next = 'is_running';
          self.peer_pid = pid;
          return $cb(null, next);
        }

        return $cb('huh');
      });
    },

    (result, $cb) => {
      console.log('======> ' + result);
      if(result == 'start_daemon') {
        return self.start((err) => {
          // TODO - Handle errors
          return $cb(err);
        });

      } else if (result == 'is_running') {
        self.update((err) => {
          // TODO - Handle errors
          $cb(err);
        });
      } else {
        return $cb(new Error("Unable to init, daemon status unknown"));
      }
    }
  ],

  (err) => {
    // TODO - Handle errors
    return self.update(cb);
  });
}

Share.prototype.start = function start (cb) {
  var self = this;

  // Highly unlikely, but a reasonable assert
  if(process.pid == self.peer_pid) {
    process.exit(1);
  }

  // Start the daemon if not already started
  //self.driver.get_local_addresses((host_ips) => {
    var cmd = [
      unfsd_path, 
      '-u', '-d', '-t', // unprivileged, non-daemon, tcp only 
      '-e ' + self.exports_path,
      '-i ' + self.pid_file,
      // We want to limit our share interaction to docker-machines only
      // so the driver needs to tell us the proper interface/addr
      // to listen on
      //'-l ' + host_ip[0] // XXX - this should be changed when other drivers appear
      '-l ' + '192.168.99.1' // XXX - this should be changed when other drivers appear
    ];

    var child = child_process.fork(
      './nfsd-watcher',
      [ cmd.join(' ') ],
      {
        detached: true,
        silent: true
      }
    );

    self.peer_pid = child.pid;
    child.unref();
    cb(null);
  //});
}


Share.prototype.refresh = function refresh (cb) {
  var self = this;
  //process.kill(self.peer_pid, 'SIGHUP');
  cb(null);
}

Share.prototype.update = function update (cb){
  var self = this;

  // SIGHUP to unfsd causes it to reload exports, etc.
  async.series([
     (callback) => { self.write_exports(callback) },
  ], 
  (err, results) => {
    // TODO - Handle errors
    self.refresh(() => {
      cb(err);
    });

  });
}

Share.prototype.write_exports = function (cb) {
  var self = this;

  var exports = self.cfg.get('exports');
  var data;

  self.dm.ipAll().then((ip_map) => {
    var mount_map = {};
    exports.forEach((item) => {
      if(!mount_map[item.src_dir]) mount_map[item.src_dir] = [];
      mount_map[item.src_dir].push(item)
    });

    var data = '';
    Object.keys(mount_map).forEach((src_item) => {
      data += '"' + src_item + '"';
      mount_map[src_item].forEach((entry) => {
        data += ' ';
        if(entry.machine) {
          data += ip_map[ entry.machine ] + '/32'
        }
        data += "(rw)"
      });
      data += "\n";
    });

    fs.writeFile(self.exports_path, data, (err) => {
      // TODO - Handle errors
      return cb(err);
    });
  });
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
