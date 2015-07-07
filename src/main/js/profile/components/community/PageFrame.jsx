import React from 'react';

import Controls from './HeaderControls';
import Head from './Head';
import Invite from './Invite';

import {getWidth} from 'common/utils/viewport';

import Gradient from 'common/components/GradientBackground';
import Page from 'common/components/Page';

export default React.createClass({
	displayName: 'Community:Page',

	propTypes: {
		pageContent: React.PropTypes.any,
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let narrow = getWidth() < 1024;
		let {entity, pageContent = 'div'} = this.props;

		let Content = pageContent;

		let topLeft = narrow
			? ( <Invite entity={entity}/> )
			: ( <h1>{entity.displayName}</h1> );


		return (
			<Page title="Profile">
				<Gradient className="community profile-wrapper">
					<div className="profile-top-controls">
						{topLeft}
						<Controls entity={entity}/>
					</div>
					<div className="profile">
						<nav>
							<Head entity={entity} narrow={narrow}/>
						</nav>
						<section>
							<Content {...this.props}/>
						</section>
					</div>
				</Gradient>
			</Page>
		);
	}
});
