import React from 'react';

import EmptyList from 'common/components/EmptyList';
import Loading from 'common/components/TinyLoader';

import {scoped} from 'common/locale';

import Card from '../Card';
// import Editable from '../Editable';
import Memberships from '../about/Memberships';
import ProfileBodyContainer from '../ProfileBodyContainer';

import Mixin from '../about/Mixin';

const t = scoped('PROFILE.ABOUT.SECTIONTITLES');

let sections = ['about', 'education', 'positions', 'interests'];

export default React.createClass({
	displayName: 'About',

	mixins: [Mixin],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let empty = !sections.reduce((result, section)=> result || !!entity[section], false);

		if (!entity) {
			return <Loading />;
		}

		if (empty) {
			return ( <EmptyList type="user-details"/> );
		}

		return (
			<ProfileBodyContainer className="profile-about-body">
				<ul className="profile-cards">
					{sections.map((s, index) => {
						return entity[s] && ( <Card key={s} className={s} title={t(s)}><div>{this.renderItems(entity[s], index)}</div></Card> );
					})}
				</ul>
				<Memberships entity={entity} preview/>
			</ProfileBodyContainer>
		);
	}
});
