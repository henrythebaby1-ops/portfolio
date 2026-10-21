import{r as y,R as ge,b as xe,G as we,P as ie,M as re,a as ye,T as Te,j as Ee}from"./index-D0zNZLAK.js";const d=100,ne={low:.4,medium:.7,high:1},M=1.5,Se=Math.log(500),be=`
precision highp float;

attribute vec2 position;
attribute vec2 uv;
attribute vec2 iOffset;
attribute vec2 iScale;
attribute float iOpacity;

varying vec2 vUv;
varying float vOpacity;

void main() {
  vUv = uv;
  vOpacity = iOpacity;
  gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
}
`,De=`
precision highp float;

varying vec2 vUv;
varying float vOpacity;

uniform float uRings;

const float PI = 3.141592653589793;
const float EDGE = 0.006737947;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;

  float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);

  brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);

  gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
}
`,Me=`
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Re=`
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTexel;
uniform vec3 uTint;
uniform vec3 uHighlight;
uniform float uStrength;
uniform float uSwirl;
uniform float uDispersion;
uniform float uGlint;
uniform float uTintAmount;
uniform float uGrayscale;

const float TAU = 6.283185307179586;

vec2 coverUV(vec2 uv) {
  vec2 safe = max(uTextureSize, vec2(1.0));
  vec2 s = uResolution / safe;
  vec2 scaledSize = safe * max(s.x, s.y);
  vec2 offset = (uResolution - scaledSize) * 0.5;
  return (uv * uResolution - offset) / scaledSize;
}

