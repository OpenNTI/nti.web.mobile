import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// import {getViewportWidth} from '@nti/lib-dom';
import { Background, ActiveLink as Link, Loading } from '@nti/web-commons';
import ContextSender from 'internal/common/mixins/ContextSender';
import Page from 'internal/common/components/Page';

import Controls from './HeaderControls';
import Head from './Head';
import Invite from './Invite';

const Transition = props => (
	<CSSTransition classNames="community-menu" timeout={500} {...props} />
);

export default createReactClass({
	displayName: 'Community:Page',
	mixins: [ContextSender],

	propTypes: {
		pageContent: PropTypes.any,

		entity: PropTypes.object.isRequired,

		selected: PropTypes.string,
	},

	getInitialState() {
		return {
			selected: void 0,
			showMenu: false,
		};
	},

	componentDidMount() {
		this.populateSections();
	},

	componentDidUpdate(prevProps) {
		if (this.props.entity !== prevProps.entity) {
			this.populateSections();
		}
	},

	populateSections(props = this.props) {
		let { entity } = props;
		this.setState(this.getInitialState(), () =>
			entity
				.getDiscussionBoardContents()
				.then(o => this.setState({ sections: o.Items }))
		);
	},

	toggleMenu() {
		let { showMenu } = this.state;
		this.setState({ showMenu: !showMenu });
	},

	render() {
		let { sections, showMenu } = this.state || {};
		let { selected, entity, pageContent = 'div' } = this.props;

		let narrow = true; // getWidth() < 1024;
		let Content = pageContent;
		let filterParams;

		if (!sections) {
			return <Loading.Mask />;
		}

		if (selected) {
			filterParams = {
				source: selected,
			};
		}

		let topLeft = narrow ? (
			<Invite entity={entity} />
		) : (
			<h1>{entity.displayName}</h1>
		);

		let { removePageWrapping } = Content || {};

		return (
			<Page title="Community">
				<Background
					className="community profile-wrapper"
					imgUrl={entity.backgroundURL}
				>
					{removePageWrapping ? (
						<Content {...this.props} />
					) : (
						<div>
							<div className="profile-top-controls">
								{topLeft}
								<Controls entity={entity} />
							</div>
							<div className="profile">
								<nav>
									<Head
										entity={entity}
										narrow={narrow}
										sections={sections}
										selected={selected}
										onMenuToggle={this.toggleMenu}
									/>
								</nav>

								<TransitionGroup className="coordinate-root">
									{narrow && showMenu ? (
										<Transition key="menu">
											{this.renderMenu()}
										</Transition>
									) : (
										<Transition key="content">
											<section>
												<Content
													{...this.props}
													filterParams={filterParams}
												/>
											</section>
										</Transition>
									)}
								</TransitionGroup>
							</div>
						</div>
					)}
				</Background>
			</Page>
		);
	},

	renderMenu() {
		let { sections = [] } = this.state;
		let all = { ID: '', title: 'All Topics' };

		let animationDelay = i => ({ animationDelay: i * 100 + 'ms' });

		let items = [all].concat(sections);

		return (
			<nav className="fullscreen-sections">
				{items.map(
					(x, i) =>
						x.title !== 'Forum' && (
							<Link
								key={i}
								href={`/activity/${x.ID}/`.replace(
									/\/\//g,
									'/'
								)}
								style={animationDelay(i)}
								onClick={this.toggleMenu}
							>
								<span>{x.title}</span>
								{x.EmailNotifications && (
									<i className="icon-bell" />
								)}
							</Link>
						)
				)}
			</nav>
		);
	},
});
