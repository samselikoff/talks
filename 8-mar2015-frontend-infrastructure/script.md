# additions

- rails taught us that things that are trivially different can and
  should be standardized
- but, *what* is trivially different? in other words, how do we identify
these things that can and should be standardized? we need a
  process for this. And so does your organization.
- the web has showed us this process: let real developers with their
  boots on the ground tinker. Then, observe shared solutions and
  abstractions that emerge. Then standardize, roll back in, and move up a level
  of abstraction.
- ember/cli has embraced this. Not only are there facilities for
  tinkering and sharing - addons and the CLI build pipeline - the
philosophy of the core team and the community at large is to eagerly
embrace new conventions, and roll them back into the core tools -
emberjs the framework and ember cli.

# Bring Sanity to your Frontend Infrastructure with EmberJS

- Hi everyone, I'm Sam. I'm a programmer at TED and you can find me on twitter @samselikoff.
- Today I want to talk to you about frontend infrastructure; but first, a story.

# The problem: frontend architecture is difficult and immature

## Acme's setup

- Acme Inc is a software company.
- When Acme started out, they had one main product, and they started out with a single codebase. The programmers worked together on this codebase, and it was responsible for everything from rendering the interface of the product down to persisting the data.
- This was a monlith - not in a bad sense. But that's just what it was.
- But Acme grew. And now Acme has many products, both internal and external.
- There are also more programmers, and they don't all work on the same thing anymore. They've extracted some code from the original monolith as independent data services, which are now shared across the organization.
- They also have multiple web and mobile apps that consume their data APIs.
- Now, let's take a look at Acme's infrastructure.

## Acme's infrastructure

- Acme's mobile native apps are kind of in their own world. The platforms have their own tools, build systems and language requirements.
- The backend services are where Acme's programmers have the most expertise. They adopted and contributed to their backend community's shared solutions. There are precendents around how to scale up this type of infrastructure, develop and test each piece, and keep them all running independently. Adding a new backend service (or splitting up an existing one into two) is well understood, easy, and requires no architectural decision-making on the part of the programmer.
- Now, let's look at Acme's frontend (web) infrastructure.
- In the early days, the single monolith also rendered the main website. But now, the data for the website comes from multiple services.
- However, the main public-facing website is still being rendered by the main service. During this transition period, when the programmers were creating multiple data layers, they couldn't really find a good place to put the frontend rendering logic for their main web app. So they left it where it was.
- Acme continued to grow, and its various API services enabled it to develop more web interfaces - many just for internal use. These interfaces included accounting apps, CRMs and analytics dashboards, all to help the rest of the org do its job better. Each one of these was a small project taken on by a few programmers.
- Each of these projects got its data from the backend services, which had mostly consistent API conventions. But, each frontend was structured a bit differently.
- Multiple APIs 
- Essentially, each time the org wanted to build a new interface, the developers had to:
    + decide which tech to use (libs, frameworks)
    + set up a build pipeline (build tool, plugins)
    + choose a data interface lib to query the backend and organize and cache the data on the frontend
    + figure out where and how to deploy this new interface
    + setup a testing environment (test runner, getting fake data)
- Needless to say, Acme ended up with many different interfaces, all set up a bit differently from each other.

## Some problems with Acme's infrastructure

- Does this sound familiar?
- What are the problems with this?
    + making all these decisions costs time, energy and patience
    + programmers that are new or didn't start at the project's beginning won't know their way around
    + shared solutions are extremely difficult to extract, both within the org, as well as with the larger community
- Note that these are challenges that arose from moving towards an SOA environment
- The thesis of this talk is twofold:
    1. Using Ember and Ember CLI *today* can drastically improve your organization's frontend infrastructure
    2. Ember and Ember CLI have laid a foundation for discovering *future* solutions to the fundamental questions of frontend architecture
- First, let's look at what Ember can do for you today.

# How Ember can help today

## Less boilerplate

- Remember all those decisions each programmer had to make whenever they spun up a new frontend? Or what new devs had to learn whenever they were ramping up on an existing project?
- With Ember CLI, these things become standard, making each programmer instantly more productive out of the box.
- For example, here's how to setup a new project - any new project:
    `ember new a-prototype`
- Here's how to test any frontend:
    `ember test`
- The tooling takes care of directory conventions, generators and more.

## Conventions 

- And it's not just the tooling. Standards and conventions are at the heart of Ember, and this means the applications themselves are structured similarly.
- New programmers know where to look for tests, they know how to quickly find what objects are responsible for rendering a portion of the UI, and they know what type of architecture to expect and replicate.
- This means that even two programmers across the org working on two completely different applications can still collaborate, since they're using the same building blocks, and they'll run into similar challenges during development. 

## Addons

- Addons were made so developers could easily share new code and new ideas in your org and across the OSS community. It's just another manifestation of Ember's commitment to discovering shared solutions.
- And with the addon infrastructre in place, the barriers to creating new shared solutions are even lower

### Deploys

