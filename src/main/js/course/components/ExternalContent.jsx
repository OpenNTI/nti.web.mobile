import React from 'react';

import {getModel} from 'nti.lib.interfaces';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Card from 'common/components/Card';
import Loading from 'common/components/Loading';

import {getService} from 'common/utils';

import Discussions from 'content/components/discussions';

const RelatedWorkReference = getModel('relatedworkref');

export default React.createClass({
	displayName: 'ExternalContent',

	propTypes: {
		contentPackage: React.PropTypes.object.isRequired,

		relatedWorkRefId: React.PropTypes.string.isRequired
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.fill(this.props);
	},

	componentWillReceiveProps (nextProps) {
		if (this.props.relatedWorkRefId !== nextProps.relatedWorkRefId) {
			this.fill(nextProps);
		}
	},


	fill (props) {
		let id = decodeFromURI(props.relatedWorkRefId);
		let {store} = this.state;

		if (store) {
			store.removeListener('change', this.onStoreChanged);
		}

		getService()
			.then(service =>
				service.getParsedObject(id)
					.then(
						relatedWorkRef => {
							this.setState({relatedWorkRef});
							return relatedWorkRef;
						},
						() => RelatedWorkReference.fromID(service, id)
					)
					.then(ref => ref.getUserData())
			)

			.then(x => x.waitForPending().then(()=>x))
			.then(x => {
				x.addListener('change', this.onStoreChanged);
				this.setState({
						store: x,
						storeProvider: {getUserDataStore: ()=>x}
					},
					()=> this.onStoreChanged(x));
			});
	},


	onStoreChanged (store) {
		if (this.state.store !== store) {
			return;
		}

		//in the future, update stuff ...but atm, we don't need to do anything.
	},


	render () {
		let {contentPackage} = this.props;
		let {relatedWorkRef, storeProvider} = this.state;

		if (!storeProvider) {
			return ( <Loading/> );
		}

		return (
			<div>
				{relatedWorkRef && ( <Card item={relatedWorkRef} contentPackage={contentPackage} disableLink/> )}

				<Discussions UserDataStoreProvider={storeProvider}/>
			</div>
		);
	}
});
