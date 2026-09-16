// create a mit class that has a name, mitPercent, and damageType (magic or physical)
// have to figure out a way to deal with mits that change based on level
// currently ignoring level completely, assume all is lvl 100
class percentMit{
    name;
    physicalMit;
    magicMit;
    jobs;
    mitType;
    extra;
    constructor(name, physicalMit, magicMit, jobs, mitType, extra = null){
        this.name = name;
        this.physicalMit = physicalMit;
        this.magicMit = magicMit;
        this.jobs = jobs;
        this.mitType = mitType;
        this.extra = extra;
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
mitOptions.push(new percentMit("Guardian", 0.40, 0.40, ["PLD"], MitType.PERSONAL));
mitOptions.push(new percentMit("Bulwark", 0.20, 0.20, ["PLD"], MitType.PERSONAL)); // not super accurate, might not matter. need to check if blocking is multiplicative
mitOptions.push(new percentMit("Holy Sheltron", 0.2775, 0.2775, ["PLD"], MitType.PERSONAL));
mitOptions.push(new percentMit("Intervention", 0, 0, ["PLD"], MitType.PERSONAL)); // does variable mitigation based on rampart and guardian
// TODO: Add divine veil

// WAR
mitOptions.push(new percentMit("Damnation", 0.40, 0.40, ["WAR"], MitType.PERSONAL));
mitOptions.push(new percentMit("Bloodwhetting", 0.19, 0.19, ["WAR"], MitType.PERSONAL));
mitOptions.push(new percentMit("Nascent Flash", 0.10, 0.10, ["WAR"], MitType.PERSONAL)); // has a shield
// TODO: Add shake
//TODO: Add thrill of battle



// Melee
mitOptions.push(new percentMit("Feint", 0.10, 0.05, ["MNK", "DRG", "NIN", "SAM", "RPR"], MitType.PARTY));

// Caster
mitOptions.push(new percentMit("Addle", 0.05, 0.10, ["BLM", "SMN", "RDM", "PCT"], MitType.PARTY));
mitOptions.push(new percentMit("Magick Barrier", 0.0, 0.10, ["RDM"], MitType.PARTY));
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
mitOptions.push(new shield("Adloquium", 300, 1.80, ["SCH"], MitType.PERSONALSHIELD))
mitOptions.push(new shield("Concitation", 200, 1.80, ["SCH"], MitType.PARTYSHIELD))
mitOptions.push(new shield("Consolation", 250, 1, ["SCH"], MitType.PARTYSHIELD))
// TODO: Add succor shields, spreadlo, etc.

// SGE
mitOptions.push(new percentMit("Kerachole", 0.10, 0.10, ["SGE"], MitType.PARTY));
mitOptions.push(new percentMit("Holos", 0.10, 0.10, ["SGE"], MitType.PARTY)); // TODO: Add holos shields

// WHM
mitOptions.push(new percentMit("Plenary Indulgence", 0.10, 0.10, ["WHM"], MitType.PARTY)); // TODO: Add % healing potency increase
mitOptions.push(new percentMit("Temperance", 0.10, 0.10, ["WHM"], MitType.PARTY));
mitOptions.push(new shield("Divine Caress", 400, 1, ["WHM"], MitType.PARTYSHIELD))
// TODO: Add divine carress
// TODO: Add asylum % healing potency increase

// AST
mitOptions.push(new percentMit("Collective Unconscious", 0.10, 0.10, ["AST"], MitType.PARTY));
mitOptions.push(new percentMit("Sun Sign", 0.10, 0.10, ["AST"], MitType.PARTY));
// TODO: add neutral shields 