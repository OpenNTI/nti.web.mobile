'use strict';
/**
 * Constants related to (and used by) the course modules.
 * @class Constants
 */
var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');


module.exports = merge(exports, keyMirror({
    NOT_FOUND: null,
    
    SET_ACTIVE_COURSE: null,
    COURSE_NAV_KEY: null

}));
