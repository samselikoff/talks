We often write acceptance tests in Ember, to test that our app is rendering things correctly. This can be hard, because of asynchrony: user events often trigger asynchronous calls (changing routes, fetching data, etc.). To help with this, Ember comes with an ember-testing package, which basically provides some helpers. If you use the helpers to write your acceptance tests, the ember-testing package will automatically add all asynch calls to a global promise object. This way, you can write tests as if they were synchronous.

Get EAK ([guide](http://iamstef.net/ember-app-kit/guides/getting-started.html)). Download [zip](http://iamstef.net/ember-app-kit/). Make sure you have grunt-cli and bower, then run `npm install`. Fire up `grunt server`, and visit http://0.0.0.0:8000 to see your app, http://0.0.0.0:8000/tests to see tests (note this is not an ember route, omit the. This will auto reload as you work (assuming you have LiveReload chrome extension installed), which is very useful for TDD.

 - If you prefer a CLI, EAK also works with Testem, which similarly auto reloads as you save your code, showing you the result of your tests in a command line.

Some nice side effects: you can add debugger statement, and view your app, use to debug your tests, etc.

So, lots going on here - 9 tests it comes with. What's going on? The first test is named Acceptances - Component - lets check it out. We find it in /tests/acceptance/component_test.js.

We name the module, then create a test. First we `visit` a route - `/component-test`. `visit` is one of our ember-testing helpers - lets us not worry about async. We can visit this route in our normal app, of course: `http://localhost:8000/#/component-test`. We can look at the code that generates this route. We've defined the route in `router.js`, and created the actual route as a module in `/routes/component_test.js`. EAK's resolver is taking care of wiring this up for us.

`/component-test` route returns an array of strings (models). `component-test` template renders the `pretty-color` component for each model, binding `name` attribute to the model - lets take a look. `pretty-color` template renders Pretty Color: {{name}}, which in our case will be the string of the model. Looking at the component code itself, we also have a style binding, which sets the color of the template equal to the name attr.

So, checking the `/#/component-test` route again, we see that's exactly what's happening: each line is styled according to its color. Now, lets go back to the test. We can actually put a breakpoint after we visit the route:

And we can see our route being rendered in the window right there. Pretty cool stuff!

Let's add a feature
-------------------

Alright, now let's try to add a feature of our own. We want to add a route that lets us add our favorite tv shows to a list. Let's create the tests first. We'll make a new test file, `favorite_shows.js`. Now, we can describe our intended behavior via the test. First, in plain English:

	- When we visit /favorite-shows,
		- we should see an input field and an add button
		- we should see an empty list of our favorite tv shows

		- When we input the name of a show and click add,
			- we should see the tv show appear in the list
			- the input box should be blank

Alright - let's create the test suite. First, let's visit the route, and check for the existence of the elements:

```js
test('favorite shows renders', function(){
  expect(4);

  visit('/favorite-shows');

  andThen(function() {
    var input = find('input'),
        button = find('button');

    equal(input.length, 1, 'there is an input field');
    equal(input.text(), '', 'the input field is empty');
    equal(button.length, 1, 'there is a button');
    equal(button.text(), 'Add show', 'the button says "Add show"');
  });
```

Pretty straight forward. Remember that `visit` is a helper from the ember-testing package, and `equal` is an assertion from QUnit. As a refresher, here are all the [ember-testing helpers](http://emberjs.com/guides/testing/integration/):

	- visit(url)
	- find(selector, context)
	- fillIn(input_selector, text)
	- click(selector)
	- keyEvent(selector, type, keyCode)

Notice how the helpers really encourage outside-in testing, forcing you to think about your app from a user's perspective.

Ok, now let's make these tests pass. When we look at our runner, we see that the `/favorite-shows` URL doesn't exist - so let's add it to router.js:

```js
this.route('favorite-shows');
```

Now we see that there is no input field - let's add that. We create a template for our route by adding a file `favorite-shows.hbs` in the /templates folder (again, the EAK resolver takes care of the rest). We add a simple input field, and our first two tests pass. Then we see the third test fails, so we add a button to make it pass. Let's finish this test by checking for the empty list:

```diff
test('favorite shows renders', function(){
+ expect(6);

  visit('/favorite-shows');

  andThen(function() {
    var input = find('input'),
        button = find('button'),
+       list = find('ul'),
+       shows = find('ul li');

    equal(input.length, 1, 'there is an input field');
    equal(input.text(), '', 'the input field is empty');
    equal(button.length, 1, 'there is a button');
    equal(button.text(), 'Add show', 'the button says "Add show"');
+   equal(list.length, 1, 'there is a show list');
+   equal(shows.length, 0, 'there are no shows in the list');
  });
```

There's no list, so we add the ul. Our tests are passing.

Now let's add a second test for our behavior. We'll try out the `fillIn` helper. The `input_selector` argument is just a CSS selector, so we can just use 'input' to find the input. We'll use the debugger to glance at our app, and make sure things are working correctly:

```js
test('user can add a show', function(){
  visit('/favorite-shows');
  fillIn('input', 'The Office');
  debugger;
```

Hmm, we see the input box, but it's not filled in with 'The Office'. What gives?

Remember that some of the ember-testing helpers are async - and in fact, if we [check the guides](http://emberjs.com/guides/testing/integration/#toc_helpers) we see that `fillIn` is an async call. That means that we reach the `debugger` line before `fillIn` has finished - so if we want to check on our app, we need to move the `debugger` to within an `andThen` block. We'll obviously want to do this with our tests as well - good thing we checked!

```js
test('user can add a show', function(){
  visit('/favorite-shows');
  fillIn('input', 'The Office');

  andThen(function() {
	  debugger;
	});
```

Now we can see that the `fillIn` method call worked as expected. Let's write our tests!

```js
test('user can add a show', function(){
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
```

Our first failing test is that there is no show in the list, since we haven't implemented the behavior for the button. First, let's store the name of the show on the controller. We'll switch to an Ember input helper for this. Then, we'll add an action to the button in our template, passing our new show variable:

```js
// favorite-shows.hbs
{{input value=name}}
<button {{action 'addShow'}}>Add show</button>
```

> Note that this point you'd probably want to start unit testing these different pieces of your app, but to keep this simple, I'm going to skip this. Also, we'd want to create something like a `TvShowModel`, but again, we're keeping things simple.

Now, we need to handle this action. We'll do it on this route's controller. First, create the file `favorite_shows.js` in `/controllers`, then add the code:

```js
export default Ember.Controller.extend({

	shows: [],

	actions: {
		'addShow': function() {
			this.shows.pushObject(this.get('name'));
			this.set('name', '');
		}
	}

});
```

We add an array to hold all the shows, and then when the button is clicked, we add the name to the array and clear the name field. But, our test still fails. That's because our `<ul>` isn't iterating over anything! Update our template:

```js
// templates/favorite-shows.hbs
...

<ul>
	{{#each shows}}
		<li></li>
	{{/each}}
</ul>
```

Remember, we want to get the test to pass the easiest way possible. With this code, we pass the first assertion, but the second one fails - the name isn't correct. Easy fix:


```diff
// templates/favorite-shows.hbs
...

<ul>
	{{#each shows}}
+		<li>{{this}}</li>
	{{/each}}
</ul>
```

Woohoo! All tests are passing! Don't forget to visit the app and actually try it out! http://localhost:8000/#/favorite-shows.



Notes for talk
--------------

- create `favorite_shows_test.js`