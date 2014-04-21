Using D3 with Backbone, Angular and Ember
=========================================

Intro
-----
JavaScript applications are becoming more and more complex. This complexity has spawned numerous application frameworks, like Backbone, Angular and Ember. Fundamentally, these frameworks attempt to address a similar problem: in nontrivial applications, architectural mistakes are costly.

Every application has an architecture, even if it's not explicit. The goal of a framework is to enforce good architectural decisions within your application. For example, within the context of a complex application, most would agree that the following code

  [jquery api call]

is an architectural mess, as it has a mixture of concerns:

  - Network I/O
  - Handing user events
  - Manipulating application state data
  - Templating

Of course, your code may not look like this, even if you're not using a framework; but the point is, frameworks try to make it hard to write code this poorly structured.

For example, in the above code we query the DOM to get some data about our user. Backbone makes it easy to keep this sort of model data in a separate layer, which is more scalable: you have a single source of truth for your model data, and you can ask that source whenever you need that data, instead of querying the DOM, which is fragile, could be in multiple places, depends on HTML/CSS implementation, etc.

And in Angular, we can use a directive to provide the template for our success handler, instead of writing it directly in our Javascript. It keeps the template's concerns apart from the data, and forces us to come up with an API for exactly what data our template needs to display.

If variations of the above code were replacated throughout our program, we may run into race conditions, where certain dependencies complete in unpredictable ways. The Ember run loop provides a mechanism for taking control of these situations.

In short, all three frameworks provide solutions to common problems that arise in building complex Javascript applications.


### The costs and benefits of frameworks

In web development, as in most areas in life, there ain't no such thing as a free lunch. Using a framework comes with a cost: primarily, learning the specific abstractions of the framework.

These abstractions take time, both because you have to learn to 'think' in terms of them, and because you need to learn a new syntax for them. And this investment is nontrivial: it can take a long time to learn how to use a framework effectively.

Still, a growing number of people seem to be convinced that frameworks are proving their worth. The benefits that frameworks provide - when used appropriately, and for the correct problems - seem to be worth it. These benefits include consistency, organization, collaborative solutions to problems, code reuse, less time spent on trivial decision-making, and others.

Once we get "on board" with a framework, we start to think of certain pieces of our app in terms of the framework. Depending on the surface area of the framework, the amount of pieces in your app like this varies. But, for example, if we use a framework that provides a "router", we think of how our application moves through routes in terms of this particular object. It's not like we're ignoring everything we know about software, or putting aside our specific domain; but we definitely adopt architectural suggestions and learn to think "in terms of the framework."


### Where does D3 come in?

So how does D3 fit into all this? Well, visualizations have recently become more prominent in web applications. Companies like Square, Chart.io, Localytics, and Plotly feature visualizations as some of the main features of their web applications.

This means the code related to visualizations is also becoming larger, and more complex. But building interactive data visualizations in web applications is a relatively new phenomeon, and there's a lot we're still discovering. Because of this, it's easy for developers to think of the visualizations in their application as completely separate from all the other 'standard' pieces.

Also, examples from D3's community tend to be one-off, isolated. This is great for understanding and sharing code, but when it comes time to incorporate modularly into your bigger app, this isn't super helpful. Similarly, D3 code tends to be procedural, which also makes it difficult to incorporate into our applications, which tend to be object-oriented. The examples tend to be a set of instructions to produce a particular visualization, rather than an object with an interface, etc. There is [some work](/chart) in this area, but again, the majority of examples don't implement this.

For all these reasons, it's easy for developers to write their data vis code separately, outside of the idioms of the framework - or more generally, your application's architecture. But this leads to the same problems that we saw at the beginning. It's just as easy to write highly coupled code that mixes concerns for data vis as it is for standard components.


### How coupled will my D3 code be?

Before I get too far, I don't want you to misunderstand me. I am not suggesting that you intersperse your D3 code among the various framework pieces. In fact, before starting a project with a framework you probably have already written a lot of d3 code; at the least, you have access to a lot of community code out there. There's no reason for you to rip it apart and meld it to your framework. That would make all your hard work on d3 not usable outside of that framework. This is probably a bad idea.

Instead, what I'm saying is this:

 - When working on a large application using a modern framework, your'e building an object-oriented system. It's important to think of your D3 code in the same way, too.
 - Each framework has its own architecture. Think in terms of that architecture, and fit your D3 objects into that system
 - Embracing the framework's idioms will open up new possibilities for your d3 code


### Thesis

The thesis of this talk is essentially this: in applications where you're using a framework, and where d3 code is prominent, you should treat your D3 code as first-class, and embrace the framework's idioms. We want to do this for the same reasons we do it with the rest of our Javascript code:

  - Improves organization, reuse and testability
  - Gives us unique and powerful ways to use our visualizations
  - Collaboration (share Ember components, Angular directives, etc.)
  - and more

Admittedly this is a young game. Patterns around both D3 and more generally large Javascript applications are still emerging. But we have learned some things about developing web applications in recent years, and it's important that we incorporate these lessons into our D3 code as well.

Now, there are a lot of frameworks out there, but we're going to focus on three: Backbone, Angular and Ember. We do this both because of their popularity, and because the goals of the three frameworks are different enough that we'll be able to illustrate how to use D3 in different contexts.

In all three frameworks, D3 code has most to do with the view layer of MVC.

For the rest of this talk, we're actually going to build up a chart that we can use with all three frameworks. We're going to see how each framework shapes our thinking about the chart as an object. It will influence the public api that we give the chart. Finally we'll see how to use the chart in each framework.


Object-orientizing our chart
----------------------------
Let's say that we work for some company, and we want to help our CEO understand how his revenues are distrubted across his clients. We check out the D3 examples page, and the bubble chart catches our eye. We decide to make a bubble chart that encodes client revenues in terms of area. That should give the business team an easy way to understand the revenue distribution.

