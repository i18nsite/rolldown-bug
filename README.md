# Table of Contents

- [Issues with rolldown 1.0.0-beta.42](#issues-with-rolldown-100-beta42)
  - [Issue 1: Incomplete Tree Shaking](#issue-1-incomplete-tree-shaking)
  - [Issue 2: `/*@__NO_SIDE_EFFECTS__*/` Not Working](#issue-2-no_side_effects-not-working)

- [rolldown 1.0.0-beta.42 的几个问题](#rolldown-100-beta42-的几个问题)
  - [问题1：摇树优化没有摇彻底](#问题1摇树优化没有摇彻底)
  - [问题2：`/*@__NO_SIDE_EFFECTS__*/` 没有生效](#问题2no_side_effects-没有生效)

<h1 id="issues-with-rolldown-100-beta42">Issues with rolldown 1.0.0-beta.42</h1>

1.  Tree shaking is not complete. Running it a second time removes more code. It is recommended that the tree shaking process continues internally until it stabilizes before returning the result.
2.  `/*@__NO_SIDE_EFFECTS__*/` is not working.

To reproduce, see the repository:

```
git clone https://github.com/i18nsite/rolldown-bug.git
```

Below is the test code:

```js
#!/usr/bin/env bun

import { rolldown } from "rolldown"
// import read from "@3-/read"
import write from "@3-/write"

const treeshake = async (input, manualPureFunctions) => {
  const {
    output: [{ code }],
  } = await (
    await rolldown({
      input,
      treeshake: {
        preset: "smallest",
        unknownGlobalSideEffects: false,
        moduleSideEffects: false,
        manualPureFunctions,
      },
    })
  ).generate({
    format: "esm",
    minify: {
      compress: {
        target: "esnext",
      },
      mangle: {
        toplevel: false,
      },
    },
  })
  // , src = read(input)
  // if (code !== src) {
  //   write(input, code)
  //   return treeshake(input)
  // }
  return code
}

const t1 = await treeshake("tree_shaking_decode.js");
console.log('# first time treeshake : ' + t1.length + ' bytes\n\n```\n' + t1 + '\n```\n')

write('t1.js', t1)
const t2 = await treeshake("t1.js");
console.log('# second time treeshake : ' + t2.length + ' bytes\n\n```\n' + t2 + '\n```\n')

const t3 = await treeshake("t1.js", ['$']);
console.log('# treeshake with manualPureFunctions : ' + t3.length + ' bytes\n\n```\n' + t3 + '\n```\n')
```

Output:

# first time treeshake : 3171 bytes

```
const set_=(_,G)=>(_._=G,_),liDecode=G=>set_(_=>{let K=[],q=_.length,J=0;for(;J<q;){let[q,Y]=G(_,J);K.push(q),J=Y}return K},[]),v0_0=G=>set_(v0(G),0),v0=_=>G=>_(G,0)[0],TEXT=new TextDecoder,utf8d=TEXT.decode.bind(TEXT),get=(_,G)=>(G=`get`+G,(K,q=0)=>[new DataView(K.buffer,K.byteOffset+q,_)[G](0,!0),q+_]),varintLen=(_,G)=>{let K=_.length;for(;G<K;)if(!(_[G++]&128))return G;return G},readTag=(_,G)=>{let K=_.length,q=0,J=0,Y;for(;G<K;){if(Y=_[G],q|=(Y&127)<<J,G++,!(Y&128))return[q&7,q>>>3,G];if(J+=7,J>28)return}},unpack=_=>{let G=[],K=_.length,q=0,J;for(;q<K&&(J=readTag(_,q),J);){let[K,Y,X]=J;q=X;let Z,Q=q;switch(K){case 0:Z=varintLen(_,q);break;case 1:Z=q+8;break;case 2:{let[G,K]=decodeVarint32(_,q);Q=K,Z=K+G;break}case 5:Z=q+4;break;default:return G}G.push([Y-1,_.subarray(Q,Z)]),q=Z}return G},decodeVarint32=(_,G=0)=>{let K=0,q=0,J;do J=_[G++],K|=(J&127)<<q,q+=7;while(J&128);return[K>>>0,G]},decodeFixed32=get(4,`Uint32`),decodeFloat=get(4,`Float32`),decodeSfixed32=get(4,`Int32`),decodeDouble=get(8,`Float64`),decodeFixed64=get(8,`BigUint64`),decodeSfixed64=get(8,`BigInt64`),decodeVarint64=(_,G=0)=>{let K=0n,q=0n,J;do J=_[G++],K|=BigInt(J&127)<<q,q+=7n;while(J&128);return[K,G]},decodeUint32=decodeVarint32,decodeSint32=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[K>>>1^-(K&1),q]},decodeBool=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[!!K,q]},decodeInt64Based=_=>(G,K)=>{let[q,J]=decodeVarint64(G,K);return[Number(_(q)),J]},decodeInt32=decodeInt64Based(BigInt.asIntN.bind(BigInt,32)),decodeInt64=decodeInt64Based(BigInt.asIntN.bind(BigInt,64)),decodeUint64=decodeInt64Based(_=>_),decodeSint64=decodeInt64Based(_=>_>>1n^-(_&1n)),string=set_(utf8d,``),bytes=set_(_=>_,new Uint8Array),bool=set_(v0(decodeBool),!1),boolLi=liDecode(decodeBool),double=v0_0(decodeDouble),doubleLi=liDecode(decodeDouble),fixed32=v0_0(decodeFixed32),fixed32Li=liDecode(decodeFixed32),fixed64=v0_0(decodeFixed64),fixed64Li=liDecode(decodeFixed64),float=v0_0(decodeFloat),floatLi=liDecode(decodeFloat),int32=v0_0(decodeInt32),int32Li=liDecode(decodeInt32),int64=v0_0(decodeInt64),int64Li=liDecode(decodeInt64),sfixed32=v0_0(decodeSfixed32),sfixed32Li=liDecode(decodeSfixed32),sfixed64=v0_0(decodeSfixed64),sfixed64Li=liDecode(decodeSfixed64),sint32=v0_0(decodeSint32),sint32Li=liDecode(decodeSint32),sint64=v0_0(decodeSint64),sint64Li=liDecode(decodeSint64),uint32=v0_0(decodeUint32),uint32Li=liDecode(decodeUint32),uint64=v0_0(decodeUint64),uint64Li=liDecode(decodeUint64),map=(_,G)=>[$([_,G])],$=_=>{let G=[],K=[],q=new Set;_.forEach((_,J)=>{Array.isArray(_)?(G[J]=[],K[J]=_[0],q.add(J)):(G[J]=_._,K[J]=_)});let J=_=>{let J=structuredClone(G);for(let[G,Y]of unpack(_)){let _=K[G];if(_){let K=_(Y);q.has(G)?J[G].push(K):J[G]=K}}return J};return J._=G,J},EchoD=$([string]),Test1D=$([int32,string]),Test2D=$([double,float,int32,int64,uint32,uint64,sint32,sint64,fixed32,fixed64,sfixed32,sfixed64,bool,string,bytes,doubleLi,floatLi,int32Li,int64Li,uint32Li,uint64Li,sint32Li,sint64Li,fixed32Li,fixed64Li,sfixed32Li,sfixed64Li,boolLi,[string],[bytes],Test1D,[Test1D],map(int32,string),int32,int32Li]);var tree_shaking_decode_default=EchoD;export{tree_shaking_decode_default as default};
```

# second time treeshake : 3164 bytes

```
const set_=(_,G)=>(_._=G,_),liDecode=G=>set_(_=>{let K=[],q=_.length,J=0;for(;J<q;){let[q,Y]=G(_,J);K.push(q),J=Y}return K},[]),v0_0=G=>set_(v0(G),0),v0=_=>G=>_(G,0)[0],TEXT=new TextDecoder,utf8d=TEXT.decode.bind(TEXT),get=(_,G)=>(G=`get`+G,(K,q=0)=>[new DataView(K.buffer,K.byteOffset+q,_)[G](0,!0),q+_]),varintLen=(_,G)=>{let K=_.length;for(;G<K;)if(!(_[G++]&128))return G;return G},readTag=(_,G)=>{let K=_.length,q=0,J=0,Y;for(;G<K;){if(Y=_[G],q|=(Y&127)<<J,G++,!(Y&128))return[q&7,q>>>3,G];if(J+=7,J>28)return}},unpack=_=>{let G=[],K=_.length,q=0,J;for(;q<K&&(J=readTag(_,q),J);){let[K,Y,X]=J;q=X;let Z,Q=q;switch(K){case 0:Z=varintLen(_,q);break;case 1:Z=q+8;break;case 2:{let[G,K]=decodeVarint32(_,q);Q=K,Z=K+G;break}case 5:Z=q+4;break;default:return G}G.push([Y-1,_.subarray(Q,Z)]),q=Z}return G},decodeVarint32=(_,G=0)=>{let K=0,q=0,J;do J=_[G++],K|=(J&127)<<q,q+=7;while(J&128);return[K>>>0,G]},decodeFixed32=get(4,`Uint32`),decodeFloat=get(4,`Float32`),decodeSfixed32=get(4,`Int32`),decodeDouble=get(8,`Float64`),decodeFixed64=get(8,`BigUint64`),decodeSfixed64=get(8,`BigInt64`),decodeVarint64=(_,G=0)=>{let K=0n,q=0n,J;do J=_[G++],K|=BigInt(J&127)<<q,q+=7n;while(J&128);return[K,G]},decodeUint32=decodeVarint32,decodeSint32=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[K>>>1^-(K&1),q]},decodeBool=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[!!K,q]},decodeInt64Based=_=>(G,K)=>{let[q,J]=decodeVarint64(G,K);return[Number(_(q)),J]},decodeInt32=decodeInt64Based(BigInt.asIntN.bind(BigInt,32)),decodeInt64=decodeInt64Based(BigInt.asIntN.bind(BigInt,64)),decodeUint64=decodeInt64Based(_=>_),decodeSint64=decodeInt64Based(_=>_>>1n^-(_&1n)),string=set_(utf8d,``),bytes=set_(_=>_,new Uint8Array),bool=set_(v0(decodeBool),!1),boolLi=liDecode(decodeBool),double=v0_0(decodeDouble),doubleLi=liDecode(decodeDouble),fixed32=v0_0(decodeFixed32),fixed32Li=liDecode(decodeFixed32),fixed64=v0_0(decodeFixed64),fixed64Li=liDecode(decodeFixed64),float=v0_0(decodeFloat),floatLi=liDecode(decodeFloat),int32=v0_0(decodeInt32),int32Li=liDecode(decodeInt32),int64=v0_0(decodeInt64),int64Li=liDecode(decodeInt64),sfixed32=v0_0(decodeSfixed32),sfixed32Li=liDecode(decodeSfixed32),sfixed64=v0_0(decodeSfixed64),sfixed64Li=liDecode(decodeSfixed64),sint32=v0_0(decodeSint32),sint32Li=liDecode(decodeSint32),sint64=v0_0(decodeSint64),sint64Li=liDecode(decodeSint64),uint32=v0_0(decodeUint32),uint32Li=liDecode(decodeUint32),uint64=v0_0(decodeUint64),uint64Li=liDecode(decodeUint64),map=(_,G)=>[$([_,G])],$=_=>{let G=[],K=[],q=new Set;_.forEach((_,J)=>{Array.isArray(_)?(G[J]=[],K[J]=_[0],q.add(J)):(G[J]=_._,K[J]=_)});let J=_=>{let J=structuredClone(G);for(let[G,Y]of unpack(_)){let _=K[G];if(_){let K=_(Y);q.has(G)?J[G].push(K):J[G]=K}}return J};return J._=G,J},EchoD=$([string]),Test1D=$([int32,string]);$([double,float,int32,int64,uint32,uint64,sint32,sint64,fixed32,fixed64,sfixed32,sfixed64,bool,string,bytes,doubleLi,floatLi,int32Li,int64Li,uint32Li,uint64Li,sint32Li,sint64Li,fixed32Li,fixed64Li,sfixed32Li,sfixed64Li,boolLi,[string],[bytes],Test1D,[Test1D],map(int32,string),int32,int32Li]);var tree_shaking_decode_default=EchoD;export{tree_shaking_decode_default as default};
```

# treeshake with manualPureFunctions : 2871 bytes

```
const set_=(_,G)=>(_._=G,_),liDecode=G=>set_(_=>{let K=[],q=_.length,J=0;for(;J<q;){let[q,Y]=G(_,J);K.push(q),J=Y}return K},[]),v0_0=G=>set_(v0(G),0),v0=_=>G=>_(G,0)[0],TEXT=new TextDecoder,utf8d=TEXT.decode.bind(TEXT),get=(_,G)=>(G=`get`+G,(K,q=0)=>[new DataView(K.buffer,K.byteOffset+q,_)[G](0,!0),q+_]),varintLen=(_,G)=>{let K=_.length;for(;G<K;)if(!(_[G++]&128))return G;return G},readTag=(_,G)=>{let K=_.length,q=0,J=0,Y;for(;G<K;){if(Y=_[G],q|=(Y&127)<<J,G++,!(Y&128))return[q&7,q>>>3,G];if(J+=7,J>28)return}},unpack=_=>{let G=[],K=_.length,q=0,J;for(;q<K&&(J=readTag(_,q),J);){let[K,Y,X]=J;q=X;let Z,Q=q;switch(K){case 0:Z=varintLen(_,q);break;case 1:Z=q+8;break;case 2:{let[G,K]=decodeVarint32(_,q);Q=K,Z=K+G;break}case 5:Z=q+4;break;default:return G}G.push([Y-1,_.subarray(Q,Z)]),q=Z}return G},decodeVarint32=(_,G=0)=>{let K=0,q=0,J;do J=_[G++],K|=(J&127)<<q,q+=7;while(J&128);return[K>>>0,G]},decodeFixed32=get(4,`Uint32`),decodeFloat=get(4,`Float32`),decodeSfixed32=get(4,`Int32`),decodeDouble=get(8,`Float64`),decodeFixed64=get(8,`BigUint64`),decodeSfixed64=get(8,`BigInt64`),decodeVarint64=(_,G=0)=>{let K=0n,q=0n,J;do J=_[G++],K|=BigInt(J&127)<<q,q+=7n;while(J&128);return[K,G]},decodeUint32=decodeVarint32,decodeSint32=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[K>>>1^-(K&1),q]},decodeBool=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[!!K,q]},decodeInt64Based=_=>(G,K)=>{let[q,J]=decodeVarint64(G,K);return[Number(_(q)),J]},decodeInt32=decodeInt64Based(BigInt.asIntN.bind(BigInt,32)),decodeInt64=decodeInt64Based(BigInt.asIntN.bind(BigInt,64)),decodeUint64=decodeInt64Based(_=>_),decodeSint64=decodeInt64Based(_=>_>>1n^-(_&1n)),string=set_(utf8d,``),bytes=set_(_=>_,new Uint8Array),bool=set_(v0(decodeBool),!1),boolLi=liDecode(decodeBool),double=v0_0(decodeDouble),doubleLi=liDecode(decodeDouble),fixed32=v0_0(decodeFixed32),fixed32Li=liDecode(decodeFixed32),fixed64=v0_0(decodeFixed64),fixed64Li=liDecode(decodeFixed64),float=v0_0(decodeFloat),floatLi=liDecode(decodeFloat),int32=v0_0(decodeInt32),int32Li=liDecode(decodeInt32),int64=v0_0(decodeInt64),int64Li=liDecode(decodeInt64),sfixed32=v0_0(decodeSfixed32),sfixed32Li=liDecode(decodeSfixed32),sfixed64=v0_0(decodeSfixed64),sfixed64Li=liDecode(decodeSfixed64),sint32=v0_0(decodeSint32),sint32Li=liDecode(decodeSint32),sint64=v0_0(decodeSint64),sint64Li=liDecode(decodeSint64),uint32=v0_0(decodeUint32),uint32Li=liDecode(decodeUint32),uint64=v0_0(decodeUint64),uint64Li=liDecode(decodeUint64),map=(_,G)=>[$([_,G])],$=_=>{let G=[],K=[],q=new Set;_.forEach((_,J)=>{Array.isArray(_)?(G[J]=[],K[J]=_[0],q.add(J)):(G[J]=_._,K[J]=_)});let J=_=>{let J=structuredClone(G);for(let[G,Y]of unpack(_)){let _=K[G];if(_){let K=_(Y);q.has(G)?J[G].push(K):J[G]=K}}return J};return J._=G,J},EchoD=$([string]),Test1D=$([int32,string]);var tree_shaking_decode_default=EchoD;export{tree_shaking_decode_default as default};
```

As you can see,

<h2 id="issue-1-incomplete-tree-shaking">Issue 1: Incomplete Tree Shaking</h2>

`first time treeshake : 3171 bytes`, `second time treeshake : 3164 bytes`

<h2 id="issue-2-no_side_effects-not-working">Issue 2: `/*@__NO_SIDE_EFFECTS__*/` Not Working</h2>

`treeshake with manualPureFunctions : 2871 bytes`. Here, `manualPureFunctions` is manually set to `$`.

However, the `$` function in `./decode.js` already has the `/*@__NO_SIDE_EFFECTS__*/` comment.

Theoretically, it should not be necessary to manually configure `manualPureFunctions`.

The related code is as follows:
```
/*@__NO_SIDE_EFFECTS__*/
export  /*@__NO_SIDE_EFFECTS__*/
  const $ = /*@__NO_SIDE_EFFECTS__*/
    (type_li_in) => {
```

---

<h1 id="rolldown-100-beta42-的几个问题">rolldown 1.0.0-beta.42 的几个问题</h1>

1.  摇树优化没有摇彻底, 多摇一次就可以多摇掉一些代码(建议内部代码中摇到稳定了再返回)
2.  `/*@__NO_SIDE_EFFECTS__*/` 没有生效

复现的代码库参见

```
git clone https://github.com/i18nsite/rolldown-bug.git
```

下面是测试代码

```js
#!/usr/bin/env bun

import { rolldown } from "rolldown"
// import read from "@3-/read"
import write from "@3-/write"

const treeshake = async (input, manualPureFunctions) => {
  const {
    output: [{ code }],
  } = await (
    await rolldown({
      input,
      treeshake: {
        preset: "smallest",
        unknownGlobalSideEffects: false,
        moduleSideEffects: false,
        manualPureFunctions,
      },
    })
  ).generate({
    format: "esm",
    minify: {
      compress: {
        target: "esnext",
      },
      mangle: {
        toplevel: false,
      },
    },
  })
  // , src = read(input)
  // if (code !== src) {
  //   write(input, code)
  //   return treeshake(input)
  // }
  return code
}

const t1 = await treeshake("tree_shaking_decode.js");
console.log('# first time treeshake : ' + t1.length + ' bytes\n\n```\n' + t1 + '\n```\n')

write('t1.js', t1)
const t2 = await treeshake("t1.js");
console.log('# second time treeshake : ' + t2.length + ' bytes\n\n```\n' + t2 + '\n```\n')

const t3 = await treeshake("t1.js", ['$']);
console.log('# treeshake with manualPureFunctions : ' + t3.length + ' bytes\n\n```\n' + t3 + '\n```\n')
```

输出 :

# first time treeshake : 3171 bytes

```
const set_=(_,G)=>(_._=G,_),liDecode=G=>set_(_=>{let K=[],q=_.length,J=0;for(;J<q;){let[q,Y]=G(_,J);K.push(q),J=Y}return K},[]),v0_0=G=>set_(v0(G),0),v0=_=>G=>_(G,0)[0],TEXT=new TextDecoder,utf8d=TEXT.decode.bind(TEXT),get=(_,G)=>(G=`get`+G,(K,q=0)=>[new DataView(K.buffer,K.byteOffset+q,_)[G](0,!0),q+_]),varintLen=(_,G)=>{let K=_.length;for(;G<K;)if(!(_[G++]&128))return G;return G},readTag=(_,G)=>{let K=_.length,q=0,J=0,Y;for(;G<K;){if(Y=_[G],q|=(Y&127)<<J,G++,!(Y&128))return[q&7,q>>>3,G];if(J+=7,J>28)return}},unpack=_=>{let G=[],K=_.length,q=0,J;for(;q<K&&(J=readTag(_,q),J);){let[K,Y,X]=J;q=X;let Z,Q=q;switch(K){case 0:Z=varintLen(_,q);break;case 1:Z=q+8;break;case 2:{let[G,K]=decodeVarint32(_,q);Q=K,Z=K+G;break}case 5:Z=q+4;break;default:return G}G.push([Y-1,_.subarray(Q,Z)]),q=Z}return G},decodeVarint32=(_,G=0)=>{let K=0,q=0,J;do J=_[G++],K|=(J&127)<<q,q+=7;while(J&128);return[K>>>0,G]},decodeFixed32=get(4,`Uint32`),decodeFloat=get(4,`Float32`),decodeSfixed32=get(4,`Int32`),decodeDouble=get(8,`Float64`),decodeFixed64=get(8,`BigUint64`),decodeSfixed64=get(8,`BigInt64`),decodeVarint64=(_,G=0)=>{let K=0n,q=0n,J;do J=_[G++],K|=BigInt(J&127)<<q,q+=7n;while(J&128);return[K,G]},decodeUint32=decodeVarint32,decodeSint32=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[K>>>1^-(K&1),q]},decodeBool=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[!!K,q]},decodeInt64Based=_=>(G,K)=>{let[q,J]=decodeVarint64(G,K);return[Number(_(q)),J]},decodeInt32=decodeInt64Based(BigInt.asIntN.bind(BigInt,32)),decodeInt64=decodeInt64Based(BigInt.asIntN.bind(BigInt,64)),decodeUint64=decodeInt64Based(_=>_),decodeSint64=decodeInt64Based(_=>_>>1n^-(_&1n)),string=set_(utf8d,``),bytes=set_(_=>_,new Uint8Array),bool=set_(v0(decodeBool),!1),boolLi=liDecode(decodeBool),double=v0_0(decodeDouble),doubleLi=liDecode(decodeDouble),fixed32=v0_0(decodeFixed32),fixed32Li=liDecode(decodeFixed32),fixed64=v0_0(decodeFixed64),fixed64Li=liDecode(decodeFixed64),float=v0_0(decodeFloat),floatLi=liDecode(decodeFloat),int32=v0_0(decodeInt32),int32Li=liDecode(decodeInt32),int64=v0_0(decodeInt64),int64Li=liDecode(decodeInt64),sfixed32=v0_0(decodeSfixed32),sfixed32Li=liDecode(decodeSfixed32),sfixed64=v0_0(decodeSfixed64),sfixed64Li=liDecode(decodeSfixed64),sint32=v0_0(decodeSint32),sint32Li=liDecode(decodeSint32),sint64=v0_0(decodeSint64),sint64Li=liDecode(decodeSint64),uint32=v0_0(decodeUint32),uint32Li=liDecode(decodeUint32),uint64=v0_0(decodeUint64),uint64Li=liDecode(decodeUint64),map=(_,G)=>[$([_,G])],$=_=>{let G=[],K=[],q=new Set;_.forEach((_,J)=>{Array.isArray(_)?(G[J]=[],K[J]=_[0],q.add(J)):(G[J]=_._,K[J]=_)});let J=_=>{let J=structuredClone(G);for(let[G,Y]of unpack(_)){let _=K[G];if(_){let K=_(Y);q.has(G)?J[G].push(K):J[G]=K}}return J};return J._=G,J},EchoD=$([string]),Test1D=$([int32,string]),Test2D=$([double,float,int32,int64,uint32,uint64,sint32,sint64,fixed32,fixed64,sfixed32,sfixed64,bool,string,bytes,doubleLi,floatLi,int32Li,int64Li,uint32Li,uint64Li,sint32Li,sint64Li,fixed32Li,fixed64Li,sfixed32Li,sfixed64Li,boolLi,[string],[bytes],Test1D,[Test1D],map(int32,string),int32,int32Li]);var tree_shaking_decode_default=EchoD;export{tree_shaking_decode_default as default};
```

# second time treeshake : 3164 bytes

```
const set_=(_,G)=>(_._=G,_),liDecode=G=>set_(_=>{let K=[],q=_.length,J=0;for(;J<q;){let[q,Y]=G(_,J);K.push(q),J=Y}return K},[]),v0_0=G=>set_(v0(G),0),v0=_=>G=>_(G,0)[0],TEXT=new TextDecoder,utf8d=TEXT.decode.bind(TEXT),get=(_,G)=>(G=`get`+G,(K,q=0)=>[new DataView(K.buffer,K.byteOffset+q,_)[G](0,!0),q+_]),varintLen=(_,G)=>{let K=_.length;for(;G<K;)if(!(_[G++]&128))return G;return G},readTag=(_,G)=>{let K=_.length,q=0,J=0,Y;for(;G<K;){if(Y=_[G],q|=(Y&127)<<J,G++,!(Y&128))return[q&7,q>>>3,G];if(J+=7,J>28)return}},unpack=_=>{let G=[],K=_.length,q=0,J;for(;q<K&&(J=readTag(_,q),J);){let[K,Y,X]=J;q=X;let Z,Q=q;switch(K){case 0:Z=varintLen(_,q);break;case 1:Z=q+8;break;case 2:{let[G,K]=decodeVarint32(_,q);Q=K,Z=K+G;break}case 5:Z=q+4;break;default:return G}G.push([Y-1,_.subarray(Q,Z)]),q=Z}return G},decodeVarint32=(_,G=0)=>{let K=0,q=0,J;do J=_[G++],K|=(J&127)<<q,q+=7;while(J&128);return[K>>>0,G]},decodeFixed32=get(4,`Uint32`),decodeFloat=get(4,`Float32`),decodeSfixed32=get(4,`Int32`),decodeDouble=get(8,`Float64`),decodeFixed64=get(8,`BigUint64`),decodeSfixed64=get(8,`BigInt64`),decodeVarint64=(_,G=0)=>{let K=0n,q=0n,J;do J=_[G++],K|=BigInt(J&127)<<q,q+=7n;while(J&128);return[K,G]},decodeUint32=decodeVarint32,decodeSint32=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[K>>>1^-(K&1),q]},decodeBool=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[!!K,q]},decodeInt64Based=_=>(G,K)=>{let[q,J]=decodeVarint64(G,K);return[Number(_(q)),J]},decodeInt32=decodeInt64Based(BigInt.asIntN.bind(BigInt,32)),decodeInt64=decodeInt64Based(BigInt.asIntN.bind(BigInt,64)),decodeUint64=decodeInt64Based(_=>_),decodeSint64=decodeInt64Based(_=>_>>1n^-(_&1n)),string=set_(utf8d,``),bytes=set_(_=>_,new Uint8Array),bool=set_(v0(decodeBool),!1),boolLi=liDecode(decodeBool),double=v0_0(decodeDouble),doubleLi=liDecode(decodeDouble),fixed32=v0_0(decodeFixed32),fixed32Li=liDecode(decodeFixed32),fixed64=v0_0(decodeFixed64),fixed64Li=liDecode(decodeFixed64),float=v0_0(decodeFloat),floatLi=liDecode(decodeFloat),int32=v0_0(decodeInt32),int32Li=liDecode(decodeInt32),int64=v0_0(decodeInt64),int64Li=liDecode(decodeInt64),sfixed32=v0_0(decodeSfixed32),sfixed32Li=liDecode(decodeSfixed32),sfixed64=v0_0(decodeSfixed64),sfixed64Li=liDecode(decodeSfixed64),sint32=v0_0(decodeSint32),sint32Li=liDecode(decodeSint32),sint64=v0_0(decodeSint64),sint64Li=liDecode(decodeSint64),uint32=v0_0(decodeUint32),uint32Li=liDecode(decodeUint32),uint64=v0_0(decodeUint64),uint64Li=liDecode(decodeUint64),map=(_,G)=>[$([_,G])],$=_=>{let G=[],K=[],q=new Set;_.forEach((_,J)=>{Array.isArray(_)?(G[J]=[],K[J]=_[0],q.add(J)):(G[J]=_._,K[J]=_)});let J=_=>{let J=structuredClone(G);for(let[G,Y]of unpack(_)){let _=K[G];if(_){let K=_(Y);q.has(G)?J[G].push(K):J[G]=K}}return J};return J._=G,J},EchoD=$([string]),Test1D=$([int32,string]);$([double,float,int32,int64,uint32,uint64,sint32,sint64,fixed32,fixed64,sfixed32,sfixed64,bool,string,bytes,doubleLi,floatLi,int32Li,int64Li,uint32Li,uint64Li,sint32Li,sint64Li,fixed32Li,fixed64Li,sfixed32Li,sfixed64Li,boolLi,[string],[bytes],Test1D,[Test1D],map(int32,string),int32,int32Li]);var tree_shaking_decode_default=EchoD;export{tree_shaking_decode_default as default};
```

# treeshake with manualPureFunctions : 2871 bytes

```
const set_=(_,G)=>(_._=G,_),liDecode=G=>set_(_=>{let K=[],q=_.length,J=0;for(;J<q;){let[q,Y]=G(_,J);K.push(q),J=Y}return K},[]),v0_0=G=>set_(v0(G),0),v0=_=>G=>_(G,0)[0],TEXT=new TextDecoder,utf8d=TEXT.decode.bind(TEXT),get=(_,G)=>(G=`get`+G,(K,q=0)=>[new DataView(K.buffer,K.byteOffset+q,_)[G](0,!0),q+_]),varintLen=(_,G)=>{let K=_.length;for(;G<K;)if(!(_[G++]&128))return G;return G},readTag=(_,G)=>{let K=_.length,q=0,J=0,Y;for(;G<K;){if(Y=_[G],q|=(Y&127)<<J,G++,!(Y&128))return[q&7,q>>>3,G];if(J+=7,J>28)return}},unpack=_=>{let G=[],K=_.length,q=0,J;for(;q<K&&(J=readTag(_,q),J);){let[K,Y,X]=J;q=X;let Z,Q=q;switch(K){case 0:Z=varintLen(_,q);break;case 1:Z=q+8;break;case 2:{let[G,K]=decodeVarint32(_,q);Q=K,Z=K+G;break}case 5:Z=q+4;break;default:return G}G.push([Y-1,_.subarray(Q,Z)]),q=Z}return G},decodeVarint32=(_,G=0)=>{let K=0,q=0,J;do J=_[G++],K|=(J&127)<<q,q+=7;while(J&128);return[K>>>0,G]},decodeFixed32=get(4,`Uint32`),decodeFloat=get(4,`Float32`),decodeSfixed32=get(4,`Int32`),decodeDouble=get(8,`Float64`),decodeFixed64=get(8,`BigUint64`),decodeSfixed64=get(8,`BigInt64`),decodeVarint64=(_,G=0)=>{let K=0n,q=0n,J;do J=_[G++],K|=BigInt(J&127)<<q,q+=7n;while(J&128);return[K,G]},decodeUint32=decodeVarint32,decodeSint32=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[K>>>1^-(K&1),q]},decodeBool=(_,G)=>{let[K,q]=decodeVarint32(_,G);return[!!K,q]},decodeInt64Based=_=>(G,K)=>{let[q,J]=decodeVarint64(G,K);return[Number(_(q)),J]},decodeInt32=decodeInt64Based(BigInt.asIntN.bind(BigInt,32)),decodeInt64=decodeInt64Based(BigInt.asIntN.bind(BigInt,64)),decodeUint64=decodeInt64Based(_=>_),decodeSint64=decodeInt64Based(_=>_>>1n^-(_&1n)),string=set_(utf8d,``),bytes=set_(_=>_,new Uint8Array),bool=set_(v0(decodeBool),!1),boolLi=liDecode(decodeBool),double=v0_0(decodeDouble),doubleLi=liDecode(decodeDouble),fixed32=v0_0(decodeFixed32),fixed32Li=liDecode(decodeFixed32),fixed64=v0_0(decodeFixed64),fixed64Li=liDecode(decodeFixed64),float=v0_0(decodeFloat),floatLi=liDecode(decodeFloat),int32=v0_0(decodeInt32),int32Li=liDecode(decodeInt32),int64=v0_0(decodeInt64),int64Li=liDecode(decodeInt64),sfixed32=v0_0(decodeSfixed32),sfixed32Li=liDecode(decodeSfixed32),sfixed64=v0_0(decodeSfixed64),sfixed64Li=liDecode(decodeSfixed64),sint32=v0_0(decodeSint32),sint32Li=liDecode(decodeSint32),sint64=v0_0(decodeSint64),sint64Li=liDecode(decodeSint64),uint32=v0_0(decodeUint32),uint32Li=liDecode(decodeUint32),uint64=v0_0(decodeUint64),uint64Li=liDecode(decodeUint64),map=(_,G)=>[$([_,G])],$=_=>{let G=[],K=[],q=new Set;_.forEach((_,J)=>{Array.isArray(_)?(G[J]=[],K[J]=_[0],q.add(J)):(G[J]=_._,K[J]=_)});let J=_=>{let J=structuredClone(G);for(let[G,Y]of unpack(_)){let _=K[G];if(_){let K=_(Y);q.has(G)?J[G].push(K):J[G]=K}}return J};return J._=G,J},EchoD=$([string]),Test1D=$([int32,string]);var tree_shaking_decode_default=EchoD;export{tree_shaking_decode_default as default};
```

可以看到,

<h2 id="问题1摇树优化没有摇彻底">问题1：摇树优化没有摇彻底</h2>

`first time treeshake : 3171 bytes`, `second time treeshake : 3164 bytes`

<h2 id="问题2no_side_effects-没有生效">问题2：`/*@__NO_SIDE_EFFECTS__*/` 没有生效</h2>

`treeshake with manualPureFunctions : 2871 bytes`, 这里手动设置了`manualPureFunctions`为`$`

但是问题是,`$`函数在 `./decode.js`已经加上了`/*@__NO_SIDE_EFFECTS__*/` 的注释,

理论上不应该需要手动配置`manualPureFunctions`

相关代码如下:
```
/*@__NO_SIDE_EFFECTS__*/
export  /*@__NO_SIDE_EFFECTS__*/
  const $ = /*@__NO_SIDE_EFFECTS__*/
    (type_li_in) => {
```
