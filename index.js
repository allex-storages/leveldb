function createLevelDBStorage(execlib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    d = q.defer(),
    execSuite = execlib.execSuite,
    libRegistry = execSuite.libRegistry;

  libRegistry.register('allex_bufferlib').then(
    onBufferLib.bind(null, d, execlib)
  );

  return d.promise;
}

function onBufferLib(defer, execlib, bufferlib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    d = q.defer(),
    execSuite = execlib.execSuite,
    libRegistry = execSuite.libRegistry;

  libRegistry.register('allex_leveldblib').then(
    realCreator.bind(null, defer, execlib, bufferlib),
    d.reject.bind(d)
  );
}

function realCreator(defer, execlib, bufferlib, leveldblib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    execSuite = execlib.execSuite,
    dataSuite = execlib.dataSuite,
    AsyncMemoryStorageBase = dataSuite.AsyncMemoryStorageBase,
    Encoding = require('./encodingcreator')(execlib, bufferlib);

  function LevelDBStorage(prophash) {
    if (!prophash.dbname) {
      throw new lib.Error('NO_DBNAME', 'LevelDB propertyhash needs the dbname property');
    }
    this.propertyhash = prophash;
    this.encoding = null;
    AsyncMemoryStorageBase.call(this, prophash);
  }
  lib.inherit(LevelDBStorage, AsyncMemoryStorageBase);
  LevelDBStorage.prototype.destroy = function () {
    AsyncMemoryStorageBase.prototype.destroy.call(this);
    if (this.encoding) {
      this.encoding.destroy();
    }
    this.encoding = null;
    this.propertyhash = null;
  };
  LevelDBStorage.prototype._createData = function () {
    this.encoding = new Encoding(this.__record);
    return new leveldblib.DBArray(lib.extend(this.propertyhash || {}, {
      dbname: this.propertyhash.dbname,
      starteddefer: this.readyDefer,
      dbcreationoptions: {
        keyEncoding: leveldblib.Int32Codec,
        valueEncoding: this.encoding.getCodec()
      }
    }));
  };
  LevelDBStorage.prototype._destroyDataWithElements = function () {
    this.data.destroy();
  };
  LevelDBStorage.prototype._traverseData = function (cb) {
    return this.data.traverse(cb, {keys: false});
  };
  LevelDBStorage.prototype._traverseDataRange = function (cb, start, endexclusive) {
    return this.data.traverse(cb, {gte:start, lt:endexclusive, keys:false});
  };
  LevelDBStorage.prototype._removeDataAtIndex = function (data, index) {
    data.del(index);
  };
  LevelDBStorage.prototype._traverseConditionally = function (cb) {
    this.data.traverseConditionally(cb);
  };

  defer.resolve(LevelDBStorage);
}

module.exports = createLevelDBStorage;
