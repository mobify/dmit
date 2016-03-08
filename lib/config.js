var AppDirectory = require('appdirectory')
var dirs = new AppDirectory('dmit')
var mkdirp = require('mkdirp');
var fs = require('fs');
var nconf = require('nconf');
var async = require('async');

function run_config (cb) {
  async.series([
    // Setup base configuration folder if not alreasy there
    (callback) => {
      fs.stat(dirs.userConfig(), (err, stats) => {
        if(err || !stats.isDirectory()){
          if(err) callback(new Error('Unable to find configuration folder'));
          mkdirp(dirs.userConfig(), (err) => {
            if(err) callback(new Error('Unable to create configuration folder'));
            callback(null);
          });
        } else {
          callback(null);
        }
      });
    },

    (callback) => {
      nconf
          .env({ match: /^DMIT_/ })
          .file({ 
            file: dirs.userConfig() + '/dmit.conf',
            format: require('nconf-toml')
          })
          .defaults({
            default_image: 'rancher',
            default_driver: 'virtualbox',
            exports: [],
            user_dir: dirs.userConfig(),
          });

      nconf.load(() => {
        callback(null);
      });

    }
  ],
  (err) => {
    // XXX: handle errors with loading config, etc.
    
    cb(nconf);
  });
}

module.exports = run_config; 
