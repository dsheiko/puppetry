<h1 align="center">
	<br>
	<img src="https://github.com/dsheiko/puppetry/raw/master/app/assets/puppetry.png" alt="Puppetry" width="200" />
	<br>
	Puppetry
	<br>
</h1>

[![Build Status](https://travis-ci.org/dsheiko/puppetry.png)](https://travis-ci.org/dsheiko/puppetry)
[![Gitter chat](https://badges.gitter.im/dsheiko/gitter.png)](https://gitter.im/dsheiko/puppetry)
[<img src="https://img.shields.io/badge/slack-puppetry.app-yellow.svg?logo=slack">](https://puppetry-app.slack.com)
[![Total downloads](https://img.shields.io/github/downloads/dsheiko/puppetry/total.svg)](https://github.com/dsheiko/puppetry/releases)
[![Latest download](https://img.shields.io/github/downloads/dsheiko/puppetry/v3.2.5/total.svg)](https://github.com/dsheiko/puppetry/releases/latest)

<h3 align="center">CODELESS END-TO-END AUTOMATED TESTING</h3>

Puppetry is an open-source cross-platform desktop application that gives non-developers the ability to create, manage, and integrate automated tests for Web

![Puppetry - codeless end-to-end test automation, integrated with CI/CD pipeline](https://github.com/dsheiko/puppetry/raw/master/docs/assets/img/puppetry-welcome.png)

- [:tv: Recording Automated Tests with Puppetry](https://youtu.be/dfuNhTCRMRg  "Recording Automated Tests with Puppetry")
- [:tv: How to test Responsive Web Design with Puppetry](https://youtu.be/m1az-KLboG8  "How to test Responsive Web Design with Puppetry")

# Welcome Puppetry
Puppetry offers you an easy-to-use UI where you choose browser methods and assertions from a predefined list, with predefined settings, guided by extensive tips.
Namely you can do the following:
- record user flow
- declare element targets as pairs `variable = locator`, where locator can be either CSS selector or Xpath.
- manage your test structure in BDD style (project, suite, test context, test case)
- manage page/element methods and assertions
- run the tests in Chromium/Chromium/Chrome/Firefox/Edge
- export the project as Jest/Puppeteer bundle ready to run in CLI (e.g. by a continuous integration server)

# Key Features

- Can be used by QA engineers with no programming background
- Features Headless Chrome ([Puppeteer](https://pptr.dev)) and [Jest](https://jestjs.io/)
- Tests can run within the application as well as to be [exported e.g. for CI-server](https://docs.puppetry.app/exporting-tests-for-ci)
- Exporting
  - as [Jest.js project](https://docs.puppetry.app/export/exporting-tests-for-ci), ready to plugin in CI/CD pipeline
  - as [human-readable test specification](https://docs.puppetry.app/export/export-as-test-specification) provided with screenshots per test step.
- [Staging, template variables and expressions](https://docs.puppetry.app/template)
- [Reusable and configurable test scenarios](https://docs.puppetry.app/snippets)
- [Built-in automation recorder](https://docs.puppetry.app/suite#recording-suite-showcase)
- [Interactive mode](https://docs.puppetry.app/running-tests/interactive-mode), where one can navigate test steps similar to Cypress
- [Version control (GIT integration)](https://docs.puppetry.app/version-control)
- Support Allure test reports
- Support of distinct testing types:
  - [Functional testing](https://docs.puppetry.app/getting-started)
  - [Testing Dynamic Content](https://docs.puppetry.app/testing-techniques/testing-dynamic-content)
  - [Exhaustive Testing](https://docs.puppetry.app/testing-techniques/exhaustive-testing)
  - [Performance Testing](https://docs.puppetry.app/testing-techniques/performance-testing)
  - [Visual Regression Testing](https://docs.puppetry.app/testing-techniques/css-regression-testing)
  - [Mocking HTTP/S Requests](https://docs.puppetry.app/testing-techniques/mocking-http-s-requests)
  - [Testing REST API](https://docs.puppetry.app/testing-techniques/testing-rest-api)
  - [Testing Google Analytics tracking code](https://docs.puppetry.app/testing-techniques/testing-google-analytics-tracking-code)
  - [Testing Chrome Extensions](https://docs.puppetry.app/testing-techniques/testing-chrome-extensions)
  - [Testing Shadow DOM](https://docs.puppetry.app/testing-techniques/testing-shadow-dom)
  - [Testing Transactional Emails](https://docs.puppetry.app/testing-techniques/testing-emails).


## Download

You can download latest installers for your platform [from the releases page](https://github.com/dsheiko/puppetry/releases)

Current only the following OS are supported:

-   Windows 7 and greater (64 bit)
-   Ubuntu 14.04 and greater (64 bit)
-   MacOS X 10.10 (Yosemite) and greater (64 bit)

On Linux can be installed with [Snapcraft](https://snapcraft.io/docs/installing-snapd):
```
sudo snap install puppetry
```

On Mac can be installed with [Homebrew](https://brew.sh/):
```
brew cask install puppetry
```
## FAQ

- [Stackoverflow](https://stackoverflow.com/questions/tagged/puppetry)

## Feedback

- [Join Puppetry on Slack](http://puppetry.dsheiko.com) :coffee:
- [Chat](https://gitter.im/dsheiko/puppetry)
- [Facebook](https://www.facebook.com/pg/puppetry.testing/)
- [Feature requests](https://github.com/dsheiko/puppetry/issues)
- [Problem reports](https://github.com/dsheiko/puppetry/issues)

## Contributing

- get acquainted with guides
  - [the great document](https://github.com/firstcontributions/first-contributions) about first contributions
- examine the [Backlog](https://github.com/dsheiko/puppetry/projects), suggest new features
- look into existing Issues, come up with a fix (`master` branch)
- implement new features (`dev` branch)
- check [Developer Guide](https://github.com/dsheiko/puppetry/wiki/)

Please adhere the coding style. We have one based on jQuery's JavaScript Style Guide. You can find the validation rules in `.eslintrc`
and lint the code by running `npm run lint`


## Thanks

A special thanks to
[Monika Rao](https://github.com/monika-12),
[vteixeira19](https://github.com/vteixeira19),
[Gernot Messow](https://github.com/uvexgmessow),
[Carlos Mantilla](https://github.com/ceoaliongroo),
[kkmuffme](https://github.com/kkmuffme),
[Ravindra Jadhav](https://github.com/jadhavravindra)
for the ideas and support

## Credits

-   [Electron](http://electronjs.org/)
-   [Puppeteer](https://pptr.dev)
-   [Jest](https://jestjs.io/)

## License

MIT
