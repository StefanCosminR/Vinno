document.getElementById("section-111").onclick = function() {
    let is_checked = document.getElementById("section-111").checked;

    if (is_checked)
        chrome.storage.local.set({'show_floating_panel': true});
    else
        chrome.storage.local.set({'show_floating_panel': false});
};

document.getElementById("section-112").onclick = function() {
    let is_checked = document.getElementById("section-111").checked;

    if (is_checked)
        chrome.storage.local.set({'show_annotations': true});
    else
        chrome.storage.local.set({'show_annotations': false});
};

document.getElementById("section-113").onclick = function() {
    let is_checked = document.getElementById("section-111").checked;

    if (is_checked)
        chrome.storage.local.set({'automatic_display': true});
    else
        chrome.storage.local.set({'automatic_display': false});
};