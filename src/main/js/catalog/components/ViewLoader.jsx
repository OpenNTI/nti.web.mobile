import Loadable from 'react-loadable';
import {Loading} from '@nti/web-commons';

export default Loadable({
	loader: () => import(/* webpackChunkName: "catalog" */'./View'),
	loading: Loading.Mask,
});
