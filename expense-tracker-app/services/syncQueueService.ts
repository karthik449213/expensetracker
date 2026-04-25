/**
 * creating a sync queue to store the failed sync operations when the user is offline. The queue will be stored in the local storage and will be processed when the user comes back online.
 * 
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
 import NetInfo from '@react-native-community/netinfo';

 interface QueuedRequest {
    id:string;
    method : string;
    endpoint:string;
    data:any;
    timestamp:number;
    retries:number;

 }

 class SyncQueueService{
    private queue:QueuedRequest[]=[];
    private isSyncing=false;
    private maxRetries =3;
    async addToQueue(method:string,endpoint:string,data:any):Promise<void>{
        const request:QueuedRequest={
            id:`${Date.now()}_${Math.random()}`,
            method,
            endpoint,
            data,
            timestamp:Date.now(),
            retries:0,
        };
        this.queue.push(request);
        await this.persistQueue();
        //try to sync if connected 
        const state =await NetInfo.fetch();
        if(state.isConnected){
            this.sync();

        }

    }
    async sync():Promise<void>{
        if(this.isSyncing || this.queue.length === 0) return;

        this.isSyncing =true;
        for( let i =0;i<this.queue.length;i++){
            const request =this.queue[i];
            try {
                await this.executeRequest(request);
                this.queue.splice(i,1);
                i--;

            }
            catch(error){
                request.retries++;

                if(request.retries >= this.maxRetries){
                    console.error(`Failed to sync after ${this.maxRetries} retries:`,request);
                    this.queue.splice(i,1);
                    i--;
                }
            }
        }

          await this.persistQueue();
          this.isSyncing =false;


    }

    private async executeRequest(request:QueuedRequest):Promise<void>{
        // implement actual API call
        const apiClient =require('./api').default;
        await apiClient({
            method:request.method,
            url:request.endpoint,
            data:request.data,

        });

    }

    private async persistQueue(): Promise<void>{
        try{
            await AsyncStorage.setItem('@sync_queue',JSON.stringify(this.queue));

        }
        catch(error){
            console.error('queue persist errro',error);

        }
    }
    async loadQueue():Promise<void>{
        try{
            const stored = await AsyncStorage.getItem('@sync_queue');
            if(stored){
                this.queue =JSON.parse(stored);

            }
        }
        catch(error){
            console.error('Queue load error',error);

        }
    }
    getQueueSize():number{
        return this.queue.length;

    }


 }

 export const syncQueueService = new SyncQueueService();