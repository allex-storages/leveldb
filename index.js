function createLevelDBStorage(execlib) {
  'use strict';
  return execlib.loadDependencies('client', ['allex:leveldb:lib', 'allex:data:lib', 'allex:leveldbstoragehelpers:lib'], require('./libindex').bind(null, execlib));
}

module.exports = createLevelDBStorage;
