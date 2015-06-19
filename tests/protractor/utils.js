var mongoose = require('mongoose');

function createTravel(title, startDate, endDate){
  browser.get('http://localhost:3000/#/travels');
  element(by.model('title')).sendKeys(title);
  element(by.model('startDate')).sendKeys(startDate);
  element(by.model('endDate')).sendKeys(endDate);

  element(by.id('createbtn')).click();
}

function userRegistration(user, password) {
  browser.get('http://localhost:3000/#/register');
  element(by.model('user.username')).sendKeys(user);
  element(by.model('user.password')).sendKeys(password);

  element(by.id('registerbtn')).click();

  browser.executeScript('window.sessionStorage.clear();');
  browser.executeScript('window.localStorage.clear();');
}

function login(user, password) {
  browser.get('http://localhost:3000/#/login');
  element(by.model('user.username')).sendKeys(user);
  element(by.model('user.password')).sendKeys(password);

  element(by.id('loginbtn')).click();
}

function clearDataBase() {
  mongoose.connect('mongodb://localhost/travelstest', function() {
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
  });
}

function clearLocalStorage() {
  browser.executeScript('window.sessionStorage.clear();');
  browser.executeScript('window.localStorage.clear();');
}

function clearAll() {
  clearDataBase();
  clearLocalStorage();
}


module.exports = {
  userRegistration: userRegistration,
  login: login,
  clearDataBase: clearDataBase,
  clearAll: clearAll,
  createTravel: createTravel
};