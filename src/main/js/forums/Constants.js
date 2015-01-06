'use strict';

var namespacedKeyMirror = require('dataserverinterface/utils/namespaced-key-mirror');

module.exports = Object.assign(exports, namespacedKeyMirror('forums', {
    DATA_CHANGE: null
}));
