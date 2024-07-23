import { EmbedBuilder } from "discord.js";
import { getDatabaseData } from "utilities";

export const wordList = [
    "About", "Alert", "Argue", "Beach",
    "Above", "Alike", "Arise", "Began",
    "Abuse", "Alive", "Array", "Begin",
    "Actor", "Allow", "Aside", "Begun",
    "Acute", "Alone", "Asset", "Being",
    "Admit", "Along", "Audio", "Below",
    "Adopt", "Alter", "Audit", "Bench",
    "Adult", "Among", "Avoid", "Billy",
    "After", "Anger", "Award", "Birth",
    "Again", "Angle", "Aware", "Black",
    "Agent", "Angry", "Badly", "Blame",
    "Agree", "Apart", "Baker", "Blind",
    "Ahead", "Apple", "Bases", "Block",
    "Alarm", "Apply", "Basic", "Blood",
    "Album", "Arena", "Basis", "Board",
    "Boost", "Buyer", "China", "Cover",
    "Booth", "Cable", "Chose", "Craft",
    "Bound", "Calif", "Civil", "Crash",
    "Brain", "Carry", "Claim", "Cream",
    "Brand", "Catch", "Class", "Crime",
    "Bread", "Cause", "Clean", "Cross",
    "Break", "Chain", "Clear", "Crowd",
    "Breed", "Chair", "Click", "Crown",
    "Brief", "Chart", "Clock", "Curve",
    "Bring", "Chase", "Close", "Cycle",
    "Broad", "Cheap", "Coach", "Daily",
    "Broke", "Check", "Coast", "Dance",
    "Brown", "Chest", "Could", "Dated",
    "Build", "Chief", "Count", "Dealt",
    "Built", "Child", "Court", "Death",
    "Debut", "Entry", "Forth", "Group",
    "Delay", "Equal", "Forty", "Grown",
    "Depth", "Error", "Forum", "Guard",
    "Doing", "Event", "Found", "Guess",
    "Doubt", "Every", "Frame", "Guest",
    "Dozen", "Exact", "Frank", "Guide",
    "Draft", "Exist", "Fraud", "Happy",
    "Drama", "Extra", "Fresh", "Harry",
    "Drawn", "Faith", "Front", "Heart",
    "Dream", "False", "Fruit", "Heavy",
    "Dress", "Fault", "Fully", "Hence",
    "Drill", "Fibre", "Funny", "Night",
    "Drink", "Field", "Giant", "Horse",
    "Drive", "Fifth", "Given", "Hotel",
    "Drove", "Fifty", "Glass", "House",
    "Dying", "Fight", "Globe", "Human",
    "Eager", "Final", "Going", "Ideal",
    "Early", "First", "Grace", "Image",
    "Earth", "Fixed", "Grade", "Index",
    "Eight", "Flash", "Grand", "Inner",
    "Elite", "Fleet", "Grant", "Input",
    "Empty", "Floor", "Grass", "Issue",
    "Enemy", "Fluid", "Great", "Irony",
    "Enjoy", "Focus", "Green", "Juice",
    "Enter", "Force", "Gross", "Joint",
    "Judge", "Metal", "Media", "Newly",
    "Known", "Local", "Might", "Noise",
    "Label", "Logic", "Minor", "North",
    "Large", "Loose", "Minus", "Noted",
    "Laser", "Lower", "Mixed", "Novel",
    "Later", "Lucky", "Model", "Nurse",
    "Laugh", "Lunch", "Money", "Occur",
    "Layer", "Lying", "Month", "Ocean",
    "Learn", "Magic", "Moral", "Offer",
    "Lease", "Major", "Motor", "Often",
    "Least", "Maker", "Mount", "Order",
    "Leave", "March", "Mouse", "Other",
    "Legal", "Music", "Mouth", "Ought",
    "Level", "Match", "Movie", "Paint",
    "Light", "Mayor", "Needs", "Paper",
    "Limit", "Meant", "Never", "Party",
    "Peace", "Power", "Radio", "Round",
    "Panel", "Press", "Raise", "Route",
    "Phase", "Price", "Range", "Royal",
    "Phone", "Pride", "Rapid", "Rural",
    "Photo", "Prime", "Ratio", "Scale",
    "Piece", "Print", "Reach", "Scene",
    "Pilot", "Prior", "Ready", "Scope",
    "Pitch", "Prize", "Refer", "Score",
    "Place", "Proof", "Right", "Sense",
    "Plain", "Proud", "Rival", "Serve",
    "Plane", "Prove", "River", "Seven",
    "Plant", "Queen", "Quick", "Shall",
    "Plate", "Sixth", "Stand", "Shape",
    "Point", "Quiet", "Roman", "Share",
    "Pound", "Quite", "Rough", "Sharp",
    "Sheet", "Spare", "Style", "Times",
    "Shelf", "Speak", "Sugar", "Tired",
    "Shell", "Speed", "Suite", "Title",
    "Shift", "Spend", "Super", "Today",
    "Shirt", "Spent", "Sweet", "Topic",
    "Shock", "Split", "Table", "Total",
    "Shoot", "Spoke", "Taken", "Touch",
    "Short", "Sport", "Taste", "Tough",
    "Shown", "Staff", "Taxes", "Tower",
    "Sight", "Stage", "Teach", "Track",
    "Since", "Stake", "Teeth", "Trade",
    "Sixty", "Start", "Texas", "Treat",
    "Sized", "State", "Thank", "Trend",
    "Skill", "Steam", "Theft", "Trial",
    "Sleep", "Steel", "Their", "Tried",
    "Slide", "Stick", "Theme", "Tries",
    "Small", "Still", "There", "Truck",
    "Smart", "Stock", "These", "Truly",
    "Smile", "Stone", "Thick", "Trust",
    "Smith", "Stood", "Thing", "Truth",
    "Smoke", "Store", "Think", "Twice",
    "Solid", "Storm", "Third", "Under",
    "Solve", "Story", "Those", "Undue",
    "Sorry", "Strip", "Three", "Union",
    "Sound", "Stuck", "Threw", "Unity",
    "South", "Study", "Throw", "Until",
    "Space", "Stuff", "Tight", "Upper",
    "Upset", "Whole", "Waste", "Wound",
    "Urban", "Whose", "Watch", "Write",
    "Usage", "Woman", "Water", "Wrong",
    "Usual", "Train", "Wheel", "Wrote",
    "Valid", "World", "Where", "Yield",
    "Value", "Worry", "Which", "Young",
    "Video", "Worse", "While", "Youth",
    "Virus", "Worst", "White", "Worth",
    "Visit", "Would", "Vital", "Voice"
];

