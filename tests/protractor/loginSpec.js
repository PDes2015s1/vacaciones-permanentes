var utils = require('./utils');
describe('Login', function() {

  beforeEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  it('No se deberia loguearse si el usuario no existe', function() {
    browser.get('http://localhost:3000/#/login');
    element(by.model('user.username')).sendKeys('usuario');
    element(by.model('user.password')).sendKeys('123456');

    element(by.id('loginbtn')).click();

    expect(element(by.id('message')).getText()).
    toEqual('Incorrect username.');
  });

  it('Deberia loguearse', function() {
    utils.userRegistration('josetest', '123456');
    browser.get('http://localhost:3000/#/login');
    element(by.model('user.username')).sendKeys('josetest');
    element(by.model('user.password')).sendKeys('123456');

    element(by.id('loginbtn')).click();

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