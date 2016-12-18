function DomainValidationError(name, data, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = name;
  this.message = message;
  this.data = data;
  this.statusCode = 400;
}

function DomainNotFoundError(name, data, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = name;
  this.message = message;
  this.data = data;
  this.statusCode = 404;
}

DomainValidationError.prototype = Error.prototype;
DomainNotFoundError.prototype = Error.prototype;

module.exports = {
  DomainValidationError,
  DomainNotFoundError
};
