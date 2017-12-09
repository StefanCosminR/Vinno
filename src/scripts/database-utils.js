function saveToTable(table, data) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(table, function (db) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else {
                let obj = {};
                obj[table] = [];

                if ((Object.keys(db).length === 0 && db.constructor === Object)) {
                    obj[table].push(data);
                } else {
                    obj[table] = [...db[table], data];
                }

                chrome.storage.local.set(obj, function () {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

function getAnnotationsFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('annotations', function (ann) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(ann);
            }
        })
    });
}

function saveToFirebase(link, content) {
    chrome.runtime.sendMessage({method: 'POST', link, content}, function (response) {
        console.log(response);
    });
}

function getFromFirebase(link) {
    chrome.runtime.sendMessage({method: 'GET', link}, function (response) {
        console.log(response);
    });}