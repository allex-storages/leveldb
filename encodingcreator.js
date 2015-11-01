function createEncoding (execlib, bufferlib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q;

  function Encoding(record) {
    this.record = record;
    var usernames = bufferlib.jsonSchemaDescriptor2UserNames(this.record.fields);
    this.logic = new (bufferlib.Logic)(usernames, this.fromBuffer.bind(this));
    this.type = usernames.join('.');
    this.result = null;
  }
  Encoding.prototype.destroy = function () {
    this.result = null;
    this.type = null;
    if (this.logic) {
      this.logic.destroy();
    }
    this.logic = null;
    this.record = null;
  };
  Encoding.prototype.getCodec = function () {
    return {
      encode: this._encode.bind(this),
      decode: this._decode.bind(this),
      buffer: true,
      type: this.type
    }
  };
  function valExtractor(val, result, field) {
    result.push(field.valueFor(val[field.name]));
    return result;
  };
  Encoding.prototype._encode = function (val) {
    return this.logic.toBuffer(this.record.fields.reduce(valExtractor.bind(null, val),[]));
  };
  Encoding.prototype._decode = function (buffer) {
    if (!this.logic) {
      return {};
    }
    this.logic.takeBuffer(buffer);
    return this.result;
  };
  function valCombiner(arry, result, field, fieldindex) {
    result[field.name] = arry[fieldindex];
    return result;
  }
  Encoding.prototype.fromBuffer = function (arry) {
    this.result = this.record.filterObject(
      this.record.fields.reduce(valCombiner.bind(null, arry), {})
    );
  };

  return Encoding;
}

module.exports = createEncoding;
