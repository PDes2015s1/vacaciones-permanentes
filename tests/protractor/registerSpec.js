describe('Registro', function() {

  beforeEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  it('Se deberia registrar correctamente', function() {
    browser.get('http://localhost:3000/#/register');
    element(by.model('user.username')).sendKeys('josetest');
    element(by.model('user.password')).sendKeys('123456');

    element(by.id('registerbtn')).click();

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