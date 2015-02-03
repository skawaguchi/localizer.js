# i18n-mock.js

> A node module that generates fake localization files from a set of source language files in a directory. Intended to for use with Gulp and targeted for projects using angular-translate partials.

## Installation

```sh
$ npm install --save-dev i18n-mock
```

## Usage

```js
  var i18nMock = require( 'i18nMock' );

  gulp.task( 'mock', function () {
    return gulp.src('path/to/source/content/files/**.json')
      .pipe ( i18nMock([
        { fileName: 'fr', prepend: 'FR:' },
        { fileName: 'es', prepend: 'ES:' }
      ], { noLogging: true } ))
      .pipe( gulp.dest('dist'));
    ;
  });

```

This example source json will be modified

```json
  {
    "key": "Lorem ipsum dolor",
    "parentKey": {
      "childKey": "Lorem ipsum dolor"
    }
  }
```

A fake French locale file will be created with this content:

```json
  {
    "key": "FR: Lorem ipsum dolor",
    "parentKey": {
      "childKey": "FR: Lorem ipsum dolor"
    }
  }
```

A fake Spanish locale file will be created with this content:

```json
  {
    "key": "ES: Lorem ipsum dolor",
    "parentKey": {
      "childKey": "ES: Lorem ipsum dolor"
    }
  }
```

Pretty simple! Just a quick way to create mocked localization files that you can test against while you're developing.

## Options

### options.noLogging

Prevent logging.

    Type: `Boolean`
    Default: `false`
    Valid values: `true | false`

## LICENSE

Copyright (c) 2015 Stephen Kawaguchi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
