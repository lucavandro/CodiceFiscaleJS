export function normalizeString(str) {
    return str.trim()
        .replace(new RegExp(/[àá]/g), 'a\'')
        .replace(new RegExp(/[èé]/g), 'e\'')
        .replace(new RegExp(/[ìí]/g), 'i\'')
        .replace(new RegExp(/[òó]/g), 'o\'')
        .replace(new RegExp(/[ùú]/g), 'u\'')
        .toUpperCase();
}
export function daysInMonth(m, y) {
    switch (m) {
        case 1:
            return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0) ? 29 : 28;
        case 8:
        case 3:
        case 5:
        case 10:
            return 30;
        default:
            return 31;
    }
}
export function isValidDate(d, m, y) {
    const month = m - 1;
    return month >= 0 && month < 12 && d > 0 && d <= daysInMonth(month, y);
}
export function getValidDate(d, m, y) {
    if (isValidDate(d, m, y)) {
        return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    else {
        throw new Error(`The date ${y}/${m}/${d} is not a valid date`);
    }
}
export function extractVowels(str) {
    return str.replace(/[^AEIOU]/gi, '');
}
export function extractConsonants(str) {
    return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '');
}
export function pad(n, size = 2) {
    let s = String(n);
    while (s.length < size) {
        s = `0${s}`;
    }
    return s;
}
