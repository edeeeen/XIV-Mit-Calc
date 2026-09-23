var health = {
    "WAR" : 0, 
    "PLD" : 0, 
    "GNB" : 0, 
    "DRK" : 0,
    "WHM" : 0, 
    "AST" : 0, 
    "SCH" : 0,  
    "SGE" : 0,
    "MNK" : 0, 
    "DRG" : 0, 
    "NIN" : 0, 
    "SAM" : 0, 
    "RPR" : 0, 
    "VPR" : 0,
    "BRD" : 0, 
    "MCH" : 0, 
    "DNC" : 0,
    "BLM" : 0, 
    "SMN" : 0, 
    "RDM" : 0, 
    "PCT" : 0
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

        partylist.append(jobDiv);
    })
}

function shieldCheckbox(element) {
    let shieldsInfo = document.getElementById("tempShields");
    checkboxes.enableShields = element.checked;
    
    if (element.checked) {
        if (shieldsInfo) shieldsInfo.style.display = "block";
    } else {
        if (shieldsInfo) shieldsInfo.style.display = "none";
    }

    updatePartyList();
    updateMit();
}

// checks when user types in vitality
function vitalityListener(event, job, lvl = 100) {
    healthElement = document.getElementById(job + "Health");
    if (healthElement) {
        let vitValue = event.target.value;
        healthElement.innerText = healthCalculation(vitValue, job);
    }
    updateMit()
}

// calculate health from vitality
// tank calc is slightly different and off by a bit
function healthCalculation(vitality, job, lvl = 100) {
    // Level base constants
    const baseHP = stats.hp(lvl);       // 4000 at lvl 100
    const baseMain = stats.main(lvl);   // 440 at lvl 100

    // HP modifier lookup
    const hpModifier = getJobAttributeModifier(statsEnum.HP, job);

    // Baseline HP for job at level
    const jobBaseHP = Math.floor((baseHP * hpModifier) / 100);

    const isTank = ["WAR", "PLD", "DRK", "GNB"].includes(job);
    const vitScalar = hpPerVit(lvl, isTank); 
    console.log(vitScalar)

    const bonusHP = Math.floor((vitality - baseMain) * vitScalar);

    // this might not actually work
    if(jobBaseHP + bonusHP < jobBaseHP) {
        health[job] = jobBaseHP;
        return jobBaseHP;
    }

    health[job] = jobBaseHP + bonusHP;

    return jobBaseHP + bonusHP;
}

function updateShields(mit) {

}

function updatePercentShields(mit){

}