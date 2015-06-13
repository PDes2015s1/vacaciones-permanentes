var utils = require('./utils');
describe('Travels', function() {


  beforeEach(function() {
    utils.clearAll();
    utils.userRegistration('josetest', '123456');
    utils.login('josetest', '123456');
  });

  it('Deberia crear un travel', function() {
    browser.get('http://localhost:3000/#/travels');
    element(by.model('title')).sendKeys('Europa');
    element(by.model('startDate')).sendKeys('2015-06-01');
    element(by.model('endDate')).sendKeys('2015-06-31');

    element(by.id('createbtn')).click();
    travels = element.all(by.repeater('travel in travels'));
    expect(travels.count()).toEqual(1);
    expect(travels.first().getText()).toContain('Europa');
  });

});