// Enums
export enum WordleCharacterState {
    Correct,
    Incorrect,
    WrongPosition
}

export enum WordleDataState {
    MaxAttemptsError,
    EndedError,
    NotInWordListError,

    Incorrect,
    Correct,
}

// Interfaces
export interface WordleCharacterData {
    character: string;
    state: WordleCharacterState;
}

export interface WordleGussedData {
    characters: WordleCharacterData[] | undefined;
    state: WordleDataState;
}

export class Wordle {
    private generatedWord: string;
    private guessedWord: WordleCharacterData[][] = [];

    readonly maxAttempts: number;
    public attempts: number;

    public ended: boolean;
    public wonGame: boolean;

    constructor(maxAttempts: number = 6, word?: string, tries?: number, guessed?: WordleCharacterData[][], ended?: boolean, wonGame?: boolean) {
        this.maxAttempts = maxAttempts
        this.generatedWord = word ?? this.generateWord();

        this.attempts = tries ?? 0;
        this.guessedWord = guessed ?? [];
        this.ended = ended ?? false;
        this.wonGame = wonGame ?? false;
    }

    private getWordleStringData(word: string): WordleCharacterData[] {
        // Create an array of WordleCharacterData objects
        let wordleCharacterData = word.split('').map(character => ({ character, state: WordleCharacterState.Incorrect }));
        for (let i = 0; i < wordleCharacterData.length; i++) {
            if (this.generatedWord.includes(wordleCharacterData[i].character)) {
                wordleCharacterData[i].state = WordleCharacterState.Correct;
            }
        }
        for (let i = 0; i < wordleCharacterData.length; i++) {
            if (this.generatedWord.includes(wordleCharacterData[i].character) && this.generatedWord[i] !== wordleCharacterData[i].character) {
                // Count the number of times the character appears in the generated word
                const countOfCharacter = Array.from(this.generatedWord).filter(character => character === wordleCharacterData[i].character).length; 
                // Count the number of times the character appears in the word
                const countOfCharacterFromWord = Array.from(word).filter(character => character === wordleCharacterData[i].character).length;

                if (countOfCharacter > countOfCharacterFromWord) {
                    wordleCharacterData[i].state = WordleCharacterState.WrongPosition;
                }
            }
        }
        return wordleCharacterData;
    }

