import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {PROFILE_VIEWED} from 'nti-analytics';
import ProfileAnalytics from '../../mixins/AnalyticsMixin';

import {ActiveState, Loading} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import Card from '../Card';
import Mixin from '../about/Mixin';

const t = scoped('PROFILE.ABOUT.SECTIONTITLES');

let sections = ['about', 'education', 'positions', 'interests'];

export default createReactClass({
	displayName: 'About:View',

	mixins: [Mixin, ProfileAnalytics],

	propTypes: {
		entity: PropTypes.object.isRequired
	},

	getAnalyticsMimeType () {
		return PROFILE_VIEWED;
	},

	render () {

		let {entity} = this.props;

		if (!entity) {
			return <Loading.Ellipse />;
		}

		let canEdit = entity.isModifiable;

		return (
			<div className="profile-view">
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
