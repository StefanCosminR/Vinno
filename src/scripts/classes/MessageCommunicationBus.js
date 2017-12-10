class MessageCommunicationBus {

    constructor() {
        this.listeners = {};

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.hasOwnProperty('method')) {
                this.listeners[request.method](sendResponse, request.link, request.content);
            } else {
                this.listeners[request](sendResponse);
            }
        });
    }

    registerListener(request, func) {
        this.listeners[request] = func;
    }


    removeListener(request) {
        delete this.listeners[request];
    }
}