const axios = require("axios");
const Utils = require("./Utils");
const cheerio = require("cheerio");

class Hololive {
  constructor(charName) {
    this.baseURL = "https://virtualyoutuber.fandom.com";
    this.opt = { name: charName };
    this.data = undefined;
  }

  async init() {
    await this.getDetail();
    await this.getGallery();
    return this;
  }

  #getTalent = async (str, limit = 1) => {
    if (limit >= 20) throw new Error("Maximum limit are 20");
    let data = await this.#_fetch(`action=query&format=json&list=search&srsearch=${str}&srlimit=${limit}`);
    return {
      name: data.query.search[0].title,
      id: data.query.search[0].pageid
    };
  };

  async getRestPfpURL() {
    let talent = await this.#getTalent(this.opt.name);
    let data = await this.#_fetch(`action=imageserving&wisId=${talent.id}&format=json`);

    return data.image.imageserving;
  }

  async getGallery() {
    if (!this.data.images.gallery) {
      let talent = await this.#getTalent(`${this.opt.name}/Gallery`);
      let body = await this.#_fetch(`action=parse&prop=text&pageid=${talent.id}&format=json`);

      if (body.error) {
        return { error: "No data found" };
      }

      let obj = {
        talent: [],
        artworks: [],
        fan_arts: []
      };
      const $ = cheerio.load(body.parse.text["*"]);

      // talent gallery
      $("#gallery-0 > .wikia-gallery-item > .thumb > div.gallery-image-wrapper > a.image > img").each((i, el) => {
        let res = $(el).attr();
        obj.talent.push({ url: res["data-src"], name: res["data-image-name"], key: res["data-image-key"], alt: res.alt });
      });

      // artworks from char designer
      $("#gallery-1 > .wikia-gallery-item > .thumb > div.gallery-image-wrapper > a.image > img").each((i, el) => {
        let res = $(el).attr();
        obj.artworks.push({ url: res["data-src"], name: res["data-image-name"], key: res["data-image-key"], alt: res.alt });
      });

      // fan arts
      $("#gallery-2 > .wikia-gallery-item > .thumb > div.gallery-image-wrapper > a.image > img").each((i, el) => {
        let res = $(el).attr();
        obj.fan_arts.push({ url: res["data-src"], name: res["data-image-name"], key: res["data-image-key"], alt: res.alt });
      });

      this.data.images.gallery = obj;

      return this.data.images.gallery;
    } else {
      return this.data.images.gallery;
    }
  }

  async getDetail() {
    if (!this.data) {
      let talent = await this.#getTalent(this.opt.name);
      let body = await this.#_fetch(`action=parse&prop=properties&pageid=${talent.id}&format=json`);
      //let body = await this.#_fetch(`action=parse&prop=properties|text&pageid=${talent.id}&format=json`);

      if (body.error) {
        return { error: "No data found" };
      }

      let obj = {};
      // const $ = cheerio.load(body.parse.text["*"]);
      // console.log($(".mw-parser-output > p:nth-child(5)").text());
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
            obj["images"] = {};
            obj["images"]["profile"] = r.data;
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

  #_fetch = (params) => {
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
  };
}

module.exports = { Hololive };
