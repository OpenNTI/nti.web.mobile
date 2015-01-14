'use strict';

var React = require('react/addons');
var ensureArray = require('dataserverinterface/utils/ensure-array');

var {Dom} = require('../../Utils');

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
		dndEvents: React.PropTypes.object,
		currentDragItem: React.PropTypes.object,
		onDragOver: React.PropTypes.func.isRequired,
		onDrop: React.PropTypes.func.isRequired
	},


	isActive() {
		var drag = this.context.currentDragItem;
		var type = drag && drag.props.type;
		return drag && this.accepts(type);
	},


	isDisabled() {
		var drag = this.context.currentDragItem;
		var type = drag && drag.props.type;
		return drag && !this.accepts(type);
	},


	accepts(type) {
		var criteria = ensureArray(this.props.accepts);

		return criteria.reduce((yes, x)=>{
			return yes || (x === type) || (x.accepts && x.accepts(type));
		}, false);
	},


	getInitialState() {
		return {hover: false};
	},


	componentDidMount() {
		var mon = this.context.dndEvents;
		if (mon) {
			mon.on('drag', this._onDraggableNotification);
			mon.on('dragEnd', this._onDragLeftDropTarget);
			mon.on('drop', this._onDragDrop);

		} else {
			console.error('DND: Missing cordination context');
		}
	},


	componentWillUnmount() {
		var mon = this.context.dndEvents;
		if (mon) {
			mon.removeListener('drag', this._onDraggableNotification);
			mon.removeListener('dragEnd', this._onDragLeftDropTarget);
			mon.removeListener('drop', this._onDragDrop);
		}
	},


	renderDropTargetWrapper(children) {
		return React.createElement(this.props.tag||'div', Object.assign({}, this.props, {
			children: children,
			className: this.__getWrapperElementClassName()
		}));
	},


	__getWrapperElementClassName() {
		var classes = ['dnd-drop-target'];
		var push = classes.push.bind(classes);

		if (this.isActive()) { push('active'); }
		if (this.isDisabled()) { push('disabled'); }
		if (this.state.over) { push('over'); }
		if (this.props.className) { push(this.props.className); }

		return classes.join(' ');
	},


	_onDraggableNotification(dragData) {
		var {x, y} = dragData;
		if (!this.isMounted() || !this.context.currentDragItem) {return;}

		if (Dom.isPointWithIn(this.getDOMNode(), x, y)) {
			if (!this.state.over) {
				this._onDragEnteredDropTarget();
			}
		} else {
			if (this.state.over) {
				this._onDragLeftDropTarget();
			}
		}
	},


	_onDragEnteredDropTarget() {
		if (this.context.currentDragItem) {
			this.setState({over: true});
			this.context.onDragOver(this);
		}
	},


	_onDragLeftDropTarget() {
		this.setState({over: false});
		this.context.onDragOver(null, this);
	},


	_onDragDrop(drop) {
		var {target} = drop;
		if(target === this && this.props.onDrop) {
			this.props.onDrop(drop);
		}
	},


	handleDrop() {
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
