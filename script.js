var jobs = document.getElementsByClassName("jobCheckbox");
var mitOptions = document.getElementsByClassName("mitOption");
var damageType = "Physical";

var max = 0
var min = 0
var base = 0


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
        // check if user wants to display personals
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

// slightly off, requires lots of bugfixing.
function calculateShields(potency, main, det, tnc, crit, dh, wd, trait, attribute, lvl = 100) {
    fDET = (Math.floor(140 * (det - stats.main(lvl)) / stats.main(lvl)) / 1000) + 1;
    fTNC = Math.floor(100 * (tnc - stats.sub(lvl)) / stats.div(lvl) + 1000);
    fHMP =  Math.floor(100 * ( main - stats.main(lvl) / stats.div(lvl) )) + 100;
    // wd can be different on the same job. refer to Job_{Job, Attribute}
    fWD = (Math.floor((stats.main(lvl) * attribute / 1000) + wd));
    fCRIT = Math.floor(200 * (crit - stats.sub(lvl)) / stats.div(lvl) + 1400);

    fHMP =  Math.floor(100 * ( main - stats.main(lvl) / stats.div(lvl) )) + 100;
    H1 = Math.floor(potency * fHMP * fDET / 100) / 1000;
    H2 = Math.floor(H1 * fTNC / 1000) * fWD / 100 * trait / 100;
    // CRIT?: If you do not critical hit, CRIT? = 1000. If you critical hit, CRIT? = f(CRIT).
    H3 = Math.floor(H2 * 1000 / 1000);
    H3Crit = Math.floor(H2 * fCRIT / 1000);
    // DOES NOT CALCULATE WITH BUFFS SO BUFFS CAN BE PROPERLY ATTRIBUTED 
    H = Math.floor(H3 * 100 / 100);
    HHigh = Math.floor(H3 * 103 / 100);
    HLow = Math.floor(H3 * 97 / 100);

    HCrit = Math.floor(H3Crit * 100 / 100);
    HCritHigh = Math.floor(H3Crit * 103 / 100);
    HCritLow = Math.floor(H3Crit * 97 / 100);

    return {
        H: H,
        HHigh: HHigh,
        HLow: HLow,
        HCrit: HCrit,
        HCritHigh: HCritHigh,
        HCritLow: HCritLow
    }

}


function tempShieldsTest() {
    var potency = document.getElementById("potencyInput").value;
    var main = document.getElementById("mainInput").value;
    var det = document.getElementById("detInput").value;
    var tnc = document.getElementById("tncInput").value;
    var crit = document.getElementById("critInput").value;
    var dh = document.getElementById("dhInput").value;
    var wd = document.getElementById("wdInput").value;
    var trait = document.getElementById("traitInput").value;
    var attribute = document.getElementById("attributeInput").value;

    var shields = calculateShields(potency, main, det, tnc, crit, dh, wd, trait, attribute);

    document.getElementById("tempShieldHigh").innerText = shields.HHigh;
    document.getElementById("tempShieldLow").innerText = shields.HLow;
    document.getElementById("tempShieldMid").innerText = shields.H;

    document.getElementById("tempShieldCritHigh").innerText = shields.HCritHigh;
    document.getElementById("tempShieldCritLow").innerText = shields.HCritLow;
    document.getElementById("tempShieldCritMid").innerText = shields.HCrit;
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



