Big data intro to d3
====================

Intro
-----
[set the stage for the 'why' of data vis]

Big data is a buzzword, but what's the idea behind it? An incomprehensible amount of information. Data so 'big' it's impossible to understand at face value.

People in big data know this, and have a solution: use data visualizations. Visualizations help distill lots of info down into something we humans can understand, primarily in two ways.

First, sometimes we have data and we know what it says, but data vis lets us communicate it simply

	[show a paragraph of information, then show a time series chart]
	"Looks like our company's not doing so well"

Sometimes we have so much data, we just need to convert it into a form that helps us explore it:

	[show calendar chart of daily stock prices]
	"Our best month was January!"

This is why datavis is important to big data.


Whats D3?
--------------

D3 means data-driven documents. That sounds useful for big data!

The document here refers to the DOM. Who can tell me what that is? I actually don't know. OK so it's an agreed-upon set of terms for accessing info from documents, changing documents, etc. Think of CSS queries, DOM events, etc. The stuff we're familiar with.

The point is we usually write out our HTML by hand. Our browsers parse the HTML and convert it into a DOM Tree-like thing, which we can then style with CSS and manipulate with Javascript. 

We get better with JS and do cooler things, and use libraries like jQuery to make it easier. But most of the time we're doing things related to GUI programming.

But - we want to do data vis! And data vis is about relating elements in the visualization (e.g bars, circles, points) to data (e.g. a time series). 

Doing this with vanilla javascript is verbose; lets set the heights of some hypothetical bars in our document:

		var data = [1, 4, 16, 5, 9, 2];

		var bars = document.getElementsByTagName("bar");
		for (var i = 0; i < bars.length; i++) {
		  var bar = bars.item(i);
		  bar.style.setProperty("height", data[i], null);
		}

With d3, its

		var data = [1, 4, 16, 5, 9 2];

		d3.selectAll('bar')
			.attr('height', function(d) {return data[i];});

Here we're getting a glimpse of d3 in action. We'll go into detail on this works soon, but notice what's going on: we can set the height using a function; and this function is 'smart' - it knows about our data. 

So d3 is really about providing an appropriate API for creating and transforming the DOM in a data-driven way: hence data-driven documents. 


Is and isn't
------------

So d3 gives us charts? No! I didn't say that. I said d3 is an api. That sounds pretty low-level, right? It is. Just like javascript gives us document.getElementsByTagName, d3 gives us d3.selectAll. It doesn't give us d3.beautifulUnicornChart. Its low-level, small, performant. It's an API for creating data-driven documents.

It's not a charting/mapping library. There are plenty that are written _using_ d3, because d3 is a great api for creating data-driven documents (like data visualizaitons).

It's not a compatability layer. It does take care of some cross-browser quirks related to created data-driven docs.

Also, you shoud know that D3 is about web standards. Remember, the D for document means DOM. THat's web standards talk: HTML, javascript, CSS. No flash, no crazy java applet plugin. This stuff works with browsers, out of the box. Which makes it super nice if you're used to usign the browser's inspector.


SO how will it help us?
-----------------------

Remember when we talked about the two ways data vis can help us? Explaining and exploring?

If you're focused on exploring, d3 can be awesome. But, it's hard to learn. If you need to crank out 12 pie charts and 3 bar charts by the end of the week, you probably shouldn't write those from scratch using d3. Use one of the libraries that exist.

Sometimes, though, existing solutions aren't enough, and you need custom ways to explore your data. For example, the calendar chart I showed in the beginning:

	[calendar chart]

This is a pretty crazy cool chart. And I don't think it's available in excel's built in charts. The point is, d3 is low-level, which means if you can dream it, you can build it. Learning D3 can be a great way to explore your specific data, becausse you have complete control over the representation and interaction.

It's also good for explaining - again, because of the control.

	[show nytimes connections between grammys]

The authors wanted to explain these relationships. They could have written an article laying out the facts of the relationships, but this visualization is much more insightful. Again, not found in excel. So if you have a specific idea or concept you want to explain - which people in big data often do - learning d3 can give you the power to do so in unique and effective ways.


Ok, lets learn it!
------------------

