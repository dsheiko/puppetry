# Smalltalk [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage][CoverageIMGURL]][CoverageURL]

Simple [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based replacement of native Alert, Confirm and Prompt.

# Install

```
npm i smalltalk
```

# API

First things first, require `smalltalk` with:

```js
const smalltalk = require('smalltalk');
```

You can also use native version with:

```js
const smalltalk = require('smalltalk/native');
```

In every method of `smalltalk` last parameter *options* is optional and could be used
to prevent handling of cancel event and to specify custom button label.

```js
{
    cancel: true /* default */
}
```

## smalltalk.alert(title, message [, options])

![Alert](https://raw.githubusercontent.com/coderaiser/smalltalk/master/screen/alert.png "Alert")

```js
smalltalk
    .alert('Error', 'There was an error!')
    .then(() => {
        console.log('ok');
    });
```

## smalltalk.confirm(title, message [, options])

![Confirm](https://raw.githubusercontent.com/coderaiser/smalltalk/master/screen/confirm.png "Confirm")

```js
smalltalk
    .confirm('Question', 'Are you sure?')
    .then(() => {
        console.log('yes');
    })
    .catch(() => {
        console.log('no');
    });
```

## smalltalk.prompt(title, message, value [, options])

![Prompt](https://raw.githubusercontent.com/coderaiser/smalltalk/master/screen/prompt.png "Prompt")

```js
smalltalk
    .prompt('Question', 'How old are you?', '10')
    .then((value) => {
        console.log(value);
    })
    .catch(() => {
        console.log('cancel');
    });
```

Use `type='password'` for `password` fields:

```js
smalltalk
    .prompt('Question', 'How old are you?', '10', {
        type: 'password',
    })
    .then((value) => {
        console.log(value);
    })
    .catch(() => {
        console.log('cancel');
    });
```

## Custom label 

You can use custom label passing into options param the buttons specification. For example :
```js
const tryToCatch = require('try-to-catch');
const OK = 2;
const result = await tryToCatch(smalltalk.confirm, 'Question', 'Are you sure?', {
    buttons: {
        ok: 'Ok Label',
        cancel: 'Cancel Label',
    }
});

if (result.length === OK)
    console.log('yes');
else
    console.log('no');
```

## Bundlers

When `webpack` `rollup` or `browserify` used, you can import `es5` version with:

```js
import smalltalk from 'smalltalk/legacy';
```

# License
MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/smalltalk.svg?style=flat&longCache=true
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/smalltalk/master.svg?style=flat&longCache=true
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/smalltalk.svg?style=flat&longCache=true
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat&longCache=true

[NPMURL]:                   https://npmjs.org/package/smalltalk "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/smalltalk  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/smalltalk "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/coderaiser/smalltalk?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/smalltalk/badge.svg?branch=master&service=github

