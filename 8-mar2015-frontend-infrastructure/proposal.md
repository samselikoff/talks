EmberConf 2015 Proposal

# Title
Frontend architecture

# Abstract
Monolithic server-side applications are on the way out - but what does this mean for our frontend code? A world of independent backend services creates unique challenges for internal frontend development: How can teams share code? Streamline deployments? Test and integrate their code with existing backend systems?

This talk will discuss how Ember's conventions and tooling can bring consistency, discipline and sanity to a company's frontend infrastructure.

### Details
This high-level talk will discuss some of the advantages of using Ember in an enterprise software environment.

TED's primary technological concern is its video processing pipeline: moving talks from raw video files into a flexible, structured system that enables widespread distribution. TED has built many internal web applications to support this task. Using Ember for front-end development has made our team more productive, our apps more usable, and enabled further improvement of our back-end architecture.

Here's a rough outline:
1. Introduction

2. TED’s move to SOA, and the front-end challenges that came with it
  - Developing new internal web apps off a single monolithic codebase is straight-forward: all the data is right there.
  - But when your data is split across multiple services, how do you piece it together to render new screens?
  - Started by writing lots of Rails view layer code
  - Problem: Rails not really designed for this
  - Problem: TED cares a lot about UX of its internal tools => needed a lot of JavaScript.
  - Problem: Sharing small bits of front-end code across Rails apps is not easy

3. Ember to the rescue
  - Ember is designed to consume APIs. We were already building services, so the APIs were essentially ready.
  - If our services changed, Ember Data was the only abstraction layer we needed to touch to update our front ends
  - Obviously, Ember is much more suitable for building apps with rich, dynamic UIs
  - Addons allow us to share TED code
  - So Ember solved most of the front-end challenges that came along with SOA

4. Ember enabled completely new development workflows
  - Case study: Hoover. Real-time display of file ingests + network transfers during our TED Global 2014 conference
  - Built in less than a month. One Node dev for real-time file system events, one rails dev for persistent data, one ember dev for interface.
    - All built / tested in isolation
    - Plugged it all together, and everything worked in time for the conference
  - SOA + Ember makes it easy for us to independently develop small, niche applications for other employees throughout the company

5. How Ember’s conventions and tooling facilitate ongoing back-end architectural improvements
  - Describe some of our internal tools + back-end needs
  - Talk about moving X number of apps to Ember CLI, separating into different repos, deployment strategy
  - Case study: front_end_builds. Admin panel for managing deployed ember apps. New deploys without needing to redeploy backend.
  - Having all our apps on Ember CLI sets the stage for more innovation in our back-end architecture

6. Ongoing and future improvements from using Ember CLI
  - Building out TED-specific component addons (e.g. image compressor)
  - Blueprint for spinning up a new internal app with commonly used addons already included
  - Features we build for various internal apps (web socket adapter, offline indicator, drag and drop interface) get packaged as addons. Huge productivity boost. And Ember conventions are huge here. All our addons look the same. Compare with Backbone/jQuery plugins.

7. Wrap up
