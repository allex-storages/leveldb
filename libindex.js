function createLevelDBStorage (execlib, leveldblib, datalib, leveldbstoragehelperslib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    MemoryStorageBase = datalib.MemoryStorageBase,
    AsyncStorageMixin = datalib.AsyncStorageMixin,
    LevelDBStorageMixin = leveldbstoragehelperslib.Mixin;

  function LevelDBStorage(prophash) {
    LevelDBStorageMixin.call(this, prophash);
    AsyncStorageMixin.call(this, prophash);
    MemoryStorageBase.call(this, prophash);
  }
  lib.inherit(LevelDBStorage, MemoryStorageBase);
  AsyncStorageMixin.addMethods(LevelDBStorage, MemoryStorageBase);
  LevelDBStorageMixin.addMethods(LevelDBStorage);
  LevelDBStorage.prototype.destroy = function () {
    MemoryStorageBase.prototype.destroy.call(this);
    AsyncStorageMixin.prototype.destroy.call(this);
    LevelDBStorageMixin.prototype.destroy.call(this);
  };
  LevelDBStorage.prototype._createData = function () {
    return new leveldblib.DBArray(this.createEncodingAndReturnPropertyHash(leveldblib.Int32Codec));
  };
  LevelDBStorage.prototype.baseFinalizeUpdateOnItem = function (item, defer) {
    MemoryStorageBase.prototype.finalizeUpdateOnItem.call(this, item, defer);
    return q(true);
  };

  return LevelDBStorage;
}

module.exports = createLevelDBStorage;
