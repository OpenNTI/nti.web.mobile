import React from 'react';
import PropTypes from 'prop-types';
import {getService} from 'nti-web-client';
import {rawContent} from 'nti-commons';
import {Loading, Error} from 'nti-web-commons';
import {parseHTML} from 'nti-lib-content-processing';

export default class extends React.Component {
	static displayName = 'PopUp';

	static propTypes = {
		onClose: PropTypes.func.isRequired,
		download: PropTypes.string,
		source: PropTypes.string.isRequired
	};

	state = {
		loading: true
	};

	componentDidMount () {
		this.load();
	}

	componentWillReceiveProps (nextProps) {
		this.load(nextProps);
	}

	getBody = (htmlStr) => {
		const dom = parseHTML(htmlStr);
		return dom.getElementsByTagName('body')[0];
	};

	load = (props = this.props) => {
		let {source} = props;
		getService()
			.then(service => service.get(source))
			.catch(error => this.setState({error}))
			.then(result => {
				const body = this.getBody(result);
				this.setState({
					html: body.innerHTML,
					loading: false
				});
			});
	};

	render () {

		const {loading, html, error} = this.state;
		return (
			<div className="popup" {...this.props}>
				<div onClick={this.props.onClose} className="close"><i className="icon-light-x" /></div>
				{error ? <Error error={error} /> :
					loading ?
						<Loading.Mask /> :
						<div className="content" {...rawContent(html)} />
				}
			</div>
		);
	}
}
