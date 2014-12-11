'use strict';

var RelatedFormPanel = require('common/forms/components/RelatedFormPanel2');
var Constants = require('common/forms/Constants');

describe('RelatedFormPanel', function () {

	it('should find the inline subfield for the given field config', function () {
		
		var subfields = {
			type: Constants.SUBFIELDS,
			content: [
				{
					ref: 'testSubfield'
				}
			]
		};

		var fieldConfig = {
			ref: 'testField',
			type: 'radiogroup',
			options: [
				{
					label: 'No Subfields',
					value: 'N'
				}
				{
					label: 'Yes',
					value: 'Y',
					related: [
						subfields
					]
				}
			]
		}
		var result = RelatedFormPanel._getInlineSubfields(fieldConfig,{testField: 'Y'})
		expect(result).toEqual(subfields);
	});

});
