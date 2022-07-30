interface ResponseImage {
  url: string;
  name: string;
  key: string;
  alt: any;
  isVideo: boolean;
}

interface ResponseDetail {
  name: string;
  image: ResponseImage[];
  original_name: string;
  nick_name: string[];
  debut_date: Date;
  character_designer: string[];
  affiliation: string;
  channel: string[];
  social_media: string[];
  official_website: string[];
  gender: string;
  age?: string | undefined;
  birthday: string;
  height: string;
  weight: string;
  zodiac_sign: string;
  emoji: string;
}

export class Hololive {
  constructor(charName: string);
  baseURL: string;
  opt: {
    name: string;
  }
  data?: ResponseDetail | undefined;
  init: function(): Promise<Hololive>;
  getDetail: function(): Promise<ResponseDetail>;
  getRestPfp: function(): Promise<string>;
}
