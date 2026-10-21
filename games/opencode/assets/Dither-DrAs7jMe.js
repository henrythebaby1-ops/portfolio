import{r as v,j as S}from"./index-D0zNZLAK.js";import{u as H,a as xe,e as Te,C as je}from"./react-three-fiber.esm-nR5vKGpt.js";import{h as T,H as Ae,N as ee,v as N,C as te}from"./three.module-BgPORkTe.js";import{E as Fe,R as Oe,N as qe,D as De,C as Be,a as B,b as we,P as L}from"./index-DX2KU2Vi.js";function A(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}new T;new T;function ye(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var W=function e(t,r,n){var a=this;ye(this,e),A(this,"dot2",function(s,l){return a.x*s+a.y*l}),A(this,"dot3",function(s,l,u){return a.x*s+a.y*l+a.z*u}),this.x=t,this.y=r,this.z=n},_e=[new W(1,1,0),new W(-1,1,0),new W(1,-1,0),new W(-1,-1,0),new W(1,0,1),new W(-1,0,1),new W(1,0,-1),new W(-1,0,-1),new W(0,1,1),new W(0,-1,1),new W(0,1,-1),new W(0,-1,-1)],re=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],ne=new Array(512),ae=new Array(512),Ge=function(t){t>0&&t<1&&(t*=65536),t=Math.floor(t),t<256&&(t|=t<<8);for(var r=0;r<256;r++){var n;r&1?n=re[r]^t&255:n=re[r]^t>>8&255,ne[r]=ne[r+256]=n,ae[r]=ae[r+256]=_e[n%12]}};Ge(0);function Ue(e){if(typeof e=="number")e=Math.abs(e);else if(typeof e=="string"){var t=e;e=0;for(var r=0;r<t.length;r++)e=(e+(r+1)*(t.charCodeAt(r)%96))%2147483647}return e===0&&(e=311),e}function oe(e){var t=Ue(e);return function(){var r=t*48271%2147483647;return t=r,r/2147483647}}var Ve=function e(t){var r=this;ye(this,e),A(this,"seed",0),A(this,"init",function(n){r.seed=n,r.value=oe(n)}),A(this,"value",oe(this.seed)),this.init(t)};new Ve(Math.random());function i(e){return e&&e.__esModule?e.default:e}var o={};o=JSON.parse('{"architecture":"attention-v3-int8","formatVersion":3,"globalBias":[-0.32877659797668457,0.4370867609977722,-0.05251404270529747,1.3072023391723633,0.0477047860622406,0.24477416276931763,0.009111796505749226,-0.17459993064403534],"globalFeatureInverseStandardDeviation":[10.771836280822754,1.9548665285110474,1.612365484237671],"globalFeatureMean":[0.9198138117790222,-0.49808526039123535,0.03374629095196724],"globalWeights":[101,-4,7,-127,6,-11,3,1,0,-16,-7,8,-8,-1,7,-4,0,0,-12,-3,-13,1,0,2],"headBias":[-0.15895532071590424,0.007501596584916115,-0.47742825746536255,0.01632097363471985,-0.48355796933174133,-0.1052703931927681,-0.8414919376373291,-0.21046382188796997],"headWeights":[-45,-7,-45,-20,7,-13,120,-24,-15,-26,-19,1,27,-48,-4,-10,1,-5,-24,64,91,-1,-68,39,54,39,101,-40,-127,64,-41,-17,-23,-19,3,35,-2,33,3,9,-64,-32,30,42,-112,12,28,-11,15,2,-4,-7,7,-3,-5,1,76,48,-34,-67,103,-40,-26,1,58,-11,46,-41,5,-6,-17,-8,13,17,-35,45,27,-17,-28,7,-53,12,-51,6,-32,-5,58,-9,-28,-21,37,-12,1,20,2,2,11,7,-4,-9,2,-15,-1,-8,16,12,-27,-1,61,-5,-1,4,-7,-2,7,4,1,4,-2,4,-18,-16,28,6,-65,16,3,-3,-5,-2,0,-40,-21,-22,14,30,-21,49,15,-64,43,19,23,18,5,-15,21,21,30,17,-11,-6,22,-38,-20,97,-46,-5,-13,-59,26,-13,11,-2,-10,-8,2,-15,-17,-27,-9,26,7,-7,6,9,-32,5,-9,12,49,17,-1,24,20,35,14,-33,-50,-1,-4,-26,11,11,9,-80,30,9,36,6,-12,-4,-7,39,-10,-30,-49,1,-43,-20,-34,76,-36,-10,15,-8,43,31,38,-42,39,37,-7,7,8,16,28,-83,32,9,23,-13,39,119,23,-127,-24,8,-48,-29,-7,-33,-12,58,-24,-29,-19,12,-55,-90,0,126,26,42,54,22],"keyProjectionWeights":[0,-1,-1,1,1,1,1,1,-64,32,49,23,-25,4,27,-22,0,1,-1,-1,-1,1,1,0,-34,38,64,88,13,-53,-41,58,-7,-4,79,-41,27,26,14,2,-2,1,1,1,-1,-1,1,1,1,-1,-1,-1,-1,-1,1,1,4,-3,126,42,-40,-116,35,20],"name":"residual-attention-v3-50m-qat-int8-epoch-25-zo-278w","outputBias":-0.0005526235327124596,"outputWeights":[11,11,14,-27,9,-22,127,6],"quantization":{"scales":{"globalWeight":0.021090541950849095,"headWeight":0.04935851140909355,"keyWeight":0.1733924937791441,"outputWeight":0.0030087142047955295,"tapInputWeight":0.1096231754049479,"tapOutputWeight":0.017949438644286102,"valueWeight":0.013986751242596301},"scheme":"symmetric-int8-per-tensor","zeroPoint":0},"summaryQueries":[0.0038647791370749474,0.09565000981092453,0.002756686182692647,-0.08183622360229492,-0.15209506452083588,-0.0006105066277086735,0.0010439646430313587,-0.03020688332617283,0.005065929610282183,0.14488759636878967,0.003160916268825531,-0.0855727270245552,-0.3123375475406647,0.00039022407145239413,0.0037786494940519333,0.1451321840286255,-0.002009483054280281,0.0597594790160656,0.0045239729806780815,-0.08765853196382523,-0.13884992897510529,-0.0021647117100656033,0.003985927440226078,0.09727758169174194,0.007170629221946001,0.0786278173327446,0.004103775601834059,-0.1198369711637497,-0.2925199568271637,-0.002055276418104768,0.0030450925696641207,0.14401987195014954],"supportedDenoiseSamples":[4,8,16],"tapFeatureInverseStandardDeviation":[2.283243417739868,0.8810898065567017,0.8210930228233337,3.752316474914551,3.6375720500946045,2.670454978942871,10.249449729919434,0.12639354169368744,100],"tapFeatureMean":[0.010318092070519924,0.01364430133253336,0.13411010801792145,-0.004725644364953041,0.10053129494190216,0.8384788632392883,0.9203217625617981,1.7139031887054443,1],"tapInputBias":[0.4780646860599518,-0.45214661955833435,0.289407879114151,0.34804567694664,-0.1320028454065323,0.17722633481025696,0.011480014771223068,-0.26692497730255127],"tapInputWeights":[0,1,7,0,-1,-7,0,31,-2,-1,14,-126,0,0,-1,2,26,-2,0,66,-73,0,0,0,-12,22,-3,0,-76,-90,0,-1,-7,-3,58,-1,0,2,6,0,0,3,4,-40,0,0,3,-13,0,0,1,-7,-13,0,0,-7,10,0,-2,-7,0,-39,-2,0,-13,-19,0,-2,20,-1,3,-1],"tapOutputBias":[-0.3867710530757904,0.1349504142999649,0.35706064105033875,-0.5938405394554138,-0.031154220923781395,1.4079623222351074,-1.9221038818359375,0.6029739379882812],"tapOutputWeights":[18,-4,47,19,74,-94,-21,-9,73,-59,88,-10,-3,71,-7,24,20,74,24,-31,-12,-10,-15,-45,-126,2,-4,27,-5,24,35,-11,-4,9,-8,26,-10,27,26,-20,17,-50,5,-35,0,-5,12,-71,89,-58,22,-83,-115,7,-16,-89,89,22,1,-20,-22,-25,-26,44],"valueProjectionWeights":[-16,-6,40,-17,84,-76,59,51,-10,-2,-10,-1,-23,74,-70,23,-5,4,4,-7,-77,127,20,-48,-36,4,-17,-12,-4,10,29,-27,-2,11,-47,-50,-54,-3,14,11,-23,-1,109,31,4,-100,-33,-36,-19,0,-8,20,-35,-24,79,2,44,2,5,7,22,-70,-67,-35]}');const Q=[["tapInputWeight","tapInputWeights",8,9],["tapOutputWeight","tapOutputWeights",8,8],["globalWeight","globalWeights",8,3],["keyWeight","keyProjectionWeights",8,8],["valueWeight","valueProjectionWeights",8,8],["headWeight","headWeights",8,32],["outputWeight","outputWeights",1,8]],O=e=>{var r,n;const t=(n=(r=i(o).quantization)==null?void 0:r.scales)==null?void 0:n[e];if(!(t>0)||!Number.isFinite(t))throw new Error(`The bundled N8AO neural model has no valid ${e} scale.`);return t};var ge,de,$e;if(i(o).architecture!=="attention-v3-int8"||i(o).formatVersion!==3||((ge=i(o).quantization)==null?void 0:ge.scheme)!=="symmetric-int8-per-tensor"||((de=i(o).quantization)==null?void 0:de.zeroPoint)!==0||(($e=i(o).supportedDenoiseSamples)==null?void 0:$e.join(","))!=="4,8,16"||Q.some(([,e,t,r])=>{var n;return((n=i(o)[e])==null?void 0:n.length)!==t*r||i(o)[e].some(a=>!Number.isInteger(a)||a<-127||a>127)}))throw new Error("The bundled N8AO neural denoise model has an unsupported layout.");const j=e=>{if(!Number.isFinite(e))throw new Error("The bundled N8AO neural model contains a non-finite value.");if(Object.is(e,-0))return"0.0";const t=Number(e).toString();return/[.eE]/.test(t)?t:`${t}.0`},F=["x","y","z","w"],_=e=>[...F.map(t=>`${e}.lo.${t}`),...F.map(t=>`${e}.hi.${t}`)],He=(e,t)=>e===0?null:e===1?t:e===-1?`(-${t})`:e<0?`(-${j(-e)} * ${t})`:`${j(e)} * ${t}`,Le=(e,t)=>e===0?null:`${j(e)} * ${t}`,Pe=e=>e.filter(Boolean).join(" + ")||"0.0",q=(e,t,r,n,a,s)=>{const l=n.map((u,m)=>He(e[t*r+m],u));return`${j(a)} * (${Pe(l)}) + ${j(s[t])}`},C=(e,t="        ")=>`vec4(
${e.map(r=>`${t}    ${r}`).join(`,
`)}
${t})`,U=({functionName:e,scaleName:t,weights:r,bias:n,width:a=8,relu:s=!1})=>{const l=_("inputToken"),u=O(t),m=Array.from({length:8},($,I)=>q(r,I,a,l,u,n)),d=C(m.slice(0,4)),h=C(m.slice(4)),p=$=>s?`max(${$}, vec4(0.0))`:$;return`
    NeuralToken neural${e[0].toUpperCase()}${e.slice(1)}(NeuralToken inputToken) {
        return NeuralToken(
            ${p(d)},
            ${p(h)}
        );
    }
`},Se=(e,t,r,n,a,s,l,u={})=>Array.from({length:a},(m,d)=>{let h=t[d];for(let p=0;p<s;p++){const $=e[d*s+p]*l;h-=$*n[p]*r[p],Object.hasOwn(u,p)&&(h+=$*n[p]*u[p])}return h}),be=O("tapInputWeight"),Qe=Se(i(o).tapInputWeights,i(o).tapInputBias,i(o).tapFeatureMean,i(o).tapFeatureInverseStandardDeviation,8,9,be,{8:1}),Je=_("scaledInput"),ie=Array.from({length:8},(e,t)=>q(i(o).tapInputWeights,t,9,Je,be,Qe)),Xe=`
    NeuralToken neuralTapInput(NeuralToken raw) {
        NeuralToken scaledInput = NeuralToken(
            raw.lo * ${C(i(o).tapFeatureInverseStandardDeviation.slice(0,4),"            ")},
            raw.hi * ${C(i(o).tapFeatureInverseStandardDeviation.slice(4,8),"            ")}
        );
        return NeuralToken(
            max(${C(ie.slice(0,4))}, vec4(0.0)),
            max(${C(ie.slice(4))}, vec4(0.0))
        );
    }
`,We=O("globalWeight"),Ye=Se(i(o).globalWeights,i(o).globalBias,i(o).globalFeatureMean,i(o).globalFeatureInverseStandardDeviation,8,3,We),Ke=F.slice(0,3).map(e=>`scaledInput.${e}`),se=Array.from({length:8},(e,t)=>q(i(o).globalWeights,t,3,Ke,We,Ye)),Ze=`
    NeuralToken neuralEncodeGlobal(vec4 raw) {
        vec3 scaledInput = raw.xyz * vec3(
            ${i(o).globalFeatureInverseStandardDeviation.map(j).join(", ")}
        );
        return NeuralToken(
            max(${C(se.slice(0,4))}, vec4(0.0)),
            max(${C(se.slice(4))}, vec4(0.0))
        );
    }
`,et=_("key"),tt=Array.from({length:4},(e,t)=>Pe(et.map((r,n)=>Le(i(o).summaryQueries[t*8+n],r)))),rt=`
    vec4 neuralQueryScores(NeuralToken key) {
        return ${C(tt)};
    }
`,Ne=[];for(let e=0;e<4;e++)Ne.push(...F.map(t=>`runningSummaryLo[${e}].${t}`),...F.map(t=>`runningSummaryHi[${e}].${t}`));const nt=O("headWeight"),ue=Array.from({length:8},(e,t)=>q(i(o).headWeights,t,32,Ne,nt,i(o).headBias)),at=`
    NeuralToken neuralHead(
        vec4 runningSummaryLo[4],
        vec4 runningSummaryHi[4]
    ) {
        return NeuralToken(
            max(${C(ue.slice(0,4))}, vec4(0.0)),
            max(${C(ue.slice(4))}, vec4(0.0))
        );
    }
`,ot=q(i(o).outputWeights,0,8,_("head"),O("outputWeight"),[i(o).outputBias]),it=`
    float neuralOutput(NeuralToken head) {
        return ${ot};
    }
`;[Xe,U({functionName:"tapOutput",scaleName:"tapOutputWeight",weights:i(o).tapOutputWeights,bias:i(o).tapOutputBias,relu:!0}),Ze,U({functionName:"keyProject",scaleName:"keyWeight",weights:i(o).keyProjectionWeights,bias:new Array(8).fill(0)}),U({functionName:"valueProject",scaleName:"valueWeight",weights:i(o).valueProjectionWeights,bias:new Array(8).fill(0)}),rt,at,it].join(`
`);Q.reduce((e,[,t])=>e+i(o)[t].length,0);Q.reduce((e,[,t])=>e+i(o)[t].filter(r=>r!==0).length,0);function st(e,t){const r=e.__r3f;return r?r.children.map(n=>n.object).filter(t):[]}function ut(e,t){const r=e.current;return t.length===r.length&&t.every((n,a)=>n===r[a])?!1:(e.current=t,!0)}var ct=v.createContext(null),ce=e=>(e.getAttributes()&2)===2,le=e=>/mainUv/.test(e.getFragmentShader()??"");function Ce(e){const t=new WeakMap;return{acquire(r,n){const a=t.get(r);a?(a.count++,a.forcedValue=n):t.set(r,{count:1,original:r[e],forcedValue:n})},release(r){const n=t.get(r);n&&--n.count<=0&&(r[e]===n.forcedValue&&(r[e]=n.original),t.delete(r))}}}var fe=Ce("autoClear"),pe=Ce("toneMapping"),R=new T,lt=(e,t)=>new Oe(e,t),J=new WeakSet,ft=new WeakSet;function pt(e){e instanceof we&&e.setEffects([]),L.prototype.dispose.call(e)}function ve(e){J.has(e)&&pt(e)}function vt(e,t,r){const n=[];for(let a=0;a<e.length;a++){const s=e[a];if(s instanceof B){const l=[s];let u=ce(s),m=le(s);if(r!=="none"){let h;for(;(h=e[a+1])instanceof B;){const p=ce(h),$=le(h);if(r==="auto"&&(u&&p||u&&$||m&&p))break;l.push(h),u||(u=p),m||(m=$),a++}}const d=new we(t,...l);J.add(d),n.push(d)}else s instanceof L&&n.push(s)}return n}var mt=v.memo(function({children:t,camera:r,scene:n,resolutionScale:a,enabled:s=!0,renderPriority:l=1,autoClear:u=!0,autoRenderToScreen:m=!0,depthBuffer:d,enableNormalPass:h,stencilBuffer:p,multisampling:$=8,frameBufferType:I=Ae,renderPass:E=lt,mergeMode:M="auto",ref:D}){const{gl:g,scene:G,camera:k}=H(),c=n||G,x=r||k;g.getSize(R);const[f,Re]=v.useState(null),[,X]=v.useReducer(y=>y+1,0);v.useEffect(()=>{fe.acquire(g,!1);const y=new Fe(g,{depthBuffer:d,stencilBuffer:p,multisampling:$,frameBufferType:I});y.autoRenderToScreen=m,y.addPass(E(c,x));let w=null,b=null;return h&&(w=new qe(c,x),w.enabled=!1,y.addPass(w),a!==void 0&&(b=new De({normalBuffer:w.texture,resolutionScale:a}),b.enabled=!1,y.addPass(b))),y.setSize(R.width,R.height),Re({composer:y,normalPass:w,downSamplingPass:b}),()=>{for(const z of y.passes)ve(z);y.dispose(),fe.release(g)}},[x,g,d,p,$,I,m,E,c,h,a]);const ke=v.useRef({width:-1,height:-1,pixelRatio:-1});xe((y,w)=>{if(!s||!f)return;const{composer:b}=f;g.getSize(R);const z=g.getPixelRatio(),P=ke.current;(R.width!==P.width||R.height!==P.height||z!==P.pixelRatio)&&(b.setSize(R.width,R.height),P.width=R.width,P.height=R.height,P.pixelRatio=z);const Me=g.autoClear;g.autoClear=u,p&&!u&&g.clearStencil(),b.render(w),g.autoClear=Me},s?l:0);const Y=v.useRef(null),K=v.useRef([]),[Ie,Ee]=v.useState(0);v.useLayoutEffect(()=>{if(!f)return;const y=st(Y.current,w=>w instanceof B||w instanceof L);ut(K,y)&&Ee(w=>w+1)}),v.useLayoutEffect(()=>{if(!f)return;const{composer:y,normalPass:w,downSamplingPass:b}=f,z=vt(K.current,x,M);if(z.some(P=>ft.has(P))){const P=new Be;J.add(P),z.push(P)}for(const P of z)y.addPass(P);return z.length&&(w&&(w.enabled=!0),b&&(b.enabled=!0)),()=>{for(const P of z)y.removePass(P),ve(P);w&&(w.enabled=!1),b&&(b.enabled=!1)}},[f,Ie,x,M]),v.useEffect(()=>(pe.acquire(g,ee),g.toneMapping=ee,()=>{pe.release(g)}),[g]);const Z=v.useMemo(()=>f?{composer:f.composer,normalPass:f.normalPass,downSamplingPass:f.downSamplingPass,resolutionScale:a,camera:x,scene:c,requestRebuild:X,autoClear:u}:null,[f,a,x,c,X,u]);return v.useImperativeHandle(D,()=>f==null?void 0:f.composer,[f]),Z?S.jsx(ct.Provider,{value:Z,children:S.jsx("group",{ref:Y,children:t})}):null}),ht=0,me=new WeakMap,he=new WeakMap,gt=0;function dt(e){let t=he.get(e);return t===void 0&&(t=gt++,he.set(e,t)),t}function V(e,t){if(e===null||typeof e!="object")return e;if(t.has(e))return"[Circular]";if(ArrayBuffer.isView(e)||e instanceof ArrayBuffer)return dt(e);if(t.add(e),Array.isArray(e))return e.map(n=>V(n,t));const r={};for(const n of Object.keys(e).sort())r[n]=V(e[n],t);return r}function $t(e){return JSON.stringify(V(e,new WeakSet))}function xt(e,t){return function({ref:n,blendFunction:a=t==null?void 0:t.blendFunction,opacity:s=t==null?void 0:t.opacity,...l}){let u=me.get(e);if(!u){const h=`@react-three/postprocessing/${e.name}-${ht++}`;Te({[h]:e}),me.set(e,u=h)}const m=H(h=>h.camera),d=v.useMemo(()=>[...l.args??[{...t,...l}]],[$t(l)]);return S.jsx(u,{camera:m,"blendMode-blendFunction":a,"blendMode-opacity-value":s,...l,args:d,ref:n})}}const wt=`
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`,yt=`
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 backgroundColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2)); 
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(backgroundColor, waveColor, clamp(f, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`,Pt=`
precision highp float;
uniform float colorNum;
uniform float pixelSize;
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float bias = mix(0.2, 0.0, smoothstep(0.45, 0.8, luminance));
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;class St extends B{constructor(){const t=new Map([["colorNum",new N(4)],["pixelSize",new N(2)]]);super("RetroEffect",Pt,{uniforms:t}),this.uniforms=t}set colorNum(t){this.uniforms.get("colorNum").value=t}get colorNum(){return this.uniforms.get("colorNum").value}set pixelSize(t){this.uniforms.get("pixelSize").value=t}get pixelSize(){return this.uniforms.get("pixelSize").value}}const bt=xt(St),ze=v.forwardRef((e,t)=>{const{colorNum:r,pixelSize:n}=e;return S.jsx(bt,{ref:t,colorNum:r,pixelSize:n})});ze.displayName="RetroEffect";function Wt({waveSpeed:e,waveFrequency:t,waveAmplitude:r,waveColor:n,backgroundColor:a,colorNum:s,pixelSize:l,disableAnimation:u,enableMouseInteraction:m,mouseRadius:d}){const h=v.useRef(null),p=v.useRef(new T),{viewport:$,size:I,gl:E}=H(),M=v.useRef({time:new N(0),resolution:new N(new T(0,0)),waveSpeed:new N(e),waveFrequency:new N(t),waveAmplitude:new N(r),waveColor:new N(new te(...n)),backgroundColor:new N(new te(...a)),mousePos:new N(new T(0,0)),enableMouseInteraction:new N(m?1:0),mouseRadius:new N(d)});v.useEffect(()=>{const k=E.getPixelRatio(),c=Math.floor(I.width*k),x=Math.floor(I.height*k),f=M.current.resolution.value;(f.x!==c||f.y!==x)&&f.set(c,x)},[I,E]);const D=v.useRef([...n]),g=v.useRef([...a]);xe(({clock:k})=>{const c=M.current;u||(c.time.value=k.getElapsedTime()),c.waveSpeed.value!==e&&(c.waveSpeed.value=e),c.waveFrequency.value!==t&&(c.waveFrequency.value=t),c.waveAmplitude.value!==r&&(c.waveAmplitude.value=r),D.current.every((x,f)=>x===n[f])||(c.waveColor.value.set(...n),D.current=[...n]),g.current.every((x,f)=>x===a[f])||(c.backgroundColor.value.set(...a),g.current=[...a]),c.enableMouseInteraction.value=m?1:0,c.mouseRadius.value=d,m&&c.mousePos.value.copy(p.current)});const G=k=>{if(!m)return;const c=E.domElement.getBoundingClientRect(),x=E.getPixelRatio();p.current.set((k.clientX-c.left)*x,(k.clientY-c.top)*x)};return S.jsxs(S.Fragment,{children:[S.jsxs("mesh",{ref:h,scale:[$.width,$.height,1],children:[S.jsx("planeGeometry",{args:[1,1]}),S.jsx("shaderMaterial",{vertexShader:wt,fragmentShader:yt,uniforms:M.current})]}),S.jsx(mt,{children:S.jsx(ze,{colorNum:s,pixelSize:l})}),S.jsxs("mesh",{onPointerMove:G,position:[0,0,.01],scale:[$.width,$.height,1],visible:!1,children:[S.jsx("planeGeometry",{args:[1,1]}),S.jsx("meshBasicMaterial",{transparent:!0,opacity:0})]})]})}function kt({waveSpeed:e=.05,waveFrequency:t=3,waveAmplitude:r=.3,waveColor:n=[.5,.5,.5],backgroundColor:a=[0,0,0],colorNum:s=4,pixelSize:l=2,disableAnimation:u=!1,enableMouseInteraction:m=!0,mouseRadius:d=1}){return S.jsx(je,{className:"dither-container",camera:{position:[0,0,6]},dpr:1,gl:{antialias:!0,preserveDrawingBuffer:!0},children:S.jsx(Wt,{waveSpeed:e,waveFrequency:t,waveAmplitude:r,waveColor:n,backgroundColor:a,colorNum:s,pixelSize:l,disableAnimation:u,enableMouseInteraction:m,mouseRadius:d})})}export{kt as default};
