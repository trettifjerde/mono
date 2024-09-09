export function makeAbsolutePath(...keys: string[]) {
    return encodeURI(`/${keys.join('/')}`);
}

export function getSkeletonClassIfNeeded(skeleton: boolean) {
    return skeleton ? 'shimmer' : '';
}

export function splitAndWrapInPs(str: string) {
    return str.split('\n').map((par, i) => <p key={i}>{par}</p>);
}