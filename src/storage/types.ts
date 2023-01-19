export type StringEnumType = Record<string | number | symbol, string>;
export type StorageDataType = Record<string, any>;
export type StorageKeyType<S extends StorageDataType> = string & keyof S;
export type StorageArea = 'local' | 'sync';
export type StorageUpdate<S extends StorageDataType> = {
    [Key in keyof S]?: {
        newValue?: S[Key] | '';
        oldValue?: S[Key] | '';
    };
};

export type Getter<S extends StorageDataType> = <
    Key extends StorageKeyType<S> | StorageKeyType<S>[]
>(
    keys: Key
) => Key extends StorageKeyType<S>
    ? Promise<S[Key]>
    : Promise<Pick<S, Key[number]>>;

export type Setter<S extends StorageDataType> = <
    KeyOrItems extends StorageKeyType<S> | Partial<S>
>(
    ...args: KeyOrItems extends StorageKeyType<S>
        ? [key: KeyOrItems, value: S[KeyOrItems] | undefined]
        : [items: KeyOrItems]
) => Promise<boolean>;

export type Remover<S extends StorageDataType> = (
    keys: StorageKeyType<S> | StorageKeyType<S>[]
) => Promise<boolean>;

export type StorageAreaApi<S extends StorageDataType> = {
    get: Getter<S>;
    set: Setter<S>;
    remove: Remover<S>;
    clear: () => Promise<unknown>;
};

export type Storage<
    LocalStorageData extends StorageDataType,
    SyncStorageData extends StorageDataType
> = {
    local: StorageAreaApi<LocalStorageData>;
    sync: StorageAreaApi<SyncStorageData>;
    any: StorageAreaApi<LocalStorageData & SyncStorageData>;
};
