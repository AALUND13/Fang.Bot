import { SlashCommandProps } from "commandkit";
import { GuildMember, SlashCommandBuilder, TextChannel } from "discord.js";
import { Wordle, WordleDataState, wordList } from "../../Handler/WordleHandler";
import { getDatabaseData, writeToDatabase } from "utilities";
import { Console } from "console";
import { addMemberPoints } from "../../utils/PointsUtli";

export const data = new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Let you play wordle.')
    .addStringOption((option) =>
        option
    .setName('word')
    .setDescription('The word to guess.')
    .setRequired(true)
)

export async function run({ interaction, client, handler }: SlashCommandProps) {
    const word = interaction.options.getString('word') as string;
    
    if (interaction.guildId === null) {
        interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        return;
    } else if (word.length !== 5) {
        interaction.reply({ content: 'The word must be exactly 5 characters long.', ephemeral: true });
        return;
    } else if (!wordList.some(wordListWord => wordListWord.toLowerCase() === word.toLowerCase())) {
        interaction.reply({ content: 'The word is not in the word list.', ephemeral: true });
        return;
    }
    
    console.log(`Wordle command executed. Command run by "${interaction.user.displayName}"`);
    
    let wordle: Wordle;
    let memberWordleData = getDatabaseData(['guilds', interaction.guildId, 'members', interaction.user.id, 'wordle'])

    const pointsData = getDatabaseData(['guilds', interaction.guildId, 'data', 'points']);

    if (!memberWordleData || memberWordleData.timeToReset < Date.now()) {
        wordle = new Wordle();
        writeToDatabase(['guilds', interaction.guildId, 'members', interaction.user.id, 'wordle'], { wordleData: wordle.serialize(), timeToReset: Math.floor(Date.now() + (pointsData.wordleCooldown ?? 12) * 60 * 60 * 1000) });
        memberWordleData = getDatabaseData(['guilds', interaction.guildId, 'members', interaction.user.id, 'wordle']);
    } else {
        wordle = Wordle.deserialize(memberWordleData.wordleData);
    }

    if (wordle.ended) {
        interaction.reply({ content: `You already played your wordle. Try again in <t:${Math.floor(memberWordleData.timeToReset / 1000)}:R>.`, ephemeral: true });
        return;
    }

    const wordleData = wordle.guessWord(word);
    
    if (wordleData.state === WordleDataState.Correct) {
        const wordlePoints = getDatabaseData(['guilds', interaction.guildId, 'data', 'points', 'pointsFromWordle']) ?? 0;
        addMemberPoints(interaction.member as GuildMember, wordlePoints);
    }

    await client.channels.fetch(memberWordleData.lastChannelID).then(async (channel) => {
        if (channel instanceof TextChannel) {
            await channel.messages.fetch(memberWordleData.lastMessageID).then(async (message) => {
                await message.delete();
                console.log('Deleted message');
            }).catch(() => {
                console.log('Could not delete message');
            });
        }
    }).catch(() => {
        console.log('Could not fetch channel');
    });
    const messageEmbed = await interaction.reply({ embeds: [wordle.buildEmbed(interaction.guildId, memberWordleData.timeToReset)], fetchReply: true });
    writeToDatabase(['guilds', interaction.guildId, 'members', interaction.user.id, 'wordle'], { wordleData: wordle.serialize(), timeToReset: memberWordleData.timeToReset, lastChannelID: interaction.channelId, lastMessageID: messageEmbed.id });
    
}

export const options = { }