import React from 'react/addons';
import ContactForm from './ContactForm';
import Configs from '../configs';

export default React.createClass({
	displayName: 'contact:View',

	render () {
		var config = Configs[this.props.configname] ||
					Configs.defaultConfig;

		return (<ContactForm fieldConfig={config}/>);
	}

});
