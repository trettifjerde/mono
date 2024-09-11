export function makeAbsolutePath(...keys: string[]) {
    return encodeURI(`/${keys.join('/')}`);
}

export function getSkeletonClassIfNeeded(skeleton: boolean) {
    return skeleton ? 'shimmer' : '';
}

export function splitAndWrapInPs(str: string) {
    return str.split('\n').map((par, i) => <p key={i}>{par}</p>);
}

export function getCleanValue(input: HTMLInputElement) {
    return input.value.trim().toLowerCase();
}

export function updateSearchParams(params: URLSearchParams, key: string, value?: string) {
    const updParams = new URLSearchParams(params);
    console.log(params);

    if (value)
        updParams.set(key, value);
    else
        updParams.delete(key);

    return updParams;
}

export function decrementStr(str: string) {
    const decrementedLastChar = String.fromCharCode(str.charCodeAt(str.length - 1) - 1);
    return str.slice(0, -1) + decrementedLastChar;
}

export function incrementStr(str: string) {
    return `${str} `
}