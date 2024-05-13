const config = require("./config");

const bdInstance = config.getInstance();

async function initTable() {
  const hasTable = await config.checkTable();
  if (hasTable) return;

  await bdInstance.schema.createTable("error", (table) => {
    table.increments("id");
    table.string("httpCode").notNullable();
    table.string("status").notNullable();
    table.string("description").notNullable();
    table.string("title").nullable();
    table.string("detail").nullable();
    table.timestamp("date").defaultTo(new Date());
  });
}

async function insertError({ httpCode, status, description }) {
  await initTable();
  const cacheInstance = await config.getCacheInstance();

  const defaultTitle = "Error";
  const defaultDetail = "Ocurrio un error";

  let errors = undefined;
  const cacheErrors = await cacheInstance.get("customErrors");

  errors = JSON.parse(cacheErrors);
  if (!errors) {
    errors = await bdInstance("error")
      .select("httpCode", "status", "description", "title", "detail")
      .then((result) => result);

    await cacheInstance.set("customErrors", JSON.stringify(errors), {
      EXP: 3600,
    });
  }

  let error = errors.find((err) => {
    return err.status === status && err.httpCode === httpCode;
  });

  if (!error) {
    error = {
        httpCode,
        status,
        description,
        title: defaultTitle,
        detail: defaultDetail,
    };

    await bdInstance("error").insert(errorObj);
    cacheInstance.del("customErrors")
  }

  cacheInstance.quit();

  return error;
}

module.exports = { insertError };
