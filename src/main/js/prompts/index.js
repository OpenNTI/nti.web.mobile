'use strict';
var Dialog = require('./components/Dialog');

exports.areYouSure = function(message) {
	return new Promise((confirm, cancel)=>{
		Dialog.show({
			confirmButtonClass: 'caution',
			message: message,
			onConfirm: ()=>	confirm(),
			onCancel: ()=>	cancel('Prompt Canceled')
		});
	});
};