So we come across [this bubble chart example](http://bl.ocks.org/mbostock/4063269), and pull down the source:

  [something]

50 lines of code, not bad at all. Let's also pull down the data, and make sure we can get it running locally. It works! Let's change the data with some data that will be more like what we give it.

Looking at the original, we have something like

```js
{
 "name": "flare",
 "children": [
  {
   "name": "analytics",
   "children": [
    {
     "name": "cluster",
     "children": [
      {"name": "AgglomerativeCluster", "size": 3938},
      {"name": "CommunityStructure", "size": 3812},
      {"name": "HierarchicalCluster", "size": 6714},
      {"name": "MergeEdge", "size": 743}
     ]
    },
    ...
```

It's a big nested tree. For our purposes, we aren't worried about the hierarchy. Here's what our data looks like:

```
{
 "name": "companies",
 "children": [
  {"name": "Wayne Enterprises", "size": 3938},
  {"name": "Stark Enterprises", "size": 3812},
  {"name": "Acme Corp", "size": 6714},
  {"name": "Dunder Mifflin", "size": 743}
 ]
}
```

So, we've got a working chart. But like we said earlier, we don't want to just copy and paste this code wherever we need it. That's not how we'll be writing the rest of our Javascript code, so that's not how we'll write our D3 code. Instead, we'll make an object.

There are a few ways we can do this. Two common patterns in Javascript are prototypes and closures. Prototypes give us shared static methods, an easy way to add methods to our main object. Closures require more memory but give us private variables, and also prevent us from having to manage the context of `this`. We'll go with the latter, as it happens to be the pattern that D3 itself uses. You can read more about it here: [www.bost.ocks.org/mike/chart].

<aside>
There is a library called [d3.chart] that was created to make building reusable, object-oriented charts easier. Be sure to check it out as an alternative to hand-rolling your own. Everything we talk about here also applies to charts made with `d3.chart`.
</aside>

After some wrangling, we end up with a chart class:

  [code wrangling]

In this case, the inner `chart` function is our closure; it takes care of creating the chart, using the configuration variables at the top of the bubbleChart function. We've also created getter/setters for the configuration variables, which act similar to jQUery methods: invoke with no argument, and you'll get the current property. Pass in a value, and you'll set the property. Subsequent calls to `chart()` will rerender the chart using the new config values.

Now we have a chart class! Use it like this:

```js
var data = [get_some_data]

var chart = bubbleChart()
  .margin({top: 0, right: 20, bottom: 0, left: 20});
d3.select('body')
  .datum(root)
  .call(chart);
```

The getter/setters are our chart's interface; its public API. It's how we'll hook up with the primitives in our frameworks.


Backbone
--------

Of these three frameworks, Backbone is the most lightweight. While not offering as many opinions as some of the other frameworks in the Javascript landscape, Backbone certainly has its idioms. At its heart, it provides you with a model layer to store your data, and an event system to tie your data to the DOM. To see how it works, let's look at a simple example.

### Simple view

Say we have a list of companies, similar to the data we used for the bubble chart:

```js
[
  {name: "Wayne Enterprises", revenue: 3938, cost: 1423},
  {name: "Stark Enterprises", revenue: 3812, cost: 823},
  {name: "Acme Corp", revenue: 6714, 2990},
  {name: "Dunder Mifflin", revenue: 743, 1304}
]
```

In Backbone, we store arrays of objects in `collections`. It's as simple as:

```js
var companies = new Backbone.Collection([
  {name: "Wayne Enterprises", revenue: 3938, cost: 1423},
  {name: "Stark Enterprises", revenue: 3812, cost: 823},
  {name: "Acme Corp", revenue: 6714, cost: 2990},
  {name: "Dunder Mifflin", revenue: 743, cost: 1304}
]);
```

This returns a new collection, which contains an array of `Backbone.Model` objects. The model objects themselves implement the default behavior. We can redefine them ourselves as we need custom behavior; for instance, to add a `.profit()` method that calculates the profit (revenue minus cost). For now, the default will do.

Now, we want to display these companies on the screen. In Backbone, as in the other two libraries, you typically want to break down your GUI into isolated chunks, and use a single View object to represent each chunk. In this case, we're going to render a list of companies somewhere (say, in a `<ul>` element). So that corresponds to a chunk of UI, and we'll make a `CompaniesView` for it.

The view will render our `companies` collection, and update itself if the collection changes:

```js
var CompaniesView = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.collection, "change add remove", this.render);
    this.render();
  },

  template: _.template(
    '<ul><% _.each(companies, function(company) { %> <li><strong><%= company.name %></strong>: revenue: <%= company.revenue %>, cost: <%= company.cost %></li> <% }); %></ul>'
  ),

  render: function() {
    // this.$el.html(this.template(this.model.attributes));
    this.$el.html(this.template({
      companies: this.collection.toJSON()
    }));

    return this;
  }

});
```

On init, we set up a listener to rerender when the view's collection's changes, and kick off an initial render. Next, look at the render function. This sets the `html` of the view's DOM element. The way it does this is by rendering an underscore template, and passing in the companies data. So this is the core idea: the template is being rendered with the collection as its context.

The template itself is simple:

```html
<ul>
  <% _.each(companies, function(company) { %>
    <li><strong><%= company.name %></strong>: revenue: <%= company.revenue %>, cost: <%= company.cost %></li>
  <% }); %>
</ul>
```

This is in a string right now, but as they get more complex, you typically save them in a separate file.

Now, this is just a class definition. We just need to actually instantiate the view, pass in its collection, and give it a DOM element to render in:

```js
var list = new CompaniesView({
  el: '.company-list',
  collection: companies
});
```

There, we can see the list has been rendered. Now, let's see it update in response to changing data.

The `companies` collection is a global object, so just change one of the properties in the console:

```js
companies.at(3).set('name', "Dwight's Beet Farms");
companies.at(3).destroy()
```

and you'll see the DOM updates automatically.

So, this is the idea, how you tie Backbone views to the data. Now, let's see how to do it with D3.


### D3 view

In our OOP chart from above, we feed our chart some data then call `chart()` to render our chart. So, when thinking about incorporating our chart into our Backbone application, we need to think of these pieces: 

  - Where should the data come from?
  - When should we call render?

For the first question, the natural place is our Backbone collections. Typically we'll have something already - like our `companies` collection from above. Our collections will usually have more data than what our chart needs. In this case, each company has both revenue and cost, but we just show one dimension in our bubble chart. So we can add a `chartData` method to our backbone collection, where we do the data manipulation, to return what our chart needs:

```diff
- var companies = new Backbone.Collection([
-   {name: "Wayne Enterprises", revenue: 3938, cost: 1423},
-   {name: "Stark Enterprises", revenue: 3812, cost: 823},
-   {name: "Acme Corp", revenue: 6714, cost: 2990},
-   {name: "Dunder Mifflin", revenue: 743, cost: 1304}
- ]);

+ var CompanyCollection = Backbone.Collection.extend({
+   chartData: function() {
+     return {
+       name: 'compaines',
+       children: this.map(function(c) { 
+         return {name: c.get('name'), size: c.get('revenue')};
+       })
+     }
+   }
+ });
+ 
+ var companies = new CompanyCollection([
+   {name: "Wayne Enterprises", revenue: 3938, cost: 1423},
+   {name: "Stark Enterprises", revenue: 3812, cost: 823},
+   {name: "Acme Corp", revenue: 6714, cost: 2990},
+   {name: "Dunder Mifflin", revenue: 743, cost: 1304}
+ ]);
```

So, one thing to point out here. Note that we're using this method to massage the data into the correct format. We could have also extended our chart to accept different formats of data, or made data accessors available on our chart which the user could customize; so in this case, we'd pass in our normal data, but then when instantiating the chart we'd specify the accessors (for example, use 'revenue' instead of 'size'). These issues turn out to be pretty nontrivial and it takes some work to get them right. Typically in smaller cases it's fine to do them anywhere blah blah blah.

Now we have the data, we need the chart view object itself.

```js
var BubbleChartView = Backbone.View.extend({

  chart: d3.charts.bubble(),

  initialize: function() {
    this.listenTo(this.collection, "change add remove", this.render);

    this.render();
  },

  render: function() {
    d3.select(this.el)
      .datum(this.collection.chartData())
      .call(this.chart);

    return this;
  }

});
```

We create an instance of our OOP reusable chart object, and store it on the chart property of our Backbone view. Our init function is the same as the last view: listen to changes in the collection, and kick off an initial render. The render function itself selects the view's base element with d3, binds the collections data (that we get from chartData function), and calls the chart.

It worked! Now, change the collection again, and watch the chart respond:

```js
companies.at(2).set('revenue', 1000);
companies.at(0).destroy()
```

Looking good.

### Some things to consider

Note that there are many unanswered questions:

 - **View cleanup.** Who's responsible for instantiating/destroying the View instances? This is more complicated than it seems, since there could be [dangling event listeners].
 - **View hierarchy.**
 - **Lazy rendering.**

View managements can get hairy with d3 views, as some approaches you would take with more standard views won't work with d3. For example, in our examples we added a call to render on init, so the view rendered itself as soon as it was instantiated. In our example, we also passed it an existing dom element, so it rendered directly to the DOM. But another approach is to manually append the view to the DOM. One way to do this is for some other object ot instnatiate the view, call render, populating the views .el property with the rendered template, adn then appending that `el` to the document. For this to work, the html is created in memory. In d3, we can't do this. D3 needs a dom element that exists in the live DOM in order to render. So, if your application is doing something like this, you'll have to rethink it a bit. You could have `render` simplay append a blank div with a class, and then have another method `renderChart` that actually renders the chart - though now your managing object would have to know this, too.


Angular
-------

<aside>Don't need jQuery, but we're using it for better selections</aside>

Angular sits at the intersection of the three frameworks. Whereas Backbone provides more of a skeleton to help you store your data outside of the DOM, Angular comes with additional powerful abstractions, and a data binding layer. Most relevant for our purposes are directives.

Directives are similar in purpose to Backbone views: they are designed to encapsulate a chunk of your GUI. The main difference is that instead of manually being responsible for instantiating a view and rendering it to a particular element in the DOM, you use the template layer itself to insert directives. Let's look at a simple example.

### Simple view

To render data to our DOM, we first need somewhere to store the data. In Backbone, we created a collection to store our data. In Angular, there aren't any special objects that represent models or arrays of models; we just use plain on Javascript arrays and objects. However, to make the data available to our template, we use controllers.

We can make a controller for our companies like this:

```js
angular.module('d3-demo', [])

  .controller('CompaniesCtrl', ['$scope', function($scope) {

    $scope.companies = [
      {name: "Wayne Enterprises", revenue: 3938, cost: 1423},
      {name: "Stark Enterprises", revenue: 3812, cost: 823},
      {name: "Acme Corp", revenue: 6714, cost: 2990},
      {name: "Dunder Mifflin", revenue: 743, cost: 1304}
    ];

  }]);
```

Here we're specifying `$scope` as a dependency. Scope in Angular is like a ViewModel or Presenter, if you're familiar with those patterns. We simply attach our array of companies to the scope, and that data becomes available to the template.

Now, in our template we can initiate an Angular app, and designate which portion of DOM our `CompaniesCtrl` will manage:

```html
<body ng-app="d3-demo">
  <div ng-controller="CompaniesCtrl">
  </div>
</body>
```

Template syntax in Angular uses {{. Let's create a list of our companies:

```html
<body ng-app="d3-demo">
  <div ng-controller="CompaniesCtrl">
    <div ng-repeat="c in companies">
      <h3>{{company.name}}</h3><p>The revenue was {{company.revenue}}</p>
    </div>
  </div>
</body>
```

We use `ng-repeat` to iterate through our companies, similar to how we used `_.each` in Backbone.

<!-- We have the `select` method, which we can use to make a company's isActive property true. We want this to occur whenever a user clicks on a company. To do that, it's simple:

```html
<body ng-app>
  <div id="demo" ng-controller="CompaniesCtrl">
    <ul>
      <li ng-repeat="c in companies" ng-click="select(c)">
        <strong>{{c.name}}</strong>: revenue: {{c.revenue}}, cost: {{c.cost}}, selected: {{c.isActive}}
      </li>
    </ul>
  </div>
</body>
```

We can see that `isActive` starts out undefined, and then toggles between true and false whenever the user clicks a company. Now, let's have the class on the company's `<li>` element correspond to whether it's active or not:

```diff
<body ng-app>
  <div id="demo" ng-controller="CompaniesCtrl">
    <ul>
+     <li ng-repeat="c in companies" ng-click="select(c)" ng-class="{active: c.isActive}">
        <strong>{{c.name}}</strong>: revenue: {{c.revenue}}, cost: {{c.cost}}, selected: {{c.isActive}}
      </li>
    </ul>
  </div>
</body>
```

The `ng-class` expression tells Angular to add the "active" class if c.isActive evaluates to true. After adding some CSS, we can now see the effect being toggled. So this is how we can bind classes to our model properties, and add interaction to our templates. Notice that every time we use any of htese variables in our template, we're referencing the same underlying data on our scope. This way, we don't have to worry about keeping different portions of our UI in sync. The data binding takes care of making sure each chunk of UI is subscribed to the correct events on each model and collection, like we did in Backbone.
 -->

Now, let's add a filter to our list. This turns out to be rather simple. The `ng-repeat` tag, which we used to iterate over our list, allows Unix-style piping. For example, if we add the following filter

```html
...
  <div ng-repeat="c in companies | filter:'Enterprise'">
...
```

we'll only see companies who have "Enterprise somewhere in their properties.

Instead of hard-coding the filter in, let's add a search box. We'll bind the text of the search box to a new model on our scope, and use that as our filter:

```diff
<body ng-app="d3-demo">
  <div ng-controller="CompaniesCtrl">
+   <input type="text" ng-model="query">

+   <div ng-repeat="c in companies | filter:query">
      <h3>{{company.name}}</h3><p>The revenue was {{company.revenue}}</p>
    </div>
  </div>
</body>
```

If you try it, you'll see everything is working. `ng-model` let us bind the value of the text input to the `query` model, which we then use to filter our companies. Pretty handy stuff!

Finally, let's add a control to let the user toggle between revenue and cost. Just like with the filter, we'll add a new model to store the data (whether the revenue or cost is being shown):

```diff
<body ng-app="d3-demo">
  <div ng-controller="CompaniesCtrl">
    <input type="text" ng-model="query">
+   <form>
+     <input type="radio" ng-model="selectedItem" value="revenue">Revenue
+     <input type="radio" ng-model="selectedItem" value="cost">Cost
+   </form> 

    <div ng-repeat="c in companies | filter:query">
      <h3>{{company.name}}</h3><p>The revenue was {{company.revenue}}</p>
    </div>
  </div>
</body>
```

Since we've bound both radio buttons to `selectedItem`, Angular will automatically set the value of `selectedItem` to whichever radio button is toggled.

We can now use this property in our template:

```diff
<body ng-app="d3-demo">
  <div ng-controller="CompaniesCtrl">
    <input type="text" ng-model="query">
    <form>
      <input type="radio" ng-model="selectedItem" value="revenue">Revenue
      <input type="radio" ng-model="selectedItem" value="cost">Cost
    </form> 

    <div ng-repeat="c in companies | filter:query">
+     <h3>{{c.name}}</h3><p>The {{selectedItem}} was {{c[selectedItem]}}</p>
    </div>
  </div>
</body>
```

It turns out that `ng-controller`, `ng-repeat` and `ng-model` are all Angular directives. We'll now make our own custom directive that will let us separate out our display of company info.


### A basic directive

Directives in Angular let you make custom elements. They encapsulate portions of your GUI, both look and behavior. In our example above, we repeated a chunk of HTML for each of our companies. This seems like a great candidate for a directive - let's call it the "CompanyInfo" directive.

To define our directive, use the `.directive` function. The entire directive is pretty small, so let's look at it first, then explain each piece:

```javascript
angular.module('d3-demo', [])

  .controller('CompaniesCtrl', ['$scope', function($scope) {
    ...
  })

  .directive('companyInfo', function() {
    return {
      restrict: 'E',
      template: '<h3>{{company.name}}</h3><p>The {{selectedItem}} was {{company[selectedItem]}}</p>',
      scope: {
        company: '=',
        selectedItem: '='
      }
    };
  })
```

Our directive function simply returns an object with some properties. Sometimes there's more work to do, but for this simple directive, this is all we need. Angular converts camelCased names to hyphenated names for rendering, so we'd use this directive like this:

```html
<company-info></company-info>
```

When creating directives, we first decide if we want to use the directive as an element (like a <div> or <p>), or an attribute (such as the checked attribute in a checkbox input, <input checked />). We want to use this directive as an element, so we set the `restrict` property to E, for element.

<aside>Directives can also be comments or classes, but you should generally stick to elements and attributes.</aside>

The `template` property is just what it sounds like: it's the template for our directive, the DOM that will replace it when we use it in our HTML. Here, we simply have added what used to be in between the `ng-repeat` part of our HTML.

The final property in our return object is the `scope` property. If we hadn't defined this property, the variables in our `template` would have corresponded to whatever scope our template was rendered in. For example, in our main controller, say we had a `favoriteCompany` model defined. In our directive - just like in the rest of the HTML for that controller - we could display information from that model: {{ favoriteCompany.name }}.

However, when our directive has its own `scope` property, that creates an isolated scope for that directive. This means the directive's template no longer has access to the outer scope in which it is being rendered; {{ favoriteCompany.name }} would just render blank, in that case.

To remedy this, we can pass data in explicitly to our directive using attributes. In this way, if we rendered

```html
<company-info favorite-company="companies.1"></company-info>
```

then `favoriteCompany` would be defined in our directive's template. Now, this seems like a bit of a run-around, just to get the same data rendered to the screen. Why go through the ceremony of creating an isolated scope in the first place?

The main reason is that by forcing whoever's using the directive to pass in all the data explicitly, it makes the directive more reusable. Everywhere it's used, it won't function correctly unless the data has been passed in. It makes it easier to see what's going on, and prevents possible bugs arising from the directive reaching into the outer scope.

So, in our example, we created two variables for our directive's local scope:

```js
scope: {
  company: '=',
  selectedItem: '='
}
```

Now, whatever data we pass in to the `company` and `selected-item` attributes of the directive will be available in the directive's isolated scope as the variables `company` and `selectedItem`.

<aside>The `'='` tells our directive to assign whatever's passed into the `company` attribute to the `company` property of our directive's isolated scope. We could also use different names for the attribute name and the property name. See [here]() for more details.</aside>

Our directive is ready to go! Let's update our main template:

```diff
<body ng-app="d3-demo">
  <div ng-controller="CompaniesCtrl">
    <input type="text" ng-model="query">
    <form>
      <input type="radio" ng-model="selectedItem" value="revenue">Revenue
      <input type="radio" ng-model="selectedItem" value="cost">Cost
    </form> 

+   <company-info ng-repeat="c in companies | filter:query" company="c" selectedItem="selectedItem">
+   </company-info>
-   <div ng-repeat="c in companies | filter:query">
-     <h3>{{c.name}}</h3><p>The {{selectedItem}} was {{c[selectedItem]}}</p>
-   </div>
  </div>
</body>
```

Now this part of our GUI is encapsulated and has its own scope. It will be easier to extend with additional behavior, and will be more maintainable as our app grows in complexity.

That's it for our basic directive! We'll now see how to encapsulate our D3 code within another custom directive.


### D3 directive

Our D3 directive looks very similar to our `companyInfo` directive, with one main exception: we need a `link` function:

```javascript
.directive('bubbleChart', function() {

  var chart = d3.charts.bubble();

  return {
    restrict: 'E',
    scope: {
      data: '='
    },

    link: function(scope, element, attrs) {

      scope.$watch('data', function(data) {

        d3.select(element[0])
          .datum(data)
          .call(chart);

      });
    }
  };
})
```

The `link` function gives our directive access to the DOM element it's being rendered to. Since we need to use Javascript to render our D3 chart (rather than using just HTML), we need to put all of our D3 code here.

Before we get to the `link` function, we instantiate our bubble chart. We also make our directive element-restricted. We actually don't need a template, since we'll just render our D3 chart directly to the directive's container element. Finally, we create a isolated scope for our directive with a single `data` property, which our chart will consume.

The link function itself is rather simple. Its parameters are the directive's scope, its DOM element, and any attributes set on the directive. We see the familiar call to our chart function:

```js
scope.$watch('data', function(data) {

  d3.select(element[0])
    .datum(data)
    .call(chart);

});
```

We want to call this every time `data` changes, so we register a `$watch` listener on it. And that's it! We can now use our shiny new custom directive in our HTML:

```html
<bubble-chart data="?"></bubble-chart>
```

All we need to do is get the data.


### Massaging the data

To actually render our chart, we need to pass in some data. We can't just pass in the raw `companies` model, because just like in our Backbone app, our chart expects its data in a certain format. 

<aside>We could of course alter our chart to make it accept data that looks like our plain `companeis` object, and in this situation that may make sense. But more generally, you will almost always need to manipulate your model data before passing it into your chart objects, so it's good to have an idea about where you can do that.</aside>

Let's add a function in our main controller that formats the data for our chart:

```diff
.controller('CompaniesCtrl', ['$scope', function($scope) {

  $scope.selectedItem = "revenue";

  $scope.companies = [
    {name: "Wayne Enterprises", revenue: 3938, cost: 1423},
    {name: "Stark Enterprises", revenue: 3812, cost: 823},
    {name: "Acme Corp", revenue: 6714, cost: 2990},
    {name: "Dunder Mifflin", revenue: 743, cost: 1304}
  ];

+ $scope.chartData = {
+   name: 'companies',
+   children: $scope.companies.map(function(c) { 
+     return {name: c.name, size: c[$scope.selectedItem]};
+   })
+ };
}])
```

Now we can render our chart like this

```html
<bubble-chart data="chartData"></bubble-chart>
```

It works! But you'll notice something - the chart doesn't update when we filter the companies. That's because we're applying the filter to the list, but not our chart's data.

Instead of duplicating the filtering, we'll create a new model `filteredCompanies`, and share it across both of our directives. We'll register it as a listener to the `query` model, so that whenever the query changes, the `filteredCompanies` model is updated.

We can inject the same $filter service we used in our template so we can use it in our controller. Here's the JavaScript

```javascript
.controller('CompaniesCtrl', ['$scope', '$filter', function($scope, $filter) {

  ... 

  $scope.$watch('query', function(q) {
    $scope.filteredCompanies = $filter('filter')($scope.companies, q);
  });
}])
```

and the HTML

```diff
- <company-info ng-repeat="c in companies | filter:query" company="c" selectedItem="selectedItem">
- </company-info>

+ <company-info ng-repeat="c in filteredCompanies" company="c" selected-item="selectedItem" >
+ </company-info>
```

We'll also move our `chartData` model into a $watch, so it gets updated whenever `filteredCompanies` is updated:

```diff
$scope.$watch('filteredCompanies', function(filteredCompanies) {

  $scope.chartData = {
    name: 'companies',
    children: filteredCompanies.map(function(c) { 
      return {name: c.name, size: c[$scope.selectedItem]};
    })
  };

});
```

Finally, we also want to update this data when `selectedItem` changes. Since our `chartData` will now be watching both `filteredCompanies` and `selectedItem`, we use `watchCollection`:


```diff
+ $scope.$watchCollection('[filteredCompanies, selectedItem]', function(arr) {
- $scope.$watch('filteredCompanies', function(filteredCompanies) {

  $scope.chartData = {
    name: 'companies',
+   children: arr[0].map(function(c) { 
+     return {name: c.name, size: c[arr[1]]};
+   })
-   children: filteredCompanies.map(function(c) { 
-    return {name: c.name, size: c[$scope.selectedItem]};
-   })
  };

});
```

That's it! Our chart now reacts to the query as the user searches through our companies. Cool!


### One more update

You'll notice that if we type a query in our search box that doesn't return any companies, our bubble chart remains in whatever state it was in last. We'd like the chart to represent the filtered companies, even if that means there are none. So first, let's update our bubble chart to deal with the case of `null` data.

So, in our bubble chart code, before we start manipulating the nodes, we'll add a check for null data:

```js
if (!data.children.length) {
  g.html('')
    .append('text')
    .attr('class', 'message')
    .text('No data');
  return false;
} else {
  g.select('.message').remove();
}
```

We first clear whatever existing SVG elements were in the main group, then append a text element. We give it a class, so we can remove it next time we render the chart with non-null data.

It works! But what we'd really like is for the message to say "No companies." Instead of hard-coding that into our chart, we'll create a new private property with an accessor:

```diff
    bubble = d3.layout.pack()
      .sort(null)
      .size([diameter-margin.left, diameter-margin.top])
+      .padding(1.5),
+   emptyMessage = 'No data';

function chart(selection) {
  selection.each(function(data) {

...

if (!data.children.length) {
  g.html('')
    .append('text')
    .attr('class', 'message')
+   .text(emptyMessage);
-   .text('No data');
  return false;
} else {
  g.select('.message').remove();
}

...

+ chart.emptyMessage = function(_) {
+   if (!arguments.length) return emptyMessage;
+ 
+   emptyMessage = _;
+ 
+   return chart;
+ };

```

Now we can specify the option in our directive. We could set it directly on our chart instance, but let's add it as an attribute:

```diff
.directive('bubbleChart', function() {

  var chart = d3.charts.bubble()

  return {
    restrict: 'E',
    scope: {
      data: '='
    },

    link: function(scope, element, attrs) {

      scope.$watch('data', function(data) {

        d3.select(element[0])
          .datum(data)
          .call(chart);

      });
    }
  };
})
```

Now we can use it in our HTML

```html
<bubble-chart data="chartData" empty-message="No companies."></bubble-chart>
```

and everything works as expected!


### Some things to consider

Notice how at the beginning, we didn't have to touch our bubble chart. Until we wanted ot add new functionality, our d3 object was completley reusable in this situation. Note that this is not just important across different frameworks, but even within the same application. Reuse - and the corollary of no duplication - is one of the most important tenants to follow in software development. We saw here that we get the exact same benefits when applying this discipline to our D3 code. This pattern makes it easy to reuse our custom visualizations in multiple places with subtle customized differences. Pretty cool!

Also, when we did come to a point in our app where we needed to extend our chart object, we did it in a way that was completely separate from our angular app. Our self-contained chart object gained functionality in a completely reusable way, and then we went back and augmented our directive to take advantage of the new functionality. The new chart object would still work with our Backbone code. So this is the advantage of this approach. Keeping our D3 code decoupled from our Angular code makes it more reusable, both for Angular and non-Angular devs.

But again, note that "decoupled" doesn't mean "second-class". Our D3 code is as prominant in this app as our other custom directive. We treat our bubble chart as a chunk of GUI with its own layout and functionality. And treating it just like we treat the rest of the pieces of our app influenced our design of the D3 object. We let how we were structuring our app and the individual pieces of the Angular framework provide feedback on how we could improve teh API of our chart ot make it more generic, reusable and valuable. This demo jsut touches the surface, but you can imagine what kind of D3 code you can build by letting all of Angular's cool tricks influence your charts.

 - Another approach: http://alexandros.resin.io/angular-d3-svg/. More about this later.


Ember
-----

Ember is certainly the most opinionated framework of the three. But all this really means is that there tends to be a well-defined way to do whatever it is you're trying to do. For example, if you want to get data into your application and you were writing your code by hand, you can imagine coming up with several reasonable places to put your AJAX requests. In Ember, the Route object is where data requests go, most of the time. Similarly, if you need to manipulate your raw data to provide different "sub-views" for your view, you do these in Ember controllers. So there tends to be a well-defined set of opinions around where you do things. And it's important to learn about these things, because certain objects in Ember have easy access to a restricted set of other objects. It's much more difficult to go outside of these conventions and try to do it your own way - and it's like that on purpose.

To incorporate our D3 into our Ember app, then, it's important (just as in the other frameworks) to learn where the reusable GUI chunk fits in. Ember gives us components - isolated objects that are responsible for portions of the GUI, styling, structure and functionality. They are comparable to directives in Angular.

First, we'll build a simple Ember component, and see how it interacts with the rest of our application.


### Simple view

Routes are central to Ember, because the Ember's router acts as a state machine that coordinates all the moving pieces of your app as your user navigates around. Therefore, when building an Ember app, we typically start out by defining the routes.

Let's have a route for all our companies, and then routes for individual companies, in a sort of master-detail fashion:

```javascript
App = Ember.Application.create();

App.Router.map(function() {
  this.resource('companies', { path: '/' }, function() {
    this.resource('company', { path: '/:company_id' });
  });
});
```

This router lets us view the `companies` resource when we visit `/`, and view a specific `company` when we visit `/[id]`, `/2` for instance.

Now, where do we actually put our data? In Ember, routes (individual routes, not the router) are responsible for getting data based on the URL. For our `companies` resource, we want to return the same array of companies we've been using throughout this tutorial. We do that in the `model` hook of the `CompaniesRoute`:

```javascript
App.CompaniesRoute = Em.Route.extend({
  model: function() {
    // Typically, make an AJAX request
    return [
      {id: 1, name: "Wayne Enterprises", revenue: 3938, cost: 1423},
      {id: 2, name: "Stark Enterprises", revenue: 3812, cost: 823},
      {id: 3, name: "Acme Corp", revenue: 6714, cost: 2990},
      {id: 4, name: "Dunder Mifflin", revenue: 743, cost: 1304}
    ];
  }
});
```

If we run the app, we don't see any errors, but we also don't see anything on the screen! Let's create a template to display the data.

When we're at `/`, the `CompaniesRoute`, Ember looks for a `companies` template to render out DOM. We can define a Handlebars templateone in our HTML, similar to how we defined underscore templates for Backbone:

```html
<script type="text/x-handlebars" id="companies">
  <ul class="company-list">
    {{#each}}
      <li>{{name}}</li>
    {{/each}}
  </ul>
</script>
```

`each` iterates over all the models for the current route, and in this case we just display the name of the company in a list. Alright, so everything's working so far!

Now, what about the detail view of our master-detail GUI? When we visit `/1`, we want to see the details of "Wayne Enterprises." We go thorugh the same process that we did for our `comapnies` route. First, we create the route, and return the data in the `model` hook:

```js
App.CompanyRoute = Em.Route.extend({
  model: function(params) {
    return this.modelFor('companies').findBy('id', +params.company_id);
  }
})
```

In this case, since `company` is a child of `companies`, we can just look into the model for the `companies` parent route, and find the object that has the correct id. The `params` object is how we get the id from the URL.

We also need to create a template for our `company` route:

```html
<script type="text/x-handlebars" id="company">
  <h2>{{name}}</h2>

  <p>Last year we made {{revenue}}. Costs were {{cost}}.<p>

</script>
```

Now, if you visit `/1`, you'll notice...nothing! Where's our template?

We actually haven't told Ember where we want it to render. Because our `company` resource is a child of our `companies` resource, Ember is trying to render both templates. We need to specify where in our `companies` template we want Ember to render our `company` template - and we do this using the `{{outlet}}` tag.

So, if we add an outlet to our `companies` template, Ember will be able to also render the `company` template when we visit `/1`:

```diff
<script type="text/x-handlebars" id="companies">
  {{#each}}
    <p>{{name}}</p>
  {{/each}}

+ <div class="detail">
+   {{outlet}}
+ </div> 
</script>
```

Now we visit `/1`, and it works! We can see our company details now. 

Instead of forcing our users to type in `/1` and `/2` into the URL, we want to give them some links. Let's change the static text in our `companies` template to links, using Ember's link helper:

```diff
<script type="text/x-handlebars" id="companies">
  <ul class="company-list">
    {{#each}}
-     <li>{{name}}</li>
+     <li>{{link-to name 'company' this}}</li>
    {{/each}}
  </ul>
</script>
```

The first parameter is the text we want between our `a` tags; in this case, we'll use the company's name. The second paramter (`'company'`) is the name of the route we're linking to. The third is the model for that route; `this` refers to each company, the context of the `each` helper.

Now when we click our companies, we transition between routes, and the detail pane gets updated. Cool!


### A basic component

Components in Ember are similar to directives in Angular: they let you create resuable chunks of GUI that isolate templates and behavior. We'll use a component for our d3 chart, but first, let's see a quick example of how they work with just a simple template.

We'll turn our detail view into a template. The way our app is currently, wouldn't really warrant extracting out teh template into its own component. But again, it's just for illustrative purposes.

Creating a component is easy:

```js
App.CompanyDetailComponent = Em.Component.extend({
  
});
```

Components must have two names, and end with `Component`. Now, we can specify the template in our HTML, alongside our other templates. We'll just extract the HTML we had in our `company` route, and move it to our component's template:

```html
<script type="text/x-handlebars" id="components/company-detail">
  <h2>{{name}}</h2>

  <p>Last year we made {{revenue}}. Costs were {{cost}}.<p>
</script>
``` 

We'll render our component in our `company` template (which, remember, corresponds to our company route). We render it like this: `{{company-detail}}`.

```html
<script type="text/x-handlebars" id="company">
  {{company-detail}}
</script>
```

If you render this out, you'll notice just the static text is rendering. Why isn't it able to get the `name`, `revenue` and `cost` variables? We know the route has returned teh correct model.

The reason is that components have their own scope, apart from whatever template they're being rendered into. In this way they are similar to the isolate scope Angular directives we made earlier. So, we need to pass in the data our component needs to render.

One way is to pass each attribute in:

```diff
<script type="text/x-handlebars" id="company">
- {{company-detail}}
+ {{company-detail name=name revenue=revenue cost=cost}}
</script>
```

but because this is a company detail component, it probably makes more sense to just pass the entire company model in. This creates a local `company` variable, so we need to update the template. We can either use `with`, or add `company.` in front of each variable:

```diff
<script type="text/x-handlebars" id="company">
- {{company-detail name=name revenue=revenue cost=cost}}
+ {{company-detail company=this}}
</script>

<script type="text/x-handlebars" id="components/company-detail">
+ {{#with company}}
    <h2>{{name}}</h2>

    <p>Last year we made {{revenue}}. Costs were {{cost}}.<p>
+ {{/with}}
</script>
```

Now we have a reusable `company-detail` component, and we can pass in any object to get the detail template rendered. We could also add additional behavior via our actual component object. Say, for example, we were using a jQuery plugin, and wanted to add some behavior to our component's element. We could do it like this:

```js
App.CompanyDetailComponent = Em.Component.extend({
  
  didInsertElement: function() {
    this.get('element').tooltip(); // some fake jQuery plugin
  }
  
});
```

As you may have guessed, the actual JavaScript code behind the component - what we see here - is where we'll incorporate our D3 chart.


### D3 view

So why did I go over this? It's important to understand how routes work, because they are so central to Ember. Getting the routes set up correctly ensures that as your application grows in complexity, all the data will always be synced up and everythign will be in the right place. We'll now incorporate our bubble chart into our app in such a way that it honors this relationsihp with the router.

We'll essentially take the same approach as we did with Angular: wrap our bubble chart in a component. Our `CompanyDetail` component had a template and no code; our D3 component will be the opposite. We don't really need to specify a template, a single tag will do just fine. And we'll need to write some JavaScript code to actually instantiate our bubble chart, and set the options, just like we did in Angular.

First, we create the component, and assign our bubble chart to a property:

```javascript
App.BubbleChartComponent = Em.Component.extend({
  chart: d3.charts.bubble()
    .emptyMessage('No companies.'),
});
```

Here we can set any static options on our chart. We could also bind properties (e.g. the empty message) to variables we pass in when we render our chart in the HTML.

If we want to customize our HTML element a little bit without writing a completely separate template, we have some options. For example, we can add a class name to the element, to let us style it:

```diff
App.BubbleChartComponent = Em.Component.extend({
+ classNames: 'bubble-chart',

  chart: d3.charts.bubble()
    .emptyMessage('No companies.'),
});
```

Now let's write the D3 code. We'll add a `draw` method, and use our bubble chart's api:

```diff
App.BubbleChartComponent = Em.Component.extend({
  classNames: 'bubble-chart',

  chart: d3.charts.bubble()
    .emptyMessage('No companies.'),

+ draw: function() {
+   d3.select(this.get('element'))
+     .data([ this.get('data') ])
+     .call(this.get('chart'));
+ }
});
```

After selecting the view's HTML element this with D3, we bind the data using `this.get('data')`. But you'll notice, we haven't defined the property `data`. Where does it come from?

Well, the idea here is similar to Angular. We're going to pass the data in when we render our component - so it will come from teh context of hte template. `data` is actually a property local tot he component's scope. This is again one of the benefits of components: their scope is isolated, and they require all their data to be explicitly passed in.

When we render it in our handlebars template, we'll do something like this:

```html
{{bubble-chart data=chartData}}
```

and that's where the data will come from. But what is `chartData`?

In Ember, Controllers are used to decorate models. THey provide a place to do data manipulation and massaging to the raw data that's stored in our models, which comes from the server. Each route has its own controller - so when we're looking at the overall list of companies, we're actually alreayd using a CompaniesController. It's just that because we haven't had to overwrite the default functionality, Ember went ahead and created one for us.

In this case, the `CompaniesController` is the perfect place to add a function that manipulates our companies models into a format our bubble chart expects. Let's redefine the controller, and add the function.

We'll define the controller as an `ArrayController`, since it represents an array of models:

```js
App.CompaniesController = Em.ArrayController.extend({

  chartData: function() {
    return {
      name: 'companies',
      children: this.map(function(c) {
        return {
          name: c.name,
          size: c.revenue
        };
      })
    };
  }.property('content')

});
```

Here we see the familiar data format our chart expects. We're returning an object with the children equal to plain objects. `this` refers to the array of companies, so we simply map it to an array containing only the data we need: name and size.

You'll notice the `property('content')` declaration at the end. This is a special type of function in Ember known as a computed property. Computed properties let you treat functions as if they were just properties storing data - so in the template we can put {{chartData}} - but whose data will be recalculated in the event one of their dependencies change. You specify dependencies as paramters to `.property()`. In essence, it's an easy way to set up your dependency graph. Also, CPs can depend on other CPs and they all lazily recalculate.

Here, we specify `content` as a dependency. `content` represents the actual array of models this controller is currently representing - so if the collection changes, this proeprty will be recalculated.

So, we now have the data we need in the format our chart expects. We render our bubble chart:

``html
{{bubble-chart data=chartData}}
```

and our bubble chart component now has a local `data` property that not only equals the initial value of our `chartData` computed property, but will update itself every time `chartData` changes.

Our chart renders! Now, let's add a dropdown to control whether revenue or cost is displayed. We can use Ember's select view to help us out:

```hbs
{{view Em.Select 
    content = 
    optionValuePath =
    optionLabelPath =
    value =
}}
```

When using this, we actually feed it data from a JavaScript array. We can just add the array to our controller:

```diff
App.CompaniesController = Em.ArrayController.extend({

+ items: [
+   {item: 'revenue', label: 'Revenue'},
+   {item: 'cost', label: 'Cost'}
+ ],

  ...
```

and then link the select box to that data:

```hbs
{{view Em.Select 
    content = items
    optionValuePath = 'content.item'
    optionLabelPath = 'content.label'
    value = selectedItem
}}
```

We've bound the selected dropdown item to a `selectedItem` property on our controller. Now let's alter our `chartData` function to use it:

```diff
App.CompaniesController = Em.ArrayController.extend({
  chartData: function() {
+   var self = this;

    return {
      name: 'companies',
      children: this.map(function(c) {
        return {
          name: c.name,
-         size: c.revenue
+         size: c[self.get('selectedItem')]
        };
      })
    };
- }.property('content')
+ }.property('content', 'selectedItem')
});
```

That's it - our chart automatically responds, because we already told it to re-draw every time its `data` property changes, and now that changes every time `selectedItem` changes. Pretty cool!

### Enhancing our chart

Now, wouldn't it be great if users could view the company details not only by selecting the links on the left, but also the bubbles in our chart? This is what we're going to add.

When we used the link helpers, they automatically took care of transitioning us to new routes when we clicked them. Behind the scenes, the link helper responds to the mouse click, and in the event handler calls `this.transitionTo('company', model)`. We want to do something similar when our user clicks on a bubble.

We can use _actions_ to add custom event handlers to our components. Within our component code, we send an action in response to some event. Then, in our application code, we respond to the action, and do whatever we want. Let's see how it works.

We want to trigger an action when the user clicks a bubble. First, we add this trigger within our bubble chart.

We'll use `d3.dispatch` to dispatch an event. We'll call the event 'select', since the user is selecting a bubble:

```js
// bubble-chart.js
var dispatch = d3.dispatch('select');

...

// Events
nodes.on('click', function(d, i) {
  dispatch.select(this, d, i);
});
```

We'll also add an accessor to our dispatcher, so code outside of the bubble chart - like our component - can subscribe to the event.

```js
chart.dispatch = function(_) {
  if (!arguments.length) return dispatch;

  dispatch = _;

  return chart;
};
```

We've now augmented our bubble chart again with new functionality. Note that this has nothing to do with Ember yet - our stand-alone bubble chart now allows whoever's using it easily respond to click events on the bubbles, and do something with the data or DOM node.

Now in our component, we can respond to the chart's event and trigger an action within our Ember app. We'll do it in the `didInsertElement` hook:

```diff
App.BubbleChartComponent = Em.Component.extend({
  classNames: 'bubble-chart',

  chart: d3.charts.bubble()
    .emptyMessage('No companies.'),

+ didInsertElement: function() {
+   this.get('chart').dispatch().on('select', function(el, d, i) {
+     self.sendAction('action', d, i);
+   });
+ },

  draw: function() {
    d3.select(this.get('element'))
      .data([ this.get('data') ])
      .call(this.get('chart'));
  }.observes('data').on('didInsertElement')

});
```

Now our component emits an action whenever a bubble is clicked, passing along the data and index of the clicked bubble. In our handlebars we can give the action a name:

```diff
- {{bubble-chart data=chartData}}
+ {{bubble-chart data=chartData action='selectCompany'}}
```

and respond to it in our route:

```js
App.CompaniesRoute = Em.Route.extend({

  model: function() {
    ...
  },

  actions: {
    selectCompany: function(d, i) {
      this.transitionTo('company', this.controller.objectAt(i));
    }
  }
```

Now, clicking the bubbles navigates our app - and the links stay in sync!

<aside>We're using the index here to find which company to transition to, which is easy but only works in simple situations. In a more complex app, you'd want to use an id instead, which would involve you passing that data into your bubble chart, and having the chart emit it on the event.</aside>

One final piece: it'd be nice if the bubbles showed us which company route we're on. Let's enhance the chart again, and give it some concept of its 'state': which data point has been selected. The strategy is to add an active class to the node that has been selected.

Now, we always have to think in terms of two-way binding. Think about the links for a second. When we click the link, the link helper gets the active class (that's how we could style it), and the app transitions. But if the app transitions some other way besides clicking the link - typing in the URL, using the back button, clicking on a bubble - the link still gets the active class. So when thinking about our bubbles, we don't want to just add an active class in the click event handler for the bubble, because someting else could make a company active.

Instead, let's abstract away from _what_ may trigger a new selected company, and instead just add a generic method to our bubble chart:

```js
// bubble-chart.js
chart.select = function(index) {
  nodes.classed('active', function(d, i) {
    return i === index;
  });
};
```

Now, whoever's using this chart can just invoke `chart.select(i)`, and the _ith_ node will get an active class. We can then use CSS to style the node.

How do we hook this up to our Ember app? Well, we want the selected bubble to be bound to the currently active company. First, we can make a computed property on our `CompaniesController` that we'll be able to pass into our bubble chart. This CP should represent the currently selected company:

```js
App.CompaniesController = Em.ArrayController.extend({
  ...
  needs: 'company',
  selectedCompany: Em.computed.alias('controllers.company.model')
});

// Need to redefine this for `needs` above
App.CompanyController = Em.ObjectController.extend();
``` 

There's a small trick we need to do to make this fully work. As it is currently written, `selectedCompany` will represent the company model as we navigate between models. But if we go back to the `CompaniesRoute`, `selectedCompany` will still be set to the last model that was chosen. This is becasue controllers are persistent in Ember, even when you leave route.

Since we want `selectedCompany` to be null when the user navigates back to the `CompaniesRoute`, we can force the `CompanyController`'s content to be null whenever the user leaves the route:

```js
// App.CompanyRoute
deactivate: function() {
  this.controller.set('content', null);
}
```

Now, our CP faithfully represents the current model, including null if the user has not selected any model. We'll now pass this CP into our bubble chart component

```html
{{bubble-chart data=chartData 
    action='selectCompany'
    selectedItem=selectedCompany }}
```

and update our component to invoke our bubble chart's "select" method whenever the `selectedCompany` property changes:

```diff
App.BubbleChartComponent = Em.Component.extend({
  classNames: 'bubble-chart',

  chart: d3.charts.bubble()
    .emptyMessage('No companies.'),

  didInsertElement: function() {
    var self = this;
 
    this.get('chart').dispatch().on('select', function(el, d, i) {
      self.sendAction('action', d, i);
    });
  },

  draw: function() {
    d3.select(this.get('element'))
      .data([ this.get('data') ])
      .call(this.get('chart'));

    this.update();
  }.observes('data').on('didInsertElement'),

+ update: function() {
+   this.get('chart').selectItem(this.get('selectedItem'));
+ }.observes('selectedItem')

});
```

Our app now works as expected - you can navigate between routes using the list, the bubbles, the URL, and the back/forward buttons, and everything stays in sync!


### Some things to consider

- Notice, our bubble chart - and Ember component - don't know about "companies." So we've kept our code very decoupled - the "companies" part of it only comes in the template, from teh context of where we're rendering the actual chart. Pretty cool!

- Ember data

- Computed properties are awesome



Wrapping up
------------

- All frameworks provide us with a place to do our data manipulation, so we can keep our D3 code agnostic about the particular format our data is in when in any framework. Alternatively, we could define a "transform" function on our chart, and in our framework objects, define that function to take the Backbone collection, angular model or ember array.

- It's an iterative process. YOu build your d3 chart as OOP in isolation, and wrap it in a framework primitive. When you need new functionality, you go back to the chart and add it in a framework-agnostic way, exposing a hook for your framework objects to use. In this way you build a highly reusable chart, while still ending up with objects in your framework that are encpasulated and semantic, not just containers for 50 lines of D3. Also, you'll see patterns: you begin to expose core primitives of your charts, rather than options (i.e. expose the axis rather than axis.ticks, axis.tickSize, etc.). Makes them even more reusable.



 - There's definitely otehr approaches. http://alexandros.resin.io/angular-d3-svg/. Some people think using Ember or Angular makes D3's data binding redundant. But if you 

- Which framework is the best for D3? Answer, probably depends on scale. Though I'm most familiar with Ember, and use it even for "smaller" things now.

- Framework binding vs. D3 binding


https://www.youtube.com/watch?v=Hd2rye9a9kk&feature=youtu.be
https://github.com/milroc/d3.MVC
http://bl.ocks.org/milroc/5519819
https://speakerdeck.com/sameersegal/combining-d3-dot-js-plus-backbone-dot-js-to-create-quick-realtime-graphs
http://shirley.quora.com/Marrying-Backbone-js-and-D3-js
http://mikemcdearmon.com/portfolio/techposts/charting-libraries-using-d3

