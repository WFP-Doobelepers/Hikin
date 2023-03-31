import { CommandInteraction, CacheType } from 'discord.js'
import { Command } from '../global/command'
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Constants } from '../../constants'
  
export default class Eval implements Command {
    getCommandMetadata(): RESTPostAPIApplicationCommandsJSONBody {
        return new SlashCommandBuilder()
            .setName('eval')
            .setDescription('evaluate JS code')
            .addStringOption(option => (
                option
                    .setName('code')
                    .setDescription('Code to evaluate')
            ))
            .toJSON()        
    }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply()

        if (interaction.user.id !== Constants.OWNER_ID) {

            await interaction.editReply('Missing Perms')
            return
        }

        const code = interaction.options.getString('code') as string

        try {

            const result = eval(code)

            await interaction.editReply(`**Succesfully Evaluated code**\n**RESULT:**\n\n${result}`)

        } catch (err) {

            await interaction.editReply(`**Failed to evalutate code**\n**ERROR:**\n\n${err}`)

        }
    }
}