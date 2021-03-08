import React from 'react';
import PropTypes from 'prop-types';

import { Flyout, ActiveState } from '@nti/web-commons';

export default class MoreItemsMenu extends React.Component {
	static propTypes = {
		entity: PropTypes.object.isRequired,
	};

	attachFlyoutRef = x => (this.flyout = x);

	dismissFlyout = () => {
		if (this.flyout) {
			this.flyout.dismiss();
		}
	};

	render() {
		const { entity } = this.props;

		return (
			<Flyout.Triggered
				trigger={
					<a href="#" className="profile-nav-more-trigger">
						&middot;&middot;&middot;
					</a>
				}
				ref={this.attachFlyoutRef}
				className="profile-more-items-menu"
				verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
				horizontalAlign={Flyout.ALIGNMENTS.RIGHT}
				arrow
				dark
			>
				<ul
					className="profile-nav-sub-items"
					onClick={this.dismissFlyout}
				>
					<li className="profile-nav-item">
						<ActiveState tag="a" href="/achievements/">
							<div onClick={this.dismissFlyout}>Achievements</div>
						</ActiveState>
					</li>
					{entity && entity.hasLink && entity.hasLink('transcript') && (
						<li className="profile-nav-item">
							<ActiveState tag="a" href="/transcripts/">
								<div onClick={this.dismissFlyout}>
									Transcripts
								</div>
							</ActiveState>
						</li>
					)}
				</ul>
			</Flyout.Triggered>
		);
	}
}
