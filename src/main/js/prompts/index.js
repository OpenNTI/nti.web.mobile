import Dialog from './components/Dialog';

export function areYouSure(message, title) {
	return new Promise((acknowledge, cancel)=> {
		Dialog.show({
			confirmButtonClass: 'caution',
			message, title,
			onConfirm: ()=>	acknowledge(),
			onCancel: ()=>	cancel('Prompt Canceled')
		});
	});
}
