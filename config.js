const knex = require("knex");
const { createClient } = require("redis");

const customErrorConfig = (() => {
  let bdInstance = undefined;
  let cacheInstance = undefined;
  let tableExist = false;

  function init(config = undefined) {
    const defaultConfig = {
      client: "sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: "./data.db",
      },
    };

    bdInstance = knex(config ?? defaultConfig);
  }

  async function InitCache(urlCache) {
    cacheInstance = await createClient(
      urlCache ? { url: urlCache } : undefined,
    ).on("error", (err) => console.error("cache error", err));
  }

  async function checkTable() {
    if (tableExist) return tableExist;
    tableExist = await bdInstance.schema.hasTable("error");
    return tableExist;
  }

  return {
    getInstance: (config) => {
      if (!bdInstance) {
        init(config);
      }
      return bdInstance;
    },
    getCacheInstance: async (urlCache) => {
      if (!cacheInstance) {
        await InitCache(urlCache);
      }

      cacheInstance.connect();

      return cacheInstance;
    },
    checkTable,
  };
})();

module.exports = {
  getInstance: customErrorConfig.getInstance,
  checkTable: customErrorConfig.checkTable,
  getCacheInstance: customErrorConfig.getCacheInstance,
};
