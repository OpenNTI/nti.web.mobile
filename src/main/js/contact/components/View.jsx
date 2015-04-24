import React from 'react';
import ContactForm from './ContactForm';
import * as Configs from '../configs';

export default React.createClass({
	displayName: 'contact:View',

	propTypes: {
		configname: React.PropTypes.string
	},

	render () {
		let config = Configs[this.props.configname] || Configs.defaultConfig;

		return (<ContactForm fieldConfig={config}/>);
	}

});
