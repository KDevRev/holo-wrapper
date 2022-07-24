const Hololive = require("../index");
const holo = new Hololive("kobo kanaeru");

(async () => {
  // the result would be a json object data, not wrapped yet
  let detail = await holo.getDetail();
  console.log(detail);
})();
