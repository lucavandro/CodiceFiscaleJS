import { Comune } from './comune';
import { CHECK_CODE_CHARS, CHECK_CODE_EVEN, CHECK_CODE_ODD, MONTH_CODES, OMOCODIA_TABLE} from './constants';
import { extractConsonants, extractVowels, getValidDate } from './utils';

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
/**
 * Compute and validate Italian Italian Tax code (codice fiscale).
 */
export class CodiceFiscale {
    public birthday: Date;
    public birthplace : Comune;
    public name: string;
    public surname: string;
    public gender: string;
    private code: string;

    get day(): number {
        return this.birthday.getDate();
    }

    set day(d: number) {
        this.birthday.setDate(d);
    }

    get month(): number {
        return this.birthday.getMonth() + 1;
    }

    set month(m: number) {
        this.birthday.setMonth(m - 1);
    }

    get year(): number {
        return this.birthday.getFullYear();
    }

    set year(y: number) {
        this.birthday.setFullYear(y);
    }

    get cf() : string {
        return this.code;
    }

    get nameCode(): string {
        return this.code.substr(3, 3);
    }

    get surnameCode(): string {
        return this.code.substr(0, 3);
    }

    get checkCode() : string {
        return this.code.substr(15, 1);
    }

    // tslint:disable-next-line:no-any
    constructor(data: string | ICodiceFiscaleObject | object) {
        if (typeof data === 'string') {
            if (CodiceFiscale.check(data)) {
                this.code = data;
                this.reverse();
            } else {
                throw new Error('Provided input is not a valid Codice Fiscale');
            }
        } else if (typeof data === 'object') {
            const cfData = <ICodiceFiscaleObject>data;
            this.name      = cfData.name;
            this.surname   = cfData.surname;
            this.gender    = this.checkGender(cfData.gender);
            this.birthday  = getValidDate(cfData.day, cfData.month, cfData.year);
            this.birthplace = new Comune(cfData.birthplace, cfData.birthplaceProvincia);
            this.compute();
        } else {
            throw new Error('Comune constructor accept either a string or a plain object. Check the documentation');
        }
    }

    // tslint:disable-next-line:function-name member-access
    static getCheckCode (codiceFiscale: string) : string {
        let val = 0 ;
        for (let i = 0; i < 15; i = i + 1) {
          const c = codiceFiscale[i];
          val += i % 2 !== 0 ? <number>CHECK_CODE_EVEN[c] : <number>CHECK_CODE_ODD[c];
        }
        val = val % 26;

        return CHECK_CODE_CHARS.charAt(val);
    }
    // tslint:disable-next-line:function-name member-access
    static findLocationCode (name : string, prov?: string) {
        return new Comune(name, prov).cc;
    }

    // tslint:disable-next-line:function-name member-access
    static computeInverse (codiceFiscale: string) : ICodiceFiscaleObject {
        return new CodiceFiscale(codiceFiscale).toJSON();
    }
    // tslint:disable-next-line:function-name member-access
    static compute (obj : object) {
        return new CodiceFiscale(obj).toString();
    }
    // tslint:disable-next-line:function-name member-access
    static check (codiceFiscale: string) {
      if (typeof codiceFiscale !== 'string') {
        return false;
      }
      let cf = codiceFiscale.toUpperCase();
      if (cf.length !== 16) {
          return false;
      }
      const expectedCheckCode = codiceFiscale.charAt(15);
      cf = codiceFiscale.slice(0, 15);

      return CodiceFiscale.getCheckCode(cf) === expectedCheckCode;
    }
    // tslint:disable-next-line:function-name member-access
    static getOmocodie(cf : string) {
        return new CodiceFiscale(cf).omocodie();
    }

    public toString(): string {
        return this.code;
    }

    public toJSON(): ICodiceFiscaleObject {
        return {
            name: this.name,
            surname: this.surname,
            gender: this.gender,
            day: this.day,
            month: this.month,
            year: this.year,
            birthplace: this.birthplace.nome,
            birthplaceProvincia: this.birthplace.prov,
            cf: this.code,
        };
    }

    public isValid () : boolean {
        if (typeof this.code !== 'string') {
            return false;
        }
        this.code = this.code.toUpperCase();
        if (this.code.length !== 16) {
            return false;
        }
        const expectedCheckCode = this.code.charAt(15);
        const cf = this.code.slice(0, 15);

        return CodiceFiscale.getCheckCode(cf) === expectedCheckCode;
    }

    public omocodie () : string[] {
        const results = [];
        let lastOmocode = (this.code = this.code.slice(0, 15));
        for (let i = this.code.length - 1; i >= 0; i = i - 1) {
          const char = this.code[i];
          if (char.match(/\d/) !== null) {
            lastOmocode = `${lastOmocode.substr(0, i)}${OMOCODIA_TABLE[char]}${lastOmocode.substr(i + 1)}`;
            results.push(lastOmocode + CodiceFiscale.getCheckCode(lastOmocode));
          }
        }

        return results;
    }

    public compute() {
        let code = this.getSurnameCode();
        code += this.getNameCode();
        code += this.dateCode();
        code += this.birthplace.cc;
        code += CodiceFiscale.getCheckCode(code);
        this.code = code;
    }

    public reverse() {
        if (this.name !== undefined) {
            this.name = this.code.substr(3, 3);
        }

        if (this.surname !== undefined) {
            this.surname = this.code.substr(0, 3);
        }

        const yearCode = this.code.substr(6, 2);
        const year19XX = parseInt(`19${yearCode}`, 10);
        const year20XX = parseInt(`20${yearCode}`, 10);
        const currentYear20XX = new Date().getFullYear();
        const year = year20XX > currentYear20XX ? year19XX : year20XX;
        const monthChar = this.code.substr(8, 1);
        const month = MONTH_CODES.indexOf(monthChar);
        this.gender = 'M';
        let day = parseInt(this.code.substr(9, 2), 10);
        if (day > 31) {
            this.gender = 'F';
            day = day - 40;
        }
        this.birthday = new Date(year, month, day, 0, 0, 0, 0);
        const cc = this.code.substr(11, 4);
        this.birthplace = Comune.GetByCC(cc);

        return this.toJSON();
    }

    private checkGender(gender?: string) {
        this.gender = gender !== undefined ? gender.toUpperCase() : this.gender.toUpperCase();
        if (typeof this.gender !== 'string') {
            throw new Error('Gender must be a string');
        }
        if (this.gender !== 'M' && this.gender !== 'F') {
            throw new Error('Gender must be either \'M\' or \'F\'');
        }

        return gender;
    }

    private getSurnameCode () : string {
      const codeSurname = `${extractConsonants(this.surname)}${extractVowels(this.surname)}XXX`;

      return codeSurname.substr(0, 3).toUpperCase();
    }

    private getNameCode () : string {
      let codNome = extractConsonants(this.name);
      if (codNome.length >= 4) {
        codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3);
      } else {
        codNome += `${extractVowels(this.name)}XXX`;
        codNome = codNome.substr(0, 3);
      }

      return codNome.toUpperCase();
    }

    private dateCode () : string {
        // Padding year
        let year = `0${this.birthday.getFullYear()}`;
        year = year.substr(year.length - 2, 2);

        const month = MONTH_CODES[this.birthday.getMonth()];
        let day = this.birthday.getDate();
        if (this.gender.toUpperCase() === 'F') {
           day += 40;
        }

        // Padding day
        let dayStr = `0${day}`;
        dayStr = dayStr.substr(dayStr.length - 2, 2);

        return String(year + month + dayStr);
    }

}
