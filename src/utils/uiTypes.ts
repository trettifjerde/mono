export type DropdownOption = {
    id: string,
    text: string
}

export type SelectOptionsConfig<T extends DropdownOption> =  {
    defaultOptions: T[],
    dynamic: false,
} | {
    getOptions: (arg: string) => Promise<T[] | null>,
    dynamic: true
};