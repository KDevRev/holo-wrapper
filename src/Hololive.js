const axios = require("axios");

class Hololive {
  constructor(charName) {
    this.baseURL = "https://virtualyoutuber.fandom.com";
    this.opt = { name: charName, id: 0 };
  }

  async #getTalent() {
    let data = await this.#_fetch(`action=query&format=json&list=search&srsearch=${this.opt.name}&srlimit=1`);
    return {
      name: data.query.search[0].title,
      id: data.query.search[0].pageid
    };
  }

  async getPfp() {
    let talent = await this.#getTalent(this.opt.name);
    let data = await this.#_fetch(`action=imageserving&wisId=${talent.id}&format=json`);

    return data.image.imageserving;
  }

  getDetail() {
    return new Promise(async (resolve, reject) => {
      let talent = await this.#getTalent(this.opt.name);
      this.#_fetch(`action=parse&prop=properties&pageid=${talent.id}&format=json`)
        .then((body) => {
          let data = body.parse.properties[0]["*"];
          // JSON.parse(data)[0].data.forEach((r) => {
          //   console.log(r.data.value);
          // });
          resolve(JSON.parse(data)[0].data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  #_fetch(params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseURL}/api.php?${params}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject({
            error: err.statusCode
          });
        });
    });
  }
}

module.exports = Hololive;
