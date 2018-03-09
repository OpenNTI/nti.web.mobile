import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import {Mixins} from 'nti-web-commons';

import Accessor, {ContextParent, ContextResolver} from './ContextAccessor';

export {ContextParent, ContextResolver};

const Mixin = {
	mixins: [Accessor],

	childContextTypes: {
		[ContextResolver]: PropTypes.func,
		[ContextParent]: PropTypes.any
	},


	getChildContext () {
		return {
			[ContextResolver]: this.resolveContext,
			[ContextParent]: this
		};
	}
};

export default Mixin;

export const Component = createReactClass({
	displayName: 'ContextContributor',
	propTypes: {
		children: PropTypes.node,
		getContext: PropTypes.func
	},
	mixins: [Mixin, Mixins.BasePath, Mixins.NavigatableMixin],
	async getContext () {
		const {getContext} = this.props;
		return getContext
			? getContext.call(this)
			: [];
	},
	render () {
		return this.props.children || null;
	}
});
