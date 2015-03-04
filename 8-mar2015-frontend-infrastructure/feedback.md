# Ryan T

## On Sat, Feb 28, 2015 at 1:01 PM, Ryan Toronto <rt@ted.com> wrote:

Hey great talk and overall I think it is well put together. However, It
seems very high level and touching on a wide range of topics. One thing
I felt was missing was actual real world examples of the themes in the
talk.



Introduce yourself. You can spend a minute talking about who you are,
where you live, what your hobbies are, or anything like that. Luke does
a great job doing this in his talks.

What is the message in your talk? Another way to ask this, who are you
giving this talk to and what do you want them to do after they see it.
It felt like some parts were speaking to experienced Ember devs while
other parts were speaking to devs who haven’t used Ember.

I think you spend too much time on describing acme inc codebase. Nothing
you said was wrong, just might be hard for some people to relate.



* frameworks
* build pipeline
* data layer
* deployments
* testing

I think a lot of talks at the conference will be about ember cli. In my
mind, most people at the conference will probably think frameworks and
build pipeline is a “solved problem”. I’m not sure what my advice is
here, but I don’t think you need to spend a lot of time on this. Worth
mentioning, but make sure you aren’t TLDRing someone else talk?

Testing got me really excited. Personally I can relate to this… like all
our tests are the same because we use QUnit and testem, but thats where
it stops. A few things came to my mind
* As an ember dev, how do I make it really easy to test. XHR mocking,
  adapter testing, theres really no good guides on this.
* How did acme inc make all their tests have the same API? I know this
  is hard to answer, but a real world example might be good. You don’t
have to show off the project/api if you don’t want to, but just hearing
about how it brings structure is nice.
* People that work on non ember projects can use whatever you say as a
  way to articulate why ember brings a sane javascript testing to your
organization. think of JS apps that have no tests.



ember test
ember deploy
Most frameworks provide a one line cli. like npm test or rake spec.



“Ember can help your company today, but its not just a framework, it
will help your company in the future”. This is great, it got me really
excited. I want to hear more about how Ember did this for acme inc.

Thinking about this more I’m really into it. Everyone tries to compare
Ember to [bb, angular, react] in terms of implementation or feature set.
I’d love to hear about the other things Ember does, especially helping
me in the future.



Careful about mentioning Luke's talk, I think he is going to announce
one project (ember-cli-deploy). Might want to sync up with him on what
you’re going to say.


I liked the part about how Ember can pull stuff in from all frameworks,
tinker with it, and then make it land in the framework.
* Why does this benefit my organization?
* Any examples of new innovations that acme inc got for free when other
  organizations had to implement them into their projects?


In the beginning you spent time talking about how acme split out to a
number of services and how Ember keeps code bases + directory structure
similar. I think there is room to talk about shared code here: common
components and css themes that all your projects will need. Feel like
acme inc gets good benefits here.
Yeah understood. I think you can still be abstract with acme inc, and
honestly that's probably better since the listener can imagine it being
his or her organization. That said, all these places are going to have
so many of the same problems that I think you can get into specifics.


## On Sat, Feb 28, 2015 at 1:21 PM, Sam Selikoff <sam@ted.com> wrote:
This is so helpful man, I *really* appreciate you taking the time to do
this.

The hardest part about this talk is, I felt like I didn't really know
what the message was. Because the talk went from, "This is a talk about
the concrete ways TED has used Ember/CLI to improve its frontend
infrastructure" to, "This is a talk about how Ember/CLI can/could
possibly help a company/org with messy frontend architecture."

To answer your question, I think this is where I landed in terms of the
main messages and takeaways of the talk:

- Frontend infrastructure is difficult and immature, mainly because it's
  new and underexplored
- The changes that are going on in the frontend infrastructure "space"
  are similar to those that went on in the backend space with e.g. rails
10 years ago
- We should take the lessons we've learned from that time, and apply
  them to our frontend architecture
- What are those lessons? Be eager about standardizing and sharing,
  while giving real developers who are doing boots-on-the-ground work
the ability to tinker, to find and discover things that are actually
needed + useful
- Ember/CLI is the best way to apply these lessons to your organization
  today
- Ember/CLI is also more than just the tools, it's the
  philosophy/community, who care deeply about these lessons, and care
about making sure we don't miss learning from them in the future
- If there's a call to action it'd be, embrace tinkering, be eager about
  shared solutions and identifying the parts of your app that are only
trivially different from others', so we can roll into a single solution
and move on to next abstraction

I will definitely go through my slides and try to work on some of this.
Thanks again man.


# Gavin

Was watching while in transit but didn't get to finish (I will later
tonight) However for the parts I saw I'd say this:

Think about dropping acme inc. People are drawn to hear stories. But
if they know from the start that it isn't a true store or not a real
company they will not be as engaged. Perhaps just say I want to tell
you about a startup you all know about (but never mention a name)

You spend a lot more time than I think you need to outlining the
problem. My guess is most people in the room will know about this
stuff so there are some broad strokes that might cover it well enough.

And to contrast my last piece of feedback the transition from monolith
or SOA is something you breezed over and I don't think is as obvious
to most people.

Anyway it's looking great! Make sure you let people know we are hiring
and bring business cards ;)
