var App;

module('Acceptances tests - favorite tv shows', {
  setup: function(){
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('favorite shows renders', function(){
  expect(6);

  visit('/favorite-shows');

  andThen(function() {
    var input = find('input'),
        button = find('button'),
        list = find('ul'),
        shows = find('ul li');

    equal(input.length, 1, 'there is an input field');
    equal(input.text(), '', 'the input field is empty');
    equal(button.length, 1, 'there is a button');
    equal(button.text(), 'Add show', 'the button says "Add show"');
    equal(list.length, 1, 'there is a show list');
    equal(shows.length, 0, 'there are no shows in the list');
  });
});

test('user can add a show', function() {
  expect(3);

  visit('/favorite-shows');
  fillIn('input', 'The Office');
  click('button');

  andThen(function() {
    var items = find('ul li'),
        input = find('input');

    equal(items.length, 1, 'the show was added to the list');
    equal(items.text(), 'The Office', 'the show has the correct name');
    equal(input.text(), '', 'the input field was reset');
  });

});