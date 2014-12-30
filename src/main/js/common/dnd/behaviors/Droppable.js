'use strict';

var React = require('react/addons');
var ensureArray = require('dataserverinterface/utils/ensure-array');

var Base = require('./Base');

var {TYPE_SHAPE} = Base;

Object.assign(exports, {
	mixins: [Base],

	propTypes: {
		accepts: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.shape(TYPE_SHAPE),
			React.PropTypes.arrayOf(React.PropTypes.string),
			React.PropTypes.arrayOf(React.PropTypes.shape(TYPE_SHAPE))
			]).isRequired,
	},


	contextTypes: {
		currentDragItem: React.PropTypes.object,
		onDragOver: React.PropTypes.func.isRequired,
		onDrop: React.PropTypes.func.isRequired
	},


	isActive: function () {
		var drag = this.context.currentDragItem;
		var type = drag && drag.props.type;
		return drag && this.accepts(type);
	},


	isDisabled: function () {
		var drag = this.context.currentDragItem;
		var type = drag && drag.props.type;
		return drag && !this.accepts(type);
	},


	accepts: function (type) {
		var criteria = ensureArray(this.props.accepts);

		return criteria.reduce((yes, x)=>{
			return yes || (x === type) || (x.accepts && x.accepts(type));
		}, false);
	},


	getInitialState: function () {
		return {hover: false};
	},


	renderDropTargetWrapper: function (children) {
		return React.createElement('div', Object.assign({}, this.props, {
			children: children,
			className: this.__getWrapperElementClassName(),
			onMouseEnter: this._onMouseEnteredDropTarget,
			onMouseLeave: this._onMouseLeftDropTarget,
			onMouseUp: this._onMouseUpInDropTarget
		}));
	},


	__getWrapperElementClassName: function() {
		var classes = ['dnd-drop-target'];
		var push = classes.push.bind(classes);

		if (this.isActive()) { push('active'); }
		if (this.isDisabled()) { push('disabled'); }
		if (this.state.over) { push('over'); }
		if (this.props.className) { push(this.props.className); }

		return classes.join(' ');
	},


	_onMouseEnteredDropTarget: function () {
		if (this.context.currentDragItem) {
			this.setState({over: true});
			this.context.onDragOver(this);
		}
	},


	_onMouseLeftDropTarget: function () {
		this.setState({over: false});
		this.context.onDragOver(null);
	},


	_onMouseUpInDropTarget: function () {
		this.handleDrop();
	},


	handleDrop: function () {
		if (!this.isActive()) {
			return;
		}

		var dropped = true;

		if (this.onDrop) {
			dropped = this.onDrop();
			//Prevent undefined/null values (no return statement) from interrupting the context callback
			dropped = dropped || (typeof dropped !== 'boolean' || dropped);
		}

		if (dropped && this.context.onDrop) {
			this.context.onDrop(this);
		}

		return dropped;
	}

});
