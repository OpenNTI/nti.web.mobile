import React from 'react/addons';
import EmptyNavRoot from './EmptyNavRoot';
import BasePath from 'common/mixins/BasePath';

import path from 'path';

var NavDrawerItem = React.createClass({
	displayName: 'NavDrawerItem',
	mixins: [BasePath],

	propTypes: {
 		record: React.PropTypes.object.isRequired
	},


	isActiveItem () {
		return this.getHREF() === document.location.pathname;
	},


	hasChildren() {
		var {record} = this.props;
		let children = (record && record.contents) || [];
		return children.length > 0;
	},


	getHREF () {
		var {record} = this.props;
		var href = record && record.href;
		return path.join(this.getBasePath(), href || '');
	},


	getCSSClassNames () {
		var classes = ['navitem'];
		var {record} = this.props;

		if (record) {

			if (!record.isNavigable ) {
				classes.push('disabled');
			}

			if (this.isActiveItem(record)) {
				classes.push('active');
			}

			if (!record.isNavigable && (this.hasChildren() || record.depth !== record.maxDepth)) {
				classes.push('sectiontitle');
			}
		}

		return classes.join(' ');
	},


	render () {
		var {record} = this.props;
		var classes = this.getCSSClassNames();

		if(record.isEmpty) {
			return <EmptyNavRoot />;
		}

		//Nav Items BETTER NOT EVER be external...
		var href = this.getHREF();

		var label = record && record.label;

		return (
			<li>
				{label && <a href={href} className={classes}>{label}</a>}
				{this.hasChildren() &&
					<ul>
						{record.contents.map((v, i) =>
							<NavDrawerItem record={v} key={i} />
						)}
					</ul>
				}
			</li>
		);
	}

});

export default NavDrawerItem;
