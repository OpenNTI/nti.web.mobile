export const FORM_CONFIG = 'forms:Form Config';
export const SUBFIELDS = 'forms:Subfield';
export const MESSAGE = 'forms:Message';
export const ERROR_ADDED = 'forms:Error Added';
export const FETCH_LINK = 'forms:Fetch Link';
export const URL_RETRIEVED = 'forms:URL Retrieved';
export const FIELD_VALUE_CHANGE = 'forms:Field Value Changed';
export const FIELD_VALUES_REMOVED = 'forms:Field Value Removed';
export const AVAILABLE_FIELDS_CHANGED = 'forms:Available Fields Changed';

/**
	Constants for users of the RenderFormConfix mixin to declare event handlers, as in:
	[ON_CHANGE] (event) { ... }
	[ON_BLUR] (event) { ... }
	[ON_FOCUS] (event) { ... }
*/
const prefix = 'FormConstants:';
const ON_BLUR = prefix + 'ON_BLUR';
const ON_CHANGE = prefix + 'ON_CHANGE';
const ON_FOCUS = prefix + 'ON_FOCUS';
const RADIO_CHANGED = prefix + 'RADIO_CHANGED';

export const RENDERED_FORM_EVENT_HANDLERS = {
	ON_BLUR,
	ON_CHANGE,
	ON_FOCUS,
	RADIO_CHANGED
};
