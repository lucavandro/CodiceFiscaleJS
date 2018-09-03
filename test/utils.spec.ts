import { normalizeString } from '../src/utils';

describe('normalizeString', () => {
    it('sostituisce gli accenti con gli apostrofi', () => {
        expect(normalizeString('papà')).toBe('PAPA\'');
        expect(normalizeString('purè')).toBe('PURE\'');
        expect(normalizeString('pipì')).toBe('PIPI\'');
        expect(normalizeString('popò')).toBe('POPO\'');
        expect(normalizeString('pupù')).toBe('PUPU\'');
    });
});
