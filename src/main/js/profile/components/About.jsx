import React from 'react';

import EmptyList from 'common/components/EmptyList';
import Loading from 'common/components/TinyLoader';

import {scoped} from 'common/locale';

import Card from './Card';
// import Editable from './Editable';

import Mixin from './about/Mixin';

const t = scoped('PROFILE.ABOUT.SECTIONTITLES');

let sections = ['about', 'education', 'positions', 'interests'];

export default React.createClass({
	displayName: 'About',

	mixins: [Mixin],

	propTypes: {
		user: React.PropTypes.object.isRequired
	},

	render () {

		let {user} = this.props;
		let empty = !sections.reduce((result, section)=> result || !!user[section], false);

		if (!user) {
			return <Loading />;
		}

		if (empty) {
			return ( <EmptyList type="user-details"/> );
		}

		return (
			<ul className="profile-cards">
				{sections.map((s, index) => {
					return user[s] && ( <Card key={s} className={s} title={t(s)}><div>{this.renderItems(user[s], index)}</div></Card> );
				})}
			</ul>
		);
	}
});
