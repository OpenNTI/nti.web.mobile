/** @jsx React.DOM */

"use strict";

var React = require('react/addons');
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
        var Tag = React.DOM[this.props.tag];
        var className = this.props.className || '';

        if (this.props.activeClassName && this.isActive()) {
            className += ' ' + this.props.activeClassName;
        }
        var props = {
            className: className
        };

        return this.transferPropsTo(Tag(props, this.props.children));
    }
});


module.exports = ActiveState;
