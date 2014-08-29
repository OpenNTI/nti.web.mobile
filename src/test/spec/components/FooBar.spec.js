'use strict';

describe('FooBar', function () {
  var Component, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    Component = require('../../../main/js/components/FooBar.jsx');
    component = Component();
  });

  it('should create a new instance of FooBar', function () {
    expect(component).toBeDefined();
  });
});
