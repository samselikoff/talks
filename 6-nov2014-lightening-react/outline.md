What is React?
--------------
- A JS lib from Facebook for building user interfaces on the web
- Just the "V" in MVC; doesn't know how to persist your data, doesn't affect routing, etc.
- Primitive is a "Component"; surprisingly powerful
  - you build apps out of nested components
- Can "iterate into" it

Motivation
----------
- Modeling state over time is the hardest part of GUIs
  - Difficult to remember end state after series of dynamic changes

- Old server-side model doesn't have this problem
- Ideally, just describe how your component looks at any time based on its state, and "refresh" whenever data changes

React's solution
----------------
- With React, we get this
  - Make state explicit: getInitialState, setState
  - Single render function
  - React re-renders each time via virtual DOM

Other points
------------
- Separation of templates and component code is artificial
  - separation of "technologies," not concerns
  - Typically templates are deliberately dumb. But keeping templates right in our component code gives us the full expressive power of a programming language.

- Philisophical differences
  - Not really embracing web standards
    - don't think web components are a really good way to build UIs 
    - hate the DOM
  - Rendering server-side vs shipping an app to the browser

Example
-------
- `render` returns a description of what it wants its UI to look like
  - creating a virtual dom. Not actual DOM nodes, but lightweight descriptors. "Create an H3 and and div please"
  - React manages the actual DOM nodes for you
  - uniform interface: intial + update are both in render

- No DOM manipulation in our react class
  - we're only concerned with what to render, now how to render it

- Components doesn't care about the current state of the DOM

- tree diffing to change DOM

