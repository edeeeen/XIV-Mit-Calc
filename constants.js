// Lots of data from allagan studies, ty nerds <3

// doesnt work with crit shields 
const consumtionPriority = ["Arcane Crest", "Tempera Coat", "Tempura Grassa", "Eukrasian Diagnosis", 
    "Haima", "Panhaima", "Brutal Shell", "Bloodwhetting", "Nacent Flash",
    "Guardian", "Divine Caress", "Manaward", "Shade Shift", "Divine Benison", "Celestial Intersection",
    "The Spire", "Eukrasian Prognosis II", "Seraphic Veil", "Consolation", "Holos", "Radiant Aegis",
    "Shake it Off", "Divine Veil", "Neutral Sect", "Improvised Finish", "Adloquium", "Manifestation",
    "Succor", "Concitation", "Accession"]

const statsEnum = Object.freeze({
    //HP MP	STR	VIT	DEX	INT	MND
    HP: 0,
    MP: 1,
    STR: 2,
    VIT: 3,
    DEX: 4,
    INT: 5,
    MND: 6
})

const MitType = Object.freeze({
    PARTY: 0,
    PERSONAL: 1,
    PERSONALSHIELD: 2,
    PARTYSHIELD: 3
});

const mainStat = {
    value : (job) => {
        switch (job) {
            case "PLD":
            case "GNB":
            case "DRK":
            case "WAR":
            case "MNK":
            case "DRG":
            case "RPR":
            case "SAM":
                return statsEnum.STR;
            case "NIN":
            case "VPR":
            case "BRD":
            case "MCH":
            case "DNC":
                return statsEnum.DEX;
            case "BLM":
            case "SMN":
            case "RDM":
            case "PCT":
                return statsEnum.INT;
            case "WHM":
            case "SCH":
            case "AST":
            case "SGE":
                return statsEnum.MND;
        }

    }
}

