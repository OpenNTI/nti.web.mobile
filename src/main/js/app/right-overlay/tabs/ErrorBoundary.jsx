import React from 'react';

const errFn = () => 'An error occurred.';

export default function (getMessage = errFn) {
	return function Boundary (Cmp) {
		return class ErrorBoundary extends React.Component {

			state = {}

			componentDidCatch = error => this.setState({error})

			render () {
				const {state: {error}} = this;
				return error ? <div>{getMessage(error)}</div> : <Cmp {...this.props} />;
			}
		};
	};
}
