export type StringEnumType = Record<string | number | symbol, string>;
export type StorageType = Record<string, any>;
export type StorageKeyType<S extends StorageType> = string & keyof S;
export type StorageArea = 'local' | 'sync';
export type StorageUpdate<S extends StorageType> = {
    [Key in keyof S]?: {
        newValue: S[Key] | '';
        oldValue: S[Key] | '';
    };
};
