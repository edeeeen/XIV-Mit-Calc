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
    }
}

const MitType = Object.freeze({
  PARTY: 0,
  PERSONAL: 1,
});


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
            default: return 100;
        }
    },
    
    MP: (job) => {
        switch(job) {
            case "GLA": return 49;
            case "PGL": return 34;
            case "MRD": return 28;
            case "LNC": return 39;
            case "ARC": return 69;
            case "CNJ": return 117;
            case "THM": return 123;
            case "PLD": return 59;
            case "MNK": return 43;
            case "WAR": return 38;
            case "DRG": return 49;
            case "BRD": return 79;
            case "WHM": return 124;
            case "BLM": return 129;
            case "ACN": return 110;
            case "SMN": return 111;
            case "SCH": return 119;
            case "ROG": return 38;
            case "NIN": return 48;
            case "MCH": return 79;
            case "DRK": return 79;
            case "AST": return 124;
            case "SAM": return 40;
            case "RDM": return 120;
            case "BLU": return 120;
            case "GNB": return 59;
            case "DNC": return 79;
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
            default: return 100;
        }
    }
}

