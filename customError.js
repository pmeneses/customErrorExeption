class CustomError {
  constructor({ status, httpCode, description, title, detail }) {
    this.status = status;
    this.httpCode = httpCode;
    this.description = description;
    this.title = title;
    this.detail = detail;
  }
}

module.exports = { CustomError };
