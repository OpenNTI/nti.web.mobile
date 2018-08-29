import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';

export default class Assignments extends React.Component {

	static connect (component) {
		class cmp extends React.Component {
			render () {
				return (
					<Assignments _component={component} {...this.props}/>
				);
			}
		}

		return HOC.hoistStatics(cmp, component, 'Assignments');
	}


	static propTypes = {
		_component: PropTypes.any,
		children: PropTypes.node,
	}


	static contextTypes = {
		assignments: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired
	}


	state = {
		assignments: this.context.assignments
	}


	componentDidUpdate () {
		const {assignments} = this.context || {};
		if (assignments && assignments !== (this.state || {}).assignments) {
			this.setState({assignments});
		}
	}


	render () {
		const {children, _component, ...props} = this.props;

		Object.assign(props, this.context, this.state);

		return _component
			? React.createElement(_component, props, children)
			: React.cloneElement(React.Children.only(children), props);
	}
}
