import { ICommand, ICommandContext } from "../helpers/command";

export const comboChartCommand: ICommand = {
    name: "combochart",
    description: "Shows TripSit's combo chart",

    callback: async (context: ICommandContext): Promise<void> => {
        await context.replyPhotoAsync("https://wiki.tripsit.me/images/3/3a/Combo_2.png");
    }
}