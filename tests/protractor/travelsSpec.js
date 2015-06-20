var utils = require('./utils');
describe('Travels', function() {


  beforeEach(function() {
    utils.clearAll();
    utils.userRegistration('josetest', '123456');
    utils.login('josetest', '123456');
  });

  it('Deberia crear un travel', function() {
    utils.createTravel('Europa', '2015-06-01', '2015-06-30');
    travels = element.all(by.repeater('travel in travels'));
    expect(travels.count()).toEqual(1);
    expect(travels.first().getText()).toContain('Europa');
  });

  it('No deberia crear un travel sin completar los campos', function() {
    browser.get('http://localhost:3000/#/travels');

    element(by.id('createbtn')).click();
    travels = element.all(by.repeater('travel in travels'));
    expect(travels.count()).toEqual(0);
  });

  it('Al ir a la pagina de un travel deberia verse su detalle', function() {
    utils.createTravel('Europa', '2015-06-01', '2015-06-30');
    element.all(by.repeater('travel in travels')).get(0).
    element(by.linkText('Detalle')).click();
    expect(element(by.id('title-travel')).getText()).toEqual('Viaje Europa');
  });

});