import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { ActiveState, Loading } from 'nti-web-commons';
import { ViewEvent } from 'nti-web-session';
import { scoped } from 'nti-lib-locale';

import ProfileAnalytics from '../../mixins/AnalyticsMixin';
import Card from '../Card';
import Mixin from '../about/Mixin';

const t = scoped('profile.about.sectiontitles', {
	'about': 'About',
	'education': 'Education',
	'positions': 'Professional',
	'interests': 'Interests'
});

let sections = ['about', 'education', 'positions', 'interests'];

export default createReactClass({
	displayName: 'About:View',

	mixins: [Mixin, ProfileAnalytics],

	propTypes: {
		entity: PropTypes.object.isRequired
	},

	getAnalyticsType () {
		return 'ProfileAboutView';
	},

	render () {

		let {entity} = this.props;

		if (!entity) {
			return <Loading.Ellipse />;
		}

		let canEdit = entity.isModifiable;

		return (
			<div className="profile-view">
				<ViewEvent {...this.getAnalyticsData()}/>
				<ul className="profile-cards">
					{sections.map((s, index) => {
						return ( <Card key={s} className={s} title={t(s)}><div>{this.renderItems(entity[s], index)}</div></Card> );
					})}
				</ul>
				{canEdit &&
					<div className="controls buttons">
						<ActiveState tag="a" href="/edit/" className="button tiny">Edit Profile</ActiveState>
					</div>
				}
			</div>
		);
	}
});
