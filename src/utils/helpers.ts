export function makeAbsolutePath(...keys: string[]) {
    return encodeURI(`/${keys.join('/')}`);
}