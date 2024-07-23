import { SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";

const magic8BallResponses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes – definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
]

export const data = new SlashCommandBuilder()
    .setName('magic8ball')
    .setDescription('Ask the magic 8 ball a question.')
    .addStringOption((option) =>
        option
            .setName('question')
            .setDescription('The question to ask the magic 8 ball.')
            .setRequired(true)
    )
 
export async function run({ interaction, client, handler }: SlashCommandProps) {
    console.log(`Magic 8 ball command executed. Command run by "${interaction.user.displayName}"`);
    
    const question = interaction.options.getString('question') as string;
    const response = magic8BallResponses[Math.floor(Math.random() * magic8BallResponses.length)];
    await interaction.reply({ content: `**Question:** ${question}\n:8ball: **Answer:** ${response}` });
}
 
export const options = { }