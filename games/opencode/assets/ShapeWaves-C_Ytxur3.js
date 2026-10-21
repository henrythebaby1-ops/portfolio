var At=Object.defineProperty;var It=(a,n,s)=>n in a?At(a,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[n]=s;var Pe=(a,n,s)=>It(a,typeof n!="symbol"?n+"":n,s);import{r as b,j as vt}from"./index-D0zNZLAK.js";import{l as Lt,o as qt,i as Dt,s as Bt,u as Me,a as Ct,e as Ee,t as Ce,f as Ft}from"./index-22RFDNDE.js";function ht(a,n,s="read-write"){const T=Lt(a,"storage"),m=typeof s=="string"?{access:s}:s,x=Wt(T.device,n,m.access??"read-write",void 0,m.indirect??!1);return qt(T,x,F=>F.destroy(),F=>{x.onDestroy(F)})}class He{constructor(n,s){Pe(this,"size");Pe(this,"access");Pe(this,"buffer");this.buffer=n,this.access=s,this.size=n.options.size}static create(n,s,T,m,x=!1){const F=x?["storage","copy_dst","copy_src","indirect"]:["storage","copy_dst","copy_src"],ce=n.createBuffer({size:s,usage:F,label:m});return new He(ce,T)}read(){return this.buffer.read(this.size)}write(n,s=0){this.buffer.write($t(n),s)}get gpu(){return this.buffer.gpu}get resourceIdentity(){return this.buffer.resourceIdentity}onDestroy(n){return this.buffer.onDestroy(n)}destroy(){this.buffer.destroy()}}function Wt(a,n,s,T,m=!1){return He.create(a,n,s,T,m)}function $t(a){if(a instanceof ArrayBuffer||ArrayBuffer.isView(a))return a;throw new TypeError("StorageBuffer.write() requires ArrayBuffer or ArrayBufferView.")}const Ht={mixed:0,squares:1,circles:2,triangles:3},Ot=2,Nt=1024,jt=32,Ut=.1,Fe=1/60,Vt=.42,Xt=.94,Yt=.972,Gt=.01,wt=.2,$e=.3,bt=.16,ie=1+$e+bt+wt,Jt=`
fn mod289v3(x: vec3f) -> vec3f { return x - floor(x * (1.0 / 289.0)) * 289.0; }
fn mod289v4(x: vec4f) -> vec4f { return x - floor(x * (1.0 / 289.0)) * 289.0; }
fn permute(x: vec4f) -> vec4f { return mod289v4(((x * 34.0) + 10.0) * x); }
fn taylorInvSqrt(r: vec4f) -> vec4f { return 1.79284291400159 - 0.85373472095314 * r; }
fn fadeCurve(t: vec3f) -> vec3f { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

fn cnoise(P: vec3f) -> f32 {
  var Pi0 = floor(P);
  var Pi1 = Pi0 + vec3f(1.0);
  Pi0 = mod289v3(Pi0);
  Pi1 = mod289v3(Pi1);
  let Pf0 = fract(P);
  let Pf1 = Pf0 - vec3f(1.0);
  let ix = vec4f(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  let iy = vec4f(Pi0.yy, Pi1.yy);
  let iz0 = Pi0.zzzz;
  let iz1 = Pi1.zzzz;

  let ixy = permute(permute(ix) + iy);
  let ixy0 = permute(ixy + iz0);
  let ixy1 = permute(ixy + iz1);

  var gx0 = ixy0 * (1.0 / 7.0);
  var gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  let gz0 = vec4f(0.5) - abs(gx0) - abs(gy0);
  let sz0 = step(gz0, vec4f(0.0));
  gx0 -= sz0 * (step(vec4f(0.0), gx0) - 0.5);
  gy0 -= sz0 * (step(vec4f(0.0), gy0) - 0.5);

  var gx1 = ixy1 * (1.0 / 7.0);
  var gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  let gz1 = vec4f(0.5) - abs(gx1) - abs(gy1);
  let sz1 = step(gz1, vec4f(0.0));
  gx1 -= sz1 * (step(vec4f(0.0), gx1) - 0.5);
  gy1 -= sz1 * (step(vec4f(0.0), gy1) - 0.5);

  var g000 = vec3f(gx0.x, gy0.x, gz0.x);
  var g100 = vec3f(gx0.y, gy0.y, gz0.y);
  var g010 = vec3f(gx0.z, gy0.z, gz0.z);
  var g110 = vec3f(gx0.w, gy0.w, gz0.w);
  var g001 = vec3f(gx1.x, gy1.x, gz1.x);
  var g101 = vec3f(gx1.y, gy1.y, gz1.y);
  var g011 = vec3f(gx1.z, gy1.z, gz1.z);
  var g111 = vec3f(gx1.w, gy1.w, gz1.w);

  let norm0 = taylorInvSqrt(vec4f(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  let norm1 = taylorInvSqrt(vec4f(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  let n000 = dot(g000, Pf0);
  let n100 = dot(g100, vec3f(Pf1.x, Pf0.yz));
  let n010 = dot(g010, vec3f(Pf0.x, Pf1.y, Pf0.z));
  let n110 = dot(g110, vec3f(Pf1.xy, Pf0.z));
  let n001 = dot(g001, vec3f(Pf0.xy, Pf1.z));
  let n101 = dot(g101, vec3f(Pf1.x, Pf0.y, Pf1.z));
  let n011 = dot(g011, vec3f(Pf0.x, Pf1.yz));
  let n111 = dot(g111, Pf1);

  let f = fadeCurve(Pf0);
  let nz = mix(vec4f(n000, n100, n010, n110), vec4f(n001, n101, n011, n111), f.z);
  let ny = mix(nz.xy, nz.zw, f.y);
  return 2.2 * mix(ny.x, ny.y, f.x);
}

fn fbm(p: vec3f) -> f32 {
  var total = 0.0;
  var amplitude = 1.0;
  var weight = 0.0;
  var frequency = 1.0;
  for (var i = 0; i < 2; i++) {
    total += amplitude * cnoise(p * frequency);
    weight += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return total / weight;
}
`,Zt=`
struct Params {
  resolution: vec4f,
  placement: vec4f,
  grid: vec4f,
  field: vec4f,
  motion: vec4f,
  color: vec4f,
  hover: vec4f,
  background: vec4f,
}
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var maskTexture: texture_2d<f32>;
@group(0) @binding(2) var maskSampler: sampler;
@group(0) @binding(3) var<storage, read> charges: array<f32>;

const SEED = vec2f(12.9898, 78.233);
const GLOW_THRESHOLD = 0.6;
${Jt}

fn sdIsoscelesTriangle(point: vec2f, q: vec2f) -> f32 {
  let p = vec2f(abs(point.x), point.y);
  let a = p - q * clamp(dot(p, q) / dot(q, q), 0.0, 1.0);
  let b = p - q * vec2f(clamp(p.x / q.x, 0.0, 1.0), 1.0);
  let s = -sign(q.y);
  let d = min(vec2f(dot(a, a), s * (p.x * q.y - p.y * q.x)), vec2f(dot(b, b), s * (p.y - q.y)));
  return -sqrt(d.x) * sign(d.y);
}

fn shapeDistance(p: vec2f, shape: i32, c: f32) -> f32 {
  if (shape == 0) { return max(abs(p.x), abs(p.y)) - c; }
  if (shape == 1) { return length(p) - c; }
  return sdIsoscelesTriangle(vec2f(p.x, p.y + c), vec2f(c, 2.0 * c));
}

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let resolution = params.resolution.xy;
  let cellPx = params.grid.x;
  let dotSize = params.grid.y;
  let mode = i32(params.grid.z + 0.5);
  let cols = i32(params.grid.w + 0.5);
  let background = params.background.rgb;
  let toSurface = params.hover.w < 0.5;

  let pixel = uv * resolution;
  let origin = params.placement.xy;
  let rows = i32(params.placement.z + 0.5);
  let cell = floor((pixel - origin) / cellPx);
  if (cell.y < 0.0 || i32(cell.y) >= rows || cell.x < 0.0 || i32(cell.x) >= cols) {
    return vec4f(background, select(0.0, 1.0, toSurface));
  }
  let center = origin + (cell + 0.5) * cellPx;
  let local = (pixel - center) / (cellPx * 0.5);
  let cellUv = center / resolution;

  if (params.motion.z > 0.5 && textureSampleLevel(maskTexture, maskSampler, cellUv, 0.0).r > 0.5) {
    return vec4f(background, select(0.0, 1.0, toSurface));
  }

  var level = 1.0;
  let fade = params.motion.w;
  if (fade > 0.0) {
    let q = abs(uv * 2.0 - 1.0);
    let radius = pow(pow(q.x, 2.5) + pow(q.y, 2.5), 1.0 / 2.5) / pow(2.0, 1.0 / 2.5);
    level = 1.0 - smoothstep(max(0.0, 1.0 - fade * 2.2), 1.0, radius);
  }
  let noise = fbm(vec3f((center + params.motion.xy) / params.field.x + SEED, params.field.w));
  let tone = clamp((noise * 0.5 + 0.5 - params.field.y) * params.field.z + 0.5, 0.0, 1.0);
  let band = i32(min(tone, 0.999999) * 3.0);

  var charge = 0.0;
  let index = i32(cell.y) * cols + i32(cell.x);
  if (index >= 0 && index < i32(arrayLength(&charges))) { charge = charges[index]; }
  let stepped = (band + i32(clamp(charge, 0.0, 0.999) * 3.0)) % 3;

  var shape = 2 - stepped;
  var size = dotSize;
  if (mode != 0) {
    shape = mode - 1;
    size = dotSize * mix(0.45, 1.0, f32(stepped) / 2.0);
  }
  let introProgress = params.placement.w;
  var front = 0.0;
  if (introProgress < ${ie.toFixed(2)}) {
    let radial = length((center - resolution * 0.5) / (resolution * 0.5)) * 0.70710678;
    let warp = cnoise(vec3f(cellUv * vec2f(3.2, 2.4) + SEED, 4.7)) * ${$e.toFixed(2)};
    let jitter = hash21(cell) * ${bt.toFixed(2)};
    let spread = radial + warp + jitter + ${$e.toFixed(2)};
    let band = ${wt.toFixed(2)} * (0.6 + 0.8 * hash21(cell + vec2f(17.0, 9.0)));
    let t = clamp((introProgress - spread) / band, 0.0, 1.0);
    if (t <= 0.0) {
      return vec4f(background, select(0.0, 1.0, toSurface));
    }
    let back = t - 1.0;
    size = max(size * (1.0 + 2.70158 * back * back * back + 1.70158 * back * back), 0.02);
    front = 1.0 - smoothstep(0.0, 1.0, abs(introProgress - spread) / band);
  }
  let aa = 2.0 / cellPx;
  let coverage = smoothstep(aa, -aa, shapeDistance(local, shape, size));

  let tint = mix(params.color.rgb, params.hover.rgb, max(smoothstep(0.15, 0.85, charge), front * 0.35));

  let rgb = mix(background, tint, coverage * level);
  if (toSurface) { return vec4f(rgb, 1.0); }
  let luminance = dot(tint * level, vec3f(0.2126, 0.7152, 0.0722));
  let glow = max(0.0, (luminance - GLOW_THRESHOLD) / (1.0 - GLOW_THRESHOLD)) * coverage;
  return vec4f(rgb, glow);
}
`,yt=`
struct Blur { direction: vec4f }
@group(0) @binding(0) var<uniform> blur: Blur;
@group(0) @binding(1) var sourceTexture: texture_2d<f32>;
@group(0) @binding(2) var sourceSampler: sampler;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let sigma = blur.direction.z;
  let radius = i32(ceil(3.0 * sigma));
  var sum = vec3f(0.0);
  var weight = 0.0;
  for (var i = -radius; i <= radius; i++) {
    let offset = f32(i);
    let w = exp(-(offset * offset) / (2.0 * sigma * sigma));
    let sample = textureSampleLevel(sourceTexture, sourceSampler, uv + offset * blur.direction.xy, 0.0);
    sum += select(sample.rgb, sample.rgb * sample.a, blur.direction.w > 0.5) * w;
    weight += w;
  }
  return vec4f(sum / weight, 1.0);
}
`,Kt=`
struct Composite { strength: vec4f }
@group(0) @binding(0) var<uniform> composite: Composite;
@group(0) @binding(1) var sceneTexture: texture_2d<f32>;
@group(0) @binding(2) var glowTexture: texture_2d<f32>;
@group(0) @binding(3) var linearSampler: sampler;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene = textureSampleLevel(sceneTexture, linearSampler, uv, 0.0).rgb;
  let glow = textureSampleLevel(glowTexture, linearSampler, uv, 0.0).rgb;
  return vec4f(scene + glow * composite.strength.x, 1.0);
}
`,We=(a,n)=>{const s=typeof a=="string"?a.trim():"";let m=(/^#?([\da-f]{3}|[\da-f]{6})$/i.exec(s)||/^#?([\da-f]{6})$/i.exec(n))[1];return m.length===3&&(m=m.replace(/./g,x=>x+x)),[0,2,4].map(x=>parseInt(m.slice(x,x+2),16)/255)};function rr({text:a="",fontFamily:n='Geist, "Geist Sans", system-ui, sans-serif',fontWeight:s=500,textSize:T=.6,shapes:m="mixed",cellSize:x=10,dotSize:F=.75,color:ce="#929292",hoverColor:Oe="#ffffff",backgroundColor:Re="#000000",speed:Ne=1,scale:je=1,contrast:Ue=1,brightness:Ve=.4,flow:Xe=0,direction:Ye=0,fade:Ge=.25,interactive:Je=!0,splashRadius:Ze=40,splashStrength:Ke=.4,glow:Qe=.35,intro:et=!0,introDuration:tt=1.6,introKey:Te=0,paused:rt=!1,onError:nt,className:zt=""}){const st=b.useRef(null),at=b.useRef(null),[St,ot]=b.useState(!1),h=b.useRef(null),le=b.useRef(()=>{}),fe=b.useRef(()=>{}),ue=b.useRef(nt);h.current={text:String(a??""),fontFamily:n,fontWeight:s,textSize:T,shapes:m,cellSize:Math.max(2,x),dotSize:F,color:ce,hoverColor:Oe,backgroundColor:Re,speed:Ne,scale:Math.max(.05,je),contrast:Ue,brightness:Ve,flow:Xe,direction:Ye,fade:Ge,interactive:Je,splashRadius:Ze,splashStrength:Ke,glow:Qe,intro:et,introDuration:Math.max(.1,tt),introKey:Te,paused:rt},ue.current=nt;const Pt=[m,x,F,ce,Oe,Re,Ne,je,Ue,Ve,Xe,Ye,Ge,Je,Ze,Ke,Qe,et,tt,rt].join("|"),Mt=[a,n,s,T].join("|"),_e=b.useRef(()=>{});return b.useEffect(()=>{le.current()},[Pt]),b.useEffect(()=>{fe.current()},[Mt]),b.useEffect(()=>{Te&&_e.current()},[Te]),b.useEffect(()=>{const ge=st.current,me=at.current;if(!ge||!me)return;let z=!1,I=!1,r,j,_,L=0,de=0,it=0,ee=[0,0],W=1,pe=!0,ct=!1,d=1,S=1,q=10,U=[0,0],k=new Float32Array(1),y=new Float32Array(1),V=new Float32Array(1),xe=0,lt=0,te=ie,ve=!1,X=!1,Y=null,G,$,H,O=()=>{};const D={x:0,y:0,at:0,inside:!1},re=window.matchMedia("(prefers-reduced-motion: reduce)"),he=document.createElement("canvas"),A=he.getContext("2d"),ye=()=>O(),ke=()=>{Y=null},Et=(i,w,c)=>{const p=h.current,P=Math.max(.5,p.splashRadius*W/q*.5),B=Math.ceil(P*2.5),M=(i*W-U[0])/q-.5,E=(w*W-U[1])/q-.5,ne=Math.max(0,Math.floor(E-B)),K=Math.min(S-1,Math.ceil(E+B)),Q=Math.max(0,Math.floor(M-B)),we=Math.min(d-1,Math.ceil(M+B));for(let J=ne;J<=K;J++){const se=J-E;for(let Z=Q;Z<=we;Z++){const ae=Z-M,be=c*Math.exp(-(ae*ae+se*se)/(2*P*P)),oe=J*d+Z;y[oe]=Math.min(1.2,y[oe]+be)}}X=!0},ft=i=>{if(!h.current.interactive)return;Y||(Y=ge.getBoundingClientRect());const w=performance.now(),c=i.clientX-Y.left,p=i.clientY-Y.top,P=c>=0&&p>=0&&c<=Y.width&&p<=Y.height;if(P){const B=D.inside?Math.max(8,w-D.at):16,E=(D.inside?Math.hypot(c-D.x,p-D.y):0)/B*1e3;Et(c,p,Math.min(1,.22+E*6e-4)*h.current.splashStrength),O()}D.x=c,D.y=p,D.at=w,D.inside=P},Ae=i=>{var c;if(z||I)return;I=!0,L&&cancelAnimationFrame(L),L=0,$==null||$.disconnect(),H==null||H.disconnect(),G==null||G(),le.current=()=>{},fe.current=()=>{};const w=r;r=void 0,w==null||w.dispose(),ot(!1),(c=ue.current)==null||c.call(ue,i instanceof Error?i:new Error(String(i)))},ut=()=>(W=Math.min(window.devicePixelRatio||1,Ot),[Math.max(1,Math.round(me.clientWidth*W)),Math.max(1,Math.round(me.clientHeight*W))]);return(async()=>{try{if(r=await Dt({powerPreference:"low-power"}),z)return r.dispose();G=r.onError(Ae);const i=ut(),w=navigator.gpu.getPreferredCanvasFormat(),c=Bt(r,me,{dpr:W,size:i,autoResize:!1,format:w}),p=Me(r,{resolution:[i[0],i[1],1/i[0],1/i[1]],placement:[0,0,1,0],grid:[10,.75,0,1],field:[320,.5,2.8,0],motion:[0,0,0,.25],color:[.573,.573,.573,1],hover:[1,1,1,0],background:[0,0,0,1]}),P=Ct(r,{minFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=(e,t)=>r.device.createTexture({size:[e,t],format:"rgba8unorm",usage:["texture_binding","copy_dst","render_attachment"],label:"shape-waves-mask"});j=B(1,1),_=ht(r,4,"read"),_.write(k);const M=Ee(r,Zt,{label:"shape-waves-scene",set:{params:p,maskTexture:j,maskSampler:P,charges:_}}),E=Ce(r,{size:i,format:"rgba8unorm",label:"shape-waves-scene"}),ne=e=>[Math.max(1,Math.ceil(e[0]/2)),Math.max(1,Math.ceil(e[1]/2))],K=Ce(r,{size:ne(i),format:"rgba8unorm",label:"shape-waves-glow-a"}),Q=Ce(r,{size:ne(i),format:"rgba8unorm",label:"shape-waves-glow-b"}),we=Me(r,{direction:[0,0,4,1]}),J=Me(r,{direction:[0,0,4,0]}),se=Ee(r,yt,{label:"shape-waves-glow-x",set:{blur:we,sourceTexture:E,sourceSampler:P}}),Z=Ee(r,yt,{label:"shape-waves-glow-y",set:{blur:J,sourceTexture:K,sourceSampler:P}}),ae=Me(r,{strength:[2,0,0,0]}),be=Ee(r,Kt,{label:"shape-waves-composite",set:{composite:ae,sceneTexture:E,glowTexture:Q,linearSampler:P}});if(await Promise.all([M.compile({colors:[w]}),M.compile(E),se.compile(K),Z.compile(Q),be.compile({colors:[w]})]),z)return;const oe=()=>h.current.glow>0;let gt=!1;const Rt=()=>{const e=h.current,[t,f]=c.size,u=Math.max(1,Math.round(t/(e.cellSize*W)));q=t/u;const o=Math.max(1,Math.floor(f/q));if(U=[0,(f-o*q)/2],u===d&&o===S&&k.length===d*S)return;d=u,S=o,k=new Float32Array(d*S),y=new Float32Array(d*S),V=new Float32Array(d*S),X=!1;const R=ht(r,k.byteLength,"read");R.write(k),M.set({charges:R}),_.destroy(),_=R},Tt=()=>{const e=d-1,t=S-1;let f=0;for(let o=0;o<S;o++){const R=(o===0?o:o-1)*d,l=(o===t?o:o+1)*d,v=o*d;for(let g=0;g<d;g++){const C=v+g,ze=v+(g===0?g:g-1),Se=v+(g===e?g:g+1),N=y[C],qe=y[ze]+y[Se]+y[R+g]+y[l+g]-4*N,De=(N-V[C])*Xt,xt=(N+De+Vt*qe)*Yt;V[C]=xt;const Be=Math.min(1,Math.max(0,xt));k[C]=Be,Be>f&&(f=Be)}}const u=y;return y=V,V=u,f},_t=e=>{if(!X)return!1;xe=Math.min(xe+e,Fe*4);let t=1;for(;xe>=Fe;)xe-=Fe,t=Tt();return t<Gt&&(y.fill(0),V.fill(0),k.fill(0),X=!1),_.write(k),X},kt=()=>{const e=h.current;return pe&&!document.hidden&&!e.paused&&e.speed>0&&!re.matches},mt=e=>{if(L=0,z||I)return;const t=h.current,f=de?Math.min(.1,(e-de)/1e3):0;de=e;const u=kt();if(u){it+=f*Ut*t.speed;const l=t.direction*Math.PI/180,v=t.flow*q*f;ee=[ee[0]+Math.cos(l)*v,ee[1]+Math.sin(l)*v]}const o=pe&&!document.hidden&&_t(f);ve&&(ve=!1,lt=e,te=0);const R=te<ie;R&&(te=Math.min(ie,(e-lt)/1e3/t.introDuration*ie)),p.set({placement:[U[0],U[1],S,te]}),p.set({field:[jt*q*t.scale,.5-(t.brightness-.5)*.4,2.8*t.contrast,it]}),p.set({motion:[ee[0],ee[1],t.text.trim()?1:0,t.fade]});try{Ft(r,l=>{if(!oe()){l.pass(c,M);return}l.pass(E,M),l.pass(K,se),l.pass(Q,Z),l.pass(c,be)})}catch(l){Ae(l);return}ct||(ct=!0,ot(!0)),u||o||R?L=requestAnimationFrame(mt):de=0};O=()=>{z||I||L||(L=requestAnimationFrame(mt))};const Ie=()=>{const e=h.current,t=e.text.trim(),[f,u]=c.size,o=t.length>0,R=o?Math.min(1,Nt/Math.max(f,u)):0,l=o?Math.max(1,Math.round(f*R)):1,v=o?Math.max(1,Math.round(u*R)):1;if(he.width=l,he.height=v,A.fillStyle="#000",A.fillRect(0,0,l,v),o){let C=Math.max(1,e.textSize*v);A.font=`${e.fontWeight} ${C}px ${e.fontFamily}`;const ze=A.measureText(t).width,Se=l*.9;ze>Se&&(C=Math.max(1,C*Se/ze),A.font=`${e.fontWeight} ${C}px ${e.fontFamily}`),A.textAlign="center",A.textBaseline="alphabetic";const N=A.measureText(t),qe=(l+N.actualBoundingBoxLeft-N.actualBoundingBoxRight)/2,De=(v+N.actualBoundingBoxAscent-N.actualBoundingBoxDescent)/2;A.fillStyle="#fff",A.fillText(t,qe,De)}const g=B(l,v);r.gpu.queue.copyExternalImageToTexture({source:he},{texture:g.gpu},[l,v]),M.set({maskTexture:g}),j.destroy(),j=g},Le=()=>{if(z||I)return;const e=h.current;Rt(),p.set({placement:[U[0],U[1],S,te],grid:[q,Math.min(1,Math.max(.1,e.dotSize)),Ht[e.shapes]??0,d],color:[...We(e.color,"#929292"),1],hover:[...We(e.hoverColor,"#ffffff"),oe()?1:0],background:[...We(e.backgroundColor,"#000000"),1]}),ae.set({strength:[2*e.glow,0,0,0]}),e.intro!==gt&&(gt=e.intro,e.intro&&!re.matches&&(ve=!0)),!e.interactive&&X&&(y.fill(0),V.fill(0),k.fill(0),X=!1,_.write(k)),O()},dt=()=>{var t;if(z||I)return;Ie(),Le();const e=h.current;!e.text.trim()||!((t=document.fonts)!=null&&t.load)||document.fonts.load(`${e.fontWeight} 32px ${e.fontFamily}`).then(()=>{z||I||(Ie(),O())}).catch(()=>{})},pt=()=>{if(z||I)return;ke();const e=ut();(e[0]!==c.size[0]||e[1]!==c.size[1])&&c.resize(e);const[t,f]=c.size;E.resize([t,f]);const u=ne([t,f]);K.resize(u),Q.resize(u),we.set({direction:[1/u[0],0,4,1]}),J.set({direction:[0,1/u[1],4,0]}),p.set({resolution:[t,f,1/t,1/f]}),Ie(),Le()};le.current=Le,fe.current=dt,_e.current=()=>{z||I||!h.current.intro||re.matches||(ve=!0,O())},$=new ResizeObserver(pt),$.observe(ge),H=new IntersectionObserver(e=>{pe=e.some(t=>t.isIntersecting),pe&&O()},{threshold:0}),H.observe(ge),document.addEventListener("visibilitychange",ye),re.addEventListener("change",ye),window.addEventListener("pointermove",ft,{passive:!0}),window.addEventListener("scroll",ke,{capture:!0,passive:!0}),pt(),dt()}catch(i){Ae(i)}})(),()=>{z=!0,O=()=>{},le.current=()=>{},fe.current=()=>{},_e.current=()=>{},document.removeEventListener("visibilitychange",ye),re.removeEventListener("change",ye),window.removeEventListener("pointermove",ft),window.removeEventListener("scroll",ke,{capture:!0}),$==null||$.disconnect(),H==null||H.disconnect(),G==null||G(),L&&cancelAnimationFrame(L),j==null||j.destroy(),_==null||_.destroy(),r==null||r.dispose()}},[]),vt.jsx("div",{ref:st,className:`shape-waves ${zt}`,"data-ready":St,style:{backgroundColor:Re},"aria-hidden":"true",children:vt.jsx("canvas",{ref:at,className:"shape-waves__canvas"})})}export{rr as default};
