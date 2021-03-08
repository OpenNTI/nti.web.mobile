import React from 'react';
import PropTypes from 'prop-types';

import { decodeFromURI } from '@nti/lib-ntiids';
import { HOC } from '@nti/web-commons';
import { HOC as HOCUtils } from '@nti/lib-commons';

const getAssignmentID = props =>
	props.assignmentId ||
	(!props.assignment || typeof props.assignment === 'string'
		? props.assignment
		: props.assignment.getID()) ||
	decodeFromURI(props.rootId);

export default class AssignmentGroups extends React.Component {
	static connect(component) {
		class cmp extends React.Component {
			render() {
				return (
					<AssignmentGroups _component={component} {...this.props} />
				);
			}
		}

		return HOCUtils.hoistStatics(cmp, component, 'AssignmentGroups');
	}

	static propTypes = {
		_component: PropTypes.any,
		children: PropTypes.node,

		//At least one of these props must be given:
		assignment: PropTypes.object,
		assignmentId: PropTypes.string,

		rootId: PropTypes.string, //uri-encoded assignmentId
	};

	static contextTypes = {
		assignments: PropTypes.object,
		course: PropTypes.object,
	};

	state = this.setup();

	componentDidUpdate() {
		const { assignments } = this.context || {};
		if (assignments && assignments !== (this.state || {}).assignments) {
			this.setState(this.setup());
		}
	}

	setup(props = this.props, { assignments } = this.context) {
		const id = getAssignmentID(props);
		const store = id && assignments.getAssignmentSummary(id);
		const assignment =
			props.assignment ||
			assignments.getAssignment(getAssignmentID(props));

		return { assignments, assignment, store };
	}

	onStoreUpdate = () => {
		this.forceUpdate();
	};

	render() {
		const { children, _component, ...props } = this.props;
		const { store } = this.state;

		Object.assign(props, this.context, this.state);

		return (
			<HOC.ItemChanges item={store} onItemChanged={this.onStoreUpdate}>
				{_component
					? React.createElement(_component, props, children)
					: React.cloneElement(React.Children.only(children), props)}
			</HOC.ItemChanges>
		);
	}
}
