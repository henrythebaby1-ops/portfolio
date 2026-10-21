import{r as ie,R as Qe,T as Ve,b as Pe,M as Ne,j as Je,a as Ze,P as et}from"./index-tDOHgNLd.js";const tt="",nt={bayer:0,noise:1,lines:2},Te={atkinson:[[1,0,1/8],[2,0,1/8],[-1,1,1/8],[0,1,1/8],[1,1,1/8],[0,2,1/8]],floyd:[[1,0,7/16],[-1,1,3/16],[0,1,5/16],[1,1,1/16]]},Be=.5,De=4,_e=1.2,We=1.6,at=1100,xe=r=>{let o=String(r||"").replace("#","");o.length===3&&(o=o.replace(/./g,m=>m+m));const f=parseInt(o.slice(0,6),16);return Number.isNaN(f)?[0,0,0]:[(f>>16&255)/255,(f>>8&255)/255,(f&255)/255]},ot=(r,o,f,m,g)=>{const l=r/o/(f/m);return g?l>1?[l,1]:[1,1/l]:l>1?[1,1/l]:[l,1]},rt=(r,o,f)=>[o*(.5+.33*Math.sin(r*.53)+.08*Math.sin(r*1.31+.6)),f*(.5+.28*Math.sin(r*.71+1.1)+.07*Math.cos(r*1.57))],st=(r,o)=>{r.canvas.width=32,r.canvas.height=32,r.drawImage(o,0,0,32,32);const m=r.getImageData(0,0,32,32).data,g=[0,0,0],l=[0,0,0];let h=0;for(let w=0;w<32;w++)for(let u=0;u<32;u++)if(!(u>0&&w>0&&u<31&&w<31)){for(let s=0;s<3;s++){const C=m[(w*32+u)*4+s]/255;g[s]+=C,l[s]+=C*C}h++}const M=[g[0]/h,g[1]/h,g[2]/h],R=M.reduce((w,u,s)=>w+Math.sqrt(Math.max(0,l[s]/h-u*u)),0)/3;return{matte:M,plain:R<.06}};let ye=null;const it=()=>{if(ye)return ye;const r=64,o=r*r,f=r-1,m=[];for(let t=-6;t<=6;t++)for(let a=-6;a<=6;a++)m.push(a,t,Math.exp(-(a*a+t*t)/4.5));const g=new Float32Array(o),l=new Uint8Array(o),h=(t,a)=>{const E=t%r,L=(t-E)/r;for(let x=0;x<m.length;x+=3)g[(L+m[x+1]&f)*r+(E+m[x]&f)]+=a*m[x+2]},M=(t,a)=>{let E=0,L=a?-1/0:1/0;for(let x=0;x<o;x++)l[x]===t&&(a?g[x]>L:g[x]<L)&&(L=g[x],E=x);return E};let R=7;const w=()=>(R=R*16807%2147483647,R/2147483647),u=Math.round(o*.1);for(let t=0;t<u;){const a=Math.floor(w()*o);l[a]||(l[a]=1,h(a,1),t++)}for(let t=0;t<o;t++){const a=M(1,!0);l[a]=0,h(a,-1);const E=M(0,!1);if(l[E]=1,h(E,1),E===a)break}const s=l.slice(),C=g.slice(),S=new Uint16Array(o);for(let t=u-1;t>=0;t--){const a=M(1,!0);l[a]=0,h(a,-1),S[a]=t}l.set(s),g.set(C);for(let t=u;t<o;t++){const a=M(0,!1);l[a]=1,h(a,1),S[a]=t}const b=new Uint8Array(o*4);for(let t=0;t<o;t++){const a=Math.floor(S[t]/o*256);b[t*4]=a,b[t*4+1]=a,b[t*4+2]=a,b[t*4+3]=255}return ye=b,b},lt=(r,o,f,m,g,l,h)=>{const M=l?3:1,R=new Float32Array(o*f*M);for(let s=0;s<o*f;s++){const C=r[s*4]/255,S=r[s*4+1]/255,b=r[s*4+2]/255;l?(R[s*3]=h(C),R[s*3+1]=h(S),R[s*3+2]=h(b)):R[s]=h(.2126*C+.7152*S+.0722*b)}const w=g-1,u=new Uint8Array(o*f*4);for(let s=0;s<f;s++){const C=s&1?-1:1;for(let S=0;S<o;S++){const b=C>0?S:o-1-S,t=s*o+b;for(let a=0;a<M;a++){const E=R[t*M+a],L=Math.min(w,Math.max(0,Math.round(E*w)))/w,x=E-L,ee=Math.round(L*255);l?u[t*4+a]=ee:u[t*4]=u[t*4+1]=u[t*4+2]=ee;for(let N=0;N<m.length;N++){const K=b+m[N][0]*C,z=s+m[N][1];K<0||K>=o||z>=f||(R[(z*o+K)*M+a]+=x*m[N][2])}}u[t*4+3]=255}}return u},ut=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ct=`#version 300 es
precision highp float;

uniform sampler2D tPrev;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uSoftness;
uniform float uStrength;
uniform float uFade;
uniform float uHold;

in vec2 vUv;
out vec4 fragColor;

float strokeDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
  return length(p - a - ab * h);
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uSize;
  float trail = max(texture(tPrev, vUv).r - uFade, 0.0);
  float band = max(uRadius * uSoftness, 1.0) * uHold;
  float d = strokeDistance(p, uFrom, uTo);
  trail = max(trail, clamp((uRadius - d) / band, 0.0, 1.0) * uStrength);
  fragColor = vec4(trail, 0.0, 0.0, 1.0);
}
`,vt=`#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tImage;
uniform sampler2D tMask;
uniform sampler2D tNoise;
uniform sampler2D tDiffused;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform float uLod;
uniform float uCell;
uniform int uPattern;
uniform int uPalette;
uniform float uLevels;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uRimColor;
uniform float uRim;
uniform float uContrast;
uniform float uBrightness;
uniform float uReverse;
uniform float uIntro;
uniform float uHold;
uniform vec3 uMatte;
uniform float uKey;
uniform vec2 uSize;
uniform vec4 uBursts[4];
uniform float uBurstWidth;

in vec2 vUv;
out vec4 fragColor;

float bayer(vec2 cell) {
  ivec2 p = ivec2(mod(cell, 8.0));
  int v = p.x ^ p.y;
  int m = ((v & 1) << 5) | ((p.y & 1) << 4) | ((v & 2) << 2) | ((p.y & 2) << 1) | ((v & 4) >> 1) | ((p.y & 4) >> 2);
  return (float(m) + 0.5) / 64.0;
}

float blueNoise(vec2 cell) {
  return (texelFetch(tNoise, ivec2(mod(cell, 64.0)), 0).r * 255.0 + 0.5) / 256.0;
}

float engraving(vec2 cell) {
  float period = 6.0;
  float f = (mod(cell.x + cell.y, period) + 0.5) / period;
  return clamp(abs(f * 2.0 - 1.0) + (bayer(cell) - 0.5) * (2.0 / period), 0.0, 1.0);
}

vec2 imageUv(vec2 uv) {
  return (uv - 0.5) * uCover + 0.5;
}

float within(vec2 p) {
  vec2 s = step(vec2(0.0), p) * step(p, vec2(1.0));
  return s.x * s.y;
}

vec3 grade(vec3 c) {
  return pow(clamp((c - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0), vec3(1.6));
}

float shockwave(vec2 p) {
  float value = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 burst = uBursts[i];
    if (burst.w <= 0.0) continue;
    float offset = distance(p, burst.xy) - burst.z;
    float edge = offset > 0.0 ? offset / (uBurstWidth * 0.35) : -offset / uBurstWidth;
    value = max(value, clamp(1.0 - edge, 0.0, 1.0) * burst.w);
  }
  return value;
}

vec3 toned(vec3 c) {
  return uPalette == 1 ? grade(c) : grade(vec3(dot(c, vec3(0.2126, 0.7152, 0.0722))));
}

vec3 quantize(vec3 v, float t) {
  float steps = max(uLevels - 1.0, 1.0);
  vec3 s = v * steps;
  vec3 base = floor(s);
  return min(base + step(vec3(t), s - base), vec3(steps)) / steps;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell;
  vec2 cellUv = vec2(center.x / uResolution.x, 1.0 - center.y / uResolution.y);

  vec2 sampleUv = imageUv(cellUv);
  float framed = within(sampleUv);
  vec3 level;
  if (uPattern == 3) {
    level = texelFetch(tDiffused, ivec2(cell), 0).rgb;
  } else {
    vec3 c = mix(uMatte, textureLod(tImage, sampleUv, uLod).rgb, framed);
    float t = uPattern == 1 ? blueNoise(cell) : (uPattern == 2 ? engraving(cell) : bayer(cell));
    level = quantize(toned(c), t);
  }

  vec3 color = mix(uInk, mix(uInk, uPaper, level), max(framed, uKey));
  vec3 backdrop = mix(uInk, uPaper, toned(uMatte));
  vec2 photoUv = imageUv(vUv);
  vec3 raw = texture(tImage, photoUv).rgb;
  float plain = uKey * (1.0 - smoothstep(0.05, 0.22, distance(raw, uMatte)));
  vec3 photo = mix(mix(uInk, backdrop, uKey), mix(raw, backdrop, plain), within(photoUv));

  vec2 point = vec2(cellUv.x, 1.0 - cellUv.y) * uSize;
  float mask = max(clamp(texture(tMask, cellUv).r * uHold, 0.0, 1.0), shockwave(point));
  float shown = mix(mask, 1.0 - mask, uReverse);
  float order = bayer(cell.yx);
  float low = order * (1.0 - uRim);
  color = mix(color, uRimColor, step(low, shown) * step(0.001, uRim));
  color = mix(color, photo, step(low + uRim, shown));

  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  float spread = length((cellUv - 0.5) * aspect) / length(aspect * 0.5);
  float appear = step(spread * 0.72 + bayer(cell + vec2(3.0, 5.0)) * 0.28, uIntro * 1.001);
  fragColor = vec4(mix(uInk, color, appear), 1.0);
}
`,mt=({src:r=tt,fit:o="contain",pattern:f="floyd",pixelSize:m=2,levels:g=2,palette:l="duotone",inkColor:h="#120f17",paperColor:M="#f4f1ea",contrast:R=1.15,brightness:w=0,revealRadius:u=200,softness:s=.6,linger:C=1,rimColor:S="#a78bfa",rim:b=0,reverse:t=!1,wander:a=!1,clickBurst:E=!0,className:L="",style:x})=>{const ee=ie.useRef(null),N=ie.useRef(null),K=ie.useRef(()=>{});return ie.useEffect(()=>{N.current={fit:o,pattern:f,pixelSize:m,levels:g,palette:l,inkColor:h,paperColor:M,contrast:R,brightness:w,revealRadius:u,softness:s,linger:C,rimColor:S,rim:b,reverse:t,wander:a,clickBurst:E},K.current()}),ie.useEffect(()=>{var Ae;const z=ee.current;if(!z)return;const Oe=(Ae=window.matchMedia)==null?void 0:Ae.call(window,"(prefers-reduced-motion: reduce)").matches,q=new Qe({dpr:Math.min(window.devicePixelRatio||1,2),alpha:!1,antialias:!1}),c=q.gl,p=c.canvas;p.style.display="block",p.style.width="100%",p.style.height="100%",z.appendChild(p);const ve=q.isWebgl2&&!!q.getExtension("EXT_color_buffer_float"),we=new Ve(c),Me=()=>new Pe(c,{image:new Uint8Array(4),width:1,height:1,generateMipmaps:!1,flipY:!1,minFilter:c.NEAREST,magFilter:c.NEAREST}),Re=new Pe(c,{minFilter:c.LINEAR_MIPMAP_LINEAR,magFilter:c.LINEAR}),$=Me(),te=Me(),le=(n,e)=>new Ze(c,{width:n,height:e,depth:!1,type:ve?c.HALF_FLOAT:c.UNSIGNED_BYTE,internalFormat:ve?c.RGBA16F:c.RGBA,minFilter:c.LINEAR,magFilter:c.LINEAR}),He=n=>{c.deleteFramebuffer(n.buffer),c.deleteTexture(n.texture.texture)};let A=[le(2,2),le(2,2)];const T={tPrev:{value:A[0].texture},uSize:{value:[1,1]},uFrom:{value:[0,0]},uTo:{value:[0,0]},uRadius:{value:1},uSoftness:{value:.5},uStrength:{value:0},uFade:{value:1},uHold:{value:We}},i={tImage:{value:Re},tMask:{value:A[0].texture},tNoise:{value:$},tDiffused:{value:te},uResolution:{value:[1,1]},uCover:{value:[1,1]},uLod:{value:0},uCell:{value:3},uPattern:{value:0},uPalette:{value:0},uLevels:{value:2},uInk:{value:[0,0,0]},uPaper:{value:[1,1,1]},uRimColor:{value:[1,1,1]},uRim:{value:0},uContrast:{value:1},uBrightness:{value:0},uReverse:{value:0},uIntro:{value:0},uHold:{value:We},uMatte:{value:[0,0,0]},uKey:{value:0},uSize:{value:[1,1]},uBursts:{value:Array.from({length:De*4},()=>0)},uBurstWidth:{value:60}},be=(n,e)=>new et(c,{vertex:ut,fragment:n,uniforms:e,depthTest:!1,depthWrite:!1}),Ke=new Ne(c,{geometry:we,program:be(ct,T)}),qe=new Ne(c,{geometry:we,program:be(vt,i)}),fe=document.createElement("canvas"),B=fe.getContext("2d",{willReadFrequently:!0});let U=null,Ee=0,ke="",Ce=!1,D=1,_=1,me=!0,ne=0,de=performance.now(),Se=0,Q=0,V=0;const d={x:0,y:0,inside:!1,fresh:!0,placed:!1},y={x:0,y:0,px:0,py:0},W=[],Ue=()=>{D=Math.max(1,z.clientWidth),_=Math.max(1,z.clientHeight),q.setSize(D,_),i.uResolution.value=[p.width,p.height],T.uSize.value=[D,_],i.uSize.value=[D,_];const n=Math.max(2,Math.round(D*Be)),e=Math.max(2,Math.round(_*Be));(n!==A[0].width||e!==A[0].height)&&(A.forEach(He),A=[le(n,e),le(n,e)]),d.placed||(d.x=D/2,d.y=_/2)},je=(n,e)=>{if(!U||!B)return;const k=Math.ceil(p.width/n),I=Math.ceil(p.height/n),G=[e.pattern,e.levels,e.palette,e.contrast,e.brightness,e.fit,k,I,p.width,p.height].join("|");if(G===ke)return;ke=G;const[X,H]=i.uCover.value,oe=U.naturalWidth,re=U.naturalHeight;fe.width=k,fe.height=I,B.imageSmoothingEnabled=!0,B.imageSmoothingQuality="high";const[se,J,he]=i.uMatte.value;B.fillStyle=`rgb(${se*255}, ${J*255}, ${he*255})`,B.fillRect(0,0,k,I);const Z=(.5-.5*X)*oe,ce=(.5-.5*H)*re,v=k*n/p.width*X*oe,P=I*n/p.height*H*re,F=Math.max(Z,0),Y=Math.max(ce,0),pe=Math.min(Z+v,oe),ge=Math.min(ce+P,re);pe>F&&ge>Y&&B.drawImage(U,F,Y,pe-F,ge-Y,(F-Z)/v*k,(Y-ce)/P*I,(pe-F)/v*k,(ge-Y)/P*I);const Xe=$e=>Math.pow(Math.min(1,Math.max(0,($e-.5)*e.contrast+.5+e.brightness)),1.6),Ye=B.getImageData(0,0,k,I).data;te.image=lt(Ye,k,I,Te[e.pattern],e.levels,e.palette==="rgb",Xe),te.width=k,te.height=I,te.needsUpdate=!0},Ie=n=>{ne=0;const e=N.current;if(!e)return;const k=Math.min(.05,Math.max(0,(n-de)/1e3));de=n;const I=e.wander&&!Oe;let G=d.x,X=d.y;if(!d.inside&&I){V=Math.min(1,V+k/1.2);const[v,P]=rt(n/1e3,D,_),F=V*V*(3-2*V);G+=(v-G)*F,X+=(P-X)*F}else V=0;if(Q+=((d.inside||I?1:0)-Q)*(1-Math.exp(-k/.16)),d.fresh)y.x=y.px=G,y.y=y.py=X,d.fresh=!1;else{const v=1-Math.exp(-k/.035);y.x+=(G-y.x)*v,y.y+=(X-y.y)*v}const H=i.uBursts.value;H.fill(0);for(let v=W.length-1;v>=0;v--)(n-W[v].start)/1e3>=_e&&W.splice(v,1);W.forEach((v,P)=>{const F=Math.max(0,(n-v.start)/1e3/_e),Y=Math.hypot(Math.max(v.x,D-v.x),Math.max(v.y,_-v.y))+i.uBurstWidth.value;H[P*4]=v.x,H[P*4+1]=v.y,H[P*4+2]=Y*Math.sin(F*Math.PI/2),H[P*4+3]=1-F*F*F}),Q>.002&&(Se=n+e.linger*1e3+150);const oe=ve?0:1.5/255,re=e.linger>0?k/e.linger:1;T.tPrev.value=A[0].texture,T.uFrom.value=[y.px,y.py],T.uTo.value=[y.x,y.y],T.uRadius.value=e.revealRadius*(.45+.55*Q),T.uSoftness.value=e.softness,T.uStrength.value=Q,T.uFade.value=Math.max(re,oe),i.uBurstWidth.value=Math.max(60,e.revealRadius*.9),q.render({scene:Ke,target:A[1]}),A.reverse(),y.px=y.x,y.py=y.y;const se=Math.max(1,Math.round(e.pixelSize*q.dpr));U&&(i.uCover.value=ot(p.width,p.height,U.naturalWidth,U.naturalHeight,e.fit==="contain"));let J=nt[e.pattern]??0;if(Te[e.pattern]&&(J=0,U&&!Ce))try{je(se,e),J=3}catch{Ce=!0}J===1&&$.width!==64&&($.image=it(),$.width=64,$.height=64,$.needsUpdate=!0);const he=U?i.uCover.value[0]*U.naturalWidth/p.width:1;i.tMask.value=A[0].texture,i.uCell.value=se,i.uLod.value=Math.log2(Math.max(se*he,1)),i.uPattern.value=J,i.uPalette.value=e.palette==="rgb"?1:0,i.uLevels.value=Math.max(2,Math.round(e.levels)),i.uInk.value=xe(e.inkColor),i.uPaper.value=xe(e.paperColor),i.uRimColor.value=xe(e.rimColor),i.uRim.value=Math.min(Math.max(e.rim,0),.95),i.uContrast.value=e.contrast,i.uBrightness.value=e.brightness,i.uReverse.value=e.reverse?1:0;const Z=U?Math.min(1,(n-Ee)/at):0;i.uIntro.value=1-Math.pow(1-Z,2),q.render({scene:qe}),(d.inside||I||Q>.002||W.length>0||n<Se||U&&Z<1)&&me&&(ne=requestAnimationFrame(Ie))},j=()=>{ne||!me||(de=performance.now(),ne=requestAnimationFrame(Ie))};K.current=j;const O=new Image;O.crossOrigin="anonymous",O.decoding="async",O.onload=()=>{U=O,Re.image=O;try{if(B){const n=st(B,O);i.uMatte.value=n.matte,i.uKey.value=n.plain?1:0}}catch{}Ee=performance.now(),j()},O.src=r;const Ge=n=>{const e=z.getBoundingClientRect();d.x=n.clientX-e.left,d.y=n.clientY-e.top,d.placed=!0},ae=n=>{Ge(n),d.inside||(d.inside=!0,d.fresh=!0),j()},ue=()=>{d.inside=!1,j()},Fe=n=>{var e;ae(n),!(!((e=N.current)!=null&&e.clickBurst)||n.pointerType==="mouse"&&n.button!==0)&&(W.push({x:d.x,y:d.y,start:performance.now()}),W.length>De&&W.shift())};window.addEventListener("pointermove",ae,{passive:!0}),window.addEventListener("pointerover",ae,{passive:!0}),window.addEventListener("pointerdown",Fe,{passive:!0}),document.documentElement.addEventListener("pointerleave",ue,{passive:!0}),window.addEventListener("pointercancel",ue,{passive:!0});const Le=new ResizeObserver(()=>{Ue(),j()});Le.observe(z);const ze=new IntersectionObserver(([n])=>{me=n.isIntersecting,j()});return ze.observe(z),Ue(),j(),()=>{var n;cancelAnimationFrame(ne),K.current=()=>{},Le.disconnect(),ze.disconnect(),O.onload=null,window.removeEventListener("pointermove",ae),window.removeEventListener("pointerover",ae),window.removeEventListener("pointerdown",Fe),document.documentElement.removeEventListener("pointerleave",ue),window.removeEventListener("pointercancel",ue),(n=c.getExtension("WEBGL_lose_context"))==null||n.loseContext(),p.parentNode&&p.parentNode.removeChild(p)}},[r]),Je.jsx("div",{ref:ee,className:`dither-veil ${L}`.trim(),style:x})};export{mt as default};
