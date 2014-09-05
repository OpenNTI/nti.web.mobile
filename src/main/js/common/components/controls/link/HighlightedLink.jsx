/**
* @jsx React.DOM
*/

'use strict';

var React = require('react');
var Router = require('react-router-component');

module.exports = React.createClass({

    mixins: [Router.NavigatableMixin],


    getDefaultProps: function() {
        return {
            activeClassName: 'active'
        };
    },


    isActive: function() {
        return this.getPath() === this.props.href;
    },


    render: function() {
        var className = this.props.baseClassName || '';
        if (this.props.activeClassName && this.isActive()) {
            className += ' ' + this.props.activeClassName;
        }
        var link = Router.Link({className: className}, this.props.children);
        return this.transferPropsTo(link);
    }
});
