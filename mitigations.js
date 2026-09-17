// create a mit class that has a name, mitPercent, and damageType (magic or physical)
// have to figure out a way to deal with mits that change based on level
// currently ignoring level completely, assume all is lvl 100
class percentMit{
    name;
    physicalMit;
    magicMit;
    jobs;
    mitType;
    shield;
    constructor(name, physicalMit, magicMit, jobs, mitType, shield = null){
        this.name = name;
        this.physicalMit = physicalMit;
        this.magicMit = magicMit;
        this.jobs = jobs;
        this.mitType = mitType;
        this.shield = shield;
    }
}

class healingBuff {

}

class shield {
    name;
    potency;
    multiplier;
    jobs;
    mitType;
    constructor(name, potency, multiplier, jobs, mitType){
        this.name = name;
        this.potency = potency;
        this.jobs = jobs;
        this.multiplier = multiplier;
        this.mitType = mitType;
    }
}

var mitOptions = [];
// ==== Tank ====
mitOptions.push(new percentMit("Reprisal", 0.10, 0.10, ["PLD", "WAR", "DRK", "GNB"], MitType.PARTY));
mitOptions.push(new percentMit("Rampart", 0.20, 0.20, ["PLD", "WAR", "DRK", "GNB"], MitType.PERSONAL));
mitOptions.push(new percentMit("Tank LB1", 0.40, 0.40, ["PLD", "WAR", "DRK", "GNB"], MitType.PARTY));
mitOptions.push(new percentMit("Tank LB2", 0.20, 0.20, ["PLD", "WAR", "DRK", "GNB"], MitType.PARTY));
mitOptions.push(new percentMit("Tank LB3", 0.80, 0.80, ["PLD", "WAR", "DRK", "GNB"], MitType.PARTY));

// GNB
mitOptions.push(new percentMit("Heart of Light", 0.05, 0.10, ["GNB"], MitType.PARTY));
mitOptions.push(new percentMit("Camoflage", 0.10, 0.10, ["GNB"], MitType.PERSONAL));  // TODO: Consider how to handle parry rate
mitOptions.push(new percentMit("Great Nebula", 0.40, 0.40, ["GNB"], MitType.PERSONAL)); // TODO: Add max health increase to calculation
mitOptions.push(new percentMit("Heart of Corundum", 0.2775, 0.2775, ["GNB"], MitType.PERSONAL)); // DOUBLE CHECK MATH ON VALUE. It is 2 seperate 15%

// DRK
mitOptions.push(new percentMit("Dark Missionary", 0.05, 0.10, ["DRK"], MitType.PARTY));
mitOptions.push(new percentMit("Dark Mind", 0.10, 0.20, ["DRK"], MitType.PERSONAL));
mitOptions.push(new percentMit("Shadowed Vigil", 0.40, 0.40, ["DRK"], MitType.PERSONAL));

//TODO: Add tbn

// PLD
mitOptions.push(new percentMit("Passage of Arms", 0.15, 0.15, ["PLD"], MitType.PARTY));
mitOptions.push(new percentMit("Guardian", 0.40, 0.40, ["PLD"], MitType.PERSONAL, 
    new shield("Guardian", 1000, 1, ["PLD"], MitType.PERSONALSHIELD)
));
mitOptions.push(new percentMit("Bulwark", 0.20, 0.20, ["PLD"], MitType.PERSONAL)); // not super accurate, might not matter. need to check if blocking is multiplicative
mitOptions.push(new percentMit("Holy Sheltron", 0.2775, 0.2775, ["PLD"], MitType.PERSONAL));
mitOptions.push(new percentMit("Intervention", 0, 0, ["PLD"], MitType.PERSONAL)); // does variable mitigation based on rampart and guardian
// TODO: Add divine veil

// WAR
mitOptions.push(new percentMit("Damnation", 0.40, 0.40, ["WAR"], MitType.PERSONAL));
mitOptions.push(new percentMit("Bloodwhetting", 0.19, 0.19, ["WAR"], MitType.PERSONAL,
    new shield("Bloodwhetting", 400, 1, ["WAR"], MitType.PERSONALSHIELD)
));
mitOptions.push(new percentMit("Nascent Flash", 0.19, 0.19, ["WAR"], MitType.PERSONAL,
    new shield("Bloodwhetting", 400, 1, ["WAR"], MitType.PERSONALSHIELD)
));
// TODO: Add shake
//TODO: Add thrill of battle



// Melee
mitOptions.push(new percentMit("Feint", 0.10, 0.05, ["MNK", "DRG", "NIN", "SAM", "RPR"], MitType.PARTY));
mitOptions.push(new percentMit("Shade Shift", 0.20, 0.20, ["NIN"], MitType.PERSONAL));
mitOptions.push(new percentMit("Riddle of Earth", 0.20, 0.20, ["MNK"], MitType.PERSONAL));
mitOptions.push(new percentMit("Tengentsu", 0.10, 0.10, ["SAM"], MitType.PERSONAL));

