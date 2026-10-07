export type Game = {
  id: number
  slug: string

  // Basic Information
  title: string
  year: number
  developer: string
  publisher: string

  // Classification
  platforms: string[]
  genres: string[]
  tags: string[]

  // Game Characteristics
  difficulty: string
  gameLength: string
  mood: string[]
  gameplay: string[]

  // GAMEBOX Scores
  gameboxScore: number
  retroScore: number
  hiddenGemScore: number
  revivalPotential: number

  // Content
  description: string
  whyPlay: string
  retroHistory: string

  // Discovery
  searchKeywords: string[]
}

export const games: Game[] = [
  {
    id: 1,
    slug: "silent-hill-2",
    title: "Silent Hill 2",
    year: 2001,
    developer: "Konami Computer Entertainment Tokyo",
    publisher: "Konami",
    platforms: ["PS2", "Xbox", "PC"],
    genres: ["Horror", "Survival Horror"],
    tags: ["Psychological Horror", "Atmosphere", "Story"],
    difficulty: "Medium",
    gameLength: "8–10 hours",
    mood: ["Dark", "Psychological", "Unsettling"],
    gameplay: ["Exploration", "Puzzle", "Survival"],
    gameboxScore: 96,
    retroScore: 98,
    hiddenGemScore: 92,
    revivalPotential: 95,
    description:
      "A psychological survival horror masterpiece built around atmosphere, symbolism, sound design and deeply unsettling exploration.",
    whyPlay:
      "Play it for its atmosphere, psychological storytelling and exceptional environmental design.",
    retroHistory:
      "Silent Hill 2 became one of the defining psychological horror games of the PlayStation 2 generation and remains one of the most influential horror games ever made.",
    searchKeywords: [
      "silent hill",
      "silent hill 2",
      "psychological horror",
      "ps2 horror",
      "survival horror",
    ],
  },

  {
    id: 2,
    slug: "silent-hill-3",
    title: "Silent Hill 3",
    year: 2003,
    developer: "Konami Computer Entertainment Tokyo",
    publisher: "Konami",
    platforms: ["PS2", "PC"],
    genres: ["Horror", "Survival Horror"],
    tags: ["Psychological Horror", "Atmosphere", "Story"],
    difficulty: "Medium",
    gameLength: "7–9 hours",
    mood: ["Dark", "Psychological", "Unsettling"],
    gameplay: ["Exploration", "Puzzle", "Survival", "Combat"],
    gameboxScore: 94,
    retroScore: 96,
    hiddenGemScore: 88,
    revivalPotential: 91,
    description:
      "A visually striking survival horror experience combining disturbing environments, psychological themes and memorable creature design.",
    whyPlay:
      "Play it for its disturbing atmosphere, striking art direction, memorable creatures and psychological storytelling.",
    retroHistory:
      "Silent Hill 3 is widely regarded as one of the strongest survival horror games of the PlayStation 2 era and a landmark example of psychological horror design.",
    searchKeywords: [
      "silent hill",
      "silent hill 3",
      "psychological horror",
      "ps2 horror",
      "survival horror",
    ],
  },

  {
    id: 3,
    slug: "resident-evil-2",
    title: "Resident Evil 2",
    year: 1998,
    developer: "Capcom",
    publisher: "Capcom",
    platforms: ["PS1", "N64", "Dreamcast", "GameCube", "PC"],
    genres: ["Horror", "Survival Horror", "Action"],
    tags: ["Zombies", "Police Station", "Classic"],
    difficulty: "Medium",
    gameLength: "8–12 hours",
    mood: ["Tense", "Dark", "Cinematic"],
    gameplay: ["Exploration", "Puzzle", "Combat", "Resource Management"],
    gameboxScore: 97,
    retroScore: 99,
    hiddenGemScore: 85,
    revivalPotential: 97,
    description:
      "One of the defining survival horror games of the PlayStation era, combining exploration, puzzles, combat and cinematic storytelling.",
    whyPlay:
      "Play it for its iconic police station setting, memorable enemies, excellent pacing and foundational survival horror design.",
    retroHistory:
      "Resident Evil 2 became one of the most influential survival horror games of the late 1990s and helped establish the genre as a mainstream success.",
    searchKeywords: [
      "resident evil",
      "resident evil 2",
      "re2",
      "ps1 horror",
      "survival horror",
      "zombie game",
    ],
  },

  {
    id: 4,
    slug: "fatal-frame-2",
    title: "Fatal Frame II: Crimson Butterfly",
    year: 2003,
    developer: "Tecmo",
    publisher: "Tecmo",
    platforms: ["PS2", "Xbox"],
    genres: ["Horror", "Survival Horror"],
    tags: ["Ghosts", "Japanese Horror", "Atmosphere"],
    difficulty: "Hard",
    gameLength: "9–12 hours",
    mood: ["Haunting", "Dark", "Melancholic"],
    gameplay: ["Exploration", "Puzzle", "Survival", "Combat"],
    gameboxScore: 93,
    retroScore: 97,
    hiddenGemScore: 96,
    revivalPotential: 94,
    description:
      "A haunting Japanese survival horror game centered around two sisters, an abandoned village and a supernatural camera.",
    whyPlay:
      "Play it for its Japanese ghost-story atmosphere, supernatural camera mechanic and deeply unsettling village setting.",
    retroHistory:
      "Fatal Frame II is widely regarded as one of the strongest Japanese survival horror games of the PS2 era and remains a cult favorite among horror fans.",
    searchKeywords: [
      "fatal frame",
      "fatal frame 2",
      "crimson butterfly",
      "project zero",
      "japanese horror",
      "ps2 horror",
    ],
  },

  {
    id: 5,
    slug: "dark-souls",
    title: "Dark Souls",
    year: 2011,
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    platforms: [
      "PS3",
      "Xbox 360",
      "PC",
      "PS4",
      "Xbox One",
      "Nintendo Switch",
    ],
    genres: ["Action RPG", "RPG"],
    tags: ["Difficult", "Dark Fantasy", "Exploration"],
    difficulty: "Hard",
    gameLength: "40–60 hours",
    mood: ["Dark", "Mysterious", "Bleak"],
    gameplay: ["Combat", "Exploration", "Character Building", "Discovery"],
    gameboxScore: 98,
    retroScore: 96,
    hiddenGemScore: 72,
    revivalPotential: 90,
    description:
      "A landmark action RPG built around interconnected world design, challenging combat, environmental storytelling and discovery.",
    whyPlay:
      "Play it for its interconnected world, precise combat, mysterious lore and extraordinary sense of discovery.",
    retroHistory:
      "Dark Souls helped popularize a new generation of challenging action RPGs and became one of the most influential games of the 2010s.",
    searchKeywords: [
      "dark souls",
      "soulslike",
      "action rpg",
      "fromsoftware",
      "dark fantasy",
      "challenging games",
    ],
  },

  {
    id: 6,
    slug: "demons-souls",
    title: "Demon's Souls",
    year: 2009,
    developer: "FromSoftware",
    publisher: "Sony Computer Entertainment",
    platforms: ["PS3"],
    genres: ["Action RPG", "RPG"],
    tags: ["Difficult", "Dark Fantasy", "Cult"],
    difficulty: "Very Hard",
    gameLength: "30–40 hours",
    mood: ["Dark", "Bleak", "Mysterious"],
    gameplay: ["Combat", "Exploration", "Character Building", "Discovery"],
    gameboxScore: 96,
    retroScore: 98,
    hiddenGemScore: 88,
    revivalPotential: 94,
    description:
      "The game that established many of the design principles that would later define the Souls genre.",
    whyPlay:
      "Play it to experience the foundation of the Souls formula, with atmospheric worlds, demanding combat and unusual multiplayer systems.",
    retroHistory:
      "Demon's Souls originated many of the design ideas that later became central to FromSoftware's globally successful Souls series.",
    searchKeywords: [
      "demons souls",
      "demon's souls",
      "soulslike",
      "fromsoftware",
      "ps3 rpg",
      "action rpg",
    ],
  },

  {
    id: 7,
    slug: "vagrant-story",
    title: "Vagrant Story",
    year: 2000,
    developer: "Square",
    publisher: "Square",
    platforms: ["PS1"],
    genres: ["RPG", "Action RPG"],
    tags: ["Cult Classic", "Dark Fantasy", "Dungeon"],
    difficulty: "Hard",
    gameLength: "25–35 hours",
    mood: ["Dark", "Serious", "Mysterious"],
    gameplay: ["Combat", "Exploration", "Dungeon Crawling", "Character Building"],
    gameboxScore: 94,
    retroScore: 99,
    hiddenGemScore: 99,
    revivalPotential: 98,
    description:
      "A sophisticated cult RPG known for its intricate combat systems, dark atmosphere, dungeon design and visual direction.",
    whyPlay:
      "Play it for its unusually deep combat system, atmospheric world, memorable art direction and sophisticated storytelling.",
    retroHistory:
      "Vagrant Story became one of Square's most critically respected cult RPGs and remains a frequent subject of discussion among PlayStation RPG enthusiasts.",
    searchKeywords: [
      "vagrant story",
      "square rpg",
      "ps1 rpg",
      "cult rpg",
      "dark fantasy",
      "hidden gem rpg",
    ],
  },

  {
    id: 8,
    slug: "shadow-tower",
    title: "Shadow Tower",
    year: 1998,
    developer: "FromSoftware",
    publisher: "FromSoftware",
    platforms: ["PS1"],
    genres: ["Action RPG", "Dungeon Crawler"],
    tags: ["Dark Fantasy", "Cult", "Atmosphere"],
    difficulty: "Very Hard",
    gameLength: "20–30 hours",
    mood: ["Oppressive", "Dark", "Claustrophobic"],
    gameplay: ["Exploration", "Combat", "Dungeon Crawling", "Resource Management"],
    gameboxScore: 89,
    retroScore: 96,
    hiddenGemScore: 99,
    revivalPotential: 91,
    description:
      "An obscure FromSoftware dungeon crawler featuring oppressive environments, brutal combat and an unusual first-person perspective.",
    whyPlay:
      "Play it for its oppressive atmosphere, unusual first-person perspective and glimpse into FromSoftware's early design philosophy.",
    retroHistory:
      "Shadow Tower represents an important early branch of FromSoftware's dungeon-crawler design and is often cited as a precursor to later Souls ideas.",
    searchKeywords: [
      "shadow tower",
      "fromsoftware",
      "ps1 rpg",
      "dungeon crawler",
      "dark fantasy",
      "cult game",
    ],
  },

  {
    id: 9,
    slug: "deus-ex",
    title: "Deus Ex",
    year: 2000,
    developer: "Ion Storm",
    publisher: "Eidos Interactive",
    platforms: ["PC", "PS2"],
    genres: ["Immersive Sim", "RPG", "Action"],
    tags: ["Cyberpunk", "Choices", "Stealth"],
    difficulty: "Medium",
    gameLength: "25–40 hours",
    mood: ["Dark", "Conspiratorial", "Thoughtful"],
    gameplay: ["Stealth", "Exploration", "Choices", "Role Playing"],
    gameboxScore: 98,
    retroScore: 97,
    hiddenGemScore: 89,
    revivalPotential: 96,
    description:
      "A genre-defining immersive simulation combining role-playing, stealth, exploration, dialogue and player-driven problem solving.",
    whyPlay:
      "Play it for its freedom of approach, systemic level design, cyberpunk world and extraordinary player choice.",
    retroHistory:
      "Deus Ex became one of the defining immersive sims of the PC era and established design principles that continue to influence modern games.",
    searchKeywords: [
      "deus ex",
      "immersive sim",
      "cyberpunk",
      "stealth rpg",
      "pc classic",
      "ion storm",
    ],
  },

  {
    id: 10,
    slug: "system-shock-2",
    title: "System Shock 2",
    year: 1999,
    developer: "Looking Glass Studios",
    publisher: "Electronic Arts",
    platforms: ["PC"],
    genres: ["Immersive Sim", "RPG", "Horror"],
    tags: ["Sci-Fi", "Horror", "Exploration"],
    difficulty: "Hard",
    gameLength: "15–20 hours",
    mood: ["Claustrophobic", "Terrifying", "Mysterious"],
    gameplay: ["Exploration", "Combat", "Character Building", "Resource Management"],
    gameboxScore: 96,
    retroScore: 98,
    hiddenGemScore: 95,
    revivalPotential: 94,
    description:
      "A pioneering science-fiction immersive sim blending RPG progression, horror, exploration and systemic gameplay.",
    whyPlay:
      "Play it for its oppressive atmosphere, RPG systems, environmental storytelling and pioneering immersive-sim design.",
    retroHistory:
      "System Shock 2 became a foundational work in immersive simulation and horror, influencing games such as BioShock and later systemic titles.",
    searchKeywords: [
      "system shock 2",
      "immersive sim",
      "sci fi horror",
      "pc classic",
      "looking glass",
      "horror rpg",
    ],
  },

  {
    id: 11,
    slug: "thief-2",
    title: "Thief II: The Metal Age",
    year: 2000,
    developer: "Looking Glass Studios",
    publisher: "Eidos Interactive",
    platforms: ["PC"],
    genres: ["Stealth", "Immersive Sim"],
    tags: ["Stealth", "Atmosphere", "Level Design"],
    difficulty: "Hard",
    gameLength: "20–25 hours",
    mood: ["Dark", "Quiet", "Atmospheric"],
    gameplay: ["Stealth", "Exploration", "Infiltration", "Resource Management"],
    gameboxScore: 95,
    retroScore: 98,
    hiddenGemScore: 96,
    revivalPotential: 92,
    description:
      "A landmark stealth game celebrated for its systemic level design, sound-based gameplay and open-ended infiltration.",
    whyPlay:
      "Play it for some of the finest stealth level design ever created and a gameplay system built around sound, light and observation.",
    retroHistory:
      "Thief II is considered one of the most influential stealth games ever made and remains a benchmark for systemic infiltration design.",
    searchKeywords: [
      "thief 2",
      "thief ii",
      "stealth game",
      "immersive sim",
      "looking glass",
      "pc classic",
    ],
  },

  {
    id: 12,
    slug: "prey-2017",
    title: "Prey",
    year: 2017,
    developer: "Arkane Studios",
    publisher: "Bethesda Softworks",
    platforms: ["PC", "PS4", "Xbox One"],
    genres: ["Immersive Sim", "Action", "Sci-Fi"],
    tags: ["Sci-Fi", "Exploration", "Choices"],
    difficulty: "Medium",
    gameLength: "15–25 hours",
    mood: ["Mysterious", "Tense", "Isolation"],
    gameplay: ["Exploration", "Combat", "Stealth", "Choices"],
    gameboxScore: 95,
    retroScore: 78,
    hiddenGemScore: 93,
    revivalPotential: 91,
    description:
      "A highly systemic science-fiction immersive sim focused on exploration, environmental storytelling and player experimentation.",
    whyPlay:
      "Play it for its systemic environments, creative abilities, exploration and exceptional sense of player freedom.",
    retroHistory:
      "Prey is increasingly regarded as a modern cult classic and one of Arkane Studios' strongest examples of immersive-sim design.",
    searchKeywords: [
      "prey 2017",
      "prey",
      "arkane",
      "immersive sim",
      "sci fi game",
      "hidden gem",
    ],
  },

  {
    id: 13,
    slug: "killer7",
    title: "Killer7",
    year: 2005,
    developer: "Grasshopper Manufacture",
    publisher: "Capcom",
    platforms: ["GameCube", "PS2", "PC"],
    genres: ["Action", "Adventure"],
    tags: ["Cult", "Stylized", "Experimental"],
    difficulty: "Medium",
    gameLength: "10–15 hours",
    mood: ["Surreal", "Stylish", "Unsettling"],
    gameplay: ["Combat", "Exploration", "Puzzle", "Story"],
    gameboxScore: 91,
    retroScore: 96,
    hiddenGemScore: 99,
    revivalPotential: 96,
    description:
      "A highly stylized cult game known for its surreal visual language, unconventional gameplay and distinctive narrative.",
    whyPlay:
      "Play it for its unique visual identity, strange narrative, experimental structure and unmistakable Suda51 style.",
    retroHistory:
      "Killer7 developed a strong cult following thanks to its unconventional presentation and remains one of the most distinctive games of the sixth console generation.",
    searchKeywords: [
      "killer7",
      "killer 7",
      "suda51",
      "grasshopper manufacture",
      "cult games",
      "gamecube classic",
    ],
  },

  {
    id: 14,
    slug: "rule-of-rose",
    title: "Rule of Rose",
    year: 2006,
    developer: "Punchline",
    publisher: "505 Games",
    platforms: ["PS2"],
    genres: ["Horror", "Adventure"],
    tags: ["Cult", "Psychological Horror", "Rare"],
    difficulty: "Medium",
    gameLength: "12–15 hours",
    mood: ["Disturbing", "Psychological", "Melancholic"],
    gameplay: ["Exploration", "Combat", "Story", "Puzzle"],
    gameboxScore: 88,
    retroScore: 97,
    hiddenGemScore: 100,
    revivalPotential: 98,
    description:
      "A rare and controversial psychological horror title remembered for its disturbing themes, unusual storytelling and cult following.",
    whyPlay:
      "Play it for its unusual psychological themes, unsettling atmosphere and status as one of the most elusive PS2 horror games.",
    retroHistory:
      "Rule of Rose developed a major cult reputation after its limited release and became one of the most sought-after survival horror games of the PS2 era.",
    searchKeywords: [
      "rule of rose",
      "ps2 horror",
      "psychological horror",
      "cult horror",
      "rare ps2 games",
      "survival horror",
    ],
  },

  {
    id: 15,
    slug: "the-suffering",
    title: "The Suffering",
    year: 2004,
    developer: "Surreal Software",
    publisher: "Midway Games",
    platforms: ["PS2", "Xbox", "PC"],
    genres: ["Horror", "Action"],
    tags: ["Horror", "Cult", "Prison"],
    difficulty: "Medium",
    gameLength: "8–10 hours",
    mood: ["Dark", "Brutal", "Claustrophobic"],
    gameplay: ["Combat", "Exploration", "Survival", "Choices"],
    gameboxScore: 89,
    retroScore: 94,
    hiddenGemScore: 97,
    revivalPotential: 95,
    description:
      "A dark action-horror game combining third-person shooting, psychological themes and a disturbing prison setting.",
    whyPlay:
      "Play it for its brutal prison setting, monster designs, action-oriented horror and surprisingly interesting morality system.",
    retroHistory:
      "The Suffering gained a dedicated cult following and remains one of the more distinctive action-horror games of the PS2 and Xbox generation.",
    searchKeywords: [
      "the suffering",
      "surreal software",
      "ps2 horror",
      "xbox horror",
      "action horror",
      "cult games",
    ],
  },

  {
    id: 16,
    slug: "enslaved-odyssey-to-the-west",
    title: "Enslaved: Odyssey to the West",
    year: 2010,
    developer: "Ninja Theory",
    publisher: "Namco Bandai Games",
    platforms: ["PS3", "Xbox 360", "PC"],
    genres: ["Action Adventure", "Action"],
    tags: ["Post-Apocalyptic", "Story", "Character"],
    difficulty: "Medium",
    gameLength: "12–15 hours",
    mood: ["Cinematic", "Melancholic", "Hopeful"],
    gameplay: ["Combat", "Exploration", "Platforming", "Story"],
    gameboxScore: 90,
    retroScore: 87,
    hiddenGemScore: 94,
    revivalPotential: 93,
    description:
      "A cinematic action adventure inspired by Journey to the West, combining strong character writing with post-apocalyptic environments.",
    whyPlay:
      "Play it for its memorable characters, cinematic presentation, post-apocalyptic world and surprisingly strong narrative.",
    retroHistory:
      "Enslaved earned critical praise but never achieved the commercial success expected of it, giving the game a lasting hidden-gem reputation.",
    searchKeywords: [
      "enslaved odyssey to the west",
      "enslaved",
      "ninja theory",
      "ps3 hidden gem",
      "xbox 360 games",
      "action adventure",
    ],
  },

  {
    id: 17,
    slug: "shadow-of-the-colossus",
    title: "Shadow of the Colossus",
    year: 2005,
    developer: "Team Ico",
    publisher: "Sony Computer Entertainment",
    platforms: ["PS2", "PS3", "PS4"],
    genres: ["Action Adventure", "Adventure"],
    tags: ["Colossus", "Atmosphere", "Minimalism"],
    difficulty: "Medium",
    gameLength: "8–12 hours",
    mood: ["Melancholic", "Epic", "Mysterious"],
    gameplay: ["Exploration", "Puzzle", "Boss Battles", "Climbing"],
    gameboxScore: 98,
    retroScore: 99,
    hiddenGemScore: 80,
    revivalPotential: 91,
    description:
      "A landmark adventure game centered around gigantic creatures, environmental scale, exploration and minimalist storytelling.",
    whyPlay:
      "Play it for its breathtaking scale, memorable boss encounters, minimalist storytelling and extraordinary sense of atmosphere.",
    retroHistory:
      "Shadow of the Colossus became one of the defining artistic achievements of the PlayStation 2 era and remains highly influential in game design.",
    searchKeywords: [
      "shadow of the colossus",
      "team ico",
      "ps2 classic",
      "colossus",
      "action adventure",
      "art games",
    ],
  },

  {
    id: 18,
    slug: "metal-gear-solid-2",
    title: "Metal Gear Solid 2: Sons of Liberty",
    year: 2001,
    developer: "Konami Computer Entertainment Japan",
    publisher: "Konami",
    platforms: ["PS2", "Xbox", "PC"],
    genres: ["Stealth", "Action"],
    tags: ["Stealth", "Story", "Cyberpunk"],
    difficulty: "Medium",
    gameLength: "12–15 hours",
    mood: ["Political", "Paranoid", "Cinematic"],
    gameplay: ["Stealth", "Combat", "Exploration", "Story"],
    gameboxScore: 96,
    retroScore: 97,
    hiddenGemScore: 82,
    revivalPotential: 90,
    description:
      "A technically ambitious stealth action game remembered for its cinematic direction, systemic gameplay and unusually ambitious themes.",
    whyPlay:
      "Play it for its stealth mechanics, cinematic direction, memorable set pieces and surprisingly prescient themes.",
    retroHistory:
      "Metal Gear Solid 2 became one of the most discussed games of its generation and remains notable for its ambitious approach to technology, information and identity.",
    searchKeywords: [
      "metal gear solid 2",
      "mgs2",
      "sons of liberty",
      "stealth game",
      "ps2 classic",
      "konami",
    ],
  },

  {
    id: 19,
    slug: "ico",
    title: "Ico",
    year: 2001,
    developer: "Team Ico",
    publisher: "Sony Computer Entertainment",
    platforms: ["PS2", "PS3"],
    genres: ["Adventure", "Puzzle"],
    tags: ["Atmosphere", "Minimalism", "Art"],
    difficulty: "Medium",
    gameLength: "7–10 hours",
    mood: ["Quiet", "Melancholic", "Dreamlike"],
    gameplay: ["Exploration", "Puzzle", "Platforming", "Companion"],
    gameboxScore: 95,
    retroScore: 99,
    hiddenGemScore: 91,
    revivalPotential: 92,
    description:
      "A minimalist adventure game praised for its atmosphere, environmental design, puzzle mechanics and emotional presentation.",
    whyPlay:
      "Play it for its elegant environmental design, minimalist storytelling, puzzles and unique emotional atmosphere.",
    retroHistory:
      "Ico became a landmark example of atmospheric game design and helped establish Team Ico as one of the most influential artistic teams in the medium.",
    searchKeywords: [
      "ico",
      "team ico",
      "ps2 classic",
      "minimalist games",
      "art games",
      "adventure game",
    ],
  },

  {
    id: 20,
    slug: "shenmue",
    title: "Shenmue",
    year: 1999,
    developer: "Sega AM2",
    publisher: "Sega",
    platforms: ["Dreamcast"],
    genres: ["Adventure", "Action"],
    tags: ["Open World", "Japan", "Cult"],
    difficulty: "Medium",
    gameLength: "20–30 hours",
    mood: ["Nostalgic", "Atmospheric", "Melancholic"],
    gameplay: ["Exploration", "Investigation", "Combat", "Life Simulation"],
    gameboxScore: 95,
    retroScore: 99,
    hiddenGemScore: 90,
    revivalPotential: 94,
    description:
      "A pioneering open-world adventure combining detailed environments, daily-life simulation, investigation and cinematic storytelling.",
    whyPlay:
      "Play it for its pioneering open-world design, detailed environments, investigation systems and immersive everyday-life simulation.",
    retroHistory:
      "Shenmue was one of the most ambitious games of its era and helped establish many ideas that would later become standard in open-world games.",
    searchKeywords: [
      "shenmue",
      "dreamcast",
      "sega",
      "open world",
      "japan game",
      "cult classic",
    ],
  },
]