const hpVitTable = {
    1:   { tank: 8.0,  nonTank: 5.6  },
    2:   { tank: 8.0,  nonTank: 5.6  },
    3:   { tank: 8.0,  nonTank: 5.6  },
    4:   { tank: 8.0,  nonTank: 5.6  },
    5:   { tank: 8.0,  nonTank: 5.6  },
    6:   { tank: 8.0,  nonTank: 5.6  },
    7:   { tank: 8.0,  nonTank: 5.6  },
    8:   { tank: 8.0,  nonTank: 5.6  },
    9:   { tank: 8.0,  nonTank: 5.6  },
    10:  { tank: 8.0,  nonTank: 5.6  },
    11:  { tank: 8.0,  nonTank: 5.6  },
    12:  { tank: 8.0,  nonTank: 5.6  },
    13:  { tank: 8.0,  nonTank: 5.6  },
    14:  { tank: 8.0,  nonTank: 5.6  },
    15:  { tank: 8.0,  nonTank: 5.6  },
    16:  { tank: 8.0,  nonTank: 5.6  },
    17:  { tank: 8.0,  nonTank: 5.6  },
    18:  { tank: 8.0,  nonTank: 5.6  },
    19:  { tank: 8.0,  nonTank: 5.6  },
    20:  { tank: 8.0,  nonTank: 5.6  },
    21:  { tank: 8.2,  nonTank: 5.8  },
    22:  { tank: 8.3,  nonTank: 6.1  },
    23:  { tank: 8.5,  nonTank: 6.3  },
    24:  { tank: 8.6,  nonTank: 6.6  },
    25:  { tank: 8.8,  nonTank: 6.8  },
    26:  { tank: 8.9,  nonTank: 7.0  },
    27:  { tank: 9.1,  nonTank: 7.3  },
    28:  { tank: 9.2,  nonTank: 7.5  },
    29:  { tank: 9.4,  nonTank: 7.8  },
    30:  { tank: 9.5,  nonTank: 8.0  },
    31:  { tank: 9.8,  nonTank: 8.2  },
    32:  { tank: 10.1, nonTank: 8.3  },
    33:  { tank: 10.4, nonTank: 8.5  },
    34:  { tank: 10.7, nonTank: 8.6  },
    35:  { tank: 11.0, nonTank: 8.8  },
    36:  { tank: 11.3, nonTank: 9.0  },
    37:  { tank: 11.6, nonTank: 9.1  },
    38:  { tank: 11.9, nonTank: 9.3  },
    39:  { tank: 12.2, nonTank: 9.4  },
    40:  { tank: 12.5, nonTank: 9.6  },
    41:  { tank: 12.8, nonTank: 9.8  },
    42:  { tank: 13.1, nonTank: 9.9  },
    43:  { tank: 13.4, nonTank: 10.1 },
    44:  { tank: 13.7, nonTank: 10.2 },
    45:  { tank: 14.0, nonTank: 10.4 },
    46:  { tank: 14.3, nonTank: 10.6 },
    47:  { tank: 14.6, nonTank: 10.7 },
    48:  { tank: 14.9, nonTank: 10.9 },
    49:  { tank: 15.2, nonTank: 11.1 },
    50:  { tank: 15.5, nonTank: 11.2 },
    51:  { tank: 15.7, nonTank: 11.4 },
    52:  { tank: 15.9, nonTank: 11.5 },
    53:  { tank: 16.1, nonTank: 11.7 },
    54:  { tank: 16.3, nonTank: 11.9 },
    55:  { tank: 16.5, nonTank: 12.1 },
    56:  { tank: 16.7, nonTank: 12.2 },
    57:  { tank: 16.9, nonTank: 12.4 },
    58:  { tank: 17.1, nonTank: 12.6 },
    59:  { tank: 17.3, nonTank: 12.7 },
    60:  { tank: 17.5, nonTank: 12.9 },
    61:  { tank: 17.6, nonTank: 13.1 },
    62:  { tank: 17.7, nonTank: 13.2 },
    63:  { tank: 17.8, nonTank: 13.3 },
    64:  { tank: 18.0, nonTank: 13.4 },
    65:  { tank: 18.1, nonTank: 13.5 },
    66:  { tank: 18.3, nonTank: 13.6 },
    67:  { tank: 18.5, nonTank: 13.7 },
    68:  { tank: 18.6, nonTank: 13.8 },
    69:  { tank: 18.7, nonTank: 13.9 },
    70:  { tank: 18.8, nonTank: 14.0 },
    71:  { tank: 19.6, nonTank: 14.2 },
    72:  { tank: 20.4, nonTank: 14.4 },
    73:  { tank: 21.1, nonTank: 14.9 },
    74:  { tank: 21.9, nonTank: 15.5 },
    75:  { tank: 22.7, nonTank: 16.0 },
    76:  { tank: 23.5, nonTank: 16.6 },
    77:  { tank: 24.3, nonTank: 17.1 },
    78:  { tank: 25.0, nonTank: 17.7 },
    79:  { tank: 25.8, nonTank: 18.3 },
    80:  { tank: 26.6, nonTank: 18.8 },
    81:  { tank: 27.4, nonTank: 19.3 },
    82:  { tank: 28.2, nonTank: 19.9 },
    83:  { tank: 29.0, nonTank: 20.4 },
    84:  { tank: 29.8, nonTank: 21.0 },
    85:  { tank: 30.6, nonTank: 21.5 },
    86:  { tank: 31.4, nonTank: 22.1 },
    87:  { tank: 32.2, nonTank: 22.6 },
    88:  { tank: 33.0, nonTank: 23.2 },
    89:  { tank: 33.8, nonTank: 23.7 },
    90:  { tank: 34.6, nonTank: 24.3 },
    91:  { tank: 35.4, nonTank: 24.8 },
    92:  { tank: 36.3, nonTank: 25.4 },
    93:  { tank: 37.1, nonTank: 26.0 },
    94:  { tank: 38.0, nonTank: 26.6 },
    95:  { tank: 38.8, nonTank: 27.2 },
    96:  { tank: 39.6, nonTank: 27.7 },
    97:  { tank: 40.5, nonTank: 28.4 },
    98:  { tank: 41.3, nonTank: 28.9 },
    99:  { tank: 42.2, nonTank: 29.5 },
    100: { tank: 43.0, nonTank: 30.1 }
};

const hpPerVit = (lvl = 100, isTank = false) => {
    const entry = hpVitTable[lvl];
    if (!entry) return 0;
    return isTank ? entry.tank : entry.nonTank;
}



const attribute = {
    value : (job) => {
        switch(job) {
            case "PLD": return 140;
            case "GNB": return 140;
            case "DRK": return 140;
            case "WAR": return 140;
            default: return 115;
        }
    }
}

