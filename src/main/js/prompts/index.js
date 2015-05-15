import Dialog from './components/Dialog';

export function areYouSure(message) {
	return new Promise((acknowledge, cancel)=> {
		Dialog.show({
			confirmButtonClass: 'caution',
			message: message,
			onConfirm: ()=>	acknowledge(),
			onCancel: ()=>	cancel('Prompt Canceled')
		});
	});
}
