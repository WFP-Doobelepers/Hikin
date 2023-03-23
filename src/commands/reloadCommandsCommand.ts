import { SlashCommandBuilder } from '@discordjs/builders'
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types'
import { CommandInteraction, GuildMember } from 'discord.js'
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

        const User = interaction.member as GuildMember

        if (!isBotAdmin(interaction.member as GuildMember) /* && (interaction.guildId != '1084456230833102968') */ && User.roles.cache.has('1084778349542518805') ) {
            await interaction.reply({content: 'Only Bot Admins may use this command', ephemeral: true})
            return
        }
        
        await interaction.deferReply({ephemeral: true})
        await discordBot.loadCommands()
        await interaction.editReply('Reloaded commands!')
    }

}