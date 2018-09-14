import {Router, Route} from '@nti/web-routing';
import {Navigation} from '@nti/web-course';

export default Router.for([
	Route({path: '/', component: Navigation.Tabs})
]);
