import React from 'react';
import {parseHTML} from 'content/utils';
import {getService} from 'common/utils';
import Loading from 'common/components/Loading';

export default React.createClass({
	displayName: 'PopUp',

	propTypes: {
		onClose: React.PropTypes.func.isRequired,
		download: React.PropTypes.string,
		source: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentDidMount () {
		this.load();
	},

	componentWillReceiveProps (nextProps) {
		this.load(nextProps);
	},

	getBody (htmlStr) {
		const dom = parseHTML(htmlStr);
		return dom.getElementsByTagName('body')[0];
	},

	load (props = this.props) {
		let {source} = props;
		getService()
			.then(service => service.get(source))
			.then(result => {
				const body = this.getBody(result);
				this.setState({
					html: body.innerHTML,
					loading: false
				});
			});
	},

	render () {

		const {loading, html} = this.state;

		return (
			<div className="popup" {...this.props}>
				<div onClick={this.props.onClose} className="close"><i className="icon-light-x" /></div>
				{loading ?
					<Loading /> :
					<div className="content" dangerouslySetInnerHTML={{__html: html}} />
				}
			</div>
		);
	}
});
