function createLevelDBStorage(execlib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    d = q.defer(),
    execSuite = lib.execSuite,
    libRegistry = execSuite.libRegistry;

  libRegistry.register('allex_leveldblib').then(
    realCreator.bind(execlib, d),
    d.reject.bind(d)
  );

  return d.promise;
}

function realCreator(execlib, defer, leveldblib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    execSuite = execlib.execSuite,
    dataSuite = execlib.dataSuite,
    MemoryStorageBase = dataSuite.MemoryStorageBase;

  function LevelDBStorage(prophash) {
    if (!prophash.dbname) {
      throw new lib.Error('NO_DBNAME', 'LevelDB propertyhash needs the dbname property');
    }
    MemoryStorageBase.call(this, prophash);
    this.propertyhash = prophash;
  }
  lib.inherit(LevelDBStorage, MemoryStorageBase);
  LevelDBStorage.prototype._createData = function () {
    return new leveldblib.DBArray({
      dbname: this.propertyhash.dbname
    });
  };

  defer.resolve(LevelDBStorage);
}

module.exports = createLevelDBStorage;
