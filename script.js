var jobs = document.getElementsByClassName("jobCheckbox");
var mitOptions = []
var damageType = "Physical";

var max = 0
var min = 0
var base = 0

const hasPotencyShields = ["SGE", "SCH", "AST", "WHM"]
const hasSingleTargetPotencyShields = ["WAR", "PLD"]

var checkboxes = {
    enablePersonalMits: false,
    enableShields: false,
    enableTooMuchInfo: false,
    enablePartyBuff: false,
    simulatePartyBonus: false
}

var partyBonus = 1.0


function addMit() {
    updatePartyList();
    var selectedMits = new Set();
    // update list of selected mits
    var mits = document.getElementsByClassName("mitOption");
    for (var i = 0; i < mits.length; i++) {
        if (mits[i].checked ) {
            selectedMits.add(mits[i].value);
        }
    }
    // Get mitigation objects for selected mits
    var selectedMitObjects = mitOptions.filter(mit => selectedMits.has(mit.name));

    // split up shield and normal mits
    var shields = [];
    var normalMits = [];

    selectedMitObjects.forEach(mit => {
        // If it has percentage mitigation, treat it as a normal mit
        if (mit.physicalMit > 0 || mit.magicMit > 0) {
            normalMits.push(mit);
        }

        // If it is purely a shield object, add to shields
        if (mit.mitType === MitType.PARTYSHIELD || mit.mitType === MitType.PERSONALSHIELD) {
            shields.push(mit);
        }

        // If it is a percentage mit WITH an attached shield (like Holos), attach its shield
        if (mit.shield) {
            // Ensure the attached shield knows which job cast it
            if (!mit.shield.jobs) mit.shield.jobs = mit.jobs; 
            shields.push(mit.shield); 
        }

        if (mit.mitType === MitType.PERCENTSHIELDPERSONAL || mit.mitType === MitType.PERCENTSHIELDPARTY) {
            shields.push(mit);
        }
    });


    // ======== SHIELD MITS ==============
    // sort in consumption prio
    shields.sort((a, b) => {
        let indexA = consumtionPriority.indexOf(a.name);
        let indexB = consumtionPriority.indexOf(b.name);

        if (indexA === -1) indexA = Infinity;
        if (indexB === -1) indexB = Infinity;

        return indexA - indexB;
    });
    potency = 0;
    let allShields = []
    if(shields.length > 0 ) {
        shields.forEach( mit => {
            if(mit.potency > 0) {
                // if its based off of potency
                healingValue = getShieldValue(mit);
                let actualShield = Object.fromEntries(
                    Object.entries(healingValue).map(([key, value]) => [key, Math.round(value * mit.multiplier)])
                );
                allShields.push(actualShield);
            } else {
                // if its based off of percent
                shieldSize = Math.round(health[mit.jobs[0]] * mit.percentShield);
                console.log(shieldSize)
                let actualShield = {
                    HHigh: shieldSize,
                    H: shieldSize,
                    HLow: shieldSize,
                    HCritHigh: shieldSize,
                    HCrit: shieldSize,
                    HCritLow: shieldSize
                };
                allShields.push(actualShield);
            }
            

        })
        document.getElementById("tempShieldHigh").innerText = allShields.map(item => item.HHigh).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HHigh, 0);
        document.getElementById("tempShieldMid").innerText = allShields.map(item => item.H).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.H, 0);
        document.getElementById("tempShieldLow").innerText = allShields.map(item => item.HLow).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HLow, 0);

        document.getElementById("tempShieldCritHigh").innerText = allShields.map(item => item.HCritHigh).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HCritHigh, 0);
        document.getElementById("tempShieldCritMid").innerText = allShields.map(item => item.HCrit).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HCrit, 0);
        document.getElementById("tempShieldCritLow").innerText = allShields.map(item => item.HCritLow).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HCritLow, 0);
    }
    
    // ======== NORMAL MITS ==============
    // update max
    maxString = ""
    if (normalMits.length > 0) {
        maxString = max + " * " + normalMits.map(mit => damageType === "physical" ? mit.physicalMit : mit.magicMit).join(" * ") + " = " 
        maxString += (max * normalMits.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(2);
    } else {
        maxString = max;
    }
    // update base
    baseString = ""
    if (normalMits.length > 0) {
        baseString = base + " * " + normalMits.map(mit => damageType === "physical" ? mit.physicalMit : mit.magicMit).join(" * ") + " = "
        baseString += (base * normalMits.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(2);

    } else {
        baseString = base;
    }
    // update min
    minString = ""
    if (normalMits.length > 0) {
        minString = min + " * " + normalMits.map(mit => damageType === "physical" ? mit.physicalMit : mit.magicMit).join(" * ") + " = "
        minString += (min * normalMits.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(2);
    } else {
        minString = min;
    }

    // update total mit
    totalMit = (normalMits.reduce((acc, mit) => acc * (1 - (damageType === "physical" ? mit.physicalMit : mit.magicMit)), 1)).toFixed(4);

    document.getElementById("maxDamage").innerText = maxString;
    document.getElementById("baseDamage").innerText = baseString;
    document.getElementById("minDamage").innerText = minString;
    document.getElementById("totalMitPercent").innerText = (Math.round((1 - totalMit) * 10000)/100) + "%";
}

function checkVitInput(checkbox, jobId) {
    let shieldsEnabled = document.getElementById("shieldsCheckbox").checked;
    
    if (!shieldsEnabled) {
        checkbox.disabled = false;
        return;
    }
    let vitalityInput = document.getElementById(jobId + "Vitality");
    console.log("PENIS " + Boolean(vitalityInput && vitalityInput.value.trim() !== ''))
    if(vitalityInput && vitalityInput.value.trim() !== '') {
        checkbox.disabled = false; 
    } else {
        checkbox.disabled = true;
        checkbox.checked = false;
        addMit();
    }

}

function checkStatsInput(checkbox, jobId) {
    let shieldsEnabled = document.getElementById("shieldsCheckbox").checked;
    
    if (!shieldsEnabled) {
        checkbox.disabled = false;
        return;
    }

    let mainStatInput = document.getElementById(jobId + "mainStatInput");
    let detInput = document.getElementById(jobId + "detInput");
    let CRTInput = document.getElementById(jobId + "CRTInput");
    let weaponDamageInput = document.getElementById(jobId + "weaponDamageInput");
    let TNCInput = document.getElementById(jobId + "TNCInput");

    const tanks = ["WAR", "PLD", "DRK", "GNB"];
    let isTank = tanks.includes(jobId);

    // Basic stats required for all jobs
    let hasBasicStats = mainStatInput && mainStatInput.value.trim() !== '' &&
                        detInput && detInput.value.trim() !== '' &&
                        CRTInput && CRTInput.value.trim() !== '' &&
                        weaponDamageInput && weaponDamageInput.value.trim() !== '';

    // Tank requires TNC as well
    let hasTankStat = !isTank || (TNCInput && TNCInput.value.trim() !== '');

    if (hasBasicStats && hasTankStat) {
        checkbox.disabled = false; 
    } else {
        checkbox.disabled = true;
        checkbox.checked = false;
        addMit();
    }
}


// creates mit list
function updateMit(element) {
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
    var shieldsEnabled = document.getElementById("shieldsCheckbox").checked;
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
        if(!personalsEnabled && (mitOptions.find(m => m.name === mit).mitType === MitType.PERSONAL)) {
            return; // Skip personal mits if checkbox is not checked
        }
        if(!shieldsEnabled && (mitOptions.find(m => m.name === mit).mitType === MitType.PARTYSHIELD
        || mitOptions.find(m => m.name === mit).mitType === MitType.PERCENTSHIELDPARTY)) {
            return
        }
        if((!personalsEnabled || !shieldsEnabled) && (mitOptions.find(m => m.name === mit).mitType === MitType.PERSONALSHIELD 
        || mitOptions.find(m => m.name === mit).mitType === MitType.PERCENTSHIELDPERSONAL)) {
            return; 
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
        
        // can be less jank if i fix this whole function


        

        let mitObject = mitOptions.find(m => m.name === mit);
        let rawShield = mitObject.shield ? mitObject.shield : mitObject;
        const hasShield = mitObject.mitType === MitType.PERSONALSHIELD || 
                  mitObject.mitType === MitType.PARTYSHIELD || 
                  (mitObject.shield && (mitObject.shield.mitType === MitType.PERSONALSHIELD || mitObject.shield.mitType === MitType.PARTYSHIELD));


        if (hasShield && rawShield.jobs && rawShield.jobs.length === 1 && hasShield) {
            let jobId = rawShield.jobs[0];

            // Disable by default until stats are validated
            checkbox.disabled = true;

            let mainStatInput = document.getElementById(jobId + "mainStatInput");
            let detInput = document.getElementById(jobId + "detInput");
            let CRTInput = document.getElementById(jobId + "CRTInput");
            let weaponDamageInput = document.getElementById(jobId + "weaponDamageInput");

            if (mainStatInput && detInput && CRTInput && weaponDamageInput) {
                mainStatInput.addEventListener('input', () => checkStatsInput(checkbox, jobId, mitObject));
                detInput.addEventListener('input', () => checkStatsInput(checkbox, jobId, mitObject));
                CRTInput.addEventListener('input', () => checkStatsInput(checkbox, jobId, mitObject));
                weaponDamageInput.addEventListener('input', () => checkStatsInput(checkbox, jobId, mitObject));
            }

            let TNCInput = document.getElementById(jobId + "TNCInput");
            if (TNCInput) {
                TNCInput.addEventListener('input', () => checkStatsInput(checkbox, jobId, mitObject));
            }

            // Run check immediately to set correct disabled state
            checkStatsInput(checkbox, jobId, mitObject);
        }

        // checkboxes for percent shields
        // requires vit to be filled out
        const hasPercentShield = mitObject.mitType === MitType.PERCENTSHIELDPERSONAL || 
                mitObject.mitType === MitType.PERCENTSHIELDPARTY || 
                (mitObject.shield && (mitObject.shield.mitType === MitType.PERCENTSHIELDPERSONAL || mitObject.shield.mitType === MitType.PERCENTSHIELDPARTY));
        
        if(hasPercentShield) {
            let jobId = rawShield.jobs[0];
            checkbox.disabled = true;
            let vitalityInput = document.getElementById(jobId + "Vitality");

            if(vitalityInput) {
                vitalityInput.addEventListener('input', () => checkVitInput(checkbox, jobId));
            }

            checkVitInput(checkbox, jobId);
        }
        


        var label = document.createElement("label");
        label.htmlFor = mit;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(mit));
        mitContainer.appendChild(label);
    });

    addMit();
}

