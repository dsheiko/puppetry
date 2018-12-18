import React from "react";
import AbstractComponent from "./AbstractComponent";

/*eslint no-unused-vars: 0*/

export default class AbstractForm extends AbstractComponent {

  validateNoSpecChars = ( rule, value, callback ) => {
    // UTF8, 0-9, whitespace
    const re = /^[^\x21-\x26\x28-\x2F\x3A-\x40]+$/;
    if ( re.test( value ) ) {
      return callback( "The value can only contain spaces, letters, numbers, dashes and apostrophes" );
    }
    callback();
  }


  hasErrors( fieldsError ) {
    return Object.keys( fieldsError ).some( field => fieldsError[ field ]);
  }

  onKeyPress = ( e, cb ) => {
    switch ( e.key ){
      case "Enter":
        cb( e );
        return;
    }
  }

}