    private generateWord(): string {
        return wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
    }

    public guessWord(word: string): WordleGussedData {
        if (this.ended) return { characters: undefined, state: WordleDataState.EndedError };
        if (this.attempts > this.maxAttempts) return { characters: undefined, state: WordleDataState.MaxAttemptsError };
        if (!wordList.some(wordListWord => wordListWord.toLowerCase() === word.toLowerCase())) return { characters: undefined, state: WordleDataState.NotInWordListError };

        const wordleStringData = this.getWordleStringData(word.toLowerCase());
        this.guessedWord.push(wordleStringData);
        this.attempts++;

        if (word.toLowerCase() === this.generatedWord) {
            this.ended = true;
            this.wonGame = true;
        } else if (this.attempts >= this.maxAttempts) {
            this.ended = true;
        }

        return { characters: wordleStringData, state: word.toLowerCase() === this.generatedWord ? WordleDataState.Correct : WordleDataState.Incorrect };
    }

    public serialize(): object {
        return {
            maxAttempts: this.maxAttempts,
            generatedWord: this.generatedWord,
            attempts: this.attempts,
            guessedWord: this.guessedWord,
            ended: this.ended,
            wonGame: this.wonGame
        }
    }

    public static deserialize(data: any): Wordle {
        return new Wordle(data.maxAttempts, data.generatedWord, data.attempts, data.guessedWord, data.ended, data.wonGame);
    }

    public buildEmbed(guildID: string, timeToReset: number, lastChannelID?: string, lastMessageID?: string): EmbedBuilder {
        // To make the description of the embed more readable
        const pointsFromWordle = getDatabaseData(['guilds', guildID, 'data', 'points', 'pointsFromWordle']) ?? 0;
        const serverEmbedColor = getDatabaseData(['guilds', guildID, 'data', 'embedColor']) ?? '#D1E44C';

        let embedDescription = '';
        embedDescription += `**Green Square**: Correct character in the correct position.\n**Yellow Square**: Correct character in the wrong position.\n**Red Square**: Incorrect character.`;
        embedDescription += `\n\nAttempts: **${this.attempts}/${this.maxAttempts}**`;
        embedDescription += `\n ${this.ended && this.wonGame ? `Congratulations, you won! ${pointsFromWordle > 0 ? `You earned **${pointsFromWordle}** points!` : ''}` : this.ended ? `You lost! The word was **${this.generatedWord}**.` : ''}${this.ended ? `\nYou are able to play again in <t:${Math.floor(timeToReset / 1000)}:R>.` : ''}`;

        const embed = new EmbedBuilder()
            .setTitle('Wordle')
            .setDescription(embedDescription)
            .setColor(serverEmbedColor);
            
        for (let i = 0; i < this.guessedWord.length; i++) {
            let wordString = '';
            let wordPosition = '';
            for (let j = 0; j < this.guessedWord[i].length; j++) {
                wordString += this.guessedWord[i][j].character;
            }
            for (let j = 0; j < this.generatedWord.length; j++) {
                wordPosition += this.generatedWord[j] === this.guessedWord[i][j].character ? '🟩' : this.generatedWord.includes(this.guessedWord[i][j].character) ? '🟨' : '⬛';
            }
            embed.addFields({ name: `Attempt ${i + 1}`, value: `${wordString}\n${wordPosition}` });
        }
        return embed;
    }
}