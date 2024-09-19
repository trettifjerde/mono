import { FirestoreQueryParams } from "./dataTypes";
import { FirestoreKeys } from "./firestoreDbTypes";
import { NAME_FILTER_CONSTRAINTS_PARTS } from "./consts";

export function makeAbsolutePath(...keys: string[]) {
    return encodeURI(`/${keys.join('/')}`);
}

export function splitAndWrapInPs(str: string) {
    return str.split('\n').map((par, i) => <p key={i}>{par}</p>);
}

export function getCleanValue(input: HTMLInputElement) {
    return input.value.trim().toLowerCase();
}

export function updateSearchParams(params: URLSearchParams, key: string, value?: string) {
    const updParams = new URLSearchParams(params);
    // console.log(params);

    if (value)
        updParams.set(key, value);
    else
        updParams.delete(key);

    return updParams;
}

export function makeNameFilter<P>(value: string) : FirestoreQueryParams<P>['filters'] {
    return NAME_FILTER_CONSTRAINTS_PARTS
    .map(({op, makeValue}) => ({
        field: FirestoreKeys.name_lowercase,
        op,
        value: makeValue(value)
    }))
}