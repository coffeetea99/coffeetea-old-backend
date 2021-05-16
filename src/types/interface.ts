export interface IDiary {
  date: string; // TBD: format
  content: string;
}

export interface IAnime {
  id: number;
  title: string;
  date: string;
}

export interface IAnimeScreenshot {
  anime_id: number;
  screenshot_id: number;
  filename: string;
}

export interface IAnimeWithScreenshot extends IAnime {
  id: number;
  title: string;
  date: string;
  screenshots: string[];
}

export interface IAnisong {
  id: number;
  filename: string;
  description: string;
}

export interface IAnisongPoll {
  id: number;
  name: string;
}

export interface IAnisongScoreboard {
  name: string;
  score: number;
}
