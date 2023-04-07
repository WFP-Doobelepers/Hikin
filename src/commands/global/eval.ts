import { CommandInteraction, CacheType, MessageEmbed } from 'discord.js'
import { Command } from './command'
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Constants } from '../../constants'
import { discordBot } from '../..'
import { i } from 'mathjs'

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

        const evaluationCode = interaction.options.getString('code') as string

        let response;
        let executionSuccess: boolean = false

        let executionTime = Date.now()

        //async () => {

            try {

                const result = await eval(evaluationCode)

                response = result
                executionSuccess = true

                executionTime = (executionTime - Date.now())

            } catch (err: any) {

                response = err.stack
            }
       // }

        let embed = new MessageEmbed()
                        .addField('Evaluated Code', `\`\`\`js\n${evaluationCode}\n\`\`\``)


        if (executionSuccess) {

            embed
                .setColor('GREEN')
                .addField('Evalutation Result', `\`\`\`js\n${response}\n\`\`\``)
                .setFooter({
                    text: `Execution time: ${executionTime/1000} s`
                })

        } else {

            embed
                .setColor('RED')
                .addField('Evalutation Failed', `\`\`\`js\n${response}\n\`\`\``)

        }

        await interaction.editReply({embeds: [embed.toJSON()]})

    }
}