# Intro

  - I'm @samselikoff, work at @TEDTalks
  - Work on lots of small internal tools, mostly JS apps
  - Reference github/talks
  - Who builds JS apps? Node apps? Heard of node?

# Part 1 (30-45 mins): Modern JavaScript applications

1 Brief history on how we got here
----------------------------------
Why? Because to understand Ember's philosophy, you need to understand
the problems it's trying to solve.

The short history of JS development goes something like this:

### Full server rendering

Server takes care of everything. Frameworks emerge to implement common
MV\* patterns. Becomes well understood.

Problems:
 - links and forms are essentially the only way users can interact with
   your document

### "Sprinkle some JS"

Needed more dynamic UIs. Keep bulk of the work on the server, but start
to add functionality in JavaScript. Submit forms, show new content, etc.
without having to reload the page.

Lots of libraries come out to address specific needs. jQuery solves many
cross-browser compatibility issues. There are jQuery plugins for almost
any UI widget you could need: image uploaders, comment widgets, graphs
and charts, tab components, data grids. These are all great things. The
community is learning a lot about building dynamic experiences on the
web. There are even libraries like Backbone that start to formalize an
approach for organizing all our data and dynamic functionality. But, the
focus is still on small, disconnected pieces.

Problems:

Still, as every developer who has worked in this way knows, things can
get out of hand quite fast. Typically the requests for dynamic pieces of
functionality only increase, and just cobbling together JS components
can only take you so far. Every team doing this is doing it in a
slightly different way, and the community begins to realize that we need
to start benefiting from shared solutions, just as the server-side
community has with projects like Ruby on Rails.

### Complete JS applications

Need a complete plan for our JavaScript.

We come to the present, where complete applications ("fat clients")
are now shipped to the browser, breaking from the request-response model
of the past. Partly made possible by the ubiquity of JS, and also by
recent performance gains in hardware + browsers.

JavaScript handles layouts and rendering, responding to UI,
keeping data synced, etc. much like an iOS app. The server is
responsible for persistence (still a big job), but is now an API for the
JS client, and potentially others. All the logic around templates,
routing, etc. has moved to the client.

This is where JS frameworks like Angular and Ember come in. They
attempt to tackle the whole problem of how to build dynamic, rich
interactive JS apps on the web without running into the architecture
problems of the past.


2 Current landscape
-------------------

This brings us to today. The JS landscape is hot, there's no doubt about
it. But it's also fragmented. There are lots of people trying to figure
these things out, and there are still lots - and lots - of ways to do
things. But, patterns are emerging:

  - promises
  - data binding (in some form)
  - declarative code
  - easy ways to handle routing
  - modules
  - others

Also, the future is bright:

  - ES6 (language features + modules)
  - HTTP2
  - Web components

So, we've learned a lot, and we continue to learn. Things are much better
and easier today than they used to be. Despite this, we currently face
many challenges:

  - fragmentation
    - in technology
    - in philosophy
  - modules
  - tooling
  - performance
  - seo

Now that you have a good understanding of the current landscape, let's
see what Ember is all about.

3 Ember
-------

Ember is a *framework* for building *ambitious* web applications. What
does this mean?

A framework is prescriptive. It embraces conventions and shared
solutions. It aims to help you avoid trivial decision making.

  - Good frameworks still have 'escape hatches' for when you
    need to do something outside the 95%.

Also, Ember's primitives + architecture are really designed for building
full single-page JavaScript applications. Other libraries like Backbone
and Angular are better suited for adding in micro-JS apps to an existing
server-rendered web app (although Ember can be used for this as well).

> Anecdote: I used to be scared of opinionated frameworks. No longer.

### Overview

Ember is an MVC application for building long-lived JavaScript web apps.
The types of apps we're talking about are like Gmail. When you first
load gmail, you click on the link. There is a brief pause while the
application loads, and then you can navigate around, and it feels
like you're navigating around a native app.

Initially a large amount of JS is downloaded, parsed and executed, and then
your app begins to run. The URL you entered might have been the Inbox, it
might have been a specific message, or it might have been your contact list.
In all of these cases, the app will initially boot up.
You see the same loading screen, and when it renders you see the same
application headers, sidebars, footers, layout, etc. Then, whatever URL you
entered is used by the application to render the main part of the template. So, if
you had entered `/inbox`, the app would render your inbox, and if you had
entered a link to a specific e-mail, it would render that message.

The URL is very important to web applications - it's kind of the reason the
web is so popular. You can grab a URL, message it to someone, email it to
someone, bookmark it for later; and when you visit it, you get whatever it is
you were looking at in the expected state.

A lot of JavaScript applications 'break the web' by disregarding a
well-functioning URL. Because URLs are at the heart of the web, Ember
has made them a priority. Ember comes with a router, and it's
right at the heart of an Ember web application.

### Routing

The `Ember.Router` class is your application's router, and it's where you
specify a list of the URLs you want in your application: for example,
`/users`, or `/groups/my-favorite-place`.

Each URL gets its own object too - an instance of `Ember.Route`. This class is
responsible for fetching data from the server related to that specific route,
and handing it off to the rest of the app to be processed and rendered.

As a simple example, consider an email app like Gmail again. The routes
of this application may look like:

 - /
 - /messages/1234
 - /contacts

That first route is called the index route, and every application gets
one of these by default. The other two we're creating manually. When
the user types one of these into the URL, Ember boots the application,
and uses the route object to set up the page for that route.

Ember also provides an *application route*. This is a route that is activated when
the app initially loads, regardless of which URL the user has entered. It's a great place
to set up anything that's common across your app - like bootstrapping initial
app-wide data.

