var jobs = document.getElementsByClassName("jobCheckbox");
var mitOptions = document.getElementsByClassName("mitOption");
var damageType = "Physical";

var max = 0
var min = 0
var base = 0

// create a mit class that has a name, mitPercent, and damageType (magic or physical)
class percentMit{
    name;
    physicalMit;
    magicMit;
    jobs;
    constructor(name, physicalMit, magicMit, jobs){
        this.name = name;
        this.physicalMit = physicalMit;
        this.magicMit = magicMit;
        this.jobs = jobs;
    }
}
var mitOptions = [];
// Tank
mitOptions.push(new percentMit("Reprisal", 0.10, 0.10, ["PLD", "WAR", "DRK", "GNB"]));
mitOptions.push(new percentMit("Heart of Light", 0.05, 0.10, ["GNB"]));
mitOptions.push(new percentMit("Dark Missionary", 0.05, 0.10, ["DRK"]));
mitOptions.push(new percentMit("Passage of Arms", 0.15, 0.15, ["PLD"]));

// Melee
mitOptions.push(new percentMit("Feint", 0.10, 0.05, ["MNK", "DRG", "NIN", "SAM", "RPR"]));

// Caster
mitOptions.push(new percentMit("Addle", 0.05, 0.10, ["BLM", "SMN", "RDM", "PCT"]));
mitOptions.push(new percentMit("Magick Barrier", 0.0, 0.10, ["RDM"]));

// Pranged
mitOptions.push(new percentMit("Shield Samba", 0.15, 0.15, ["DNC"]));
mitOptions.push(new percentMit("Troubadour", 0.15, 0.15, ["BRD"]));
mitOptions.push(new percentMit("Tactician", 0.15, 0.15, ["MCH"]));
mitOptions.push(new percentMit("Dismantle", 0.10, 0.10, ["MCH"]));

// Healer
mitOptions.push(new percentMit("Sacred Soil", 0.10, 0.10, ["SCH"]));
mitOptions.push(new percentMit("Fey Illumination", 0.0, 0.05, ["SCH"]));
mitOptions.push(new percentMit("Expedient", 0.10, 0.10, ["SCH"]));
mitOptions.push(new percentMit("Kerachole", 0.10, 0.10, ["SGE"]));
mitOptions.push(new percentMit("Holos", 0.10, 0.10, ["SGE"]));
mitOptions.push(new percentMit("Plenary Indulgence", 0.10, 0.10, ["WHM"]));
mitOptions.push(new percentMit("Temperance", 0.10, 0.10, ["WHM"]));
mitOptions.push(new percentMit("Collective Unconscious", 0.10, 0.10, ["AST"]));
mitOptions.push(new percentMit("Sun Sign", 0.10, 0.10, ["AST"]));

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



