function storagegetter () {
  return require('..')(execlib);
}
describe('Basic Test', function () {
  loadMochaIntegration('allex_datalib');
  BasicStorageTest(storagegetter, {dbname: 'basictest.db', initiallyemptydb: true});
});
