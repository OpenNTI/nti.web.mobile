import React from 'react';
import PropTypes from 'prop-types';
import {HOC as HOCUtils} from '@nti/lib-commons';
import {HOC} from '@nti/web-commons';

//TODO: Use new React context API, change willMount, willReceiveProps
export default class AssignmentGroups extends React.Component {

	static connect (component) {
		const cmp = React.forwardRef((props, ref) => (
			<AssignmentGroups _component={component} {...props} ref={ref}/>
		));

		return HOCUtils.hoistStatics(cmp, component, 'AssignmentGroups');
	}


	static propTypes = {
		_component: PropTypes.any,
		children: PropTypes.node,
	}


	static contextTypes = {
		assignments: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired
	}


	state = this.setup()


	componentDidUpdate () {
		const {assignments} = this.context || {};
		if (assignments && assignments !== (this.state || {}).assignments) {
			this.setState(this.setup());
		}
	}


	setup ({assignments} = this.context) {
		const store = assignments.getGroupedStore();
		return {assignments, store};
	}


	onStoreUpdate = () => {
		setTimeout(() => this.forceUpdate(), 0);
	}


	render () {
		const {children, _component, ...props} = this.props;
		const {store} = this.state;

		Object.assign(props, this.context, this.state);

		return (
			<HOC.ItemChanges item={store} onItemChanged={this.onStoreUpdate}>
				{_component
					? React.createElement(_component, props, children)
					: React.cloneElement(React.Children.only(children), props)
				}
			</HOC.ItemChanges>
		);
	}
}
