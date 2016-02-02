import React from 'react';

// import Page from 'common/components/Page';
import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'NotFound',
	mixins: [BasePathAware],


	propTypes: {
		code: React.PropTypes.number,
		message: React.PropTypes.string
	},

	getDefaultProps () {
		return {
			code: 404,
			message: 'That page was not found.'
		};
	},

	onBack (e) {
		e.preventDefault();
		e.stopPropagation();

		global.history.go(-1);
	},

	render () {
		/* global pageRenderSetPageNotFound */
		if (global.pageRenderSetPageNotFound) {
			pageRenderSetPageNotFound();
		}

		let home = this.getBasePath();
		let {length = 1} = global.history || {};

		const {code, message} = this.props;

		return (
			<div className="not-found" title="Not Found">
				<div className="grid-container">
					<hr/>
					<div className="row">
						<div className="small-10 small-centered columns">
							<div className="sadface">:(</div>

							<h2>Error ({code})</h2>
							<p>{message}</p>

							{length > 1 && (
								<span>
									<a className="button tiny" href="#" onClick={this.onBack}>Back</a>
									&nbsp;
								</span>
							)}

							<a className="button tiny" href={home}>Home</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
