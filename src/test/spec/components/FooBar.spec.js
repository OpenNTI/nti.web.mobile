/**
 * This is an example unit test for a React component. Tests should be placed in __test__ folders
 * along side the components/units they will be testing.
 */
import React from 'react';
import Button from 'common/forms/components/Button';

describe('FooBar', ()=> {
    let component;

    beforeEach(()=>{
        let container = document.createElement('div');
        container.id = 'content';
        document.body.appendChild(container);

        component = React.render(
            React.createElement(Button, {href: '#'}, 'Test'),
            container
        );

    });

    it('should create a new instance of Button', ()=> {
        expect(component).toBeDefined();
        expect(component.getDOMNode().textContent).toBe('Test');
    });


    it('should call preventDefault onClick', ()=> {
        let event = {
            preventDefault: ()=> {}
        };

        spyOn(event, 'preventDefault');

        component.onClick(event);

        expect(event.preventDefault).toHaveBeenCalled();

    });
});
