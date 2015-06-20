describe('Index', function() {
  it('Deberia tenes un titulo', function() {
    browser.get('http://localhost:3000/');

    expect(browser.getTitle()).toEqual('Vacaciones permanentes');
  });
});