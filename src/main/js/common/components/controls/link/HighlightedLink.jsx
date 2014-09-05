/**
* @jsx React.DOM
*/

"use strict";

var React = require('react');
var Router = require('react-router-component');
var Environment = Router.environment;


var Link = React.createClass({
    mixins: [Router.NavigatableMixin],

    displayName: 'Link',

    propTypes: {
        tag: React.PropTypes.string,
        role: React.PropTypes.string,
        href: React.PropTypes.string.isRequired,
        global: React.PropTypes.bool,
        globalHash: React.PropTypes.bool
    },


    getDefaultProps: function() {
        return {
            activeClassName: 'active'
        };
    },


    isActive: function() {
        return this.getPath() === this.props.href;
    },


    onClick: function(e) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        if (!e.defaultPrevented) {
            e.preventDefault();
            this._navigate(this.props.href, function(err) {
            if (err) {
                throw err;
            }
            });
        }
    },

    _navigationParams: function() {
        var params = {};
        for (var k in this.props) {
            if (!this.constructor.propTypes[k]) {
                params[k] = this.props[k];
            }
        }
        return params;
    },

    _createHref: function() {
        return this.props.global ?
            Environment.defaultEnvironment.makeHref(this.props.href) :
            this.makeHref(this.props.href);
    },

    _navigate: function(path, cb) {
        if (this.props.globalHash) {
            return Environment.hashEnvironment.navigate(path, cb);
        }

        if (this.props.global) {
            return Environment.defaultEnvironment.navigate(path, cb);
        }

        return this.navigate(path, this._navigationParams(), cb);
    },

    render: function() {
        var Tag = React.DOM[this.props.tag || 'a'];
        var className = this.props.baseClassName || '';
        if (this.props.activeClassName && this.isActive()) {
            className += ' ' + this.props.activeClassName;
        }
        var props = {
            onClick: this.onClick,
            href: this._createHref(),
            role: this.props.role,
            className: className
        };

        return this.transferPropsTo(Tag(props, this.props.children));
    }
});


module.exports = Link;
