import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {Mixins, Presentation} from 'nti-web-commons';
import {Component as Video} from 'nti-web-video';


export default createReactClass({
	displayName: 'Title',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		entry: PropTypes.object
	},

	getItem (props) {
		return props.entry;
	},

	render () {
		const {entry} = this.props;
		if (!entry) { return; }

		const {promoImage: promo, Video: video} = entry;
		const context = [entry.getID()];

		const cls = cx('catalog-entry-title header',{
			'with-video' : video,
			'with-promo': promo
		});

		return (
			<div className={cls}>
				{video ? (

					<div className="video-wrap">
						<Video src={video} context={context}/>
					</div>

				) : promo ? (
					<Presentation.Asset propName="src" contentPackage={entry} type="promo">
						<PromoImage/>
					</Presentation.Asset>
				) :
					null
				}

				<div className="title">
					<div className="text">{entry.Title}</div>
				</div>
			</div>
		);
	}
});

PromoImage.propTypes = {
	src: PropTypes.string
};

function PromoImage ({src}) {
	return (
		<div className="promo-image" style={{backgroundImage: `url(${src})`}}/>
	);
}
