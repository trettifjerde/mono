import { orderBy, where } from "firebase/firestore/lite";
import { FirestoreKeys as FK } from "./firestoreDbTypes";
import Entity from "./classes/Entity";

export function makeAbsolutePath(...keys: Array<string|undefined>) {
    return encodeURI(`/${keys.filter(k => !!k).join('/')}`);
}

export function splitAndWrapInPs(str: string) {
    return str.split('\n').map((par, i) => <p key={i}>{par}</p>);
}

export function getCleanLCValue(input: HTMLInputElement) {
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

export function getNameFilterConfig<E extends Entity>() {
    return {
        initialValue: '',
        makeConstraints: (nameStart: string) =>({
            filters: [
                where(FK.name_lowercase, '>=', nameStart),
                where(FK.name_lowercase, '<=', `${nameStart}\uf8ff`)
            ],
            sort: orderBy(FK.name_lowercase)
        }),
        makeFilterFn: (nameStart: string) => (ent: E) => ent.previewInfo[FK.name_lowercase].startsWith(nameStart)
    }
}