var co = require('co');
var expect = require('expect.js');
var fs = require('fs');
var Client = require('../');

describe('storage', function () {
  var randomId = (new Date()).getTime();
  var filepath = __dirname + '/figures/sticker.jpg';
  var unexist = __dirname + '/figures/unexist.jpg';
  var client = Client.create('test', 'test1234', 'jackson-test-space');

  var size;
  before(function (done) {
    fs.readFile(filepath, function(err, data) {
      expect(err).to.not.be.ok();
      size = data.length;
      expect(size).to.be.above(0);
      done();
    });
  });

  it('create', function () {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    expect(client).to.be.ok();
    expect(client.oprator).to.be('test');
    expect(client.password).to.be('test1234');
    expect(client.bucket).to.be('jackson-test-space');
  });

  it('setAddress', function () {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    expect(client.uri).to.be('http://v0.api.upyun.com');
    client.setAddress('v1');
    expect(client.uri).to.be('http://v1.api.upyun.com');
    client.setAddress('http://www.baidu.com');
    expect(client.uri).to.be('http://www.baidu.com');
    client.setAddress();
    expect(client.uri).to.be('http://v0.api.upyun.com');
  });

  it('putFile should work', function(done){
    co(function *() {
      var result = yield client.putFile(filepath, '/sticker_' + randomId + '.jpg');
      var res = result[1];
      expect(res.statusCode).to.be(200);
    })(done);
  });

  it('putFile 401', function (done) {
    var client = Client.create('test', 'error_password', 'jackson-test-space');
    co(function *() {
      yield client.putFile(filepath, '/sticker_' + randomId + '.jpg');
    })(function (err) {
      expect(err).to.be.ok();
      expect(err.name).to.be('UpYunError');
      expect(err.code).to.be(401);
      done();
    });
  });

  it('putFile unexist file', function (done) {
    co(function *() {
      try {
        yield client.putFile(unexist, '/sticker_fake_' + randomId + '.jpg');
      } catch (err) {
        expect(err).to.be.ok();
        expect(err.code).to.be('ENOENT');
      }
    })(done);
  });

  it('getFile', function (done) {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    co(function *() {
      var result = yield client.getFile('/sticker_' + randomId + '.jpg');
      var data = result[0];
      expect(data).to.be.a('object');
      expect(data.length).to.be(size);
    })(done);
  });

  it('getFileInfo', function (done) {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    co(function *() {
      var result = yield client.getFileInfo('/sticker_' + randomId + '.jpg');
      var res = result[1];
      expect(res.statusCode).to.be(200);
      var data = result[0];
      expect(data.type).to.be('file');
      expect(data.size).to.be(size);
      expect(data.lastModified).to.be.a(Date);
    })(done);
  });

  it('deleteFile', function (done) {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    co(function *() {
      var result = yield client.deleteFile('/sticker_' + randomId + '.jpg');
      expect(result[1].statusCode).to.be(200);
      var info = yield client.getFileInfo('/sticker_' + randomId + '.jpg');
      expect(info[1].statusCode).to.be(404);
      var data = info[0];
      expect(data.type).to.be('file');
      expect(data.size).to.be(0);
      expect(data.lastModified).to.be.a(Date);
    })(done);
  });

  it('putFolder', function (done) {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    co(function *() {
      var result = yield client.putFolder('/folder_' + randomId);
      expect(result[1].statusCode).to.be(200);
    })(done);
  });

  it('getFolder /folder', function (done) {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    co(function *() {
      var result = yield client.getFolder('/folder_' + randomId);
      expect(result[1].statusCode).to.be(200);
      var data = result[0];
      expect(data).to.be.an(Array);
      expect(data.length).to.be(0);
    })(done);
  });

  it('deleteFolder', function (done) {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    co(function *() {
      var result = yield client.deleteFolder('/folder_' + randomId + '/');
      expect(result[1].statusCode).to.be(200);
      try {
        yield client.getFolder('/folder_' + randomId + '/');
      } catch (err) {
        expect(err).to.be.ok();
        expect(err.name).to.be('UpYunError');
        expect(err.code).to.be(404);
      }
    })(done);
  });

  it('bucketUsage', function (done) {
    var client = Client.create('test', 'test1234', 'jackson-test-space');
    co(function *() {
      var result = yield client.bucketUsage();
      var data = result[0];
      expect(data).to.be.a('number');
      expect(data).to.be.above(0);
    })(done);
  });
});
