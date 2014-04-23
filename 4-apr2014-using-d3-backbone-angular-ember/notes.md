**1. Intro**  

  - This is a talk about what I've learned. Things I wish I knew before.
  - JavaScript applications are becoming complex
  - Frameworks do the same thing: provide you with an architecture

**2. Architecture**  

  - Every application has an architecture, even if not explicity
  - Architectural mistakes are costly, esp. at scale
  - Goal of a framework is to enforce good arch. decisions

**3. Bad code**

  - Most would agree this is a mess
  - Your code may not look like this, even w/o framework
    - But frameworks help you avoid this

**4. Backbone**
**4. Angular**
**4. Ember**
  
  - All three frameworks provide solutions - in varying degrees -
to problems that arise when building complex Javascript applications
  
**5. Costs and benefits**

  - TANSTAAFL. Learning framework's abstractions is involved
  - You learn to 'think in terms' of framework 
  - Varies: framework surface area
  - Benefits
    - boiler plate
    - standards
    - reduce trivial decision makings
  - Still, growing number seem convinced

**6. Where does D3 fit in?**

  - Data vis is becoming more prominent in apps

**7. [images]**

  - D3 code is becoming larger/complex
  - D3 examples tend to be one-off and isolated
  - Easy to treat D3 as completely separate

**7. Apps object-oriented, D3 procedural**

  - Makes it easy to write our D3 code outside the conventions  of the rest of our app

**8. Solution **

  1. Encapsulate. When using a frameowrk we're building an object-oriented system. Important to treat D3 code this way.
  2. Integrate. Think in terms of the framework's architecture.
  3. Embrace. Framework's idioms will open up new possibilities for d3 code 

  - Don't need to couple your d3 code to the framework.

  - Essentially, the thesis is: in apps where you're using a framework, and where D3 code is prominent, treat your D3 code as first-class, and embrace the framework's idioms.

  Benefits:
    - reusability
    - collaboration
    - encapsulation
    - testability

  Take the lessons we're learning from frameworks, and not miss out on them.

**9. Frameworks **

  - Why these?
    - Popular
    - Sufficiently different

  - In all three, D3 has most to do with the View layer of MVC

  - For the rest of this talk, we'll be building up a chart to use with all frameworks
    - Each framework will shape our thinking about the chart as an object
    - Influence the public api


Let's get it done
---------------------

  - Say we work for a company, want to help CEO understand revs/costs
  - Visit the D3 examples page

**10. Bubble chart

  - See bubble chart from D3 examples, pull it down

**11. 50 lines of code**

**12. Original data
  

Backbone
--------

  - Most lightweight, but has idioms
  - Provides a model layer to store data
  - Event system to tie data to DOM

** Data **

  - Returns array of Backbone.Model
    - can redefine methods

** View **

  - GUI is isolated chunks, backed by objects
  - Core idea is to keep template in sync with data

**16. Some things to consider**


Angular
--------

  - Sits at intersection
  - Angular has more abstractions than Backbone, not as perscriptive as Ember
  - "A toolkit for building your application's framework"

  - Directives are similar to Backbone Views
  - No model layer like in Backbone, though does provide mechanism for data syncing

** Controllers, templates, filters **

** Directives **

  - Custom elements + encapsulation
  - Restricted: el vs. attribute
  - template
  - Why isolate scope?

** Demo **

  - Our first bubble chart enhancement

** Some things to consider **


Ember
-----

  - Most opinionted
  - Tries to nudge you in the right direction
    - Because of this, more important to learn how things work
  
  - Components are reusable GUI chunks
  - Router is state machine
    - Start off with routes
    - Making a master/detail type app

** Basics **

** D3 **
  
  - As you may have guessed, component is where we'll put our D3 code
  - Understanding routes is important to Ember
    - We want our components to honor this relationship

  - Enhancing the chart has nothing to do with Ember


























