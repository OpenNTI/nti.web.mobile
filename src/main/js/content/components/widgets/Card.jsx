/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var Card = require('common/components/Card');

module.exports = React.createClass({
	displayName: 'NTICard',

	statics: {
		mimeType: /ntirelatedworkref$|nticard$/i,
		handles: function(item) {
			var type = item.type || '';
			var cls = item.class || '';
			var re = this.mimeType;
			return re.test(type) || re.test(cls);
		}
	},


	getInitialState: function () {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)
		
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
		var ownerProps = props.ownerProps;
		return (
			<Card
				item={props.item}
				slug={ownerProps.slug}
				contentPackage={ownerProps.course}/>
		);
	}
});
