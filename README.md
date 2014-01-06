# Soul

Soul is a(n alpha) starter theme for building a modern, fully REST API-driven WordPress site using things like [Backbone](http://backbonejs.org/), [WP REST API](https://github.com/WP-API/WP-API), [Browserify](http://browserify.org/), [Mustache](http://mustache.github.io/), [Sass](http://sass-lang.com/), [Grunt](http://gruntjs.com/), and [Composer][]. It is fully buzzword-compliant and sorta works.

Did I mention this is alpha? This is a proof-of-concept. The blog index, paged views, and posts are currently all that is supported. And scripts other than those loaded on your initial view won't get loaded.

[Composer]: http://getcomposer.org/

***

## Getting Started

1. You **must** have the [WP REST API](https://github.com/WP-API/WP-API) installed and activated (no checking is done, it'll fatal error without it)
2. Your post permalinks need to be `/%post_id%/%postname%/` for proper working-ness.[^1]

[^1]: This is hopefully a short-lived limitation.

The set of commands below assumes you already have [Node](http://nodejs.org), [Composer][], [Sass](http://sass-lang.com/)[^2], and [grunt-cli](http://gruntjs.com/getting-started) installed. If you don't, go do that, and then come back and thank me for upping your developer game.

[^2]: I *highly* recommend using Sass >= 3.3.x for its sourcemap support. At this time, it's hit RC2 and can be installed with `gem install sass --pre`. Combine with Chrome's sourcemap support and why yes you can buy me a drink.

Everything installed? Cool, on your command line, type:

```
git clone https://github.com/mattwiebe/soul.git YOUR_DIR
cd YOUR_DIR
composer install
npm install
```

(`YOUR_DIR` is a placeholder, and needs to be in `wp-content/themes/`.)

Quick developer points:

1. Mustache templates are in the `templates` directory. There is no comparable-to-stock-WP template hierarchy at present.
2. Uncompiled JS is in the `app` directory
3. Uncompiled Sass is in the `sass` directory.
4. Grunt knows where to put everything in the end for the three things above.
5. You can run `grunt watch` while developing to automatically compile anything you've just edited into its proper form. (This also starts a [LiveReload](http://livereload.com) server for max awesome.)
6. Be sure to have `define( 'SOUL_LOCAL_DEV', true );` set in your PHP environment so that you're developing with the non-minified, sourcemap'd sources output by `grunt watch`.
7. Run plain `grunt` when you're ready to generate production assets.

***

## Rationale

WordPress is slowly but surely warming up to modern developer practices. We've warmed up to Backbone, Grunt, and Sass. We have a REST API that will hopefully land in v3.9 and already exists as a plugin. We have calls for a [single page app](http://aaron.jorb.in/blog/2013/12/the-twenty-fifteen-theme/) (SPA) for the next default WP theme.

Of course, the trouble with SPAs are well-known: bootstrapping the app on the client-side leads to long rendering delays, especially if server calls are involved. Or, if you use `pushState` (as you should), you now have to also render on the server, which is better for performance (and more SEO-friendly), but now you have duplicated logic. So, that leads us to the first piece of Soul's tech stack:

### Mustache

I wanted as little duplication of templating as possible between server-side and client-side rendering. Mustache was an obvious go-to, since its "logic-less"[^3] nature means there are implementations in nearly every language out there. I'm using [Mustache.php](https://github.com/bobthecow/mustache.php) (installed as a dependency fancy-style using Composer) on the server, and [Hogan.js](http://twitter.github.io/hogan.js/) on the client. Since I have various template files, and I'm *not* going to slurp those in client-side via multiple <abbr title="XMLHttpRequest">XHR</abbr>s, I needed a compilation step. This led to the no-brainer of:

[^3]: I wish they had a better way of describing their approach. It's not logic-less: you can do if statements and loop over arrays. There's just no room for helpers, which is why it's a great cross-platform templating language.

### Grunt

Grunt has exploded in the JavaScript dev community over the last couple of years. Yes, it's a bit verbose, but it has a great ecosystem. So long as I had a task runner going, I figured that I should jump in and use a JavaScript module process. After toying with [RequireJS](http://requirejs.org/), I decided that I actually preferred:

### Browserify

Browserify lets you write modular code for your browser as if you were in Node. You write stuff like:

```javascript
var Views = require( './views' );
var App = {
	view: new Views.Post(),
	// ...
}
// ...
module.exports = App;
```

And then you compile everything down into a single JS file for the browser. You can manage your dependencies through [npm](https://npmjs.org/), which is great since the dev dependencies for Grunt are already managed there. Simply having all of my separate concerns in separate files forces me to, well, separate them better. Once you get [grunt-browserify](https://npmjs.org/package/grunt-browserify) wired up and keep `grunt watch` running, you're off to the races. I haven't felt so elated to separate usually-monolithic browser code into components since I first discovered:

### Sass

I think the days of not using a CSS preprocessor are over, and Sass is the best of breed in my mind. Disagree? Switch to another: this is a *starter* theme.

I used to be a big advocate of Compass, but I never found myself leveraging much of its power: I expect even that to decrease as vendor prefixes die out. Also, plain Sass leaves open the future possibility of using [Libsass](http://libsass.org/)-based compilers (like [sassphp](https://github.com/sensational/sassphp) or [node-sass](https://github.com/andrew/node-sass)), thus dropping the Ruby requirement.[^4]

[^4]: This is actually on the [verge of happening](https://github.com/andrew/node-sass/issues/194) for node-sass. This is great, since all Libsass compilers are quite a bit faster.

### WP REST API

Duh. This can't be in core soon enough. I did have to kind of make it bend over backwards to repurpose its way of creating post objects to feed into Mustache templates on the PHP side.

### Backbone

Also duh. What other MV* framework could kinda-sorta work with WordPress?

***

## The Future

That probably depends on you. This is barely past proof-of-concept stage. While this approach will likely *never* support everything that WordPress supports, I'm certain that it could support a lot more. A few things I've kicked around:

* A way to transform WP rewrites into routes in a way that makes sense both server- and client-side with Mustache templates
* Handle script dependencies where different pages need different scripts. Jetpack's Infinite Scroll does this fairly intelligently, but our implementation would have to be quite different.
* For the above: probably:
	1. add a header on the JSON requests that say which scripts have been already added
	2. add a header to the JSON response that enumerates scripts that need to be added
	3. add needed scripts
	4. if 3., add load listeners
	5. regardless of 3. and 4., but after 4. when needed, fire a document.ready.
* Explore replacing Mustache with Handlebars since the latter can provide helpers ( eg transform "2013-12-10T05:05:11+00:00" returned by the API into "10 Dec 2013" ). This will result in some code that needs to live in PHP and JS, but maybe we can make a cross-compiler for that?
* Not need the post ID in post permalinks. Especially important when we start supporting other post types. Probably means I'm doing routers wrong.
* Add comments dynamically (and at all). Maybe even look into allowing nested comments but for now SCREW NESTED COMMENTS I HATE THEM
* Avoid turning this into Ghost-lite.
