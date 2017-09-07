describe("Codice Fiscale", function() {
  it("esiste un oggetto chiamato CodiceFiscale", function() {
    expect(CodiceFiscale).not.toBe(undefined);
  });
});

describe("CodiceFiscale.compute", function() {
  it("è  definito", function() {
    expect(CodiceFiscale.compute).not.toBe(undefined);
  });

  it("calcola il codice fiscale", function() {
    expect(CodiceFiscale.compute("Luca", "Moreno",'M', 1, 1, 2000, "Roma", "RM")).toBe("MRNLCU00A01H501J");
  });

  it("calcola il codice fiscale da un oggetto JSON", function() {
    expect(CodiceFiscale.compute({
        name: "Luca", 
        surname: "Moreno",
        gender: 'M', 
        day: 1, 
        month: 1, 
        year: 2000, 
        birthplace: "Roma", 
        birthplace_provincia:"RM"
      })).toBe("MRNLCU00A01H501J");
  });


  it("calcola il codice fiscale di persone nate all'estero", function() {
    expect(CodiceFiscale.compute("Luca", "Moreno",'M', 1, 1, 2000, "Albania", "EE")).toBe("MRNLCU00A01Z100P");
  });

  it("calcola il codice fiscale all'estero da un oggetto JSON", function() {
    expect(CodiceFiscale.compute({
        name: "Luca", 
        surname: "Moreno",
        gender: 'M', 
        day: 1, 
        month: 1, 
        year: 2000, 
        birthplace: "Albania", 
        birthplace_provincia:"EE"
      })).toBe("MRNLCU00A01Z100P");
  });

  it("se il comune non esiste lancia un eccezione", function() {
    var comuneInventato = function(){
      CodiceFiscale.compute("Luca", "Moreno",'M', 1, 1, 2000, "Pufflandia", "CE");
    }
    expect(comuneInventato).toThrowError("Comune not found");
  });
});

describe("CodiceFiscale.findComuneCode", function() {
  it("è  definito", function() {
    expect(CodiceFiscale.findComuneCode).not.toBe(undefined);
  });

  it("trova il codice del comune", function() {
    expect(CodiceFiscale.findComuneCode("Roma", "RM")).toBe("H501");
  });

  it("se il comune non esiste lancia un eccezione", function() {
    var comuneInventato = function(){
      CodiceFiscale.findComuneCode("Pufflandia", "RM");
    }
    expect(comuneInventato).toThrowError("Comune not found");
  });

});



describe("CodiceFiscale.check", function() {
  it("è definito", function() {
    expect(CodiceFiscale.check).not.toBe(undefined);
  });

  it("controlla se il codice fiscale è valido", function() {
    expect(CodiceFiscale.check("MRNLCU00A01H501J")).toBe(true);
  });

  it("controlla che sia composto dal non più 16 valori alfanumerici", function() {
    expect(CodiceFiscale.check("MRNLCU00A01H501JK")).toBe(false);
  });

  it("controlla che sia composto dal almeno 16 valori alfanumerici", function() {
    expect(CodiceFiscale.check("MRNLCU00A01H501J3")).toBe(false);
  });

  it("controlla che il carattere di controllo sia esatto", function() {
    expect(CodiceFiscale.check("VNDLDL87D07B963G")).toBe(false);
  });

  it("funziona anche in caso di omocodie", function() {
    expect(CodiceFiscale.check("BNZVCN32S10E57PV")).toBe(true);
    expect(CodiceFiscale.check("BNZVCNPNSMLERTPX")).toBe(true);
  });
});


describe("CodiceFiscale.getOmocodie", function() {
  it("è definito", function() {
    expect(CodiceFiscale.getOmocodie).not.toBe(undefined);
  });

  it("calcola le omocodie dato un codice fiscale", function() {
     expect(CodiceFiscale.getOmocodie("BNZVCN32S10E573Z"))
     .toEqual(jasmine.arrayContaining(["BNZVCN32S10E57PV", "BNZVCNPNSMLERTPX"]));
  });

});


describe("Calcolo codice fiscale inverso -> metodo .computeInverse", function() {
  it("è definito", function() {
    expect(CodiceFiscale.computeInverse).not.toBe(undefined);
  });

  it("restituisce falso se l'input non è stringa", function() {
     expect(CodiceFiscale.computeInverse(null)).toEqual(false);
  });

  it("restituisce falso se l'input è stringa formattata male", function() {
    expect(CodiceFiscale.computeInverse("BNZVCN32SC0E573Z")).toEqual(false);
  });

  it("restituisce il genere corretto", function() {
    expect(CodiceFiscale.computeInverse("MRNLCU00A01H501J").gender).toEqual(jasmine.arrayContaining(["M", "MASCHIO"]));
  });

  it("restituisce la città natale corretta", function() {
    expect(CodiceFiscale.computeInverse("MRNLCU00A01H501J").birthplace).toEqual('ROMA');
  });

  it("restituisce la provincia della città natale corretta", function() {
    expect(CodiceFiscale.computeInverse("MRNLCU00A01H501J").birthplace_provincia).toEqual('RM');
  });

  it("restituisce il giorno di nascita come numero compreso tra 1 e 31", function() {
    expect(CodiceFiscale.computeInverse("MRNLCU00A01H501J").day >= 1 && CodiceFiscale.computeInverse("MRNLCU00A01H501J").day <= 31).toBe(true);
  });
});