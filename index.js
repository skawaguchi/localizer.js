/**
 *
 * @desc i18n-mock.js is a very simple tool to create fake localization
 * files based on your core language files. It's intended to use streams
 * and is particularly useful with Gulp. For example, if you work
 * with English files, simply pass in your files via a Gulp stream along
 * with the fileConfigs. If you don't pass in a fileConfigs object,
 * then i18n-mock.js defaults to Samaritan Aramaic, a dead language:
 * http://en.wikipedia.org/wiki/List_of_ISO_639-2_codes
 *
 * @example
 *  return gulp.src ( './app/content/en.json')
 *  .pipe ( i18nMock([
 *    { fileName: 'fr', prepend: 'FR:' },
 *    { fileName: 'es', prepend: 'ES:' }
 *  ]))
 *  .pipe ( gulp.dest ( './app/content/' ))
 *
 * @param {array} fileConfigs This is a required parameter. It expects
 * an array with value objects within it that consist of two attributes:
 * fileName, which is the json file that will be generated, and prepend
 * which is the string that will be added to the beginning of every
 * value in the code.
 *
 * @param {object} opts This is a value object that can be used to
 * configure the behaviour of the plugin. This currently only supports
 * the noLogging boolean flag if you want to turn off logging.
 *
 */

var jsBeautify = require('js-beautify').js_beautify;
var gutil = require ( 'gulp-util' );
var path = require ('path');
var through2 = require ( 'through2' );

module.exports = function ( fileConfigs, opts ) {

  'use strict';

  opts = opts || {};

  if ( ! fileConfigs ) {
    gutil.log ( 'i18nMock generated fake Samaritan Aramaic files for you' );
    fileConfigs = [{ fileName: 'sam', prepend: 'SAM:'}];
  }

  // Use through to pass the stream through
  return through2.obj ( function ( file, enc, cb ) {

    if ( file.isStream () ) {
      cb ( new gutil.PluginError( 'i18nMock.js', { message: 'Streaming not supported' } ));
      return;
    }

    if ( fileConfigs && ! Array.isArray( fileConfigs ) ) {
      cb ( new gutil.PluginError( 'i18nMock.js', { message: 'You must pass an array with objects with fileName and prepend attributes to i18nMock' } ));
      return;
    }

    try {

      // Loop through the languages that are passed in
      fileConfigs.forEach( function ( config, index ) {

        var json = JSON.stringify ( JSON.parse ( file.contents.toString('utf8'), function ( key, value ) {

          if ( typeof value === 'string' ) {
            return config.prepend + ' ' + value;
          }

          return value;
        } ) );

        json = jsBeautify( json, {
          indent_size: 2,
          indent_char: ' '
        });

        var newFile = new gutil.File ({
          base: file.base,
          cwd: file.cwd,
          path: path.join ( file.path.replace( /(.*)([a-zA-Z]{2})(.json)/, '$1'), config.fileName + '.json' ),
          contents: new Buffer ( json )
        });

        if ( ! opts.noLogging ) {

          // Pretty logging
          if ( index === 0 ) {
            gutil.log ( gutil.colors.black.bgGreen ( 'Target directory' ), newFile.path.split('/').slice (0, -1).join('/') );
          }

          gutil.log ( gutil.colors.black.bgGreen ( 'Generated' ), newFile.path.split('/').pop() );

        }
console.log(newFile.path);
        this.push( newFile );

      }, this);

    } catch ( err ) {

      new gutil.PluginError ( 'i18nMock.js', { error: err });

    }

    cb(null, file);
  });
};