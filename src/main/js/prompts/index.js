import Dialog from './components/Dialog';

export function areYouSure (message, title = 'Are you sure?', extra = {}) {
	return new Promise((acknowledge, cancel)=> {
		Dialog.show(Object.assign(extra || {}, {
			confirmButtonClass: 'caution',
			message, title,
			onConfirm: ()=>	acknowledge(),
			onCancel: ()=>	cancel('Prompt Canceled')
		}));
	});
}
