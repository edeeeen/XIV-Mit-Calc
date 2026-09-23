var jobs = document.getElementsByClassName("jobCheckbox");
var mitOptions = []
var damageType = "Physical";

var max = 0
var min = 0
var base = 0

const hasPotencyShields = ["SGE", "SCH", "AST", "WHM"]
const hasSingleTargetPotencyShields = ["WAR", "PLD"]
const appState = {
    selectedMits: new Map(), // Stores mitName -> mitObject
    damageType: "physical",  // "physical" | "magic"
    baseDamage: 10000,
    partyBonus: 1.0
};

var checkboxes = {
    enablePersonalMits: false,
    enableShields: false,
    enableTooMuchInfo: false,
    enablePartyBuff: false,
    simulatePartyBonus: false
}




function addMit() {
    updatePartyList();

    const selectedMitObjects = Array.from(appState.selectedMits.values());

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
    if (shields.length > 0) {
        shields.forEach(mit => {
            if (mit.potency > 0) {
                let healingValue = getShieldValue(mit);
                let actualShield = Object.fromEntries(
                    Object.entries(healingValue).map(([key, value]) => [key, Math.round(value * (mit.multiplier || 1))])
                );
                allShields.push(actualShield);
            } else {
                let shieldSize = Math.round(health[mit.jobs[0]] * mit.percentShield);
                allShields.push({
                    HHigh: shieldSize, H: shieldSize, HLow: shieldSize,
                    HCritHigh: shieldSize, HCrit: shieldSize, HCritLow: shieldSize
                });
            }
        });
            
        document.getElementById("tempShieldHigh").innerText = allShields.map(item => item.HHigh).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HHigh, 0);
        document.getElementById("tempShieldMid").innerText = allShields.map(item => item.H).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.H, 0);
        document.getElementById("tempShieldLow").innerText = allShields.map(item => item.HLow).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HLow, 0);

        document.getElementById("tempShieldCritHigh").innerText = allShields.map(item => item.HCritHigh).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HCritHigh, 0);
        document.getElementById("tempShieldCritMid").innerText = allShields.map(item => item.HCrit).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HCrit, 0);
        document.getElementById("tempShieldCritLow").innerText = allShields.map(item => item.HCritLow).join(" + ") + " = " + allShields.reduce((sum, item) => sum + item.HCritLow, 0);
    } else { 
        ["tempShieldHigh", "tempShieldMid", "tempShieldLow", "tempShieldCritHigh", "tempShieldCritMid", "tempShieldCritLow"].forEach(id => {
            document.getElementById(id).innerText = "0";
        });

    }
    
    // ======== NORMAL MITS ==============
    // update max
    
    const currentDamageType = appState.damageType;
    const calculateMitFactor = (mit) => 1 - (currentDamageType === "physical" ? mit.physicalMit : mit.magicMit);

    const totalMitFactor = normalMits.reduce((acc, mit) => acc * calculateMitFactor(mit), 1);

    if (normalMits.length > 0) {
        const mitListStr = normalMits.map(mit => currentDamageType === "physical" ? mit.physicalMit : mit.magicMit).join(" * ");
        document.getElementById("maxDamage").innerText = `${max} * ${mitListStr} = ${(max * totalMitFactor).toFixed(2)}`;
        document.getElementById("baseDamage").innerText = `${base} * ${mitListStr} = ${(base * totalMitFactor).toFixed(2)}`;
        document.getElementById("minDamage").innerText = `${min} * ${mitListStr} = ${(min * totalMitFactor).toFixed(2)}`;
    } else {
        document.getElementById("maxDamage").innerText = max;
        document.getElementById("baseDamage").innerText = base;
        document.getElementById("minDamage").innerText = min;
    }

    totalPercentMit = Math.round((1 - totalMitFactor) * 10000) / 100;
    document.getElementById("totalMitPercent").innerText = totalPercentMit + "%";
}

