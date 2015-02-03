var i18nMock = require ( '../' );
var gutil = require ( 'gulp-util' );
var path = require ( 'path' );
var chai = require ( 'chai' );
require ( 'mocha' );


chai.config.includeStack = true;
global.expect = chai.expect;
chai.should ();
chai.use ( sinonChai );

function createFile ( base, fileName, contents ) {

  return new gutil.File ({
    base: path.join ( __dirname, base ),
    cwd: __dirname,
    path: path.join ( base, fileName),
    contents: new Buffer ( contents || '{"item1": "My content", "parent": { "nestedItem1": "My nested content"}}' )
  });
}

describe ( 'i18nMock.js', function () {

  describe ( 'Core Functionality', function () {

    var testFile1;
    var testFile2;
    var count;

    beforeEach ( function () {
      testFile1 = createFile ( 'test/content', 'en.json' );
      testFile2 = createFile ( 'test/content/sub', 'en.json' );
      count = 0;
    });

    it ( 'should create a valid file', function (done) {

      var stream = i18nMock([], { noLogging: true });

      stream.on ( 'data', function (file) {
        expect( file ).not.to.equal ( undefined );
        expect( file.contents ).not.to.equal ( undefined );
        expect( file.path ).not.to.equal ( undefined );
        expect( file.relative ).not.to.equal ( undefined );
      });

      stream.once ( 'end', function () {
        done();
      });

      stream.write ( testFile1 );
      stream.end ();
    });

    it ( 'should create a single fake localefile', function (done) {

      var stream = i18nMock([
        { fileName: 'fr', prepend: 'FR:' }
      ], { noLogging: true });

      stream.on ( 'data', function ( file ) {
        if ( count === 0 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('FR:');
          expect( file.path ).to.contain ('fr.json');
        }
        // The second file out is the source 'en' file
        else {
          expect( file.contents.toString('utf8') ).not.to.contain ('FR:');
          expect( file.path ).not.to.contain ('fr.json');
        }
        count += 1;
      });

      stream.once ( 'end', function () {
        done();
      });

      stream.write ( testFile1 );
      stream.end ();
    });

    it ( 'should create multiple fake locale files', function (done) {

      var stream = i18nMock([
        { fileName: 'fr', prepend: 'FR:' },
        { fileName: 'de', prepend: 'DE:' },
        { fileName: 'es', prepend: 'ES:' }
      ], { noLogging: true });

      stream.on ( 'data', function ( file ) {
        if ( count === 0 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('FR:');
          expect( file.path ).to.contain ('fr.json');
        } else if ( count === 1 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('DE:');
          expect( file.path ).to.contain ('de.json');
        } else if ( count === 2 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('ES:');
          expect( file.path ).to.contain ('es.json');
        }
        // The second file out is the source 'en' file
        else {
          expect( file.path ).to.contain ('en.json');
        }
        count += 1;
      });

      stream.once ( 'end', function () {
        done();
      });

      stream.write ( testFile1 );
      stream.end ();
    });

    it ( 'should create multiple fake locale files to different directories', function (done) {

      var stream = i18nMock([
        { fileName: 'fr', prepend: 'FR:' },
        { fileName: 'de', prepend: 'DE:' }
      ], { noLogging: true });

      stream.on ( 'data', function ( file ) {
        if ( count === 0 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('FR:');
          expect( file.path ).to.contain ('content/fr.json');
        } else if ( count === 1 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('DE:');
          expect( file.path ).to.contain ('content/de.json');
        } else if ( count === 5 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('FR:');
          expect( file.path ).to.contain ('content/fr.json');
        } else if ( count === 4 ) {
          expect( file.contents.toString ('utf8') ).to.contain ('DE:');
          expect( file.path ).to.contain ('content/sub/de.json');
        }
        // The second file out is the source 'en' file
        else {
          expect( file.path ).to.contain ('en.json');
        }
        count += 1;
      });

      stream.once ( 'end', function () {
        done();
      });

      stream.write ( testFile1 );
      stream.write ( testFile2 );
      stream.end ();
    });

  });

  describe ( 'Initialization Functionality', function () {

    it ( 'should default to Samaritan Aramaic if no languages are defined', function ( done ) {

      var stream = i18nMock ( null, { noLogging: true });
      var testFile = createFile ( 'test/content', 'en.json' );
      var count = 0;

      stream.on ( 'data', function ( file ) {

        // The first file out will be the generated one
        if ( count === 0 ) {
          expect( file.contents.toString('utf8') ).to.contain ('SAM:');
        }
        // The second file out is the source 'en' file
        else {
          expect( file.contents.toString('utf8') ).not.to.contain ('SAM:');
        }
        count += 1;

      });

      stream.once ( 'end', function () {
        done();
      });

      stream.write ( testFile );
      stream.end ();

    });

  });

});
