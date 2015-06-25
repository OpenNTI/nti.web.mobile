import React from 'react';
import Loading from 'common/components/TinyLoader';
import {scoped} from 'common/locale';
import Card from './Card';
import Editable from './Editable';
import renderItemsMixin from './widgets/Mixin';

const t = scoped('PROFILE.ABOUT.SECTIONTITLES');

let sections = ['about', 'education', 'positions'];

export default React.createClass({
	displayName: 'About',

	mixins: [renderItemsMixin],

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
				{sections.map((s, index) => {
					return (
						<Card className={s} title={t(s)}><Editable>{this.renderItems(user[s], index)}</Editable></Card>
					);
				})}
			</ul>
		);
	}
});