So, say a user opens up their browser and enters in `www.our-
app.com/contacts`. Ember would boot up, load the application route (fetching
any associated data), then load the contacts route (fetching its associated
data), and finally render the appropriate HTML response. But how does Ember
actually know what to do with the data it gets from its routes?

### Templates

Remember, Ember's job is to fetch data via a route, and render it using a
template. Ember uses Handlebars for its templating language. Handlebars looks
like HTML, with variables and expressions mixed in (much like PHP, ERB or
JSP):

```hbs
<h1>{{title}}</h1>

{{#each contact in contacts}}
  <div class='contact-card'>
    {{contact.name}}
    <img href="mailto:{{contact.email}}">{{contact.email}}</a>
  </contact>
{{/each}}
```

The variables returned from your route are made available to the associated
template to be rendered. Ember even makes some reasonable assumptions about
how your templates will be named, in order to wire up the routes with the
templates. So if the user visits the `/contacts` route, that route will fetch some
data, and whatever data is comes back, Ember will look for a `contacts`
template to render it in.

This is the principle of convention over configuration at work. If you mapped
out a `contacts` resource in your router, chances are you're going to want to
be rendering a contacts template that displays information about those
contacts. You can always override it - say, if you wanted to render the
Friends, Groups and Events template using the contacts data, you could. But it
turns out the default takes care of 80%+ of cases, and it's easily
overridable. This is the power of a framework like Ember. If you've never used
it before, hopefully you're starting to see how productive it can make you.

### Controllers

Now, often we want to transform the raw data we get from our server
before rendering it in our templates. Controllers are designed to give
you an object for preciesely this purpose. They are similar to presenters
or view models from other paradigms.

When a route returns data (known as a model), it actually stores that model on a controller
automatically - even if we've never defined or created a controller for
that route. This is part of Ember's 'magic': it will dynamically create
objects for us if we only ever need the default behavior. Often, we want
to just display data from the server directly, and in that case we never
need to define a controller ourselves.

But say we get an array of contacts from the server with their first and
last names, and we want to display each individual's full name. We
could use a controller to create a *computed property*, which
essentially allows us to create new properties on our objects. These new
properties are also made available in our templates.

```js
App.ContactController = Ember.Controller.extend({
  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }
});
```

```hbs
{{#each contact in contacts}}
  <p>{{contact.fullName}}</p>
{{/each}}
```

If you've ever worked on a web app with a lot of Javascript, you should
immediately see the benefit of controllers. We now have a nice place to
put display-level logic, which keeps it separate from the raw data we
get from the server. These computed properties also drastically reduce
the clutter in our templates. Good things all around.

### Views

Views are the objects that are actually responsible for rendering your
Handlebars templates - but again, if that's all you need them for, you
never need to define them yourself.

Routes retrieve data from the server, hand it to controllers to
transform the data with computed properties. The resulting data is
passed to views to be rendered in a template. This is essentially the
flow of a request in an Ember app.

Sometimes, you'll need to interact with the DOM directly via Javascript.
For this, you can redefine the default view.

Redefining views will let you do things like update a dynamic layout
once the initial Handlebars template has been rendered, or render a JS
chart to a container element, or intialize a jQuery plugin (say, a
calendar widget). They're essentially used for things you can't do in
Handlebars templates alone. Templates in Ember are surprisingly
powerful, though, so you'll seldom need your own views.

### Compoments

Components are actually a subclass of view - they have the same hooks,
and they render a template - but they differ in a few ways. The main
difference is that they are completely isolated from the surrounding
context in which they are rendered. Essentially, they act as their own
controller, instead of accessing data from the outside controller.

This makes components completely reusable throughout your appliaction,
making them prime candidates for things like datepickers, tab
navigations, etc.

### Actions

Eventually, you'll want to add user interaction to your app.
Traditionally, if you wanted to react to a click event in Javascript
using something like jQuery, you'd bind a handler directly to the
DOM event, like this:

```js
$('#delete-contact').click(function() {
  $.ajax(...);
});
```

These types of event handlers tend to be brittle, because they're
coupled with the actual DOM element selector, as well as the event
('click') itself.

Ember gives us *actions* to deal with these problems. Actions provide
a layer of abstraction between native DOM events like click and keyup,
and the actual work you want to do in your application. For example,
here's an action in a Handlebars template:

```hbs
<a id='delete-contact' {{action 'deleteContact' this}}>Delete</a>
```

This lets us write a function called `deleteContact`:

```js
deleteContact(contact) {
  contact.delete();
}
```

which separate our code from the template-layer details, keeping it more
flexible. In essence, actions give us a place to transform the native
browser events into semantic events within our application - events that
have meaning.

But where do we write that `deleteContact` function? Actions in Ember
actually bubble up the *view hierarchy*. First, an action will check the
associated controller for an action handler; then, it will travel up any
parent controllers; and finally up to the current route and parent
routes, all the way up to the application route.

This hierarchy lets you delegate out your action handlers to the most
appropriate level in your appliaction; for example, `logOut` can always
be handled at the appliaction level. Hierarchies are important in Ember,
because you tend to make apps with nested UIs. These types of UIs are
some of the hardest to deal with when using more traditional techniques,
so we will learn to love what Ember has done for us.

### Models

Earlier we talked about how routes fetch data from the server, and pass
them off to the controller. Typically, though, instead of working with
the raw server data (usually in the form of a dictionary), we'll want to
turn that data into model entities. *Ember data* is a library separate
from Ember that makes it easy to fetch, cache and save data from the server
to our Ember app. It also helps when dealing with related entites - for
example, a contact has many addresses.

Ember data is still in beta and is optional, but many (if not most)
Ember apps use it.

---

Alright, enough intro. In the next section we'll build something using
Ember-CLI.


# Part 2 (30-45 mins): Building [iTunes/Gmail/something else] with Ember

 - We'll build something with Ember








































