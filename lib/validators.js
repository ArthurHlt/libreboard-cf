
if (Meteor.isClient) {

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Trim Input
    root.trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    }
    
    // Validations
    root.isEmail = function(val, field) {
      if (val.indexOf('@') !== -1) {
          return true;
        } else {
          Session.set('error_message', 'Error & Please enter a valid email address.');
          return false;
        }
    }
    
    root.isValidPassword = function(val, field) {
      if (val.length >= 6) {
        return true;
      } else {
        Session.set('error_message', 'Error & Your password should be 6 characters or longer.');
        return false;
      }
    }
    
    root.isNotEmpty = function(val) {
      // if null or empty, return false
      if (!val || val === ''){
        Session.set('error_message', 'Error & Please fill in all required fields.');
        return false;
      }
      return true;
    }

    root.Error = function(str) {
        Session.set("error_message", str);
    };

    root.removeError = function() {
        Session.set("error_message", null);
    };

}

