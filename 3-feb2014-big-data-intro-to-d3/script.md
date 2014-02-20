Big data intro to d3
====================

[I will assume you understand the basics of HTML, CSS and JS]

Intro - why data vis?
----------------------
[set the stage for the 'why' of data vis]

Big data is a buzzword, but what's the idea behind it? An incomprehensible amount of information. Data so 'big' it's impossible to understand at face value.

One solution people in big data use is data visualizations. Visualizations help distill lots of info down into something we humans can understand, primarily in two ways.

First, sometimes we have data, and we know what it says, but it's hard to communicate that to others. Data vis lets us communicate it simply:

  [show a paragraph of information, then show a time series chart]
  "Looks like our company's not doing so well"

Sometimes we have so much data, we just need to convert it into a form that helps us explore it:

  [show calendar chart of daily stock prices]
  "Our best month was January!"

This is why datavis is important to big data.

  
What's D3?
----------

D3 means data-driven documents. That sounds useful for big data! What the heck does it mean?

The document here refers to the DOM. Who can tell me what that is? I actually don't know. OK so it's kind of an agreed-upon set of terms for representing documents, accessing info from documents, changing documents, etc. Think of CSS queries, DOM events, etc. The stuff we're familiar with.

The point is we usually write out our HTML by hand. Our browsers parse the HTML and convert it into a DOM Tree-like thing, which we can then style with CSS and manipulate with Javascript. 

We get better with JS and do cooler things, and use libraries like jQuery to make it easier. But most of the time we're doing things related to GUI programming. We're building user interfaces.

But - we want to do data vis! And data vis is about relating elements in the visualization (e.g bars, circles, points) to data (e.g. a time series). 

Doing this with vanilla javascript is verbose; lets set the heights of some hypothetical bars in our document:

    var nums = [80, 53, 125, 200, 28, 97];

    var bars = document.getElementsByTagName("rect");
    for (var i = 0; i < bars.length; i++) {
      var bar = bars.item(i);
      bar.style.setProperty("height", data[i], null);
    }

With d3, its

    d3.selectAll('rect')
      .attr('height', function(d, i) {return data[i];});

So first, its more terse. But here we're getting a glimpse of d3 in action. We'll go into detail on how this works soon, but you'll notice: we can set the height using a function; and this function is 'smart' - it knows about our data. 

So d3 is really about providing an appropriate API for creating and transforming the DOM in a data-driven way: hence data-driven documents. 


Is and isn't
------------

So d3 gives us charts? No! I didn't say that. I said d3 is an api. That sounds pretty low-level, right? It is. Just like javascript gives us document.getElementsByTagName, d3 gives us d3.selectAll. It doesn't give us d3.beautifulUnicornChart. Its low-level, small, performant. It's an API for creating data-driven documents.

It's not a charting/mapping library. There are plenty that are written _using_ d3, because d3 is a great api for creating data-driven documents, such as data visualizaitons.

It's not a compatability layer, though it does take care of some cross-browser quirks related to created data-driven docs.

Also, you should know that D3 is about web standards. Remember, the D for document means DOM. THat's web standards talk: HTML, javascript, CSS. No flash, no crazy java applet plugin. This stuff works with browsers, out of the box. It makes it especially nice nice if you're used to using the browser's inspector - and you will be if you start writing d3.


So how will it help us?
-----------------------

Remember when we talked about the two ways data vis can help us? Explaining and exploring?

If you're focused on exploring, d3 can be awesome. But, it's hard to learn. If you need to crank out half a dozen pie and bar charts by the end of the week, you probably shouldn't write those from scratch using d3. Use a library: nvd3, flot, google charts, etc.

Sometimes, though, existing solutions aren't enough, and you need custom ways to explore your data. Remember that calendar chart I showed you in the beginning?

  [calendar chart]

This is a pretty crazy cool chart. And I'm pretty sure it's not available as a built-in excel chart. The point is, d3 is low-level, which means if you can dream it, you can build it. Learning D3 can be a great way to explore your specific data, because you have complete control over the representation and interaction.

It's also good for explaining - again, because of the control.

  [show nytimes connections between grammys]

The authors wanted to explain these relationships. They could have written an article laying out the facts of the relationships, but this visualization is much more insightful. Again, not found in excel. So if you have a specific idea or concept you want to explain - which people in big data often do - learning d3 can give you the power to do so in a unique and effective way.


Ok, lets learn it!


