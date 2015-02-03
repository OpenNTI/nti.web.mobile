import React from 'react/addons';
import {Locations, Location, NotFound as Default} from 'react-router-component';

//Main Views
import Contact from 'contact/components/View';
import Content from 'content/components/View';
import Course from 'course/components/View';
import Enrollment from 'enrollment/components/View';
import Home from 'home/components/View';
import Library from 'library/components/View';
import Login from 'login/components/View';
import NotFound from 'notfound/components/View';

import Redirect from 'navigation/components/Redirect';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Router',
	mixins: [BasePathAware],


	onNavigation () {
		if (global.scrollTo) {
			global.scrollTo(0,0);
		}

		var action = this.props.onNavigation;
		if (action) {
			action();
		}
	},


	render () {
		var basePath = this.getBasePath();
		return (
			<Locations path={this.props.path} onNavigation={this.onNavigation}>
				<Location path={basePath + 'login/*'} handler={Login} basePath={basePath}/>

				<Location path={basePath + 'library/*'} handler={Library} basePath={basePath} />
				<Location path={basePath + 'courseware*'} handler={Redirect} location={basePath + 'library/'} />

				<Location path={basePath + 'content/:pkgId/*'} handler={Content} basePath={basePath} />
				<Location path={basePath + 'course/:course/*'} handler={Course} basePath={basePath} />
				<Location path={basePath + 'enroll/:course/*'} handler={Enrollment} basePath={basePath} />

				<Location path={basePath + 'contact/:configname/'} handler={Contact} basePath={basePath} />

				<Location path={basePath} handler={Home} basePath={basePath} />
				<Default handler={NotFound} />
			</Locations>
		);
	}

});
