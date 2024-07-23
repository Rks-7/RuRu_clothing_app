
export const loadState=(key:string)=>{
    try {
        const serialisedstate=localStorage.getItem(key);
        if(serialisedstate==null)return undefined;
        return JSON.parse(serialisedstate);
    } catch (error) {
        console.error("Could not load state", error);
        return undefined;
    }
}

export const saveState=(key:string,state:any)=>{
    try {
        const serialisedstate=JSON.stringify(state);
        localStorage.setItem(key,serialisedstate);
    } catch (error) {
        console.error("Could not save state", error);
    }
}

export const clearState=(key:string)=>{
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Could not clear state", error);
    }
}