import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';

export default class AssignmentsProvider extends React.Component {

	static connect (component) {
		class cmp extends React.Component {
			render () {
				return (
					<AssignmentsProvider _component={component} {...this.props}/>
				);
			}
		}

		return HOC.hoistStatics(cmp, component, 'AssignmentsProvider');
	}


	static propTypes = {
		_component: PropTypes.any,
		children: PropTypes.node,
		course: PropTypes.object.isRequired
	}


	static childContextTypes = {
		course: PropTypes.object,
		assignments: PropTypes.object
	}


	state = {
		loading: true
	}


	getChildContext () {
		const {state: {assignments}, props: {course}} = this;
		return { assignments, course };
	}


	async loadAssignments ({course} = this.props) {

		this.setState({ loading: true });

		const assignments = await course.getAssignments();

		this.setState({ assignments, loading: false });
	}


	componentDidMount () {
		this.loadAssignments();
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.course !== nextProps.course) {
			this.loadAssignments(nextProps);
		}
	}


	render () {
		const {children, _component, ...props} = this.props;

		Object.assign(props, this.state);

		return _component
			? React.createElement(_component, props, children)
			: React.cloneElement(React.Children.only(children), props);
	}
}
