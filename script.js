var jobs = document.getElementsByClassName("jobCheckbox");
var mitOptions = []
var damageType = "Physical";

var max = 0
var min = 0
var base = 0

const hasPotencyShields = ["WAR", "PLD", "SGE", "SCH", "AST", "WHM"]


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
    var { shields, normalMits } = selectedMitObjects.reduce((acc, mit) => {
        if (mit.mitType === MitType.PARTYSHIELD || mit.mitType === MitType.PERSONALSHIELD) {
            acc.shields.push(mit);
        } else {
            acc.normalMits.push(mit);
        }
        return acc;
    }, { shields: [], normalMits: [] });


    // ======== SHIELD MITS ==============
    potency = 0;
    let allShields = []
    if(shields.length > 0 ) {
        // sort in consumption prio
        shields.sort((a, b) => {
            let indexA = consumtionPriority.indexOf(a.name);
            let indexB = consumtionPriority.indexOf(b.name);

            if (indexA === -1) indexA = Infinity;
            if (indexB === -1) indexB = Infinity;

            return indexA - indexB;
        });

        shields.forEach( mit => {
            if(mit.potency > 0) {
                // if its based off of potency
                healingValue = getShieldValue(mit);
                actualShield = Object.fromEntries(
                    Object.entries(healingValue).map(([key, value]) => [key, Math.round(value * mit.multiplier)])
                );
                allShields.push(actualShield);
            } else {
                // if its based off of percent
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

function healthCalculation(vitality, job, lvl = 100) {
    // Level base constants
    const baseHP = stats.hp(lvl);       // 4400 at lvl 100
    const baseMain = stats.main(lvl);   // 440 at lvl 100

    // HP modifier lookup
    const hpModifier = getJobAttributeModifier(statsEnum.HP, job);

    // Baseline HP for job at level
    const jobBaseHP = Math.floor((baseHP * hpModifier) / 100);

    const isTank = ["WAR", "PLD", "DRK", "GNB"].includes(job);
    const vitScalar = hpPerVit(lvl, isTank); 

    const bonusHP = Math.floor((vitality - baseMain) * vitScalar);

    return jobBaseHP + bonusHP;
}

function vitalityListener(event, job, lvl = 100) {
    healthElement = document.getElementById(job + "Health");
    if (healthElement) {
        let vitValue = event.target.value;
        healthElement.innerText = healthCalculation(vitValue, job);
    }
}

function updatePartyList() {
    let partylist = document.getElementById("partyList");

    for (let j = 0; j < jobs.length; j++) {
        let job = jobs[j];
        if (!job) continue;
        
        let jobId = job.id;

        if (job.checked && !document.getElementById(jobId + "PartyList")) {
            let jobDiv = document.createElement("div");
            jobDiv.id = jobId + "PartyList";

            let jobName = document.createElement("h3");
            jobName.innerText = jobId;
            jobDiv.append(jobName);

            let healthText = document.createElement("p");
            healthText.innerText = "Health: ";

            let health = document.createElement("span");
            health.innerText = "0";
            health.id = jobId + "Health";
            healthText.append(health);
            jobDiv.append(healthText);

            let vitalityP = document.createElement("p");
            vitalityP.innerText = "Vitality ";

            let vitalityInput = document.createElement("input");
            vitalityInput.type = "number";
            vitalityInput.id = jobId + "Vitality";
            
            vitalityInput.addEventListener("input", (e) => vitalityListener(e, jobId));

            vitalityP.append(vitalityInput);
            jobDiv.append(vitalityP);
            

            // need to check which of these is actually needed

            mainStatP = document.createElement("p")
            mainStatP.innerText = "Main Stat "
            mainStatInput = document.createElement("input")
            mainStatInput.id = jobId + "mainStatInput"
            mainStatP.append(mainStatInput)
            mainStatP.id = "mainStat"
            jobDiv.append(mainStatP)
            
            // none of this needs to exist for jobs that dont have potency shields
            if(hasPotencyShields.includes(jobId)) {
                det = document.createElement("p")
                det.innerText = "DET"
                detInput = document.createElement("input")
                detInput.id = jobId + "Det"
                det.append(detInput)
                det.id = "det"
                jobDiv.append(det)
                

                // only show if tank
                let tanks = ["WAR", "PLD", "DRK", "GNB"]
                if(tanks.includes(jobId)) {
                    TNC = document.createElement("p")
                    TNC.innerText = "TNC"
                    TNCInput = document.createElement("input")
                    TNCInput.id = jobId+"TNCInput"
                    TNC.append(TNCInput)
                    TNC.id = "TNC"
                    jobDiv.append(TNC)
                }
                
                

                CRT = document.createElement("p")
                CRT.innerText = "CRT"
                CRTInput = document.createElement("input")
                CRTInput.id = jobId + "CRTInput"
                CRT.append(CRTInput)
                CRT.id = "CRT"
                jobDiv.append(CRT)
            

                weaponDamage = document.createElement("p")
                weaponDamage.innerText = "WD"
                weaponDamageInput = document.createElement("input")
                weaponDamageInput.id = jobId + "weaponDamageInput"
                weaponDamage.append(weaponDamageInput)
                weaponDamage.id = "weaponDamage"
                jobDiv.append(weaponDamage)
            }
            
            partylist.append(jobDiv);
        }
        if (!jobs[j].checked && document.getElementById(jobs[j].id+"PartyList")) {
            document.getElementById(jobs[j].id+"PartyList").remove()
        }
    }
}



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
        if(!shieldsEnabled && mitOptions.find(m => m.name === mit).mitType === MitType.PARTYSHIELD) {
            return
        }
        if((!personalsEnabled || !shieldsEnabled) && (mitOptions.find(m => m.name === mit).mitType === MitType.PERSONALSHIELD)) {
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
        var label = document.createElement("label");
        label.htmlFor = mit;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(mit));
        mitContainer.appendChild(label);
    });

    addMit();
}

function getShieldValue(mit) {
    job = mit.jobs[0];
    console.log(job)
    potency = mit.potency;
    mainStatVal = parseInt(document.getElementById(job+"mainStatInput").value);
    det = parseInt(document.getElementById(job+"Det").value);
    tnc = 400
    let tanks = ["WAR", "PLD", "DRK", "GNB"]
    if(tanks.includes(job)) { 
        tnc = parseInt(document.getElementById(job+"TNCInput").value);
    }
    crt = parseInt(document.getElementById(job+"CRTInput").value);
    wd  = parseInt(document.getElementById(job+"weaponDamageInput").value);
    return calculateShields(potency, mainStatVal, det, tnc, crt, wd, job)
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

// https://docs.google.com/spreadsheets/d/1YAuklyu4IJCFUdk1KERmCP0F_SRkhJpSRvU0hazStj0/edit?gid=2139215610#gid=2139215610
// Caro is the goat
function calculateShields(potency, main, det, tnc, crit, wd, job = "SCH", lvl = 100) {
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

for (var i = 0; i < jobs.length; i++) {
    jobs[i].addEventListener("change", (e) => {
        updateMit(e)
    });
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



document.addEventListener("DOMContentLoaded", () => {
    updateMit()
});