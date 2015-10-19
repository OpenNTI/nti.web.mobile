import React from 'react';

import {scoped} from 'common/locale';

import Page from 'common/components/Page';

import Sections from '../Sections';

let getLabel = scoped('CONTENT.SECTIONS');


export default React.createClass({
	displayName: 'course:Page',

	propTypes: {
		children: React.PropTypes.any
	},

	componentWillMount () {
		this.setup();
	},


	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	},


	setup (props = this.props) {
		let {contentPackage} = props;
		let menu = [];

		let push = x => menu.push({
			label: getLabel(x.toLowerCase()),
			href: Sections[x]
		});


		for(let s of Object.keys(Sections)) {
			push(s);
		}

		if (!contentPackage.hasDiscussions()) {
			menu = menu.filter(x=> x.href !== Sections.DISCUSSIONS);
		}

		this.setState({menu});
	},


	render () {
		let {menu} = this.state || {};
		let {children} = this.props;

		if (menu && menu.length < 2) {
			menu = null;
		}

		let props = Object.assign({}, this.props, {
			availableSections: menu,
			children: React.Children.map(children, x => React.cloneElement(x))
		});

		return React.createElement(Page, props);
	}
});
