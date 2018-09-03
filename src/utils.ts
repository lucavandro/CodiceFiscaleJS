export function normalizeString (str: string) {
    return str.trim()
      .replace(new RegExp(/[àá]/g), 'a\'')
      .replace(new RegExp(/[èé]/g), 'e\'')
      .replace(new RegExp(/[ìí]/g), 'i\'')
      .replace(new RegExp(/[òó]/g), 'o\'')
      .replace(new RegExp(/[ùú]/g), 'u\'')
      .toUpperCase();
  }

/**
 * Get the number of days in any particular month
 * @link https://stackoverflow.com/a/1433119/1293256
 * @param  {integer} m The month (valid: 0-11)
 * @param  {integer} y The year
 * @return {integer}   The number of days in the month
 */
export function daysInMonth(m: number, y:  number) {
    switch (m) {
        case 1 :
            return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0) ? 29 : 28;
        case 8 : case 3 : case 5 : case 10 :
            return 30;
        default :
            return 31;
    }
}

/**
 * Check if a date is valid
 * @link https://stackoverflow.com/a/1433119/1293256
 * @param  {[type]}  d The day
 * @param  {[type]}  m The month
 * @param  {[type]}  y The year
 * @return {Boolean}   Returns true if valid
 */
export function isValidDate(d: number, m: number, y: number) {
    const month = m - 1;

    return month >= 0 && month < 12 && d > 0 && d <= daysInMonth(month, y);
}

/**
 * Check if a date is valid
 * @link https://stackoverflow.com/a/1433119/1293256
 * @param  {[type]}  d The day
 * @param  {[type]}  m The month
 * @param  {[type]}  y The year
 * @return {Boolean}   Returns true if valid
 */
export function getValidDate(d: number, m: number, y: number) {
    if (isValidDate(d, m, y)) {
        return new Date(y, m - 1, d, 0, 0, 0, 0);
    } else {
        throw new Error(`The date ${y}/${m}/${d} is not a valid date`);
    }
}

export function extractVowels (str: string) {
    return str.replace(/[^AEIOU]/gi, '');
}

export function extractConsonants (str : string) {
    return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '');
}

export function pad(n: number, size : number = 2) {
    let s = String(n);
    while (s.length < size) {
        s = `0${s}`;
    }

    return s;
}
