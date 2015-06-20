var utils = require('./utils');
describe('Destinations', function() {


  beforeEach(function() {
    utils.clearAll();
    utils.userRegistration('josetest', '123456');
    utils.login('josetest', '123456');
    utils.createTravel('Europa', '2015-06-01', '2015-06-30');
  });
  /*
    it('Deberia crear un destino', function() {
      utils.createDestination('Madrid España', '2015-06-01', '2015-06-30');
      travels = element.all(by.repeater('destination in travel.destinations'));
      expect(travels.count()).toEqual(1);
      expect(travels.first().getText()).toContain('Madrid');
    });
  */
  it('No deberia crear un destino sin completar los campos', function() {
    element.all(by.repeater('travel in travels')).get(0).
    element(by.linkText('Detalle')).click();
    element(by.id('createbtn')).click();
    travels = element.all(by.repeater('destination in travel.destinations'));
    expect(travels.count()).toEqual(0);
  });

});