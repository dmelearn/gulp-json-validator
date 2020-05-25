var mapStream = require('map-stream');
var PluginError = require('plugin-error');
var validator = require('json-dup-key-validator');

module.exports = gulpJsonValidator;

function gulpJsonValidator(option) {
  var allowDuplicatedKeys = false;
  if (option.allowDuplicatedKeys) {
    allowDuplicatedKeys = !!option.allowDuplicatedKeys;
  }

  var ignoreEmptyFiles = false;
  if (option.ignoreEmptyFiles) {
    ignoreEmptyFiles = !!option.ignoreEmptyFiles;
  }

  return mapStream(function (file, cb) {
    var content = file.contents;
    var error;
    var allowed = true;

    if (ignoreEmptyFiles) {
      allowed = (file.contents.length > 0);
    }

    if (content && allowed) {
      var e = validator.validate(String(content), allowDuplicatedKeys);
      if (e) {
        error = new PluginError('gulp-json-validator', {
          name: 'JSON Validate Error',
          filename: file.path,
          message: e + "\n" + file.path
        });
      }
    }
    cb(error, file);
  });
}
