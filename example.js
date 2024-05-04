const { throwCustomError } = require("./throwCustomError");

throwCustomError({
  status: 10,
  httpCode: 500,
  message: "Error al insertar usuario",
}).catch((err) => {
  //we can handle the error here
  console.error(err);
});
