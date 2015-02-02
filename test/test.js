var i18nMock = require ( '../' );
var gulp = require ( 'gulp' );
var gutil = require ( 'gulp-util' );
var path = require ( 'path' );
var fs = require ( 'fs' );
var chai = require ( 'chai' );
require ( 'mocha' );

chai.config.includeStack = true;
global.expect = chai.expect;

//function createFile ( fileName, contents) {
//
//  var base = path.join ( __dirname, 'fixtures');
//  var filePath = path.join ( base, fileName);
//
//  return new gutil.File ({
//    base: base,
//    cwd: 'test/',
//    path: filePath,
//    contents: contents || fs.readFileSync ( filePath )
//  });
//}

function getFile ( filePath ) {
  filePath = 'test/' + filePath;
  return new gutil.File({
    path: filePath,
    cwd: 'test/',
    base: path.dirname (filePath),
    contents: fs.readFileSync ( filePath )
  });
}

describe ( 'i18nMock.js', function () {

  var files;

  describe ( 'Core Functionality', function () {

    beforeEach(function () {

    });

    it('should pass a valid file', function (done) {

      var testFile = getFile ( 'fixtures/content/en.json' );

      var stream = i18nMock([], {noLogging: true});

      stream.on('data', function (file) {
        expect(file).not.to.equal(undefined);
        expect(file.contents).not.to.equal(undefined);
        expect(file.path).not.to.equal(undefined);
        expect(file.relative).not.to.equal(undefined);
      });

      stream.once('end', function () {
        done();
      });

      stream.write(testFile);
      stream.end();
    });


  });

  describe ( 'Initialization Functionality', function () {

    //it ( 'should default to Samaritan Aramaic if no languages are defined', function () {
    //  gulp.src ( './content/**/en.json' )
    //    .pipe ( localizer() )
    //    .pipe ( gulp.dest ( './content/' ) );
    //  //var file = JSON.stringify ( JSON.parse ( stream.contents.toString('utf8') ) );
    //});

  });

});
