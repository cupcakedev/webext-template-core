import Demo from '../components/Demo'
import { RouteInterface } from '../../interfaces'

const isSearchPage = (pathname: string) =>{
    if(pathname && (pathname === 's' || pathname === '/s')){
        return {}
    }
}

export const routes:RouteInterface[] = [
    // { pattern: isSearchPage, component: () => SearchPage }, // amazon search page
    { pattern: '/demo', component: () => Demo}, // product page
]