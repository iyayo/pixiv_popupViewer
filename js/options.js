const popupWidth = document.getElementById("popupWidth");
const popupHeight = document.getElementById("popupHeight");
const mobileView = document.getElementById("mobileView");

function restore(){
    chrome.storage.local.get(["options"], items => {
        if (items.options.popupWidth !== undefined) popupWidth.value = items.options.popupWidth;
        if (items.options.popupHeight !== undefined) popupHeight.value = items.options.popupHeight;
        if (items.options.mobileView !== undefined) mobileView.checked = items.options.mobileView;
    })
}

function save() {
    chrome.storage.local.set({"options": 
    {
        "popupWidth": popupWidth.value,
        "popupHeight": popupHeight.value,
        "mobileView": mobileView.checked
    }
    })
    updateRulesets(mobileView.checked);
}

function updateRulesets(status) {
    if (status) chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["ruleset"]});
    else if (!status) chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: ["ruleset"]});
}

restore();

document.querySelectorAll("input").forEach(element => {
    element.onchange = save;
});