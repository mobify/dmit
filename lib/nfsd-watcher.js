var foreground = require('foreground-child');

var cmd = process.argv[2].split(' ');

var chld = foreground(cmd[0], cmd.slice(1), (done) => {
  // we're running unfsd away until we hit here
}); 

// Pass through SIGHUP to the child, so it reloads config
process.on('SIGHUP', () => {
  child.kill('SIGHUP');
});

process.on('SIGINT', () => {
  child.kill();
  process.exit(0);
});
