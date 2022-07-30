const { Hololive } = require("../index");

(async () => {
  const kobo = await new Hololive("kobo kanaeru").init();
  console.log(kobo.data.name);

  const gura = await new Hololive("gawr gura").init();
  console.log(gura.data.name);
})();
