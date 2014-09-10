/* global moment */
import Ember from 'ember';

function momentFormat(value, format) {
  return moment(value).format(format);
}

export {
  momentFormat
};

export default Ember.Handlebars.makeBoundHelper(momentFormat);
