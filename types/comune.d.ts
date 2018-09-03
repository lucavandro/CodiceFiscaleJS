export interface IComuneObject {
    nome: string;
    prov?: string;
    cc?: string;
}
export declare class Comune {
    nome: string;
    prov: string;
    cc: string;
    readonly nomeNorm: string;
    constructor(nome: string, prov?: string, cc?: string, check?: boolean);
    static GetByName(name: string, prov?: string): Comune;
    static GetByCC(cc: string): Comune;
    private searchByName;
    private searchByNameAndProvince;
}
