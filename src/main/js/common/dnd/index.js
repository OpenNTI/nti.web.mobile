'use strict';

Object.assign(exports, {
	behaviors: {
		Draggable: require('./behaviors/Draggable'),
		Droppable: require('./behaviors/Droppable')
	},

	Draggable: require('./components/Draggable'),
	DropTarget: require('./components/DropTarget'),

	Mixin: require('./Mixin')
});
