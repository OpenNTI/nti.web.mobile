import React from 'react';
import Loading from 'common/components/TinyLoader';
import {scoped} from 'common/locale';
import Card from './Card';
import Editable from './Editable';

const t = scoped('PROFILE.ABOUT.SECTIONTITLES');

let sections = ['about', 'education', 'positions'];

export default React.createClass({
	displayName: 'About',

	propTypes: {
		user: React.PropTypes.object.isRequired
	},

	render () {

		let {user} = this.props;

		if (!user) {
			return <Loading />;
		}

		return (
			<ul className="profile-cards">
				{sections.map(s => {
					return (
						<Card className={s} title={t(s)}><Editable>{user[s]}</Editable></Card>
					);
				})}
			</ul>
		);
	}
});

