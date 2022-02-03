import { IIconTable, IconTable } from "./iconTable";

export const interactionIconTable: IIconTable = new IconTable({
    "Dangerous": "❌",
    "Unsafe": "🧡",
    "Caution": "⚠️",
    "Low Risk & Decrease": "⬆️",
    "Low Risk & No Synergy": "⏺",
    "Low Risk & Synergy": "⬇️"
});