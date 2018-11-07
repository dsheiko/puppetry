<h1 align="center">
	<br>
	<img src="https://github.com/dsheiko/puppetry/raw/master/app/assets/puppetry.png" alt="Puppetry" width="200" />
	<br>
	Puppetry
	<br>
</h1>

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdsheiko%2Fpuppetry.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdsheiko%2Fpuppetry?ref=badge_shield)
[![Build Status](https://travis-ci.org/dsheiko/puppetry.png)](https://travis-ci.org/dsheiko/puppetry)
[![Join the chat at https://gitter.im/dsheiko/puppetry](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dsheiko/puppetry?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<h3 align="center">CODELESS END-TO-END TESTING</h3>

App to build end-to-end automation tests without a line of code.

[![Puppetry - v0.1.0](https://raw.githubusercontent.com/dsheiko/puppetry/master/gh-pages/assets/img/puppetry-welcome.png)](https://youtu.be/ogUBL-XVGRU "Puppetry - v0.1.0")


# Key Features
- Features Headless Chrome (Puppeteer) and Jest
- Generated tests can be run by CI-server
- Can be used by QA engineers with no programming background

E2E testing for the Web in a nutshell is about locating a target, applying a command  on it, asserting the result complies the given constraints. Where target can be either a [HTML element](https://en.wikipedia.org/wiki/HTML_element) or the entire page. Commands for the page can be such as "goto to a URL", "make a screenshot". For an element - click, focus, type a text and so on. As for assertions we can check for example that element's property or attribute has a specified value, or element's position and size match the provided criteria.

Puppetry offers you a UI to create and manage your E2E tests. Namely it allows:
- to declare element targets as pairs a arbitrary variable / CSS selector or Xpath. Element can be easily located with Chrome DevTool. [Then you just right-click on it and copy selector or XPath](https://www.youtube.com/watch?v=du2Jnm-TzJc).
- to manage your test structure (suite, test group, test)
- to manage commands and assertions

## Download

You can download latest installers for your platform [from the releases page](https://github.com/dsheiko/puppetry/releases)

Current only the following OS are supported:

-   Windows 7 and greater (64 bit)
-   Ubuntu 14.04 and greater (64 bit)
-   MacOS X 10.10 (Yosemite) and greater (64 bit)


## Contributing

- please note [the great document](https://github.com/firstcontributions/first-contributions) about first contributions
- here used a coding style, based on jQuery's JavaScript Style Guide. You can find the validation rules in `.eslintrc` and check the code by running `npm run lint`


### How To Run in Development Mode

```
# clone the project
git clone https://github.com/dsheiko/puppetry.git
cd puppetry

# install dependencies
npm install

# build JavaScript
npm run build

# run the app
npm start
```

## Credits

-   [Electron](http://electronjs.org/)
-   [Puppeteer](https://pptr.dev)
-   [Jest](https://jestjs.io/)

## License

MIT