// Caster
mitOptions.push(new percentMit("Addle", 0.05, 0.10, ["BLM", "SMN", "RDM", "PCT"], MitType.PARTY));
mitOptions.push(new percentMit("Magick Barrier", 0.0, 0.10, ["RDM"], MitType.PARTY)); // TODO: Add healing buff
// TODO: Add tempura grassa

// Pranged
mitOptions.push(new percentMit("Shield Samba", 0.15, 0.15, ["DNC"], MitType.PARTY));
// TODO: Add improv shields
mitOptions.push(new percentMit("Troubadour", 0.15, 0.15, ["BRD"], MitType.PARTY));
// TODO: Add nature's minne
mitOptions.push(new percentMit("Tactician", 0.15, 0.15, ["MCH"], MitType.PARTY));
mitOptions.push(new percentMit("Dismantle", 0.10, 0.10, ["MCH"], MitType.PARTY));

// ==== Healer ====
// SCH
mitOptions.push(new percentMit("Sacred Soil", 0.10, 0.10, ["SCH"], MitType.PARTY));
mitOptions.push(new percentMit("Fey Illumination", 0.0, 0.05, ["SCH"], MitType.PARTY)); // TODO: Add % healing potency increase
mitOptions.push(new percentMit("Expedient", 0.10, 0.10, ["SCH"], MitType.PARTY));
mitOptions.push(new percentMit("Protraction", 0.10, 0.10, ["SCH"], MitType.PERSONAL));
mitOptions.push(new shield("Adloquium", 300, 1.80, ["SCH"], MitType.PERSONALSHIELD))
mitOptions.push(new shield("Concitation", 200, 1.80, ["SCH"], MitType.PARTYSHIELD))
mitOptions.push(new shield("Consolation", 250, 1, ["SCH"], MitType.PARTYSHIELD))
mitOptions.push(new shield("Accession", 240, 1.80, ["SCH"], MitType.PARTYSHIELD))
mitOptions.push(new shield("Manifestation", 360, 1.80, ["SCH"], MitType.PARTYSHIELD))
// TODO: spreadlo

// SGE
mitOptions.push(new percentMit("Kerachole", 0.10, 0.10, ["SGE"], MitType.PARTY));
mitOptions.push(new percentMit("Holos", 0.10, 0.10, ["SGE"], MitType.PARTY,
    new shield("Holos", 300, 1, ["SGE"], MitType.PARTYSHIELD)
));
mitOptions.push(new percentMit("Taurochole", 0.10, 0.10, ["SGE"], MitType.PERSONAL));
mitOptions.push(new shield("Eukrasian Prognosis II", 100, 3.60, ["SGE"], MitType.PARTYSHIELD));
mitOptions.push(new shield("Eukrasian Diagnosis", 300, 1.80, ["SGE"], MitType.PARTYSHIELD));
mitOptions.push(new shield("Panhaima", 200, 1, ["SGE"], MitType.PARTYSHIELD));
mitOptions.push(new shield("Haima", 300, 1, ["SGE"], MitType.PERSONALSHIELD));

// WHM
mitOptions.push(new percentMit("Plenary Indulgence", 0.10, 0.10, ["WHM"], MitType.PARTY)); // TODO: Add % healing potency increase
mitOptions.push(new percentMit("Temperance", 0.10, 0.10, ["WHM"], MitType.PARTY));
mitOptions.push(new shield("Divine Caress", 400, 1, ["WHM"], MitType.PARTYSHIELD))
mitOptions.push(new percentMit("Aquaveil", 0.10, 0.10, ["WHM"], MitType.PERSONAL));
mitOptions.push(new shield("Divine Benison", 500, 1, ["WHM"], MitType.PERSONALSHIELD))

// TODO: Add asylum % healing potency increase

// AST
mitOptions.push(new percentMit("Collective Unconscious", 0.10, 0.10, ["AST"], MitType.PARTY));
mitOptions.push(new percentMit("The Bole", 0.10, 0.10, ["AST"], MitType.PERSONAL));
mitOptions.push(new percentMit("Exaltation", 0.10, 0.10, ["AST"], MitType.PERSONAL));
mitOptions.push(new percentMit("Sun Sign", 0.10, 0.10, ["AST"], MitType.PARTY));
mitOptions.push(new shield("The Spire", 400, 1, ["AST"], MitType.PERSONALSHIELD))
mitOptions.push(new shield("Celestial Intersection", 200, 2, ["AST"], MitType.PERSONALSHIELD))
// TODO: add neutral shields 

