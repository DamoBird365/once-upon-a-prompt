export interface KidDetails {
  name: string;
  pronouns: "he" | "she" | "they";
  age: number;
  colour?: string;
  companionName?: string;
  companionDesc?: string;
}

export interface StoryTheme {
  id: string;
  emoji: string;
  label: string;
  prompt: string;
}

export const storyThemes: StoryTheme[] = [
  { id: "space", emoji: "🚀", label: "Space Adventure", prompt: "an exciting space adventure exploring planets and meeting friendly aliens" },
  { id: "pirate", emoji: "🏴‍☠️", label: "Pirate Quest", prompt: "a pirate treasure hunt sailing the seas on a magical ship" },
  { id: "forest", emoji: "🌲", label: "Enchanted Forest", prompt: "a magical journey through an enchanted forest full of talking animals" },
  { id: "underwater", emoji: "🌊", label: "Underwater Kingdom", prompt: "an underwater adventure discovering a hidden kingdom beneath the waves" },
  { id: "dinosaur", emoji: "🦕", label: "Dinosaur Discovery", prompt: "a time-travelling trip to meet friendly dinosaurs" },
  { id: "superhero", emoji: "🦸", label: "Superhero School", prompt: "a day at superhero school learning amazing powers" },
  { id: "castle", emoji: "🏰", label: "Castle Mystery", prompt: "solving a fun mystery inside a magical castle" },
  { id: "rainbow", emoji: "🌈", label: "Rainbow Land", prompt: "a colourful adventure in a magical land made of rainbows" },
  { id: "dragon", emoji: "🐉", label: "Dragon Friend", prompt: "making friends with a baby dragon and going on a flying adventure" },
  { id: "circus", emoji: "🎪", label: "Circus Spectacular", prompt: "joining a magical circus and learning amazing tricks" },
];

export type StoryLength = "short" | "medium" | "long";

export const storyLengths: {
  id: StoryLength;
  label: string;
  emoji: string;
  time: string;
  wordGuidance: string;
}[] = [
  { id: "short", label: "Quick Tale", emoji: "⚡", time: "~30 sec", wordGuidance: "about 50 words" },
  { id: "medium", label: "Bedtime Story", emoji: "📖", time: "~2 min", wordGuidance: "about 150-200 words" },
  { id: "long", label: "Epic Adventure", emoji: "📚", time: "~3 min", wordGuidance: "about 250-300 words with lots of dialogue and descriptive scenes" },
];

const pronounMap = {
  he: { subject: "he", object: "him", possessive: "his" },
  she: { subject: "she", object: "her", possessive: "her" },
  they: { subject: "they", object: "them", possessive: "their" },
};

export function buildStoryPrompt(
  kids: KidDetails[],
  theme: StoryTheme,
  storyExtra?: string,
  length: StoryLength = "medium",
): string {
  const characterLines = kids.map((kid) => {
    const p = pronounMap[kid.pronouns];
    let line = `- ${kid.name}, age ${kid.age}`;
    if (kid.colour) line += `, who loves the colour ${kid.colour}`;
    line += ` (use ${p.subject}/${p.object}/${p.possessive} pronouns)`;
    if (kid.companionName && kid.companionDesc) {
      line += `. ${kid.name}'s beloved companion is ${kid.companionName} (${kid.companionDesc})`;
    }
    return line;
  });

  const hasCompanions = kids.some((k) => k.companionName && k.companionDesc);
  const hasColours = kids.some((k) => k.colour);

  return [
    `Create a short, fun, kid-friendly bedtime story.`,
    ``,
    `Characters (these are real children — make them the heroes!):`,
    ...characterLines,
    ``,
    `Theme: ${theme.prompt}`,
    ...(storyExtra ? [``, `Extra idea from the parent: ${storyExtra}`] : []),
    ``,
    `Rules:`,
    `- Age-appropriate, gentle, and imaginative`,
    `- The children are the main characters and heroes of the story`,
    ...(hasColours ? [`- Reference their favourite colours naturally where it fits`] : []),
    ...(hasCompanions ? [`- Include their pet or toy companion as a character in the story — they come along on the adventure!`] : []),
    `- Include fun dialogue between characters`,
    `- Have a positive, uplifting, happy ending`,
    `- ${storyLengths.find((l) => l.id === length)!.wordGuidance}`,
    `- Make it exciting but never scary`,
  ].join("\n");
}

export function buildImagePrompt(kids: KidDetails[], theme: StoryTheme): string {
  const kidDescriptions = kids
    .map((kid) => {
      const clothing = kid.colour ? ` wearing ${kid.colour} clothes` : "";
      return `a ${kid.age}-year-old child${clothing}`;
    })
    .join(" and ");

  const companions = kids
    .filter((k) => k.companionName && k.companionDesc)
    .map((k) => k.companionDesc)
    .join(" and ");

  const companionPart = companions ? `, with ${companions}` : "";

  return `Children's storybook illustration, whimsical and colourful, ${kidDescriptions}${companionPart}, ${theme.prompt}, warm friendly style, digital art, bright colours, safe for children`;
}
