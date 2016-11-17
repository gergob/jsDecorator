// this is the function we will decorate with different capabilities.
function isPrime(num) {
    if (num === 2 || num === 3) {
    	return true;
    }
    if (num % 2 === 0) {
    	return false;
    }
    let max = Math.ceil(Math.sqrt(num));
    for (let i = 3; i <= max; i += 2) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

// utility to make nice looking argument lists.
function formatArguments(args) {
	let params = JSON.stringify(Array.prototype.slice.call(args));
    return params.substr(1, params.length-2);
}

// utility to dynamically rename a function.
function renameFunction(func, name) {
    Object.defineProperty(func, 'name', { value: name });
    return func;
}

// decorator to log function calls with arguments, result and time.
function logDecorator(func) {
    let decorated = function () {
        let params = formatArguments(arguments),
            start = performance.now(),
            result = func.apply(this, arguments),
            time = Math.round((performance.now() - start) * 1000);
        console.log(`${decorated.name}(${params}) => ${result} (${time} μs)`);
        return result;
    };
    return renameFunction(decorated, func.name + 'Log');
}

// decorator to cache and reuse previous results
function memoDecorator(func) {
    let cache = {},
        decorated = function () {
            let params = formatArguments(arguments);
            if (params in cache) {
                return cache[params];
            } else {
                const result = func.apply(this, arguments);
                cache[params] = result;
                return result;
            }
        };
    return renameFunction(decorated, func.name + 'Memo');
}

// try it out.
// create one with just logging, and another one with logging and memoization
let isPrimeLog = logDecorator(isPrime),
    isPrimeMemoLog = logDecorator(memoDecorator(isPrime));

let num = 22586101147;
console.clear();
console.log('Normal:');
isPrimeLog(num);
isPrimeLog(num);
isPrimeLog(num);
console.log('Memoized:');
isPrimeMemoLog(num);
isPrimeMemoLog(num);
isPrimeMemoLog(num);
