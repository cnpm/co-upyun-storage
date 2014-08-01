var thunkify = require('thunkify');
var Client = require('upyun-storage');

exports.create = function (oprator, password, bucket) {
  var client = new Client(oprator, password, bucket);
  var asyncFunctions = ['putFile', 'getFile', 'getFileInfo', 'deleteFile',
    'putFolder', 'getFolder', 'deleteFolder', 'bucketUsage'];
  // thunkify the async function
  asyncFunctions.forEach(function (key) {
    client[key] = thunkify(client[key]);
  });
  return client;
};