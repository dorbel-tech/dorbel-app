'use strict';

function getValuesFromInputRefs(refs) {
  return Object.keys(refs)
    .filter(key => refs.hasOwnProperty(key))
    .reduce((obj, key) => {
      obj[key] = getValueFromInput(refs[key]);
      return obj; 
    }, {});
}

function getValueFromInput(input) {
  switch(input.type) {
    case 'checkbox': return input.checked;
    case 'radio': return input.checked;
    case 'number': return input.valueAsNumber;
    case 'date': return input.valueAsDate;
    default: return input.value;
  }
}

module.exports = {
  getValuesFromInputRefs
};
