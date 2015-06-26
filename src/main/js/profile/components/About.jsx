import React from 'react';
import Loading from 'common/components/TinyLoader';
import {scoped} from 'common/locale';
import Card from './Card';
// import Editable from './Editable';
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

		let hasInfo = false;

		return (
			<ul className="profile-cards">
				{sections.map((s, index) => {
					if (user[s]) {
						hasInfo = true;
						return <Card className={s} title={t(s)}><div>{this.renderItems(user[s], index)}</div></Card>;
					}
					return null;
				})}
				{!hasInfo && <Card><div>No additional information available.</div></Card>}
			</ul>
		);
	}
});

