export type NewWaveTrack = {
  artist: string;
  title: string;
  album: string;
  year: number;
  spotifyId: string;
};

export type NewWaveTrackPair = {
  id: string;
  heading: string;
  original: NewWaveTrack;
  cover: NewWaveTrack;
  listenFor: string;
  connection: string;
};

export const newWaveTrackPairs: NewWaveTrackPair[] = [
  {
    id: "making-plans-for-nigel",
    heading: "Making Plans For Nigel",
    original: {
      artist: "XTC",
      title: "Making Plans For Nigel",
      album: "Drums and Wires",
      year: 1979,
      spotifyId: "1XT5kxg6Tk0ukCO2vBQN4v",
    },
    cover: {
      artist: "Primus",
      title: "Making Plans For Nigel",
      album: "Miscellaneous Debris",
      year: 1992,
      spotifyId: "5EvpklpOJu1dJK5MGsRNzx",
    },
    listenFor:
      "The clipped rhythm and mechanical gait are already in XTC. Primus adds low-end weight and attack without having to make the song strange from scratch.",
    connection:
      "Primus makes the family resemblance obvious by changing the body of the performance while leaving its nervous architecture in place.",
  },
  {
    id: "scissor-man",
    heading: "Scissor Man",
    original: {
      artist: "XTC",
      title: "Scissor Man",
      album: "Drums and Wires",
      year: 1979,
      spotifyId: "1OM6HeJdm6AKe2VJCn9pbA",
    },
    cover: {
      artist: "Primus",
      title: "Scissor Man",
      album: "Rhinoplasty",
      year: 1998,
      spotifyId: "4pSRdrjShKkblJgcIFiieL",
    },
    listenFor:
      "Character voice, clipped guitar and a lurching threat in the original, then the way Primus stretches that threat without losing the compact song underneath it.",
    connection:
      "A second cover from Drums and Wires turns XTC from a stray influence into a repeated destination.",
  },
  {
    id: "intruder",
    heading: "Intruder",
    original: {
      artist: "Peter Gabriel",
      title: "Intruder",
      album: "Peter Gabriel 3",
      year: 1980,
      spotifyId: "4vgqp0xt9Y22jMG177y4B4",
    },
    cover: {
      artist: "Primus",
      title: "Intruder",
      album: "Miscellaneous Debris",
      year: 1992,
      spotifyId: "3XUecNMkz1jOrfz1H11bOE",
    },
    listenFor:
      "The original makes the huge, abruptly cut drum room part of the composition. Primus preserves the repetition and open space, then gives them a heavier physical shove.",
    connection:
      "This pair lets the production-transfer diagram become audible instead of remaining a story about studio credits.",
  },
  {
    id: "family-and-fishing-net",
    heading: "The Family And The Fishing Net",
    original: {
      artist: "Peter Gabriel",
      title: "The Family And The Fishing Net",
      album: "Peter Gabriel 4",
      year: 1982,
      spotifyId: "3NIiAqTN1nvL8tG1WHS3G1",
    },
    cover: {
      artist: "Primus",
      title: "The Family And The Fishing Net",
      album: "Rhinoplasty",
      year: 1998,
      spotifyId: "7mi32lMRzl5618GTeuy7WO",
    },
    listenFor:
      "Ritual rhythm, an odd-shaped arrangement and dense atmosphere, followed by the parts Primus preserves when the performance becomes more blunt and elastic.",
    connection:
      "The second Gabriel cover shows sustained attention rather than a one-off novelty choice.",
  },
];

export const giorgioCoda: NewWaveTrack = {
  artist: "Daft Punk",
  title: "Giorgio by Moroder",
  album: "Random Access Memories",
  year: 2013,
  spotifyId: "0oks4FnzhNp5QPTZtoet7c",
};

export const hamburgerTrain: NewWaveTrack = {
  artist: "Primus",
  title: "Hamburger Train",
  album: "Pork Soda",
  year: 1993,
  spotifyId: "0tdWYwH8xIOoSeNoEz7QqV",
};

export const hearTheMeshTracks = [
  { artist: "Donna Summer", title: "I Feel Love", year: 1977 },
  { artist: "David Bowie", title: "Heroes", year: 1977 },
  { artist: "Devo", title: "Jocko Homo", year: 1978 },
  { artist: "Talking Heads", title: "The Great Curve", year: 1980 },
  { artist: "Japan", title: "Life in Tokyo", year: 1979 },
  { artist: "King Crimson", title: "Elephant Talk", year: 1981 },
  { artist: "Oingo Boingo", title: "Only a Lad", year: 1981 },
  { artist: "Bruce Springsteen", title: "Hungry Heart", year: 1980 },
  { artist: "Limahl", title: "The NeverEnding Story", year: 1984 },
] as const;

export function spotifyTrackUrl(track: NewWaveTrack): string {
  return `https://open.spotify.com/track/${track.spotifyId}`;
}

export function spotifySearchUrl(artist: string, title: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${title}`)}`;
}
