/** @jsx React.DOM */
'use strict';

var Card = require('common/components/Card');

var path = require('path');

module.exports = React.createClass({
	displayName: 'NTICard',

	statics: {
		mimeType: /ntirelatedworkref$|nticard$/i,
		handles: function(item) {
			var type = item['attribute-type'] || '';
			var cls = item['attribute-class'] || '';
			var re = this.mimeType;
			return re.test(type) || re.test(cls);
		}
	},


	getInitialState: function () {
		var item = this.props.item;
		var el;
		if (item) {

			if (!item.desc && item.dom) {
				//Because the item was interpreted from a DOM element, the
				//content of the element is the description.
				//
				//We aren't doing this correctly :P... we attempted to use
				//a HTML style "fallback" to allow us flexibility and all,
				//but we still split "data points" into it... hmm...
				el = item.dom.querySelector('span.description');
				item.desc = el && el.innerHTML;
			}

			if (!item.icon && item.dom) {
				//See comment above... sigh...
				el = item.dom.querySelector('img');
				item.icon = el && el.getAttribute('src');
			}

		}

		return {};
	},


	render: function() {
		var props = this.props;
		var basePath = path.join(
			props.basePath,
			'course', //encodeURIComponent(props.course.getID()),
			'o', props.outlineId
		)


		return this.transferPropsTo(<Card
			basePath={basePath} pathname="c"
			contentPackage={this.props.course}/>);
	}
});
