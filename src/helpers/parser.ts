export interface IParser {
    example: string,
    regexp: string,

    callback: ParserCallback
}

export type ParserCallback = (match: RegExpExecArray, argPos: number) => any | undefined;