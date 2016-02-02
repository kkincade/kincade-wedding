var plan = require('flightplan');

var appName = 'kincade-wedding';
var username = 'kkincade';
var startFile = 'server.js';

var tmpDir = appName + '-' + new Date().getTime();

// Configuration (add in another server if you have more than one)
plan.target('production', [
  {
    host: '107.170.211.204',
    username: username,
    agent: process.env.SSH_AUTH_SOCK
  }
]);

// Run commands on localhost
plan.local(function(local) {
  // uncomment these if you need to run a build on your machine first
  // local.log('Run build');
  // local.exec('gulp build');

  local.log('Copy files to remote hosts');
  var filesToCopy = local.exec('git ls-files', {silent: true});
  // rsync files to all the destination's hosts
  local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// Run commands on remote hosts (destinations)
plan.remote(function(remote) {
  remote.log('Move folder to root');
  remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: username});
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Install dependencies');

  // npm install
  remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, {user: username});

  // bower install
  remote.sudo('cd ~/' + tmpDir);
  remote.sudo('bower install', {user: username});
  remote.sudo('cd ~');

  remote.log('Reload application');
  remote.sudo('ln -snf ~/' + tmpDir + ' ~/' + appName, { user: username });
  remote.exec('forever stop ~/' + appName + '/' + startFile, { failsafe: true });
  remote.exec('forever start ~/' + appName + '/' + startFile);
});