import React from 'react';
import PropTypes from 'prop-types';
import {HOC as HOCUtils} from 'nti-commons';
import {HOC} from 'nti-web-commons';

export default class AssignmentGroups extends React.Component {

	static connect (component) {
		class cmp extends React.Component {
			render () {
				return (
					<AssignmentGroups _component={component} {...this.props}/>
				);
			}
		}

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


	state = {}


	componentWillMount () {
		this.setup();
	}


	componentWillReceiveProps (_,__, context) {
		const {assignments} = context || {};
		if (assignments && assignments !== (this.state || {}).assignments) {
			this.setup({assignments});
		}
	}


	setup ({assignments} = this.context) {
		const store = assignments.getGroupedStore();
		this.setState({assignments, store});
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
