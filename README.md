<h1 align="center">
	<br>
	<img src="https://raw.githubusercontent.com/dsheiko/puppetry/master/assets/puppetry.png" alt="Puppetry" width="200" />
	<br>
	Puppetry
	<br>
</h1>

<h3 align="center">CODELESS END-TO-END TESTING</h3>

App to build end-to-end automation tests without a line of code.

[![Puppetry - v0.1.0](https://raw.githubusercontent.com/dsheiko/puppetry/master/gh-pages/assets/img/puppetry-welcome.png)](https://youtu.be/ogUBL-XVGRU "Puppetry - v0.1.0")

# Key Features
- Features Headless Chrome (Puppeteer) and Jest
- Generated tests can be run by CI-server
- Can be used by QA engineers with no programming background

E2E testing for the Web in a nutshell is about locating a target, applying a command  on it, asserting the result complies the given constraints. Where target can be either a [HTML element](https://en.wikipedia.org/wiki/HTML_element) or the entire page. Commands for the page can be such as "goto to a URL", "make a screenshot". For an element - click, focus, type a text and so on. As for assertions we can check for example that element's property or attribute has a specified value, or element's position and size match the provided criteria.

Puppetry offer you a UI to create and manage your E2E tests. Namely it allows:
- to declare element targets as pairs a arbitrary variable / CSS selector or Xpath. Element can be easily located with Chrome DevTool. [Then you just right-click on it and copy selector or XPath](https://www.youtube.com/watch?v=du2Jnm-TzJc).
- to manage your test structure (suite, test group, test)
- to manage commands and assertions

## How To Run

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