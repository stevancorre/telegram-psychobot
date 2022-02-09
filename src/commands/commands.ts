import { ICommand } from "../helpers/command";

import { pingCommand } from "./pingCommand";
import { ketamineCalcCommand } from "./ketamineCalcCommand";
import { breatheCommand } from "./breatheCommand";
import { combosCommand } from "./combosCommand";
import { infoCommand } from "./infoCommand";
import { effectsCommand } from "./effectsCommand";
import { effectInfoCommand } from "./effectInfoCommand";
import { dxmCalcCommand } from "./dxmCalcCommand";
import { helpCommand } from "./helpCommand";
import { comboChartCommand } from "./comboChartCommand";

export const Commands: ICommand[] = [
    breatheCommand,
    combosCommand,
    pingCommand,
    ketamineCalcCommand,
    effectsCommand,
    effectInfoCommand,
    infoCommand,
    dxmCalcCommand,
    helpCommand,
    comboChartCommand
]