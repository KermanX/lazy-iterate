import {LazyIterator, injectLazyIterator} from "./index.js";


//export class Addon<T,TReturn,TNext> extends LazyIterator<T,TReturn,TNext>
declare module "./index.js"{
    interface LazyIterator<T,TReturn,TNext>{
        foo():number;
    }
}

injectLazyIterator("foo",function(){
    return this.currentPos;
})

const v=LazyIterator.from([1,1,4,5,1,4]);
const v2 =v.map(v=>v.toString(),(v)=>{v});

for(const i of v2){
    i+1;
}