import { QueryClient } from 'react-query';
import { createChromeStoragePersistor } from '../storage/createChromeStoragePersistor';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';

export const REACT_QUERY_STORAGE_KEY = `REACT_QUERY_CHROME_STORAGE_LOCAL`;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 1000 * 60 * 60 * 24,
            refetchOnMount: false,
            refetchOnReconnect: false,
            // enabled: false,
        },
    },
});

const localStoragePersistor = createChromeStoragePersistor({
    key: REACT_QUERY_STORAGE_KEY,
});

persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
});

export const invalidateQueries = (queryClient: QueryClient) => {
    queryClient.invalidateQueries('usersList');
};

export default queryClient;
