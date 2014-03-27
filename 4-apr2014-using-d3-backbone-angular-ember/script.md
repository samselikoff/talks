Using D3 with Backbone, Angular and Ember
=========================================

Intro
-----
These days, JavaScript applications are becoming more and more complex. This complexity has spawned numerous application frameworks, like Backbone, Angular and Ember. Fundamentally, these frameworks attempt to address a similar problem: in nontrivial applications, architectural mistakes are costly.

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

Once we get "on board" with a framework, we start to think of certain pieces of our app in terms of the framework. Depending on the surface area of the framework, the amount of pieces in your app like this varies. But, for example, if we use a framework that provides a "router", we think of how our application moves through routes in terms of this particular object. It's not like we're ignoring everything we know about software, or putting aside our specific domain; but we definitely learn to think "in terms of the framework."


### Where does D3 come in?

So how does D3 fit into all this? Well, visualizations have recently become more prominent in web applications. Companies like Chart.io, Localytics, and Square feature visualizations as some of the main features of their web applications.

This means the code related to visualizations is also becoming larger, and more complex. But building interactive data visualizations in web applications is a relatively new phenomeon, and there's a lot we're still discovering. Because of this, developers often think of the visualizations in their application as completely separate from all the other 'standard' pieces.

Also, examples from D3's community tend to be one-off, isolated. This is great for understanding and sharing code, but when it comes time to incorporate modularly into your bigger app, this isn't super helpful. Similarly, D3 code tends to be procedural, which also makes it difficult to incorporate into our applications, which tend to be object-oriented. The examples tend to be a set of instructions to produce a particular visualization, rather than an object with an interface, etc. There is [some work](/chart) in this area, but again, the majority of examples don't implement this.

For all these reasons, developers often write their data vis code separately, outside of the idioms of the framework. But this leads to the same problems that we saw at the beginning. It's just as easy to write highly coupled code that mixes concerns for data vis as it is for standard components.


### How coupled will my D3 code be?

Before I get too far, I don't want you to misunderstand me. I am not suggesting that you intersperse your D3 code among the various framework pieces. In fact, before starting a project with a framework you probably have already written a lot of d3 code; at the least, you have access to a lot of community code out there. There's no reason for you to rip it apart and meld it to your framework. That would make all your hard work on d3 not usable outside of that framework. This is probably a bad idea.

Instead, what I'm saying is this:

 - When working on a large application using a modern framework, your'e building an object-oriented system. It's important to think of your D3 code in the same way, too.
 - Each framework has its own architecture. Think in terms of that architecture, and fit your D3 objects into that system
 - Embracing the framework's idioms will open up new possibilities for your d3 code

An exception is if you're using one of the frameworks to build a charting library. But that's not really what we're talking about here.


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

Of these three frameworks, Backbone is the most lightweight. While not offering as many opinions as some of the other frameworks in the Javascript landscape, Backbone certainly has its idioms. At its heart, it provides you with a model layer to store your data, and an event system to tie your data to the DOM. Let's see how it works:






https://www.youtube.com/watch?v=Hd2rye9a9kk&feature=youtu.be
https://github.com/milroc/d3.MVC
http://bl.ocks.org/milroc/5519819
https://speakerdeck.com/sameersegal/combining-d3-dot-js-plus-backbone-dot-js-to-create-quick-realtime-graphs
http://shirley.quora.com/Marrying-Backbone-js-and-D3-js
http://mikemcdearmon.com/portfolio/techposts/charting-libraries-using-d3

