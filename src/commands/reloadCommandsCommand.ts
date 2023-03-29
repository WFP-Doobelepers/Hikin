import { SlashCommandBuilder } from '@discordjs/builders'
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types'
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import { discordBot } from '..'
import { isBotAdmin } from '../utils'
import { Command } from './command'

export default class ReloadCommandsCommand implements Command {
    getCommandMetadata(): RESTPostAPIApplicationCommandsJSONBody {
        return new SlashCommandBuilder()
            .setName('reloadcommands')
            .setDescription('Reloads all the commands')
            .toJSON()
    }

    async execute(interaction: CommandInteraction): Promise<void> {

        interaction.deferReply();

        const User = interaction.member as GuildMember

        if (!isBotAdmin(interaction.member as GuildMember) /* && (interaction.guildId != '1084456230833102968') */ && User.roles.cache.has('1084778349542518805')) {
            await interaction.editReply('**ERROR:** Missing Permissions.')
            return
        }

        await discordBot.loadCommands()
        console.log(`${new Date().toTimeString} Reloaded Commands by ${interaction.user.username} in ${interaction.guild?.name}`)

        const embed =  new MessageEmbed()
                            .setTitle('Reloaded Commands')
                            .setDescription(`Reloadeded commands at ${new Date().toDateString}`)
                            .setColor('ORANGE')
                            .setThumbnail(<string> interaction.guild?.iconURL())
                            .setFooter({
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: `${interaction.user.avatarURL()}`
                            })
                            .setTimestamp(Date.now())
                            .toJSON()

        await interaction.editReply({embeds: [embed]})
    }
}