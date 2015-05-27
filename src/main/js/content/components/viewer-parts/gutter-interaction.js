import CSS from 'react/lib/CSSCore';
import cx from 'classnames';

export default {

	openGutterDrawer () {
		let {className = ''} = this.state;

		className = cx('open-discussions-drawer', className.split(/\s+/));

		this.setState({className});
		CSS.addClass(document.body, 'scroll-lock');
	},


	closeGutterDrawer () {
		let {className = ''} = this.state;

		className = className.replace(/open\-discussions\-drawer/g, ' ').replace(/\s+/g, ' ');

		this.setState({className});

		CSS.removeClass(document.body, 'scroll-lock');
	}

};
