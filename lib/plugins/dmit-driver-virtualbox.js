

function Driver(opts) {
  var self = this;

  self.dm = opts.dm;

  return self;
}

Driver.prototype.name = 'virtualbox';

Driver.prototype.get_local_addresses = function get_local_addresses(cb) {
  var self = this;

  // This is actually hardcoded in the docker-machine code base
  // so for now we can rely on it!
  // https://github.com/docker/machine/blob/master/drivers/virtualbox/virtualbox.go#L28
  
  return cb([ '192.168.99.1' ]);
};

Driver.prototype.iso_option = '--virtualbox-boot2docker-url';
