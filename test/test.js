'use strict';

var noin = require('../index');
var path = require('path');
var fs = require('fs-extra');
var expect = require('chai').expect;
var whacko = require('whacko');
require('mocha-jshint')();

describe('general', function() {
  before(function() {
    var testfilepath = path.join(__dirname, 'assets/');
    fs.copySync(path.join(testfilepath, 'inline.html'),
                path.join(testfilepath, 'inline.html.old'));
    noin.runNoin(path.join(testfilepath, 'inline.html'));
  });
  after(function() {
    var testfilepath = path.join(__dirname, 'assets/');
    fs.unlinkSync(path.join(testfilepath, 'inline.html'));
    fs.renameSync(path.join(testfilepath, 'inline.html.old'),
                  path.join(testfilepath, 'inline.html'));
    fs.unlinkSync(path.join(testfilepath, 'inline_events.js'));
    fs.unlinkSync(path.join(testfilepath, 'inline_script0.js'));
    fs.unlinkSync(path.join(testfilepath, 'inline_script1.js'));
  });

  it ('removes inline scripts', function() {
    var html = fs.readFileSync(path.join(__dirname, 'assets/inline.html'), 'utf8');
    expect(html).to.contain('<script src=');
    expect(html).to.not.contain('<script>');
  });

  it ('removes inline event listeners', function() {
    var html = fs.readFileSync(path.join(__dirname, 'assets/inline.html'), 'utf8');
    expect(html).to.not.contain('onClick=');
    expect(html).to.not.contain('onclick=');
    expect(html).to.not.match(/<([^<>\s]+)\s[^<>]*on[^<>="]+=[^<>]*>[\s\S]*<\/\1\s*>/g);
    var $ = whacko.load(html);
    var eventListeners = [];
    $('body').find('*').each(function() {
      var el = $(this);
      eventListeners = noin.getEventListeners(el);
    });
    expect(eventListeners).to.be.empty;
  });

  it ('creates .js files for the inline scripts', function() {
    var js0 = fs.readFileSync(path.join(__dirname, 'assets/inline_script0.js'), 'utf8');
    var js1 = fs.readFileSync(path.join(__dirname, 'assets/inline_script1.js'), 'utf8');
    expect(js0).to.exist;
    expect(js1).to.exist;
  });

  it ('creates a .js file for the inline event listeners', function() {
    var js = fs.readFileSync(path.join(__dirname, 'assets/inline_events.js'), 'utf8');
    expect(js).to.exist;
  });

});