Learning D3
===========

There are definitely a few conceptual hurdles to learning d3. I like starting with an example. Let's build a bar chart:

  [bar chart]

This comes straight from the [examples]() page, which, by the way, is a fantastic resource for learning d3.

There are several components here: the bars, the x and y axis, the labels. As we discuss these components, remember that D3 is not just about building charts. We'll see the approach D3 takes to build these things, and by learning and understanding it you'll be able to apply the general concepts to any visualization you like.

This particular chart is rendered in SVG. SVG is web standards talk; it's part of the same "document", it's not an external resource that's embedded. You can open up the inspector and see:

  [picture of inspector showing the bar chart]

See? The svg is in the DOM. Its parsed and ready to style and manipulate. But again, d3 is not just about svg. We can use it to create an html table, for example. But today we'll focus on svg, which is often used in data vis.


### Selections

Lets start with the bars. Our initial document is

```html
<html>
  <body>
    <script src="d3.v3.min.js" charset="utf-8"></script>
    <script>
      // Our code
    </script> 
  </body>
</html>
```

We're referencing a copy of d3 in our folder. Here's the data driving this visualization:

```js
var nums = [80, 53, 125, 200, 28, 97];
```

Now, to render an SVG rect, we first need an `<svg>` container element. Let's add one to the DOM:

```js
d3.select('body').append('svg');
```

