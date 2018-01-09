chrome.storage.local.get('show_floating_panel', function (result) {
    document.getElementById("section-111").checked = result.show_floating_panel;
});

chrome.storage.local.get('show_annotations', function (result) {
    document.getElementById("section-112").checked = result.show_annotations;
});

chrome.storage.local.get('automatic_display', function (result) {
    document.getElementById("section-113").checked = result.automatic_display;
});


document.getElementById("section-111").onclick = function() {
    let is_checked = document.getElementById("section-111").checked;

    if (is_checked)
        chrome.storage.local.set({'show_floating_panel': true});
    else
        chrome.storage.local.set({'show_floating_panel': false});
};

document.getElementById("section-112").onclick = function() {
    let is_checked = document.getElementById("section-112").checked;

    if (is_checked)
        chrome.storage.local.set({'show_annotations': true});
    else
        chrome.storage.local.set({'show_annotations': false});
};

document.getElementById("section-113").onclick = function() {
    let is_checked = document.getElementById("section-113").checked;

    if (is_checked)
        chrome.storage.local.set({'automatic_display': true});
    else
        chrome.storage.local.set({'automatic_display': false});
};