# Deploying Ember Apps with front\_end\_builds

- Hi everyone, I'm Sam. I'm a programmer at TED and you can find me on twitter @samselikoff. Today I want to talk about deploying Ember applications.

## What does it mean to deploy a static app?

- Deploying static apps is kind of a new thing. For a long time, our static files were so wrapped up with our server-side code that no one even talked about "strategies for deploying static appications."
- But these days with JSON APIs separate from JavaScript applications, how to deploy your frontend apps has become as important a question as how to deploy your backend apps.
- So, what does it mean to deploy a frontend app? Well, how do frontend apps get served up in the first place?
- When you visit gmail.com, a server responds with an HTML page. That page contains some data, as well as links to gmail's CSS and JavaScript. So, for this all to work, a server somewhere needs to serve up this starting HTML page (lets call it the index), and a server somewhere needs to serve up the CSS and JavaScript that the index loads.
- Finally, once you start using Gmail, a server somewhere needs to receive and send you data as you write and read your emails.
- So to sum up, here's what it takes to serve a Javascript application:
    + serve an index html page when user visits someurl.com in his browser
    + serve up the index's assets
    + respond to api requests made by the JS
- With that covered, it should be easy to identify what it takes to deploy new versions of our applications.
- Most of the time, we need to update the JS and CSS - step 2. So, we need to put those new resources on a server somewhere.
- If we do that, we also need to update our index file, so it loads/points to these new assets.
- Somtimes, we also need to update our API. But most of the time, we just need to put some new static files up on a server somewhere.
- So, these are the three main steps involved with deploying Ember apps - or any JS application.

## Comparison with backend

- Now, let's compare this with the backend. For those of you familiar with backend development, you know serving a server-side app is much more involved than serving up some static files. Any old web server can serve up static files, but server apps need language runtimes, databases, and a bunch of other stuff.
- Deploying a new version of a server-side app is also complex. Transfer lots of files, install depdendencies, boot up the app. At the time of deployment, you also have to worry about active connections, warming up caches, and more
- Also, even with 0 downtime deploys, there are lots of potential spots for hiccups:
    + app doesn't handle requests while it's booting up (several seconds). During this time, users could get frustrated, feel like site is unresponsive.
    + more complex when involving db migrations
    + if we switch from old to new after a client fetched index.html but before they made request for app-123.js, new won't have it
- But when we're building frontend apps that are completely decoupled from our server-side apps, it's no longer necessary to go through all these steps whenever we make frontend-only changes. We simply need to update our index and our assets.
- So streamlining and simplifying deployment becomes yet another argument in favor of separating frontend and backend development. We can now develop, test and deploy our user interfaces completely separate from our data layers.

## Tradeoffs

- Does this mean every Ember app we make should be deployed like this, independent from its data layer? Not necessarily.
- Separating out frontend and backend deployments comes with a cost: more moving parts. More complexity. These costs are higher for greenfield projects and early prototypes, especially when the frontend and backend are being built in tandem.
- So, how do we know which strategy to take? One way to answer this is to think about the relationship between your frontends and backends.
    - Is it 1 to 1? Do you have a single JS interface for a single backend API? Are you essentially building one app, but you've split it between server-side and clientside (for any number of reasons)?
    - Or is it many to many? Are you creating a new interface that will be talking to several existing backends?
    - And this is a spectrum, there are areas in between
- In the first case, if you're essentially building one app, and especially if you're starting out/prototyping, you'll most likely want to deploy frontend and backend changes together. Working on both ends and being able to push out a complete new build with one step is nice and simple.
- But as you move towards an infrastructure with multiple backend services operating and talking to each other, it makes more and more sense to isolate each new interface from the operation of the various other data services +  interfaces. In this type of environment, separate deployments makes a lot of sense. You wire things up once upfront, and then new front end developers can improve and update their interfaces without ever setting foot in the server side code.
- So, different situations call for different deployment strategies. The rest of this talk will be focused on the latter end of the spectrum: many independent interfaces in an environment with many data services. What deployment strategies should we use here, and what are the options?

(~7 minutes)

## Many services

- Again, the main idea in an environment with many services is: a new deploy consists of updating our index and our assets. It's completely decoupled from our backend deploys. We have a few options for how to set this up.
- There's basically two options: hosted and open source.

## Hosted solutions

