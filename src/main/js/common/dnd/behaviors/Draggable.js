'use strict';

var React = require('react/addons');

var Base = require('./Base');

var {TYPE_SHAPE} = Base;

Object.assign(exports, {
	mixins: [Base],


	propTypes: {
		type: React.PropTypes.oneOfType([
				React.PropTypes.string,
				React.PropTypes.shape(TYPE_SHAPE)
			]).isRequired
	},


	contextTypes: {
		currentDragItem: React.PropTypes.object.isRequired,
		onDragStart: React.PropTypes.func.isRequired,
		onDragStop: React.PropTypes.func.isRequired
	}

});
