import { DropdownOption, SelectOptionsConfig } from "../utils/types";

enum BookSortingOptions {
    Name = "Title",
    Author = "Author",
    Price = "Price",
};

enum AuthorSortingOptions {
    Name = "Last name",
    NumberOfBooks = "Number of published books"
}

export const bookSortingConfig: SelectOptionsConfig<DropdownOption> = {
    dynamic: false,
    defaultOptions: Object
        .entries(BookSortingOptions)
        .map(([name, value]) => ({
            text: name,
            id: value
        }))
};

export const authorSortingConfig: SelectOptionsConfig<DropdownOption> = {
    dynamic: false,
    defaultOptions: Object
        .entries(AuthorSortingOptions)
        .map(([value, name]) => ({
            text: name,
            id: value
        }))
};

export const authorFilterConfig: SelectOptionsConfig<DropdownOption> = {
    dynamic: true,
    getOptions: (initArg: string) => new Promise<DropdownOption[]|null>((resolve) => {
        if (!initArg)
            resolve(null);

        setTimeout(() => {
            const dummyData = [
                { text: 'Meow', id: '1' },
                { text: 'Woof', id: '2' }
            ];
            console.log('resolving author results');
            resolve(dummyData.filter(item => item.text.toLowerCase().includes(initArg)));
        }, 2000);
    })
};
