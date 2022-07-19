const Hololive = require("../index");
const holo = new Hololive();

(async () => {
  // the result would be a raw data, not wrapped yet
  console.log(await holo.getDetail("gawr gura"));
})();
