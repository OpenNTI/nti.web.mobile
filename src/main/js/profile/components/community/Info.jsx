import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Link } from 'react-router-component';
import { rawContent } from '@nti/lib-commons';
import { Mixins } from '@nti/web-commons';

import ContextSender from 'common/mixins/ContextSender';

import { profileHref } from '../../mixins/ProfileLink';

import Members from './Members';

const MEMBERS = 'members';
const FACULTY = 'faculty';
const PEOPLE_YOU_KNOW = 'pyk';

const Breakdown = function Breakdown({ count, ...props }) {
	const countDisplay = !count ? void 0 : count > 9999 ? '9999+' : count;

	return (
		<li>
			<Link data-count={countDisplay} {...props} />
		</li>
	);
};

Breakdown.propTypes = {
	count: PropTypes.number,
	href: PropTypes.string,
};

export default createReactClass({
	displayName: 'Community:Info',
	mixins: [Mixins.BasePath, ContextSender],

	statics: {
		removePageWrapping: true,
	},

	getContext() {
		return Promise.resolve([
			{
				label: 'Information',
				href:
					this.getBasePath() +
					profileHref(this.props.entity) +
					'info/',
			},
		]);
	},

	propTypes: {
		entity: PropTypes.object,

		show: PropTypes.oneOf([MEMBERS, FACULTY, PEOPLE_YOU_KNOW]),
	},

	render() {
		let { entity, show } = this.props;

		let members = void 0;
		// let faculty = 0;
		// let people = 0;

		if (show === MEMBERS) {
			return <Members {...this.props} nested />;
		}

		return (
			<div className="community-info">
				<div className="heading">
					<h3>Description</h3>
					<div
						className="description"
						{...rawContent(entity.about)}
					/>
					{this.renderAdmins()}
				</div>
				<div className="inset-shadow">
					<ul className="membership-breakdown">
						<Breakdown href="/info/members/" count={members}>
							Members
						</Breakdown>
						{/*}
						<Breakdown href="/info/faculty/" count={faculty}>Faculty</Breakdown>
						<Breakdown href="/info/pyk/" count={people}>People you know</Breakdown>
						*/}
					</ul>

					{/*}
					<form>
						<p>Notify me when</p>
						<ul>
							<li>
								<Radio label="Any activity"/>
							</li>
						</ul>
					</form>
					*/}
				</div>
			</div>
		);
	},

	renderAdmins() {
		let { entity } = this.props;

		return (
			entity.admin && (
				<div>
					<h5>Admin</h5>
				</div>
			)
		);
	},
});
