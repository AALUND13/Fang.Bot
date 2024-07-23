import { SlashCommandProps } from "commandkit";

export const data = {
    name: 'ping',
    description: 'Pong!',
}
 
export async function run({ interaction, client, handler }: SlashCommandProps) {
    console.log(`Ping command executed. Command run by "${interaction.user.displayName}"`);
    await interaction.reply({ content: `Pong! ${client.ws.ping}ms`, ephemeral: true });
}
 
export const options = { }