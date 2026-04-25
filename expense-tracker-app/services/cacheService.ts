import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
    data:T;
    timestamp:number;
    expiresIn:number;//millisecons

}



class CacheService {
    private  prefix ='@expense_cache_';
    async set<T>(key:string,data:T,expiresInMinutes:number=30):Promise<void>{
       try{
        const cacheItem:CacheItem<T>={
            data,
            timestamp:Date.now(),
            expiresIn:expiresInMinutes * 60 * 100,

        };
        await AsyncStorage.setItem(this.prefix + key,JSON.stringify(cacheItem));

       } catch(error){
         console.error("cahe set error",error);

       }
    }

    async get<T>(key:string): Promise< T | null>{
        try{
            const cached =await AsyncStorage.getItem(this.prefix + key);
            if(!cached) return null;
            const cacheItem:CacheItem<T> =JSON.parse(cached);
            const isExpired = Date.now() - cacheItem.timestamp >cacheItem.expiresIn;
            if(isExpired){
                await this.remove(key);
                return null;

            }
            return cacheItem.data;

        }
        catch(error){
            console.error("cache get error",error);
            return null;
        }
    }

    async remove(key:string):Promise<void>{
        try{
            await AsyncStorage.removeItem(this.prefix + key);

        }
        catch(error){
            console.error('cache  remove error',error);

        }
    }
    async clear():Promise<void>{
        try{
            const keys=await AsyncStorage.getAllKeys();
            const cachekeys=keys.filter(key=>key.startsWith(this.prefix));
            await AsyncStorage.multiRemove(cachekeys);

        }
        catch(error){
            console.error('ccache caler aerror',error);

        }
    }
}


export const cacheService= new CacheService();