function getJobAttributeModifier(stat, job) {
    switch (stat) {
        case statsEnum.HP: return jobModifiers.HP(job);
        case statsEnum.MP: return jobModifiers.MP(job);
        case statsEnum.STR: return jobModifiers.STR(job);
        case statsEnum.VIT: return jobModifiers.VIT(job);
        case statsEnum.DEX: return jobModifiers.DEX(job);
        case statsEnum.INT: return jobModifiers.INT(job);
        case statsEnum.MND: return jobModifiers.MND(job);
        default: return -1
    }
}

function getShieldValue(mit) {
    job = mit.jobs[0];
    console.log(job)
    potency = mit.potency;
    mainStatVal = parseInt(document.getElementById(job+"mainStatInput").value);
    det = parseInt(document.getElementById(job+"detInput").value);
    tnc = 400
    let tanks = ["WAR", "PLD", "DRK", "GNB"]
    if(tanks.includes(job)) { 
        tnc = parseInt(document.getElementById(job+"TNCInput").value);
    }
    crt = parseInt(document.getElementById(job+"CRTInput").value);
    wd  = parseInt(document.getElementById(job+"weaponDamageInput").value);
    return calculateShields(potency, mainStatVal, det, tnc, crt, wd, job, mit.pet)
}

// https://docs.google.com/spreadsheets/d/1YAuklyu4IJCFUdk1KERmCP0F_SRkhJpSRvU0hazStj0/edit?gid=2139215610#gid=2139215610
// Caro is the goat
function calculateShields(potency, main, det, tnc, crit, wd, job = "SCH", pet = false, lvl = 100) {
    // pets aren't affected by party bonus
    if (!pet) {
        main = main * partyBonus // add party bonus 1.0-1.05
    }
    
    
    let fDET = Math.floor(140 * (det - stats.main(lvl)) / stats.div(lvl) + 1000);
    const tanks = ["PLD", "DRK", "WAR", "GNB"]
    let fTNC = 1000
    if(tanks.includes(job)) {
        fTNC = Math.floor(100 * (tnc - stats.sub(lvl)) / stats.div(lvl) + 1000);
    }
    
    let fCRIT = Math.floor(200 * (crit - stats.sub(lvl)) / stats.div(lvl)) + 1400;
    console.log("fCRT = " + fCRIT)
    console.log("fTNC = " + fTNC)
    console.log("fDET = " + fDET)
    
    // Level 100 Main Stat (Healing Power) scaling
    let fHMP = Math.floor(207 * (main - stats.main(lvl)) /508) + 100;
    console.log("fHMP = " + fHMP + "\nstats.main(lvl) = " + stats.main(lvl) + "\nstats.main(lvl) = ")

    // Weapon Damage sub-function
    let scaling = mainStat.value(job); 
    let fWD = Math.floor((stats.main(lvl) * getJobAttributeModifier(scaling, job) / 1000) + wd);
    console.log("fWD = " + fWD)

    // Trait Modifier
    const magicJobs = ["WHM", "AST", "SCH", "SGE", "PCT", "RDM", "SMN", "BLM"];
    let trait = magicJobs.includes(job) ? 130 : 100;

    let H1 = Math.floor(Math.floor(potency * fHMP * fDET / 100)/1000);
    let H2 = Math.floor(Math.floor(Math.floor(H1 * fTNC / 1000) * fWD / 100) * trait / 100);

    let H3 = H2;
    let H3Crit = Math.floor(H2 * fCRIT / 1000);

    if(checkboxes.enableTooMuchInfo) {
        document.getElementById("fCRT").innerText = fCRIT
        document.getElementById("fTNC").innerText = fTNC
        document.getElementById("fDET").innerText = fDET
        document.getElementById("fHMP").innerText = fHMP
        document.getElementById("fWD").innerText = fWD
        document.getElementById("H1").innerText = H1
        document.getElementById("H2").innerText = H2
        document.getElementById("HCrit").innerText = H3Crit
    }

    return {
        H: H3,
        HLow: Math.floor(H3 * 97 / 100),
        HHigh: Math.floor(H3 * 103 / 100),
        HCrit: H3Crit,
        HCritLow: Math.floor(H3Crit * 97 / 100),
        HCritHigh: Math.floor(H3Crit * 103 / 100)
    };
}

