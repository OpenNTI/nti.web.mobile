'use strict';

var React = require('react');

describe('FooBar', function () {
    var Component, component;

    beforeEach(function () {
        var container = document.createElement('div');
        container.id = 'content';
        document.body.appendChild(container);

        var Component = React.createFactory(require('common/forms/components/Button'));
        component = React.render(
            Component({href: '#'}, 'Test'),
            container
        );

    });

    it('should create a new instance of Button', function () {
        expect(component).toBeDefined();
        expect(component.getDOMNode().textContent).toBe('Test');
    });


    it('should call preventDefault onClick', function() {
        var event = {
            preventDefault: function () {}
        };

        spyOn(event, 'preventDefault');

        component.onClick(event);

        expect(event.preventDefault).toHaveBeenCalled();

    });
});
