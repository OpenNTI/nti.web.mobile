import Loadable from 'react-loadable';
import {Loading} from '@nti/web-commons';

export default Loadable({
	loader: () => import(/* webpackChunkName: "enrollment" */'./View'),
	loading: Loading.Mask,
});
