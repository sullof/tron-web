export default class Promisable {

    constructor() {
        this.injectPromise = Promisable.promiseInjector(this);
    }


    static injectPromiseStatic(func, ...args) {
        return new Promise((resolve, reject) => {
            func(...args, (err, res) => {
                if (err)
                    reject(err);
                else resolve(res);
            });
        });
    }

    static promiseInjector(scope) {
        return (func, preArgs) => {
            let args = [];
            const len = Object.keys(preArgs).length;
            for (let i = 0; i < len; i++) {
                if (i === len - 1 && (typeof preArgs[i.toString()] === 'undefined' || typeof preArgs[i.toString()] === 'function'))
                    break;
                args.push(preArgs[i.toString()]);
            }
            return Promisable.injectPromiseStatic(func.bind(scope), ...args);
        }
    }
}

