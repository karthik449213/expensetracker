import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
    data:T;
    timestamp:number;
    expiresIn:number;//millisecons

}



class CacheService {
    private  prefix ='@expense_cache_';
    async set<T>(key:string,data:T,expiresInMinutes:number=30):Promise<void>{
        const cacheItem:cah
    }
}