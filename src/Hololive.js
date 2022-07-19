const axios = require("axios");

class Hololive {
  constructor() {
    this.baseURL = "https://virtualyoutuber.fandom.com";
  }

  async #getTalent(char) {
    let data = await this.#_fetch(`action=query&format=json&list=search&srsearch=${char}&srlimit=1`);
    return {
      name: data.query.search[0].title,
      id: data.query.search[0].pageid
    };
  }

  #_fetch(params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseURL}/api.php?${params}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getDetail(char) {
    return new Promise(async (resolve, reject) => {
      let talent = await this.#getTalent(char);
      this.#_fetch(`action=query&prop=revisions&pageids=${talent.id}&rvprop=content&rvslots=main&rvlimit=1&format=json`)
        .then((body) => {
          let data = body.query.pages[talent.id].revisions[0].slots.main["*"];
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Hololive;
