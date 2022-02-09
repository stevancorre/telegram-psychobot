import { ICommand } from "../helpers/command";

import { breatheCommand } from "./breatheCommand";
import { comboChartCommand } from "./comboChartCommand";
import { combosCommand } from "./combosCommand";
import { dxmCalcCommand } from "./dxmCalcCommand";
import { effectInfoCommand } from "./effectInfoCommand";
import { effectsCommand } from "./effectsCommand";
import { helpCommand } from "./helpCommand";
import { infoCommand } from "./infoCommand";
import { ketamineCalcCommand } from "./ketamineCalcCommand";
import { pingCommand } from "./pingCommand";

export const Commands: ICommand[] = [
    breatheCommand,
    comboChartCommand,
    combosCommand,
    dxmCalcCommand,
    effectInfoCommand,
    effectsCommand,
    helpCommand,
    infoCommand,
    ketamineCalcCommand,
    pingCommand,
]