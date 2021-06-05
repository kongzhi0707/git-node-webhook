
const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({ path: '/webhook', secret: 'kongzhi' });

var app = http.createServer(function(req, res) {
  console.log('我进来了11111123334455');
  handler(req, res, function(err) {
    res.statusCode = 404;
    res.end('no location');
  })
});
app.listen(7788, () => {
  console.log('web-hook listen on http://localhost:7788')
})

handler.on('error', function(err) {
  console.log('error', err.message);
});

handler.on('push', function(event) {
  console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref);
  run_cmd('sh', ['./deploy.sh'], function(text) {
    console.log(text);
  })
});

// run_cmd 函数
function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = '';
  child.stdout.on('data', function(buffer) {
    resp += buffer.toString();
  })
  console.log('resp', resp);
  child.stdout.on('end', function() {
    console.log('xxx------');
    callback(resp);
  });
}

