/*eslint react/no-multi-comp:0*/
import React from 'react';

import {Link} from 'react-router-component';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import {rawContent} from 'nti-commons/lib/jsx';

import {profileHref} from '../../mixins/ProfileLink';

import Members from './Members';

const MEMBERS = 'members';
const FACULTY = 'faculty';
const PEOPLE_YOU_KNOW = 'pyk';

const Breakdown = function Breakdown (props) {

	let {count} = props;

	if (!count) {
		count = void 0;
	}

	if (count > 9999) {
		count = '9999+';
	}

	return (
		<li><Link data-count={count} {...props}/></li>
	);
};

Breakdown.propTypes = {
	count: React.PropTypes.number,
	href: React.PropTypes.string
};


export default React.createClass({
	displayName: 'Community:Info',
	mixins: [BasePathAware, ContextSender],

	statics: {
		removePageWrapping: true
	},


	getContext () {
		return Promise.resolve([
			{
				label: 'Information',
				href: this.getBasePath() + profileHref(this.props.entity) + 'info/'
			}
		]);
	},


	propTypes: {
		entity: React.PropTypes.object,

		show: React.PropTypes.oneOf([MEMBERS, FACULTY, PEOPLE_YOU_KNOW])
	},

	render () {
		let {entity, show} = this.props;

		let members = void 0;
		// let faculty = 0;
		// let people = 0;

		if (show === MEMBERS) {
			return ( <Members {...this.props} nested/> );
		}

		return (
			<div className="community-info">
				<div className="heading">
					<h3>Description</h3>
					<div className="description" {...rawContent(entity.about)}/>
					{this.renderAdmins()}
				</div>
				<div className="inset-shadow">

					<ul className="membership-breakdown">
						<Breakdown href="/info/members/" count={members}>Members</Breakdown>
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
								<label><input type="radio"/><span> Any activity</span></label>
							</li>
						</ul>
					</form>
					*/}
				</div>
			</div>
		);
	},


	renderAdmins () {
		let {entity} = this.props;

		return entity.admin && (
			<div>
				<h5>Admin</h5>

			</div>
		);
	}
});
