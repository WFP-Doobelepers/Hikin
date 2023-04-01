import { SlashCommandBuilder } from '@discordjs/builders'
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types'
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import { discordBot } from '../..'
import { isBotAdmin } from '../../utils'
import { Command } from '../global/command'

export default class ReloadCommandsCommand implements Command {
    getCommandMetadata(): RESTPostAPIApplicationCommandsJSONBody {
        return new SlashCommandBuilder()
            .setName('reloadcommands')
            .setDescription('Reloads all the commands')
            .toJSON()
    }

    async execute(interaction: CommandInteraction): Promise<void> {

        if (!isBotAdmin(interaction.member as GuildMember) && !(interaction.member as GuildMember).roles.cache.has('1084778349542518805')) {
            await interaction.reply('**ERROR:** Missing Permissions.')
            return
        }

        interaction.deferReply()

        await discordBot.loadCommands()

        const date =  new Date(Date.now())

        console.log(`${date.toTimeString()} Reloaded Commands by ${interaction.user.username} in ${interaction.guild?.name}`)

        const embed =  new MessageEmbed()
                            .setTitle('Reloaded Commands')
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