- Take, for example, the issue of deploying a frontend app.
- Acme has many frontends. They serve different purposes, but ultimately, they're all Ember apps made of the same stuff
- Each time an Acme programmer had to set up the deploy pipeline for a new frontend, they had to do it manually. Who was going to serve up the static assets? How to get them on a CDN? Write a new script to use for pushing new builds?
- This is yet another question Acme's programmers had to spend time answering each time they wired up a new app.
- Over the past year, the Ember community has given this question some thought. Starting with Luke's RailsConf talk, a pretty unique solution has emerged.
- There've been several OSS implementations, but the gist is that deploying a new frontend consists of
    + putting new static assets on an asset server
    + updating the frontend's bootstrap file on a backend server
- With a bit of setup, some simple addons brought consistency and structure to Acme's deploy process. Now, an programmer can update any of Acme's frontends with the same command: `ember deploy`.

### Testing

- As your organization's apps start looking more and more similar, the pieces that are the same become apparent, and completely new workflows and solutions emerge.
- For example, take the issue of testing. Every new frontend Acme's programmers made, required them to setup testing. Out of the box Ember CLI comes with a test runner set up and some conventions around test structure, but there are still a lot of unanswered questions around how to write tests.
- Each new frontend went through the same setup to get fake API responses, so the Ember app could be tested. Because each of these apps looked so similar to begin with, the steps taken each time to get this fake server running were easy to identify and isolate
- They packaged these steps up inside a simple new addon. Now, adding tests to an Ember app looked even more similar across all apps. More conventions and consistency across the organization, less repetitive decision-making by the programmers.

----

- These are all tangible ways Ember/EmberCLI can improve an organization's infrastructure today - and the innovation is only increasing.
- Think about what this does for an organization. The goal for any organization should be for all apps to look like they were written by the same person. We can approach this goal by holding as much constant across our apps as possible. Ember/EmberCLI let us do this
- Ember as a framework is also focused on this
- When community solutions form, and the team coalesces around a correct solution, it makes its way back into the framework. The process feeds itself, bringing more and more shared solutions to the fore.

# How Ember can help tomorrow

## Staying up to date

- Commitment to semver means all your frontends have upgrade paths to keep them fresh
- Larger orgs tend to have many apps that get "finished" for 6 months
- Imagine if it took only between 0.5 - 2 days every six months to keep your app up to date?

## Flexibility

- Using Ember encourages having a clean, sane split between your frontend and backends. This means your interfaces only have one spot where they need to change (Ember data), if your data services change
- Also, remember those questions Acme's programmers had to answer each time they started a new interface? Ember / CLI essentially offer an answer to all of these questions, BUT allow your org to change its answers to them, and importantly, easily share those answers across your org

## Specialization

- Enables completely new workflows: simultaneous, asynchronous development of frontend/backend

## New standards + best practices

- Frameworks - not just Ember - encourage discovery of shared patterns: Promises, e.g.
- These make their way back into standards, and new best practices emerge
- Ember is adament about rolling these sorts of things back into itself. You're setting yourself up to be able to take advantage over and over.
- Think about Ember CLI itself. Completely natural outgrowth of the Ember community - and see how much more productive it made the programmers. Every Ember developer was setting up directories + wiring, so a solution got rolled back into the ecosystem. This will continue to happen.
- So, one more way to continually refine and improve your architecture

## Continual refinement of your architecture

- also, because they hold things constant, they make the things that are the same across your apps apparent. so you can extract them into shared solutions. e.g. pretenderify

----

- Importantly, we're not trying to identify the development platform we'll all be using in 10 years, and build it today. Why? Precisely because we don't know what that will look like. To get there, we need to tinker. We need lots of people tinkering, and we need everyone to be able to share what works - and what doesn't! 
- Addons let us tinker. Standardizing lets us focus on what's the same between our apps. The more we hold constant via something like Ember CLI, the easier it is to identify better abstractions.

# Closing

- I think the Ember community has pushed the JS community at large to standardize and streamline. In other words, in a world without Ember, the rest of the community would not be as actively and agressively focused on coming up with standard solutions for these common problems.

- Back when Acme had a single monolith, creating a new screen or new little interface was simple. All the data was there - just get what you need from the controller, and it's available as instance data in all your views. New screen is not a problem. But in a distributed environment, there's more moving parts, and it's not so easy. But we want to make it easy. We want to lower the costs of spinning up a new interface as agressively as possible, and make it super easy and clear to get the data you need.

- Encourage innovation today => extract shared solutions tomorrow

- just like we don't start off with SOA in backend, we don't need to start off answering all these questions on the frontend. You don't start off a brand new project by architecting out 10 different services.
- However, you want to preempt building a poorly architected monolith. Similar for frontend. And the more conventions that are established, the more likely it is for you to succeed.

- In short, the ember community has made the programmers at Acme very happy

- (cta) be eager about standardizing + seeking conventions. push them back upstream, in your company, into Ember, into the entire frontend ecosystem.