- Heroku has a [buildpack](https://github.com/tonycoco/heroku-buildpack-ember-cli) for Ember CLI. Buildpacks are essentially instructions for Heroku dynos that tell them how to deploy your app.
- Once you create the Heroku app using this buildpack, deploys work the same as any other Heroku app you're used to: `git push heroku master`.
- The pros are
    - it's fast
    - declare your backend proxy via ENV var
    - it automatically sets NginX via config variables. e.g. set api_url to '/api'
    - namespace on adapter point to /api
    - It's Heroku, which lots of people are generally used to
- The cons
    - it can get expensive
    - ember build + npm install
- [Divshot](https://divshot.com/) is a newer hosted alternative which is focused on just static apps.
- The pros are
    - setup has a really nice, simple UX
        - sign up, simple config file
    - high quality ember cli addon by rwjblue
      - pushes to divshot config
      - keeps all config in one place
    - really fast deploy
    - also declare a backend proxy server that you can fake
      - e.g. in production, api should point to ems.ted.com
      - this is in your config file
      - then when you push, proxies to back end
      - so, same as heroku, but done via config file and not env variable
- The cons are
    - divshot proxy was slow. 50ms -> 500ms
    - didn't see anything in paid plans about faster proxies
    - SSL expensive

- This is not an exhaustive list, but the general idea is there. You can pay to have your static app hosted, and you can deploy new versions very simply. A new deploy essentially consists of putting new versions of your index and assets up on the hosted server.
- In all of these cases, your application's index and assets are served from the hosted servers (or CDN). Your app then makes requests to your data layer, which lives somewhere else.
- And both have a proxy server, which means you don't have to worry about CORS. You just configure where your server is, and all your API requests will get routed to the right place (is that true?).

## Open source solutions

- Now, what if you don't want to go with a hosted solution? You can always stuff the `dist` of your Ember CLI app into your server-side's `public` folder, but that would require redeploying the server side app, which is what we want to avoid.
- You could also essentially replicate what Divshot/Heroku are doing, set up a new server to deploy to, and just push new versions of your Ember CLI app on it. But that would require you to set up either a proxy server, or configure your API for CORS access, since you're now serving on two different domains. (true?)
- But there's another way. The basic idea comes from Luke's 2014 RailsConf talk. In the talk, Luke explained that our index file is really our JS app's bootstrap file. If we could
    + Have our API server serve the index file,
    + Put the JS/CSS/images on fast asset servers, and
    + Deploy new versions of the index without having to redeploy our API
- then we have a nice, fast solution, with independent deploys, we avoid CORS, and more.
- That's the solution we're using, and we wrapped up our implementation into a few libraries.

## Our solution

- There are two main pieces: a backend and a frontend.
- The backend is **front\_end\_builds**, a Rails engine that allows you to CRUD frontend apps and deploy new versions without redeploying the rails app
- The frontend is **ember-cli-front-end-builds**, an ember addon that makes it easy to deploy assets to an asset server, and notify a front\_end\_builds-enabled Rails backend of a new deploy.
- Let's look at the Rails engine first.

## front\_end\_builds

- Remember the idea here is for our Ember app's API server (in this case a Rails app) to bootstrap the Ember app. To do this it needs to serve up the correct `index` HTML file.
- The gem allows us to serve many `frontends` from this API server.
- First, we install the gem. [gif]
- Then we mount the admin interface. The admin is how we create and edit the frontend apps for this API. [gif]
- Create the app. Give it a name. These apps are stored in a db table. [gif]
- Final step is to setup a route, because the app exists, but we need to serve it at some URL. We do this in routes.rb. [gif]
- That's it. Some more options like whether to automatically enable.
- Now let's push some builds. The app came with an API key, which we'll use to start pushing builds.

## ember-cli-front-end-builds

- This is the frontend part. The idea here is, upload the new assets to an asset server, and send the new index to the backend.
- For this, we're assuming we've already set up an S3 bucket w/static hosting
- Install the addon + run generator [gif]
- Run the setup `ember deploy:setup` [gif]. This creates a `config/deploy.js` file with the config needed for your deploys. Here's where you can specify your asset host, CDN prefix, put your feb API key etc. etc
- Now we're all setup, we can run `ember deploy --environment=production`. Note our backend needs to be running to be notified of the new index. [gif]


## Other solutions

- There are other libraries out there that solve parts of this, like [ember-deploy](), but none that address both the frontend and backend pieces.
- You can also always rsync your `dist` somewhere, but having features like rollback and smoketesting is good

Thanks!
