
"use strict";

var React = require('react');
var Router = require('react-router-component');


var ActiveState = React.createClass({
    mixins: [Router.NavigatableMixin],

    displayName: 'ActiveState',

    propTypes: {
        activeClassName: React.PropTypes.string,
        tag: React.PropTypes.string
    },


    getDefaultProps: function() {
        return {
            tag: 'span',
            activeClassName: 'active'
        };
    },


    isActive: function() {
        //We will make our href's absolute...
        return this.makeHref(this.getPath()) === this.props.href;
        //this.getPath returns a router-relative ref... our href's are absolute.
        //return this.getPath() === this.props.href;
    },


    render: function() {
        var Tag = this.props.tag;
        var className = this.props.className || '';

        if (this.props.activeClassName && this.isActive()) {
            className += ' ' + this.props.activeClassName;
        }

        var props = Object.assign({}, this.props, {
            className: className
        });

        return <Tag {...props}/>;
    }
});


module.exports = ActiveState;
