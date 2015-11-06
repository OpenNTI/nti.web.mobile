import React from 'react';
import {Link} from 'react-router-component';
import {PROFILE_VIEWED} from 'nti.lib.interfaces/models/analytics/MimeTypes';

import Loading from 'common/components/TinyLoader';
import ActiveState from 'common/components/ActiveState';
import {scoped} from 'common/locale';

import ProfileAnalytics from '../../mixins/AnalyticsMixin';
import Card from '../Card';
import Mixin from '../about/Mixin';

const t = scoped('PROFILE.ABOUT.SECTIONTITLES');

let sections = ['about', 'education', 'positions', 'interests'];

export default React.createClass({
	displayName: 'About:View',

	mixins: [Mixin, ProfileAnalytics],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	getAnalyticsMimeType () {
		return PROFILE_VIEWED;
	},

	render () {

		let {entity} = this.props;

		if (!entity) {
			return <Loading />;
		}

		let canEdit = entity.hasLink('edit');

		return (
			<div className="profile-view">
				<ul className="profile-cards">
					{sections.map((s, index) => {
						return ( <Card key={s} className={s} title={t(s)}><div>{this.renderItems(entity[s], index)}</div></Card> );
					})}
				</ul>
				{canEdit &&
					<div className="controls buttons">
						<ActiveState tag={Link} href="/edit/" className="button tiny">Edit Profile</ActiveState>
					</div>
				}
			</div>
		);
	}
});
