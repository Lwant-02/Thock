export interface SoundPack {
  id: string;
  name: string;
  color: string;
  url: string;
  configUrl: string;
}

function pack(folder: string, name: string, color: string): SoundPack {
  return {
    id: folder,
    name,
    color,
    url: `/sounds/${folder}/sound.ogg`,
    configUrl: `/sounds/${folder}/config.json`,
  };
}

export const SOUND_PACKS: SoundPack[] = [
  pack("cherrymx-brown-pbt", "CherryMX Brown · PBT", "#8a5a2b"),
  pack("cherrymx-brown-abs", "CherryMX Brown · ABS", "#a06a35"),
  pack("cherrymx-black-pbt", "CherryMX Black · PBT", "#2f3033"),
  pack("cherrymx-black-abs", "CherryMX Black · ABS", "#4a4b4f"),
  pack("cherrymx-blue-pbt", "CherryMX Blue · PBT", "#2f6fed"),
  pack("cherrymx-blue-abs", "CherryMX Blue · ABS", "#4f8bf0"),
  pack("cherrymx-red-pbt", "CherryMX Red · PBT", "#e23b3b"),
  pack("cherrymx-red-abs", "CherryMX Red · ABS", "#ef5a5a"),
  pack("eg-crystal-purple", "EG Crystal Purple", "#8b5cf6"),
  pack("eg-oreo", "EG Oreo", "#374151"),
  pack("bruh", "Bruh Moment", "#ECB65F"),
  pack("gunshot", "Gun Shot", "#c03232"),
  pack("anime-moan", "Anime Moan", "#f472b6"),
  pack("vine-boom", "Vine Boom", "#111844"),
];

export const DEFAULT_PACK = SOUND_PACKS[0];
