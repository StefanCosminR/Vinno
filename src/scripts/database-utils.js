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