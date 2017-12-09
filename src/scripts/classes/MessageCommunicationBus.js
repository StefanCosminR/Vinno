class MessageCommunicationBus {

    constructor() {
        this.listeners = {};

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.hasOwnProperty('method')) {
                this.listeners[request.method](request.link, request.content, sendResponse);
            } else {
                this.listeners[request](request.link, sendResponse);
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