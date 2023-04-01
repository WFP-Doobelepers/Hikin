import { REST } from '@discordjs/rest'
import { RESTPatchAPIApplicationCommandJSONBody, RESTPostAPIApplicationGuildCommandsJSONBody, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9'
import { Constants } from '../constants'
import path from 'path'
import fsp from 'fs/promises'
import { Command, IAutocompletableCommand, IExecutableCommand } from '../commands/global/command'

export class LocalCommandManager {

    // Duplicated global and guild commands. Implement better

    loadedPublicCommands: Record<string, string> = {}
    loadedPrivateCommands: Record<string, string> = {}

    async getLocalCommands(): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
        const commandsDir = path.join(__dirname, '../commands/global')
        const commandFiles = await fsp.readdir(commandsDir)
        this.loadedPublicCommands = {}

        return <RESTPostAPIApplicationCommandsJSONBody[]> commandFiles.flatMap(file => {
            if (!file.endsWith('.js')) return []

            const commandPath = path.join(commandsDir, file)

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const CommandClass: (new () => Command | undefined) | undefined = require(commandPath)?.['default']
            if(!CommandClass) return []

            const commandInstance = new CommandClass()
            const metadata = commandInstance?.getCommandMetadata()
            if (!metadata) return []
            
            this.loadedPublicCommands[metadata.name] = commandPath

            const aliases = commandInstance?.getCommandAliasMetadata?.() ?? []
            for (const alias of aliases) {
                this.loadedPublicCommands[alias.name] = commandPath
            }

            return [metadata, ...aliases]
        })
    }

    async getLocalPrivateCommands(): Promise<RESTPostAPIApplicationGuildCommandsJSONBody[]> {
        const commandsDir = path.join(__dirname, '../commands/private')
        const commandFiles = await fsp.readdir(commandsDir)
        this.loadedPrivateCommands = {}

        return <RESTPostAPIApplicationCommandsJSONBody[]> commandFiles.flatMap(file => {
            if (!file.endsWith('.js')) return []

            const commandPath = path.join(commandsDir, file)

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const CommandClass: (new () => Command | undefined) | undefined = require(commandPath)?.['default']
            if(!CommandClass) return []

            const commandInstance = new CommandClass()
            const metadata = commandInstance?.getCommandMetadata()
            if (!metadata) return []
            
            this.loadedPrivateCommands[metadata.name] = commandPath

            const aliases = commandInstance?.getCommandAliasMetadata?.() ?? []
            for (const alias of aliases) {
                this.loadedPrivateCommands[alias.name] = commandPath
            }

            return [metadata, ...aliases]
        })
    }

    resolveLocalPublicCommandClass(name: string): (new () => IExecutableCommand | IAutocompletableCommand) | undefined {
        const commandPath = this.loadedPublicCommands[name]
        if (!commandPath) return undefined

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(commandPath)?.['default']
    }

    resolveLocalPrivateCommandClass(name: string): (new () => IExecutableCommand | IAutocompletableCommand) | undefined {
        const commandPath = this.loadedPrivateCommands[name]
        if (!commandPath) return undefined

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(commandPath)?.['default']
    }
}
