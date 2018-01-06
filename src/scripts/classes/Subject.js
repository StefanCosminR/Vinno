class Subject {
    constructor() {
        this._value = undefined;
        this._handlers = [];
    }

    subscribe(fn) {
        this._handlers.push(fn);
        if(this._value) {
            this._trigger();
        }
    }

    next(value) {
        this._value = value;
        this._trigger();
    }

    _trigger() {
        this._handlers.forEach(fn => fn(this._value));
    }
}