function checkVitInput(checkbox, jobId) {
    let shieldsEnabled = document.getElementById("shieldsCheckbox").checked;
    if (!shieldsEnabled) {
        checkbox.disabled = false;
        return;
    }
    let vitalityInput = document.getElementById(jobId + "Vitality");
    if (vitalityInput && vitalityInput.value.trim() !== '') {
        checkbox.disabled = false; 
    } else {
        checkbox.disabled = true;
        if (checkbox.checked) {
            checkbox.checked = false;
            appState.selectedMits.delete(checkbox.value);
            addMit();
        }
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

    let hasBasicStats = mainStatInput?.value.trim() && detInput?.value.trim() && CRTInput?.value.trim() && weaponDamageInput?.value.trim();
    let hasTankStat = !isTank || TNCInput?.value.trim();

    if (hasBasicStats && hasTankStat) {
        checkbox.disabled = false; 
    } else {
        checkbox.disabled = true;
        if (checkbox.checked) {
            checkbox.checked = false;
            appState.selectedMits.delete(checkbox.value);
            addMit();
        }
    }
}


// creates mit list
function updateMit() {
    var availableMits = new Set();

    // get active jobs
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
    var personalsEnabled = checkboxes.enablePersonalMits;
    var shieldsEnabled = checkboxes.enableShields;

    for (let [mitName] of appState.selectedMits) {
        if (!availableMits.has(mitName)) {
            appState.selectedMits.delete(mitName);
        }
    }

    var mitContainer = document.getElementById("mitOptions");
    mitContainer.innerHTML = "";

    // Create checkboxes for each selected job's mit options
    title = document.createElement("h2");
    title.innerText = "Available Mits:";
    mitContainer.appendChild(title);

    availableMits.forEach(mitName => {
        let mitObject = mitOptions.find(m => m.name === mitName);
        if (!mitObject) return;
        

        // Filter from checkboxes
        if (!personalsEnabled && mitObject.mitType === MitType.PERSONAL) return;
        if (!shieldsEnabled && (mitObject.mitType === MitType.PARTYSHIELD || mitObject.mitType === MitType.PERCENTSHIELDPARTY)) return;
        if ((!personalsEnabled || !shieldsEnabled) && (mitObject.mitType === MitType.PERSONALSHIELD || mitObject.mitType === MitType.PERCENTSHIELDPERSONAL)) return;

        // create mit name text
        var label = document.createElement("label");
        label.className = mitName.replace(/\s+/g, '');

        // create checkbox
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = mitName.replace(/\s+/g, '');
        checkbox.value = mitName;
        checkbox.className = "mitOption";

        // Sync with appState
        checkbox.checked = appState.selectedMits.has(mitName);
        
        // update state map on click
        checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
                appState.selectedMits.set(mitName, mitObject);
            } else {
                appState.selectedMits.delete(mitName);
            }
            addMit();
        });

        let rawShield = mitObject.shield ? mitObject.shield : mitObject;
        const hasShield = mitObject.mitType === MitType.PERSONALSHIELD || 
                          mitObject.mitType === MitType.PARTYSHIELD || 
                          (mitObject.shield && (mitObject.shield.mitType === MitType.PERSONALSHIELD || mitObject.shield.mitType === MitType.PARTYSHIELD));

        // grey out checkbox if stats not filled in
        if (hasShield && rawShield.jobs && rawShield.jobs.length === 1) {
            let jobId = rawShield.jobs[0];
            checkbox.disabled = true;

            const inputs = ["mainStatInput", "detInput", "CRTInput", "weaponDamageInput", "TNCInput"];
            inputs.forEach(inputName => {
                let el = document.getElementById(jobId + inputName);
                if (el) el.addEventListener('input', () => checkStatsInput(checkbox, jobId));
            });

            checkStatsInput(checkbox, jobId);
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
        


        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(mitName));
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
        main = main * appState.partyBonus // add party bonus 1.0-1.05
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

function calculateDamage() {
    var damageInput = parseFloat(document.getElementById("mitInput").value) || 0;
    max = damageInput * 1.05;
    min = damageInput * 0.95;
    base = damageInput;
    appState.damageType = document.getElementById("mitDropdown").value.toLowerCase();
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
        appState.partyBonus = 1 + ( bonus / 100)
    } else {
        appState.partyBonus  = 1.0
    }
    document.getElementById("PartyBonus").innerText = appState.partyBonus;

    updateMit()
}

function personalsCheckboxListener(e) {
    checkboxes.enablePersonalMits = e.checked;
    updatePartyList();
    updateMit();
}


document.addEventListener("DOMContentLoaded", () => {
    checkboxes.enableShields = document.getElementById("shieldsCheckbox").checked;
    checkboxes.enablePersonalMits = document.getElementById("personalsCheckbox").checked;
    checkboxes.enableTooMuchInfo = document.getElementById("tooMuchInfoCheckbox").checked;

    for (var i = 0; i < jobs.length; i++) {
        jobs[i].addEventListener("change", updateMit);
    }
    
    createPartyList();

    shieldCheckbox(document.getElementById("shieldsCheckbox"));
    partyBonusListener(document.getElementById("partyBonusCheckbox"));
    tooMuchInfoListener(document.getElementById("tooMuchInfoCheckbox"));

    calculateDamage();

    document.getElementById("mitInput").addEventListener("input", calculateDamage);
    document.getElementById("mitDropdown").addEventListener("change", calculateDamage);
    document.getElementById("shieldsCheckbox").addEventListener("change", (e) => shieldCheckbox(e.target));
    document.getElementById("personalsCheckbox").addEventListener("change", (e) => personalsCheckboxListener(e.target));
    document.getElementById("tooMuchInfoCheckbox").addEventListener("change", (e) => tooMuchInfoListener(e.target));
    document.getElementById("partyBonusCheckbox").addEventListener("change", (e) => partyBonusListener(e.target));
    document.getElementById("partyBonusDropdown").addEventListener("change", () => partyBonusListener(document.getElementById("partyBonusCheckbox")));
});