function tempShieldsTest() {
    var potency = document.getElementById("potencyInput").value;
    var main = document.getElementById("mainInput").value;
    var det = document.getElementById("detInput").value;
    var tnc = document.getElementById("tncInput").value;
    var crit = document.getElementById("critInput").value;
    var wd = document.getElementById("wdInput").value;
    

    var shields = calculateShields(potency, main, det, tnc, crit, wd);

    document.getElementById("tempShieldHigh").innerText = shields.HHigh;
    document.getElementById("tempShieldLow").innerText = shields.HLow;
    document.getElementById("tempShieldMid").innerText = shields.H;

    document.getElementById("tempShieldCritHigh").innerText = shields.HCritHigh;
    document.getElementById("tempShieldCritLow").innerText = shields.HCritLow;
    document.getElementById("tempShieldCritMid").innerText = shields.HCrit;
}

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

function tooMuchInfoListener(e) {
    checkboxes.enableTooMuchInfo = e.checked
    infoDiv = document.getElementById("tooMuchInfo")
    if (checkboxes.enableTooMuchInfo) {
        infoDiv.style.display = "flex"
    } else {
        infoDiv.style.display = "none"
    }
    updateMit()
}

function partyBonusListener(e) {
    checkboxes.enableTooMuchInfo = e.checked
    partyBonusDropdown = document.getElementById("partyBonusDropdown")
    if (checkboxes.enableTooMuchInfo) {
        bonus = parseInt(partyBonusDropdown.value)
        partyBonus = 1 + ( bonus / 100)
    } else {
        partyBonus = 1.0
    }
    document.getElementById("PartyBonus").innerText = partyBonus;

    updateMit()
}

document.addEventListener("DOMContentLoaded", () => {
    for (var i = 0; i < jobs.length; i++) {
        jobs[i].addEventListener("change", (e) => {
            updateMit(e)
        });
    }
    createPartyList()
    updateMit()
    updatePartyList()
    calculateDamage()
    shieldCheckbox(document.getElementById("shieldsCheckbox"))
    partyBonusListener(document.getElementById("partyBonusCheckbox"))
    tooMuchInfoListener(document.getElementById("tooMuchInfoCheckbox"))
    document.getElementById("mitInput").addEventListener("input", calculateDamage)
    document.getElementById("mitDropdown").addEventListener("input", calculateDamage)
    document.getElementById("shieldsCheckbox").addEventListener("input", (e) => {shieldCheckbox(e.target)});
    document.getElementById("personalsCheckbox").addEventListener("input", updatePartyList)
    document.getElementById("tooMuchInfoCheckbox").addEventListener("input", (e) => {tooMuchInfoListener(e.target)})
    
    document.getElementById("partyBonusCheckbox").addEventListener("input", (e) => {partyBonusListener(e.target)})
    document.getElementById("partyBonusDropdown").addEventListener("input", (e) => {partyBonusListener(document.getElementById("partyBonusCheckbox"))})
});