void main() {
  float amount = texture2D(uDisplacement, vUv).r;
  vec2 base = coverUV(vUv);

  float theta = amount * uSwirl * TAU;
  vec2 dir = vec2(sin(theta), cos(theta));
  vec2 push = dir * amount * uStrength;

  vec3 color;
  if (uDispersion > 0.001) {
    float split = uDispersion * 0.25;
    color.r = texture2D(uTexture, base + push * (1.0 + split)).r;
    color.g = texture2D(uTexture, base + push).g;
    color.b = texture2D(uTexture, base + push * (1.0 - split)).b;
  } else {
    color = texture2D(uTexture, base + push).rgb;
  }

  if (uGrayscale > 0.001) {
    color = mix(color, vec3(dot(color, vec3(0.2126, 0.7152, 0.0722))), uGrayscale);
  }

  if (uTintAmount > 0.001) {
    color = mix(color, color * uTint * 1.9, clamp(amount * 1.6, 0.0, 1.0) * uTintAmount);
  }

  if (uGlint > 0.001) {
    float ex = texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
    float ey = texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r - texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
    vec3 normal = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
    vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
    float raw = pow(max(dot(normal, light), 0.0), 22.0);
    float flatSpec = pow(max(light.z, 0.0), 22.0);
    color += uHighlight * clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) * uGlint;
  }

  gl_FragColor = vec4(color, 1.0);
}
`,R=T=>{const h=T.replace("#",""),g=h.length===3?h.split("").map(v=>v+v).join(""):h,s=parseInt(g,16);return Number.isNaN(s)?[1,1,1]:[(s>>16&255)/255,(s>>8&255)/255,(s&255)/255]},ze=({src:T="",brushSize:h=150,strength:g=.2,swirl:s=1,rings:v=4,spread:se=5,fade:ce=3,spacing:ue=15,dispersion:A=0,glint:z=0,tint:U="#a855f7",tintAmount:O=.1,grayscale:G=!0,highlightColor:F="#ffffff",trigger:le="hover",clickStrength:ve=2,quality:H="low",enabled:fe=!0,className:pe="",style:me})=>{const V=y.useRef(null),x=y.useRef({}),_=y.useRef(null);return x.current={brushSize:h,spread:se,fade:ce,spacing:ue,clickStrength:ve,trigger:le,enabled:fe},y.useEffect(()=>{const o=V.current;if(!o)return;const E=typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,S=new ge({alpha:!1,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),t=S.gl;t.clearColor(0,0,0,1);const f=t.canvas;f.style.width="100%",f.style.height="100%",f.style.display="block",o.appendChild(f);const j=new xe(t,{generateMipmaps:!1,minFilter:t.LINEAR,magFilter:t.LINEAR,wrapS:t.CLAMP_TO_EDGE,wrapT:t.CLAMP_TO_EDGE});let B=!1;const u=new window.Image;u.crossOrigin="anonymous",u.decoding="async",u.onload=()=>{B||(j.image=u,w.uTextureSize.value=[u.naturalWidth||1,u.naturalHeight||1])},u.src=T;const L=new Float32Array(d*2),N=new Float32Array(d*2),b=new Float32Array(d),k=Array.from({length:d},()=>({x:0,y:0,scale:M,target:M,size:1,opacity:0}));let C=0;const D=new we(t,{position:{size:2,data:new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1])},uv:{size:2,data:new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1])},iOffset:{instanced:1,size:2,data:L},iScale:{instanced:1,size:2,data:N},iOpacity:{instanced:1,size:1,data:b}}),q={uRings:{value:v}},X=new ie(t,{vertex:be,fragment:De,uniforms:q,transparent:!0,depthTest:!1,depthWrite:!1,cullFace:!1});X.setBlendFunc(t.ONE,t.ONE);const de=new re(t,{geometry:D,program:X,frustumCulled:!1}),P=new ye(t,{width:2,height:2,depth:!1,minFilter:t.LINEAR,magFilter:t.LINEAR,wrapS:t.CLAMP_TO_EDGE,wrapT:t.CLAMP_TO_EDGE}),w={uTexture:{value:j},uDisplacement:{value:P.texture},uResolution:{value:[1,1]},uTextureSize:{value:[1,1]},uTexel:{value:[1,1]},uTint:{value:R(U)},uHighlight:{value:R(F)},uStrength:{value:g},uSwirl:{value:s},uDispersion:{value:A},uGlint:{value:z},uTintAmount:{value:O},uGrayscale:{value:G?1:0}},he=new re(t,{geometry:new Te(t),program:new ie(t,{vertex:Me,fragment:Re,uniforms:w,depthTest:!1,depthWrite:!1})});_.current={wave:q,composite:w};let p=1,m=1;const Y=()=>{p=Math.max(1,o.clientWidth),m=Math.max(1,o.clientHeight),S.setSize(p,m),w.uResolution.value=[p,m];const a=ne[H]||ne.high,i=Math.max(2,Math.round(p*a)),e=Math.max(2,Math.round(m*a));P.setSize(i,e),w.uTexel.value=[1/i,1/e]},Q=new ResizeObserver(Y);Q.observe(o),Y();const $=(a,i,e)=>{const l=x.current,c=k[C];C=(C+1)%d,c.x=a,c.y=i,c.scale=M*e,c.target=M*Math.max(1,l.spread)*e,c.size=Math.max(1,l.brushSize),c.opacity=1},J=(a,i)=>{const e=o.getBoundingClientRect();return e.width===0||e.height===0||a<e.left||a>e.right||i<e.top||i>e.bottom?null:[a-e.left,e.height-(i-e.top)]};let K=0,Z=0;const ee=a=>{const i=x.current;if(!i.enabled||E||i.trigger==="click")return;const e=J(a.clientX,a.clientY);if(!e)return;const l=Math.max(1,i.spacing);(Math.abs(e[0]-K)>l||Math.abs(e[1]-Z)>l)&&($(e[0],e[1],1),K=e[0],Z=e[1])},te=a=>{const i=x.current;if(!i.enabled||E||i.trigger==="hover")return;const e=J(a.clientX,a.clientY);e&&$(e[0],e[1],Math.max(1,i.clickStrength))};window.addEventListener("pointermove",ee,{passive:!0}),window.addEventListener("pointerdown",te,{passive:!0});let I=0,W=0;const ae=a=>{I=requestAnimationFrame(ae);const i=W?Math.min(.05,(a-W)/1e3):0;W=a;const e=x.current,l=E?0:1-Math.exp(-i*1.09),c=E?1:Math.exp(-i*Se/Math.max(.15,e.fade));for(let n=0;n<d;n+=1){const r=k[n];if(r.opacity<=0){b[n]=0;continue}if(r.opacity*=c,r.scale+=(r.target-r.scale)*l,r.opacity<.002){r.opacity=0,b[n]=0;continue}const oe=r.scale*r.size/2;L[n*2]=r.x/p*2-1,L[n*2+1]=r.y/m*2-1,N[n*2]=oe/p*2,N[n*2+1]=oe/m*2,b[n]=r.opacity}D.attributes.iOffset.needsUpdate=!0,D.attributes.iScale.needsUpdate=!0,D.attributes.iOpacity.needsUpdate=!0,S.render({scene:de,target:P,clear:!0}),S.render({scene:he})};return I=requestAnimationFrame(ae),()=>{B=!0,cancelAnimationFrame(I),Q.disconnect(),window.removeEventListener("pointermove",ee),window.removeEventListener("pointerdown",te),_.current=null,f.parentNode===o&&o.removeChild(f);const a=t.getExtension("WEBGL_lose_context");a&&a.loseContext()}},[T,H]),y.useEffect(()=>{const o=_.current;o&&(o.wave.uRings.value=v,o.composite.uStrength.value=g,o.composite.uSwirl.value=s,o.composite.uDispersion.value=A,o.composite.uGlint.value=z,o.composite.uTintAmount.value=O,o.composite.uGrayscale.value=G?1:0,o.composite.uHighlight.value=R(F),o.composite.uTint.value=R(U))},[v,g,s,A,z,O,G,F,U]),Ee.jsx("div",{ref:V,className:`ripple-distortion ${pe}`.trim(),style:me})};export{ze as default};
