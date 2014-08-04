co-upyun-storage(upyun-storage的co版本)
======================================

## Requirements
请使用node v0.11.3以上的版本，并且打开`--harmony`开关。

## Installation

```bash
$ npm install co-upyun-storage
```

## Usage

```
co(function *() {
  var client = Client.create('test', 'test1234', 'jackson-test-space');
  var result = yield client.deleteFile('/sticker.jpg');
  var info = yield client.getFileInfo('/sticker.jpg');
})(done);
```

## License

The MIT License
