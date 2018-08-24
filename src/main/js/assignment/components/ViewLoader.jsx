import Loadable from 'react-loadable';
import {Loading} from '@nti/web-commons';

export default Loadable({
	loader: () => import(/* webpackChunkName: "assignments" */'./View'),
	loading: Loading.Mask,
});
