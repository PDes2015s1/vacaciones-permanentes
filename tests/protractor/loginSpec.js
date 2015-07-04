var utils = require('./utils');
describe('Login', function() {

  beforeEach(function() {
    utils.clearAll();
  });

  it('No se deberia loguearse si el usuario no existe', function() {
    utils.login('usuario', '123456');

    expect(element(by.id('message')).getText()).
    toEqual('Incorrect username.');
  });

  it('Deberia loguearse', function() {
    utils.userRegistration('josetest', '123456');
    utils.login('josetest', '123456');

    expect(element(by.id('currentUser')).getText()).
    toEqual('josetest');
  });

  it('No se deberia loguearse sin completar los campos', function() {
    browser.get('http://localhost:3000/#/login');

    element(by.id('loginbtn')).click();

    expect(element(by.id('message')).getText()).
    toEqual('Please fill out all fields');
  });
});