import React from 'react';

import Card from '../Card';
import Loading from 'common/components/TinyLoader';
import Mixin from '../about/Mixin';
import Link from 'common/components/ActiveLink';

import {scoped} from 'common/locale';

const t = scoped('PROFILE.ABOUT.SECTIONTITLES');
let sections = ['about', 'education', 'positions', 'interests'];

export default React.createClass({
	displayName: 'About:View',

	mixins: [Mixin],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;

		console.log('components/about/View');

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
						<Link href="/edit/" className="button tiny">Edit Profile</Link>
					</div>
				}
			</div>
		);
	}
});
