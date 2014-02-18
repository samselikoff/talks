var App;

module('Acceptances - sam', {
  setup: function(){
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('sam renders', function(){
  expect(1);

  visit('/sam');

  andThen(function(){
    var heading = find('h1');
    equal(heading.text(), 'that hansel is so hot right now');
  });

});
