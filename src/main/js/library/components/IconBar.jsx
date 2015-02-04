import React from 'react/addons';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import {Link} from 'react-router-component';

var BarItem = React.createClass({
	mixins: [NavigatableMixin],

	isActive () {
		return this.getPath().indexOf(this.props.href) === 0;
	},

	render () {
		var {href} = this.props;
		var css = ['item'];

		if(this.isActive()) {
			css.push('active');
		}

		var props = {
			className: css.join(' '),
			href
		};

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
				<BarItem href="/admin/">Admin</BarItem>
				<BarItem href="/courses/">Courses</BarItem>
				<BarItem href="/books/">Books</BarItem>
				<BarItem href="/catalog/">Catalog</BarItem>
			</div>
		);
	}

});
