var jobs = document.getElementsByClassName("jobCheckbox");
var mitOptions = []
var damageType = "Physical";

var max = 0
var min = 0
var base = 0

const hasPotencyShields = ["SGE", "SCH", "AST", "WHM"]
const hasSingleTargetPotencyShields = ["WAR", "PLD"]


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
    });

    console.log(shields)


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

// calculate health from vitality
// tank calc is slightly different and off by a bit
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
    console.log(vitScalar)

    const bonusHP = Math.floor((vitality - baseMain) * vitScalar);

    return jobBaseHP + bonusHP;
}

// checks when user types in vitality
function vitalityListener(event, job, lvl = 100) {
    healthElement = document.getElementById(job + "Health");
    if (healthElement) {
        let vitValue = event.target.value;
        healthElement.innerText = healthCalculation(vitValue, job);
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
        
        // can be less jank if i fix this whole function
        let mitObject = mitOptions.find(m => m.name === mit);
        extraMit = mitObject.shield;
        extraMitType = null;
        if(extraMit != null) {
            extraMitType = extraMit.mitType;
        }
        if( (mitObject.mitType === MitType.PERSONALSHIELD || mitObject.mitType === MitType.PARTYSHIELD 
            || extraMitType === MitType.PERSONALSHIELD || extraMitType === MitType.PARTYSHIELD) && mitObject.jobs.length == 1) {
            console.log(mit)
        }

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
    det = parseInt(document.getElementById(job+"detInput").value);
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


function updatePartyList() {
    let partylist = document.getElementById("partyList");

    for (let j = 0; j < jobs.length; j++) {
        let job = jobs[j];
        if (!job) continue;
        
        let jobId = job.id;

        jobDiv = document.getElementById(jobId + "PartyList")

        if (job.checked && document.getElementById(jobId + "PartyList")) {         
            jobDiv = document.getElementById(jobId + "PartyList")
            jobDiv.style.display = "flex"

            let mainStatInput = document.getElementById(jobId + "mainStatInput")
            let mainStatP = document.getElementById(jobId + "mainStat")
            let detInput = document.getElementById(jobId + "detInput")
            let det = document.getElementById(jobId + "det")
            let CRTInput = document.getElementById(jobId + "CRTInput")
            let CRT = document.getElementById(jobId + "CRT")
            let weaponDamageInput = document.getElementById(jobId + "weaponDamageInput")
            let weaponDamage = document.getElementById(jobId + "weaponDamage")
            let TNCInput = document.getElementById(jobId + "TNCInput")
            let TNC = document.getElementById(jobId + "TNC")


            // show/hide tank stats based off of personals checkbox (only jobs with personal potency shields)
            if(document.getElementById("personalsCheckbox").checked && hasSingleTargetPotencyShields.includes(jobId)) {
                if (mainStatP) mainStatP.style.display = "flex";
                if (mainStatInput) mainStatInput.style.display = "flex";
                if (detInput) detInput.style.display = "flex";
                if (det) det.style.display = "flex";
                if (CRTInput) CRTInput.style.display = "flex";
                if (CRT) CRT.style.display = "flex";
                if (weaponDamageInput) weaponDamageInput.style.display = "flex";
                if (weaponDamage) weaponDamage.style.display = "flex";
                if (TNC) TNC.style.display = "flex";
                if (TNCInput) TNCInput.style.display = "flex";
            } else if (!document.getElementById("personalsCheckbox").checked && hasSingleTargetPotencyShields.includes(jobId)) {
                if (mainStatP) mainStatP.style.display = "none";
                if (mainStatInput) mainStatInput.style.display = "none";
                if (detInput) detInput.style.display = "none";
                if (det) det.style.display = "none";
                if (CRTInput) CRTInput.style.display = "none";
                if (CRT) CRT.style.display = "none";
                if (weaponDamageInput) weaponDamageInput.style.display = "none";
                if (weaponDamage) weaponDamage.style.display = "none";
                if (TNCInput) TNCInput.style.display = "none";
                if (TNC) TNC.style.display = "none";
            }
            // show/hide healer/tank stats based off of shield checkbox
            if(document.getElementById("shieldsCheckbox").checked && (hasPotencyShields.includes(jobId))) {
                if (mainStatP) mainStatP.style.display = "flex";
                if (mainStatInput) mainStatInput.style.display = "flex";
                if (detInput) detInput.style.display = "flex";
                if (det) det.style.display = "flex";
                if (CRTInput) CRTInput.style.display = "flex";
                if (CRT) CRT.style.display = "flex";
                if (weaponDamageInput) weaponDamageInput.style.display = "flex";
                if (weaponDamage) weaponDamage.style.display = "flex";
            } else if (!document.getElementById("shieldsCheckbox").checked && (hasPotencyShields.includes(jobId) || hasSingleTargetPotencyShields.includes(jobId))) {
                if (mainStatP) mainStatP.style.display = "none";
                if (mainStatInput) mainStatInput.style.display = "none";
                if (detInput) detInput.style.display = "none";
                if (det) det.style.display = "none";
                if (CRTInput) CRTInput.style.display = "none";
                if (CRT) CRT.style.display = "none";
                if (weaponDamageInput) weaponDamageInput.style.display = "none";
                if (weaponDamage) weaponDamage.style.display = "none";
                if (TNCInput) TNCInput.style.display = "none";
                if (TNC) TNC.style.display = "none";
            }


        } else {
            jobDiv.style.display = "none"
        }
    }
}

function createPartyList() {
    let partylist = document.getElementById("partyList");

    jobsOrder.forEach((job)=> {
    
        let jobDiv = document.createElement("div");
        jobDiv.id = job + "PartyList";

        let jobName = document.createElement("h3");
        jobName.innerText = job;
        jobDiv.append(jobName);

        let healthText = document.createElement("p");
        healthText.innerText = "Health: ";

        let health = document.createElement("span");
        health.innerText = "0";
        health.id = job + "Health";
        healthText.append(health);
        jobDiv.append(healthText);

        let vitalityP = document.createElement("p");
        vitalityP.innerText = "Vitality ";

        let vitalityInput = document.createElement("input");
        vitalityInput.type = "number";
        vitalityInput.id = job + "Vitality";
        
        vitalityInput.addEventListener("input", (e) => vitalityListener(e, job));

        vitalityP.append(vitalityInput);
        jobDiv.append(vitalityP);

        
        
        // none of this needs to exist for jobs that dont have potency shields
        
        mainStatP = document.createElement("p")
        mainStatP.innerText = "Main Stat "
        mainStatInput = document.createElement("input")
        mainStatInput.id = job + "mainStatInput"
        mainStatP.id =  job +  "mainStat"

        det = document.createElement("p")
        det.innerText = "DET"
        detInput = document.createElement("input")
        detInput.id = job + "detInput"
        det.id =  job +  "det"

        TNC = document.createElement("p")
        TNC.innerText = "TNC"
        TNCInput = document.createElement("input")
        TNCInput.id = job+"TNCInput"
        TNC.id =  job + "TNC"

        CRT = document.createElement("p")
        CRT.innerText = "CRT"
        CRTInput = document.createElement("input")
        CRTInput.id = job + "CRTInput"
        CRT.id =  job + "CRT"

        weaponDamage = document.createElement("p")
        weaponDamage.innerText = "WD"
        weaponDamageInput = document.createElement("input")
        weaponDamageInput.id = job + "weaponDamageInput"
        weaponDamage.id =  job + "weaponDamage"

        TNCInput.style.display = "none"
        TNC.style.display = "none"
        
        if(!hasPotencyShields.includes(job)) {
            mainStatInput.style.display = "none"
            mainStatP.style.display = "none"
            detInput.style.display = "none"
            det.style.display = "none"
            CRTInput.style.display = "none"
            CRT.style.display = "none"
            weaponDamageInput.style.display = "none"
            weaponDamage.style.display = "none"
        }
        // only show if tank
        if(document.getElementById("personalsCheckbox").checked && hasSingleTargetPotencyShields.includes(job)) {
            mainStatInput.style.display = "flex"
            mainStatP.style.display = "flex"
            detInput.style.display = "flex"
            det.style.display = "flex"
            CRTInput.style.display = "flex"
            CRT.style.display = "flex"
            weaponDamageInput.style.display = "flex"
            weaponDamage.style.display = "flex"
            TNCInput.style.display = "flex"
            TNC.style.display = "flex"
        }
        mainStatP.append(mainStatInput)
        jobDiv.append(mainStatP)
        det.append(detInput)
        jobDiv.append(det)
        TNC.append(TNCInput)
        jobDiv.append(TNC)
        CRT.append(CRTInput)
        jobDiv.append(CRT)
        weaponDamage.append(weaponDamageInput)
        jobDiv.append(weaponDamage)

        if(!job.checked) {
            jobDiv.style.display = "none"
        }


        // jobDiv.style.display = "none"

        partylist.append(jobDiv);
        
    })
        
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
    document.getElementById("mitInput").addEventListener("input", calculateDamage)
    document.getElementById("mitDropdown").addEventListener("input", calculateDamage)
    document.getElementById("personalsCheckbox").addEventListener("input", updatePartyList)
});