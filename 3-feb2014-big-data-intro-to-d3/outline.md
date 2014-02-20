Big data intro to d3

Setup:
http://d3js.org/
http://bl.ocks.org/mbostock/3943967
file:///Users/SamSelikoff/Dropbox/Projects/talks/3-feb2014-big-data-intro-to-d3/final.html
file:///Users/SamSelikoff/Dropbox/Projects/talks/3-feb2014-big-data-intro-to-d3/test.html
http://square.github.io/crossfilter/
http://square.github.io/cubism/demo/

1: Intro

Who works in big data?
Who works with web technologies?
Prereq for this talk is HTML, CSS, JS

2: Why data vis?
Big data really means incomprehensible
One solution is data vis. Helps in two ways: communication, exploration

3: Explaining

Which is easier to understand?

4: Exploring

Insightful view into massive amount of data

5: What is D3? 

Stands for data-driven documents

Document = DOM. What does this mean? 
A parsed document
Style-able and programmable
We develop tools for this
But our tools are for GUI programming
We want data vis

Data vis is about relating elements to data. Look at it in vanilla javascript:

6: JS vs D3

Verbose!

D3 is more terse. But more, we’re seeing a glimpse of the data-driven part. Notice the function.

So d3 is really about providing an API suitable for creating and transforming the DOM in a data-driven way.

7: D3 is not

a DOM query lib
A compatibility layer
a charting library
easy
proprietary tech. web standards!

8: So how will d3 help us?

D3 is low level. 
We give up convenience, in exchange for control and power

9: Learning D3
Plenty of awesome examples out there
[show]
Today, I want to focus on some higher-level concepts via an example

10: What we’re building

Not very exciting. But, good starting point.

Remember, this is SVG. Standards talk. 
Not an external resource. Look with inspector.

So let’s dive in

11: Initial document

And data.

[Show in Chrome with inspector]

12: First, need an <svg>

D3 is global object - think $
And similar to $, lets us select, and perform operations

[Show both in Chrome]

So think of a selection as an object that wraps around DOM elements
Wrapping your head around selections is one of the main hurdles to learn D3

13: Append returns a new selection

14: Make the bars

Six data points, could just `append` six times.

[Show in Chrome]

But this isn’t very data-driven. Clearly we need something better.

Before we get there, need to dive deeper into selections

15: Selecting arrays

We’ve seen selecting one element
But d3 gives us another way to product selections: selectAll

Now, we’ve seen two kinds of selections
So what is a selection? A single object? A group?
Think of it at a higher-level than the actual elements
It’s a managing object. 
It knows about elements in the DOM, 
but it knows more

16: Selections enable declarative programming

Earlier we changed the background-color of ‘body’.
Could use loops to do the same thing to paragraphs
But selections should be thought of as a single object. Act on the selection itself
Clearly, this is more terse, but also more powerful.
Opens the door for new things


**** [Questions?]


17. Selecting no elements

This is interesting
Currently, our dom has 6 <rect>s, and we can select them

[Show .selectAll in Chrome}

But what if we select them before they exist?
Clearly, will return null, right? Or empty set?
Vacuous CSS rule
jQuery select elements that don’t exist
Vacuous return value?

No. Selections are higher-level that DOM elements. They can represent elements that happen not to exist in the DOM.

In this case, bars doesn’t refers to anything in the DOM
But it does represent an array of <rect>

18. Selections have two pieces

An abstract representation. “A body tag.” “An array of rect elements.” It’s almost like a Platonic abstraction, a world of pure elements
The actual elements in the DOM as it currently exists. For example, the 6 rects in the DOM that we see in the inspector

Having both pieces is the secret to d3’s power

Now, you may have figured out, d3 can compare both pieces
The actual elements come from the DOM
But how do we specify the abstract representation?
So far, either a single element, or an array
How big is the array? What elements are in the array?

19. The data join

Data join lets us specify our representations. Like this:

Now we have a selection, but one that is bound to data. 
D3 knows exactly what it represents

Now d3 can compare both pieces, telling us where they’re the same and different.

These produce 3 subselections

20. Subselections

[venn diagram]

Explain the three subselections
Remember, they’re not just <rect>’s, they’re <rect>’s tied to a piece of data

So, how does this look in practice?

21. Creating the bars

DOM is empty
So all the rect’s are in our enter subselection
Access them, then bring them into the DOM

[in Chrome]

There they are in the DOM!

22. Where does the data live?

DOM, not in JS

[in Chrome]

This means selections are transient.

[Reselect in Chrome, show data]

Congratulations, you’ve learned some of the most difficult concepts in d3!



**** [Questions?]

23. Data-driven transformations

Bound data lets us drive transformations with data
Finish the bar chart

24. What next?

We haven’t scratched the surface

25. Applications to big data

There are massive amount of examples of companies using d3
[go through list]

At end of the day, “big data” doesn’t necessarily mean “plotting 1 billion points in a scatter plot”. 
There will be an analytics component
Cleaning, aggregation/reduction, filtering, selection
What d3 does is , given some focused set of data, provides developers with a means of transforming it into effective visualizions
Visualizations that efficiently convey incredible amounts of information
More and more humans are being brought into the analysis part of big data
instead of just using an algorithm, and looking at the results
Dynamic, real-time visualizations give us a completely new way to interact with our data
This will be key as we move forward 