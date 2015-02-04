import React from 'react/addons';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import {Link} from 'react-router-component';

import SectionAware from '../mixins/SectionAware';

var BarItem = React.createClass({
	mixins: [NavigatableMixin, SectionAware],

	propTypes: {
		section: React.PropTypes.string.isRequired,
		forced: React.PropTypes.bool
	},


	getSectionName () {
		return this.props.section;
	},


	isActive () {
		return this.getPath().indexOf(this.getHref()) === 0;
	},


	canRender () {
		return this.props.forced || this.isActive() || this.getListForSection(this.getSectionName()).length;
	},


	getHref () {
		var section = this.getSectionName();
		return `/${section}/`;
	},


	getClassNames () {
		var list = ['item'];

		if(this.isActive()) {
			list.push('active');
		}

		return list.join(' ');
	},


	render () {
		if (!this.canRender()) {
			return null;
		}

		var href = this.getHref();
		var className = this.getClassNames();

		var props = {className, href};

		return (
			<Link {...props}><label>{this.props.children}</label></Link>
		);
	}

});


export default React.createClass({
	displayName: 'IconBar',

	render () {
		return (
			<div className="icon-bar three-up">
				<BarItem section="admin">Admin</BarItem>
				<BarItem section="courses">Courses</BarItem>
				<BarItem section="books">Books</BarItem>
				<BarItem section="catalog" forced>Catalog</BarItem>
			</div>
		);
	}

});
