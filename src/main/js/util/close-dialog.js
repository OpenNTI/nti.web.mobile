import {environment} from 'react-router-component';

const {defaultEnvironment: ENV, hashEnvironment: DLGENV} = environment;


export default function closeDialog () {
	const {scrollX, scrollY} = global;

	DLGENV.setPath('');
	ENV.setPath(ENV.getPath(), {replace: true});

	try {
		const {scrollTo} = global;
		scrollTo(scrollX, scrollY);
		setTimeout(() => scrollTo(scrollX, scrollY), 1); //safari... always gonna be difficult.
	} catch (e) {
		//don't care
	}
}
