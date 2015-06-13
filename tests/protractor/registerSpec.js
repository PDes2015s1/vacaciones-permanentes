describe('Protractor Demo App', function() {

  it('Se deberia registrar correctamente', function() {
    browser.get('http://localhost:3000/#/register');
    element(by.model('user.username')).sendKeys('josetest');
    element(by.model('user.password')).sendKeys('123456');

    element(by.id('registerbtn')).click();

    expect(element(by.id('currentUser')).getText()).
    toEqual('josetest');
  });
});