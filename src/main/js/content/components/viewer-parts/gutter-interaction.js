
import cx from 'classnames';

export default {

	openGutterDrawer () {
		let {className = ''} = this.state;

		className = cx('open-discussions-drawer', className.split(/\s+/));

		this.setState({className});
	},


	closeGutterDrawer () {
		let {className = ''} = this.state;

		className = className.replace(/open\-discussions\-drawer/g, ' ').replace(/\s+/g, ' ');

		this.setState({className});
	}

};
