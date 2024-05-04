const { insertError } = require("./error");
const { CustomError } = require("./customError");

async function throwCustomError({ status, httpCode, message }) {
  const error = await insertError({
    httpCode,
    status,
    description: message,
  });

  throw new CustomError(error);
}

module.exports = { throwCustomError };
