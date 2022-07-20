const Hololive = require("../index");
const holo = new Hololive("gawr gura");

(async () => {
  // the result would be a json array data, not wrapped yet
  console.log(await holo.getDetail());
})();
