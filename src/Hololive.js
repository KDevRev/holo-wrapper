const axios = require("axios");
const Utils = require("./Utils");

class Hololive {
  constructor(charName) {
    this.baseURL = "https://virtualyoutuber.fandom.com";
    this.opt = { name: charName };
    this.data = undefined;
  }

  async init() {
    await this.getDetail();
    return this;
  }
  async #getTalent() {
    let data = await this.#_fetch(`action=query&format=json&list=search&srsearch=${this.opt.name}&srlimit=1`);
    return {
      name: data.query.search[0].title,
      id: data.query.search[0].pageid
    };
  }

  async getRestPfp() {
    let talent = await this.#getTalent(this.opt.name);
    let data = await this.#_fetch(`action=imageserving&wisId=${talent.id}&format=json`);

    return data.image.imageserving;
  }

  async getDetail() {
    if (!this.data) {
      let talent = await this.#getTalent(this.opt.name);
      let body = await this.#_fetch(`action=parse&prop=properties&pageid=${talent.id}&format=json`);

      if (body.error) {
        return { error: "No data found" };
      }

      let obj = {};
      let parsed = body.parse.properties.filter((res) => res.name === "infoboxes");

      if (parsed.length >= 1) {
        let result = JSON.parse(body.parse.properties.filter((res) => res.name === "infoboxes")[0]["*"])[0];

        for (let r of result.data) {
          if (r.type === "title") {
            obj["name"] = r.data.value;
          } else if (r.type === "image") {
            r.data.forEach((res) => {
              delete res["caption"];
              delete res["item-name"];
              delete res["source"];
            });
            obj["image"] = r.data;
          } else if (r.type === "group") {
            r.data.value
              .filter((res) => res.type === "data")
              .forEach((dt) => {
                let name = dt.data.source;
                let dtvalue = dt.data.value;

                if (name === "nick_name") {
                  obj[name] = dtvalue.split("<br>");
                } else if (name === "channel" || name === "social_media" || name === "official_website" || name === "character_designer") {
                  obj[name] = Utils.findURL(dtvalue);
                } else if (name === "affiliation" || name === "age" || name === "birthday" || name === "height" || name === "weight") {
                  obj[name] = dtvalue.replace(/<[^>]*>|(&#91;.&#..;)/gm, "");
                } else if (name === "debut_date") {
                  obj[name] = new Date(dtvalue.replace(/<[^>]*>|(&#91;.&#..;)/gm, "").split(" ")[1]);
                } else {
                  obj[name] = dtvalue;
                }
              });
          }
        }
        this.data = obj;
        return this.data;
      } else {
        return { error: "Data invalid or data was not a vtuber info" };
      }
    } else {
      return this.data;
    }
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

module.exports = { Hololive };
