/*
 * LoginActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoginConstants = require('../constants/LoginConstants');

var LoginActions = {

  /**
   * @param  {string} text
   */
  init: function() {
    AppDispatcher.handleViewAction({
      actionType: LoginConstants.Login_CREATE,
      text: text
    });
  },

  /**
   * @param  {string} id
   */
  logout: function(id) {
    AppDispatcher.handleViewAction({
      actionType: LoginConstants.Login_DESTROY,
      id: id
    });
  },

  /**
   * Delete all the completed Logins
   */
  destroyCompleted: function() {
    AppDispatcher.handleViewAction({
      actionType: LoginConstants.Login_DESTROY_COMPLETED
    });
  }

};

module.exports = LoginActions;
