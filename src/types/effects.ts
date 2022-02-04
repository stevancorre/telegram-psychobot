export interface IEffect {
    name: string;
    url?: string;
}

export interface IEffectInfo {
    summary_raw: string;
    name: string;
    external_links: IEffectInfoExternalLink[];
};

export interface IEffectInfoExternalLink {
    url: string;
    title: string;
}