const stats = {
    main: (lvl) => {
        switch (lvl) {
            case 70: return 292;
            case 80: return 340;
            case 90: return 400;
            case 100: return 440;
        }
    },
    sub: (lvl) => {
        switch (lvl) {
            case 70: return 364;
            case 80: return 380;
            case 90: return 400;
            case 100: return 420;
        }
    },
    div: (lvl) => {
        switch (lvl) {
            case 70: return 2170;
            case 80: return 3300;
            case 90: return 1900;
            case 100: return 2780;
        }
    },
    hp: (lvl) => {
        switch (lvl) {
            case 100: return 4000;
        }
    }
}






const jobModifiers = {
    //      HP	MP	STR	VIT	DEX	INT	MND
    // GLA	110	49	95	100	90	50	95
    // PGL	105	34	100	95	100	45	85
    // MRD	115	28	100	100	90	30	50
    // LNC	110	39	105	100	95	40	60
    // ARC	100	69	85	95	105	80	75
    // CNJ	100	117	50	95	100	100	105
    // THM	100	123	40	95	95	105	70
    // PLD	120	59	100	110	95	60	100
    // MNK	110	43	110	100	105	50	90
    // WAR	125	38	105	110	95	40	55
    // DRG	115	49	115	105	100	45	65
    // BRD	105	79	90	100	115	85	80
    // WHM	105	124	55	100	105	105	115
    // BLM	105	129	45	100	100	115	75
    // ACN	100	110	85	95	95	105	75
    // SMN	105	111	90	100	100	115	80
    // SCH	105	119	90	100	100	105	115
    // ROG	103	38	80	95	100	60	70
    // NIN	108	48	85	100	110	65	75
    // MCH	105	79	85	100	115	80	85
    // DRK	120	79	105	110	95	60	40
    // AST	105	124	50	100	100	105	115
    // SAM	109	40	112	100	108	60	50
    // RDM	105	120	55	100	105	115	110
    // BLU	105	120	70	100	110	115	105
    // GNB	120	59	100	110	95	60	100
    // DNC	105	79	90	100	115	85	80
    // VPR  111	100	100	100	110	45	55
    // PCT  105	100	50	100	110	115	80
    // Bunshin					100		
    // Living Shadow	100		100				
    // Automaton	100				100		
    // Garuda	90						
    // Demi-Summons	90						
    // Titan	150						
    // Fairies	100		
        
    HP: (job) => {
        switch(job) {
            case "GLA": return 110;
            case "PGL": return 105;
            case "MRD": return 115;
            case "LNC": return 110;
            case "ARC": return 100;
            case "CNJ": return 100;
            case "THM": return 100;
            case "PLD": return 120;
            case "MNK": return 110;
            case "WAR": return 125;
            case "DRG": return 115;
            case "BRD": return 105;
            case "WHM": return 105;
            case "BLM": return 105;
            case "ACN": return 100;
            case "SMN": return 105;
            case "SCH": return 105;
            case "ROG": return 103;
            case "NIN": return 108;
            case "MCH": return 105;
            case "DRK": return 120;
            case "AST": return 105;
            case "SAM": return 109;
            case "RDM": return 105;
            case "BLU": return 105;
            case "GNB": return 120;
            case "DNC": return 105;
            case "VPR": return 111;
            case "PCT": return 105;
            default: return 100;
        }
    },
    
    MP: (job) => {
        switch(job) {
            default: return 100;
        }
    },

    STR: (job) => {
        switch(job) {
            case "GLA": return 95;
            case "PGL": return 100;
            case "MRD": return 100;
            case "LNC": return 105;
            case "ARC": return 85;
            case "CNJ": return 50;
            case "THM": return 40;
            case "PLD": return 100;
            case "MNK": return 110;
            case "WAR": return 105;
            case "DRG": return 115;
            case "BRD": return 90;
            case "WHM": return 55;
            case "BLM": return 45;
            case "ACN": return 85;
            case "SMN": return 90;
            case "SCH": return 90;
            case "ROG": return 80;
            case "NIN": return 85;
            case "MCH": return 85;
            case "DRK": return 105;
            case "AST": return 50;
            case "SAM": return 112;
            case "RDM": return 55;
            case "BLU": return 70;
            case "GNB": return 100;
            case "DNC": return 90;
            case "VPR": return 100;
            case "PCT": return 50;
            case "Living Shadow": return 100;
            case "Automaton": return 100;
            case "Garuda": return 90;
            case "Demi-Summons": return 90;
            case "Titan": return 150;
            case "Fairies": return 100;
            default: return 100;
        }
    },

    VIT: (job) => {
        switch(job) {
            case "GLA": return 100;
            case "PGL": return 95;
            case "MRD": return 100;
            case "LNC": return 100;
            case "ARC": return 95;
            case "CNJ": return 95;
            case "THM": return 95;
            case "PLD": return 110;
            case "MNK": return 100;
            case "WAR": return 110;
            case "DRG": return 105;
            case "BRD": return 100;
            case "WHM": return 100;
            case "BLM": return 100;
            case "ACN": return 95;
            case "SMN": return 100;
            case "SCH": return 100;
            case "ROG": return 95;
            case "NIN": return 100;
            case "MCH": return 100;
            case "DRK": return 110;
            case "AST": return 100;
            case "SAM": return 100;
            case "RDM": return 100;
            case "BLU": return 100;
            case "GNB": return 110;
            case "DNC": return 100;
            case "VPR": return 100;
            case "PCT": return 100;
            default: return 100;
        }
    },

    DEX: (job) => {
        switch(job) {
            case "GLA": return 90;
            case "PGL": return 100;
            case "MRD": return 90;
            case "LNC": return 95;
            case "ARC": return 105;
            case "CNJ": return 100;
            case "THM": return 95;
            case "PLD": return 95;
            case "MNK": return 105;
            case "WAR": return 95;
            case "DRG": return 100;
            case "BRD": return 115;
            case "WHM": return 105;
            case "BLM": return 100;
            case "ACN": return 95;
            case "SMN": return 100;
            case "SCH": return 100;
            case "ROG": return 100;
            case "NIN": return 110;
            case "MCH": return 115;
            case "DRK": return 95;
            case "AST": return 100;
            case "SAM": return 108;
            case "RDM": return 105;
            case "BLU": return 110;
            case "GNB": return 95;
            case "DNC": return 115;
            case "VPR": return 110;
            case "PCT": return 110;
            case "Bunshin": return 100;
            case "Living Shadow": return 100;
            default: return 100;
        }
    },

    INT: (job) => {
        switch(job) {
            case "GLA": return 50;
            case "PGL": return 45;
            case "MRD": return 30;
            case "LNC": return 40;
            case "ARC": return 80;
            case "CNJ": return 100;
            case "THM": return 105;
            case "PLD": return 60;
            case "MNK": return 50;
            case "WAR": return 40;
            case "DRG": return 45;
            case "BRD": return 85;
            case "WHM": return 105;
            case "BLM": return 115;
            case "ACN": return 105;
            case "SMN": return 115;
            case "SCH": return 105;
            case "ROG": return 60;
            case "NIN": return 65;
            case "MCH": return 80;
            case "DRK": return 60;
            case "AST": return 105;
            case "SAM": return 60;
            case "RDM": return 115;
            case "BLU": return 115;
            case "GNB": return 60;
            case "DNC": return 85;
            case "VPR": 45;
            case "PCT": 115;
            case "Automaton": return 100;
            default: return 100;
        }
    },

    MND: (job) => {
        switch(job) {
            case "GLA": return 95;
            case "PGL": return 85;
            case "MRD": return 50;
            case "LNC": return 60;
            case "ARC": return 75;
            case "CNJ": return 105;
            case "THM": return 70;
            case "PLD": return 100;
            case "MNK": return 90;
            case "WAR": return 55;
            case "DRG": return 65;
            case "BRD": return 80;
            case "WHM": return 115;
            case "BLM": return 75;
            case "ACN": return 75;
            case "SMN": return 80;
            case "SCH": return 115;
            case "ROG": return 70;
            case "NIN": return 75;
            case "MCH": return 85;
            case "DRK": return 40;
            case "AST": return 115;
            case "SAM": return 50;
            case "RDM": return 110;
            case "BLU": return 105;
            case "GNB": return 100;
            case "DNC": return 80;
            case "VPR": return 55;
            case "PCT": return 80;
            default: return 100;
        }
    }
}

