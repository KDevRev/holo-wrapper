interface ProfileImage {
  url: string;
  name: string;
  key: string;
  alt: unknown;
  isVideo: boolean;
}

interface GalleryImagesInfo {
  url: string;
  name: string;
  key: string;
  alt?: string | undefined;
}
interface GalleryImages {
  talent: GalleryImagesInfo[];
  artworks: GalleryImagesInfo[];
  fan_arts: GalleryImagesInfo[];
}

interface ResponseDetail {
  name: string;
  images: {
    profile: ProfileImage[];
    gallery: GalleryImages;
  };
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
  };
  data?: ResponseDetail | undefined;
  init(): Promise<Hololive>;
  getDetail(): Promise<ResponseDetail>;
  getGallery(): Promise<GalleryImages>;
  getRestPfpURL(): Promise<string>;
}