`d3` is the d3 global object - think `$` from jQuery. And also similar to jQuery, d3 allows us to select elements in the DOM. Here, we select the `<body>` element. Selecting something in d3 produces a [d3 selection](https://github.com/mbostock/d3/wiki/Selections). **Selections** are a powerful abstraction that let us apply transformations to groups of elements, rather than using imperative code, via something like a `for` loop. We'll see their full power soon.

For now, just think of the selection as an object that wraps the `<body>` tag, and provides some useful methods. For example, they let us change CSS properties:

```js
d3.select('body').style('background-color', 'blue');
```

And as we saw, they also let us `append` other elements to the DOM. When we call `append('svg')`, d3 appends an `<svg>` element to the `<body>` element. Check out the inspector - there it is!

Now, we probably append things to the DOM in order to do something with them. Conveniently, after D3 appends a new element to the dom, it returns a new d3 selection wrapping the element that was just appended. So, we can do something like this:

```js
var svg = d3.select('body').append('svg');
```

and work with our new selection using this local variable, just as if we had written `d3.select('svg')`.

It's time to create some `<rect>` elements. Maybe we could just `append` them, like we did the `svg` element. We have 6 data points, so...

```js
// Recall, var nums = [80, 53, 125, 200, 28, 97];

svg.append('rect');
svg.append('rect');
svg.append('rect');
svg.append('rect');
svg.append('rect');
svg.append('rect');
```

If we check the inspector, the bars are there! But this is d3, and the whole point is to use the data to drive the creation of our documents. Clearly, this solution falls short.


### Selecting arrays of elements

Before we learn how its really done, we need to learn a bit more about selections. 

We've seen d3.select used on single elements: d3.select('body'), d3.select('svg'), and so on. There's another method which gives us a selection: **`d3.selectAll()`**. This produces a selection that wraps an _array_ of all matching elements. For example,

```js
var paragraphs = d3.selectAll('p');
```

returns a d3 selection wrapping all `<p>` tags on the page. So, what is a selection, really? We can select single elements, or groups of them, but what does the selection itself represent? Think of it as higher-level than the elements themselves. It represents a powerful object that references some set of elements in the document, it knows details about them, and can apply transformations to them.

**Understanding selections is key to writing d3 code.** It takes some time to wrap your head around, so after playing with the code a bit, be sure to read as much as you can on them from the docs and from other tutorials.

Now, remember when we changed the color of the 'body' element earlier? If you wanted to do that for all our page's paragraphs, you might try something like this:

```js
paragraphs.forEach(function(p) {
  p.style('background-color', 'green');
});
```

But this is not how we do things in d3. Remember, a selection should be thought of and acted upon as a single managing object. Because of this, when it comes time to transform elements in the DOM, you operate on the selection itself:

```js
paragraphs.style('background-color', 'green');
```

The selection applies the transformation to each element it references.

This style of programming is called _declarative programming_, because we declare our intention (_what_ we want to do), rather than imperative programming, where we write out each step our program needs to accomplish a given task (_how_ to do it). 

As you can already see, declarative programming is a powerful abstraction that can reduce complexity and open the door for more powerful code. It is the style in which d3 code is written.


### Selecting no elements

Now, we come to an interesting point. Currently, our DOM looks like this:

```html
<body>
  <svg>
    <rect></rect>
    <rect></rect>
    <rect></rect>
    <rect></rect>
    <rect></rect>
    <rect></rect>
  </svg>
</body>
```

And we can use `selectAll` to grab the bars:

```js
var bars = d3.selectAll('rect');
```

But what if we had selected the bars before we had appended them? 

```
// index.html
<body>
  <svg>
  </svg>
</body>

// script.js
var bars = d3.selectAll('rect');
```

Clearly, we're selecting something that doesn't exist, so it will return null, right? It's as if we applied a CSS rule to a #home element, but that element doesn't exist. Or used jQuery to find all the `<h5>` elements, `$('h5')`, but none exists, so we get a null, an empty set, a vacuous solution.

Actually, even though our selection _is_ empty, the return value is not vacuous. Remember, selections are a higher-level thing, a managing object. In this case, `bars` doesn't reference anything in the DOM, it's true; but it still _represents_ an array of `<rect>` elements.

So, you can think of selections as having two pieces. The first is this abstract, Platonic thing that they represent, like a single 'body' tag, or an array of '<rect>' elements. The second is the actual set of elements the selection matched in the DOM as it currently exists - for example, the 6 rect elements that we can see in the inspector, right now. 

Having both pieces is the key to how d3 operates.


### The data join and subselections

As you may have already figured out, d3 can compare both parts of a selection - the elements that the selection represents, and the elements that the selection matched in the DOM - and tell us where they are similar, and where they are different.

The elements matched in the DOM simply come from the DOM - so that's easy. But how does d3 know what our selection should represent? So far, it has just represented either a single element, or an array of elements. But how big is the array? And what are the elements of the array which the selection represents?

This is where the data join comes in. The data join gives us a way to specify exactly what our selections represent. We do it like this:

```js
var nums = [80, 53, 125, 200, 28, 97];

var bars = svg.selectAll('rect')
  .data(data);
```

Now we have a selection, but one that is bound to data. d3 knows _exactly_ what that selection represents: an array of 6 different `<rect>` elements, each which maps to the corresponding integer in the array.

Now that d3 knows exactly what our selection represents, and it also knows what's currently in the DOM (since it performed a `selectAll`), it can tell us what's the same and what's different between the two pieces. It does this by creating **subselections**: selections that represent a subset of the original selection. There are three subselections: **enter**, **exit**, and **update**:

  [venn diagram]

The names are pretty straightforward. The enter subselection represents elements that (typically) will be entering into the DOM: they're in the data that was joined to our selection, but they're not currently in the DOM. And exit represents elements that will be leaving the DOM: they're in the DOM right now, but not in the data that was joined to the selection. Update refers to those elements that are in both groups.

So how does this look in practice? Well, what are we trying to do again? Create bars. We have a selection

```js
var nums = [80, 53, 125, 200, 28, 97];

var bars = svg.selectAll('rect')
  .data(data);
```

But the rects don't exist in the dom. That means there are six rects in our enter subselection - we can get to them like this:

```js
bars.enter()
```

Now, we are holding the matched elements. We can do whatever we want with them. In this case, for each element in our representation, we want to append an actual bar element to the DOM:

```js
bars.enter()
    .append('rect');
```

Check the inspector - there are our bars!

### Data is stored in the dom

Now, when the elements are inserted into the DOM, d3 actually stores the data with them, too. This leads us to another fact about selections: **selections are transient.** If you ever need to reselect elements that have been inserted into the DOM, you simply reselect them:

```
d3.selectAll('rect')
```

Inspect those in the console, and you'll see the data. You can also call d3.selectAll('rect').data().

Congratulate yourself - we're over the hump! Selections are the main hurdle in d3, and as you practice more and more with them, the rest will become much easier.


### Data-driven transformations

Ok, so now we have data-bound `<rect>` elements in the DOM. This is exciting, because now we get to to data-driven transformations, like we saw in the very beginning.

First, lets set the width and height of each bar to 20 to see what we're working with:

```js
d3.selectAll('rect')
    .attr('width', 20)
    .attr('height', 20);
```

We see something! But they're all lined up. What's going on? [inspector]. They're all there, for sure. But we haven't moved them.

Now finish the chart.
