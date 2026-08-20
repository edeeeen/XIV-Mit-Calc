var jobs = document.getElementsByClassName("jobCheckbox");
var mitOptions = document.getElementsByClassName("mitOption");
var damageType = "Physical";

var max = 0
var min = 0
var base = 0

const MitType = Object.freeze({
  PARTY: 0,
  PERSONAL: 1,
});


// create a mit class that has a name, mitPercent, and damageType (magic or physical)
class percentMit{
    name;
    physicalMit;
    magicMit;
    jobs;
    mitType
    constructor(name, physicalMit, magicMit, jobs, mitType){
        this.name = name;
        this.physicalMit = physicalMit;
        this.magicMit = magicMit;
        this.jobs = jobs;
        this.mitType = mitType
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

// Pranged
mitOptions.push(new percentMit("Shield Samba", 0.15, 0.15, ["DNC"], MitType.PARTY));
mitOptions.push(new percentMit("Troubadour", 0.15, 0.15, ["BRD"], MitType.PARTY));
mitOptions.push(new percentMit("Tactician", 0.15, 0.15, ["MCH"], MitType.PARTY));
mitOptions.push(new percentMit("Dismantle", 0.10, 0.10, ["MCH"], MitType.PARTY));

// Healer
mitOptions.push(new percentMit("Sacred Soil", 0.10, 0.10, ["SCH"], MitType.PARTY));
mitOptions.push(new percentMit("Fey Illumination", 0.0, 0.05, ["SCH"], MitType.PARTY));
mitOptions.push(new percentMit("Expedient", 0.10, 0.10, ["SCH"], MitType.PARTY));
mitOptions.push(new percentMit("Kerachole", 0.10, 0.10, ["SGE"], MitType.PARTY));
mitOptions.push(new percentMit("Holos", 0.10, 0.10, ["SGE"], MitType.PARTY));
mitOptions.push(new percentMit("Plenary Indulgence", 0.10, 0.10, ["WHM"], MitType.PARTY));
mitOptions.push(new percentMit("Temperance", 0.10, 0.10, ["WHM"], MitType.PARTY));
mitOptions.push(new percentMit("Collective Unconscious", 0.10, 0.10, ["AST"], MitType.PARTY));
mitOptions.push(new percentMit("Sun Sign", 0.10, 0.10, ["AST"], MitType.PARTY));

function addMit() {
    var selectedMits = new Set();
    // update list of selected mits
    var mits = document.getElementsByClassName("mitOption");
    for (var i = 0; i < mits.length; i++) {
        if (mits[i].checked) {
            selectedMits.add(mits[i].value);
        }
    }
    // Get mitigation objects for selected mits
    var selectedMitObjects = mitOptions.filter(mit => selectedMits.has(mit.name));
    // update max
    maxString = ""
    if (selectedMitObjects.length > 0) {
        maxString = max + " * " + selectedMitObjects.map(mit => damageType === "physical" ? mit.physicalMit : mit.magicMit).join(" * ") + " = " 
        maxString += (max * selectedMitObjects.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(2);
    } else {
        maxString = max;
    }
    // update base
    baseString = ""
    if (selectedMitObjects.length > 0) {
        baseString = base + " * " + selectedMitObjects.map(mit => damageType === "physical" ? mit.physicalMit : mit.magicMit).join(" * ") + " = "
        baseString += (base * selectedMitObjects.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(2);

    } else {
        baseString = base;
    }
    // update min
    minString = ""
    if (selectedMitObjects.length > 0) {
        minString = min + " * " + selectedMitObjects.map(mit => damageType === "physical" ? mit.physicalMit : mit.magicMit).join(" * ") + " = "
        minString += (min * selectedMitObjects.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(2);
    } else {
        minString = min;
    }

    // update total mit
    totalMit = (selectedMitObjects.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(4);

    document.getElementById("maxDamage").innerText = maxString;
    document.getElementById("baseDamage").innerText = baseString;
    document.getElementById("minDamage").innerText = minString;
    document.getElementById("totalMitPercent").innerText = (Math.round((1 - totalMit) * 10000)/100) + "%";
}


function updateMit() {
    var availableMits = new Set();
    for (var j = 0; j < jobs.length; j++) {
        if (jobs[j].checked) {
            for (var m = 0; m < mitOptions.length; m++) {
                if (mitOptions[m].jobs.includes(jobs[j].id)) {
                    availableMits.add(mitOptions[m].name);
                }
            }
        }
    }

    // Get currently selected mits before clearing
    var mits = document.getElementsByClassName("mitOption");
    var personalsEnabled = document.getElementById("personalsCheckbox").checked;
    var previouslySelected = new Set();
    for (var i = 0; i < mits.length; i++) {
        if (mits[i].checked) {
            previouslySelected.add(mits[i].value);
        }
    }

    var mitContainer = document.getElementById("mitOptions");
    mitContainer.innerHTML = "";

    // Create checkboxes for each selected job's mit options
    title = document.createElement("h2");
    title.innerText = "Available Mits:";
    mitContainer.appendChild(title);
    availableMits.forEach(mit => {
        if(!personalsEnabled && mitOptions.find(m => m.name === mit).mitType === MitType.PERSONAL) {
            return; // Skip personal mits if checkbox is not checked
        }
        var label = document.createElement("label");
        label.className = mit.replace(/\s+/g, '');
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = mit.replace(/\s+/g, '');
        checkbox.value = mit;
        checkbox.className = "mitOption";
        // Preserve checked state if mit was previously selected
        if (previouslySelected.has(mit)) {
            checkbox.checked = true;
        }
        // Add event listener to update the damage calculation when a mit option is checked or unchecked
        checkbox.addEventListener("change", addMit);
        var label = document.createElement("label");
        label.htmlFor = mit;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(mit));
        mitContainer.appendChild(label);
    });

    addMit();
}

for (var i = 0; i < jobs.length; i++) {
    jobs[i].addEventListener("change", updateMit);
}

updateMit();

function calculateDamage() {
    var damageInput = document.getElementById("mitInput").value;
    max = damageInput * 1.05;
    min = damageInput * 0.95;
    base = damageInput;
    document.getElementById("maxDamage").innerText = max;
    document.getElementById("baseDamage").innerText = base;
    document.getElementById("minDamage").innerText = min;
    damageType = document.getElementById("mitDropdown").value;
    addMit();
}



