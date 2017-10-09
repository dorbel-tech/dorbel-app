'use strict';

function invalidate(inputElement, invalidFieldMap) {
  let valid = true;

  if (inputElement.getAttribute('required') !== null && !inputElement.value) {
    invalidFieldMap[inputElement.name] = 'שדה חובה';
    valid = false;
  }

  const type = inputElement.getAttribute('type');
  if (type !== null) {
    if (type === 'tel' && !validTelephone(inputElement.value)) {
      invalidFieldMap[inputElement.name] = 'השדה אינו תקין';
      valid = false;
    } else if (type === 'email' && !validEmail(inputElement.value)) {
      invalidFieldMap[inputElement.name] = 'השדה אינו תקין';
      valid = false;
    }
  }

  if (valid) {
    delete invalidFieldMap[inputElement.name];
  }

  return invalidFieldMap;
}

function validTelephone(val) {
  if (typeof val === 'number') {
    return true;
  }
  return /^[-+]?(?:\d*[.])?\d+$/.test(val);
}

function validEmail(val) {
  return /^((([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(val);
}

module.exports = {
  invalidate
};
