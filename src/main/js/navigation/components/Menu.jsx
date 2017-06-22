import React from 'react';
import {addClass, removeClass} from 'nti-lib-dom';

const getViewport = ()=> document.getElementsByTagName('html')[0];

export default class extends React.Component {
	static displayName = 'Menu';

	componentDidMount () {
		addClass(getViewport(), 'scroll-lock');
	}

	componentWillUnmount () {
		removeClass(getViewport(), 'scroll-lock');
	}

	render () {
		return (<ul {...this.props}/>);
	}
}
