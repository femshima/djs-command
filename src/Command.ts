import { ApplicationCommandData, ApplicationCommandPermissionData, CommandInteraction, Guild } from "discord.js";


export interface Command {
    definition: ApplicationCommandData;
    permission?: (guild: Guild) => ApplicationCommandPermissionData[] | Promise<ApplicationCommandPermissionData[]>;
    handler: (interaction: CommandInteraction<'cached'>) => void | Promise<void>;
}
