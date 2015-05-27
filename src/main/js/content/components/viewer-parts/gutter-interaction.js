import CSS from 'react/lib/CSSCore';
import cx from 'classnames';

const root = () => document.getElementsByTagName('html')[0];

export default {

	openGutterDrawer () {
		let {className = ''} = this.state;

		className = cx('open-discussions-drawer', className.split(/\s+/));

		this.setState({className});
		CSS.addClass(root(), 'scroll-lock');
	},


	closeGutterDrawer () {
		let {className = ''} = this.state;

		className = className.replace(/open\-discussions\-drawer/g, ' ').replace(/\s+/g, ' ');

		this.setState({className});

		CSS.removeClass(root(), 'scroll-lock');
	}

};
