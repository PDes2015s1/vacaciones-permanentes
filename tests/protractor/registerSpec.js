var utils = require('./utils');
describe('Registro', function() {

  beforeEach(function() {
    utils.clearAll();
  });

  it('Se deberia registrar correctamente', function() {
    utils.userRegistration('josetest', '123456');

    expect(element(by.id('currentUser')).getText()).
    toEqual('josetest');
  });

  it('No se deberia registrar sin completar los campos', function() {
    browser.get('http://localhost:3000/#/register');

    element(by.id('registerbtn')).click();

    expect(element(by.id('message')).getText()).
    toEqual('Please fill out all fields');
  });
});