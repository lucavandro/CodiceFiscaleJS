import { Comune } from './comune';
export interface ICodiceFiscaleObject {
    name: string;
    surname: string;
    gender: string;
    day: number;
    month: number;
    year: number;
    birthplace: string;
    birthplaceProvincia: string;
    cf?: string;
}
export declare class CodiceFiscale {
    birthday: Date;
    birthplace: Comune;
    name: string;
    surname: string;
    gender: string;
    private code;
    day: number;
    month: number;
    year: number;
    readonly cf: string;
    readonly nameCode: string;
    readonly surnameCode: string;
    readonly checkCode: string;
    constructor(data: string | ICodiceFiscaleObject | object);
    static getCheckCode(codiceFiscale: string): string;
    static findLocationCode(name: string, prov?: string): string;
    static computeInverse(codiceFiscale: string): ICodiceFiscaleObject;
    static compute(obj: object): string;
    static check(codiceFiscale: string): boolean;
    static getOmocodie(cf: string): string[];
    toString(): string;
    toJSON(): ICodiceFiscaleObject;
    isValid(): boolean;
    omocodie(): string[];
    compute(): void;
    reverse(): ICodiceFiscaleObject;
    private checkGender;
    private getSurnameCode;
    private getNameCode;
    private dateCode;
}
