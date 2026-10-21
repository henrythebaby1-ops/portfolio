import{r as T,R as pe,P as ve,M as he,T as ge,j as N}from"./index-tDOHgNLd.js";const p=64,xe=`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ye=`
precision highp float;

#define MAX_POINTS 64

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uNormalBlend;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float filmGrain(vec2 p, float time) {
  float frame = time * 18.0;
  float frameIndex = mod(floor(frame), 256.0);
  float nextFrameIndex = mod(frameIndex + 1.0, 256.0);
  float blend = fract(frame);
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec2 pixel = floor(p);
  float current = hash(pixel + vec2(frameIndex * 17.0, frameIndex * 31.0));
  float next = hash(pixel + vec2(nextFrameIndex * 17.0, nextFrameIndex * 31.0));
  return mix(current, next, blend) * 2.0 - 1.0;
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.16 * pulseAmount;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);

    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float grain = filmGrain(pixel, uTime);
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.4;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  vec3 additiveColor = color * luminance;
  float normalAlpha = clamp(strongest * uBrightness * uOpacity * uFade, 0.0, 1.0);
  vec3 normalColor = mix(color, vec3(1.0), smoothstep(0.45, 1.0, strongestCore) * uHotspot * 0.35);
  gl_FragColor = vec4(mix(additiveColor, normalColor, uNormalBlend), mix(alpha, normalAlpha, uNormalBlend));
}
`,S=f=>{let s=(f||"").replace("#","").trim();s.length===3&&(s=s.split("").map(v=>v+v).join(""));const m=Number.parseInt(s||"000000",16);return[(m>>16&255)/255,(m>>8&255)/255,(m&255)/255]},l=(f,s,m)=>Math.min(Math.max(f,s),m),Te=({color:f="#67E8F9",secondaryColor:s="#A78BFA",trailLength:m=40,trailWidth:v=8,trailTaper:Y=.8,followSpeed:k=.16,glowIntensity:J=1.9,glowSpread:K=1.2,hotspot:Q=.65,brightness:Z=1.25,opacity:ee=1,pulseSpeed:oe=1.1,noiseStrength:te=.035,idleFade:ne=!0,idleTimeout:re=700,fadeDuration:ae=900,blendMode:B="screen",maxDevicePixelRatio:G=1.5,enabled:ie=!0,children:_,className:O="",style:le,...se})=>{const W=T.useRef(null),L=T.useRef(null),C=T.useRef({});return C.current={color:f,secondaryColor:s,trailLength:m,trailWidth:v,trailTaper:Y,followSpeed:k,glowIntensity:J,glowSpread:K,hotspot:Q,brightness:Z,opacity:ee,pulseSpeed:oe,noiseStrength:te,idleFade:ne,idleTimeout:re,fadeDuration:ae,maxDevicePixelRatio:G,blendMode:B,enabled:ie},T.useEffect(()=>{const d=W.current,H=L.current;if(!d||!H)return;const n=C.current,P=new pe({canvas:H,alpha:!0,dpr:Math.min(window.devicePixelRatio||1,n.maxDevicePixelRatio)}),h=P.gl;h.clearColor(0,0,0,0);const M=Array(p*2).fill(0),r=Array.from({length:p},()=>({x:0,y:0})),c={x:0,y:0},u={x:0,y:0},o=new ve(h,{vertex:xe,fragment:ye,uniforms:{uResolution:{value:[1,1]},uPoints:{value:M},uPointCount:{value:n.trailLength},uColor:{value:S(n.color)},uSecondaryColor:{value:S(n.secondaryColor)},uTrailWidth:{value:n.trailWidth},uTaper:{value:n.trailTaper},uGlowIntensity:{value:n.glowIntensity},uGlowSpread:{value:n.glowSpread},uHotspot:{value:n.hotspot},uBrightness:{value:n.brightness},uOpacity:{value:n.opacity},uPulseSpeed:{value:n.pulseSpeed},uNoiseStrength:{value:n.noiseStrength},uNormalBlend:{value:n.blendMode==="normal"?1:0},uTime:{value:0},uFade:{value:0}},transparent:!0,depthTest:!1,depthWrite:!1}),j=new he(h,{geometry:new ge(h),program:o});let R=1,b=1,g=!1,A=!1,x=0,I=performance.now(),z=performance.now(),E=0,F=!1;const X=()=>{R=Math.max(d.clientWidth,1),b=Math.max(d.clientHeight,1),P.setSize(R,b),o.uniforms.uResolution.value=[R,b]},ue=(a,e)=>{c.x=a,c.y=e,u.x=a,u.y=e;for(const i of r)i.x=a,i.y=e;g=!0,x=1},y=a=>{const e=d.getBoundingClientRect(),i=l(a.clientX-e.left,0,e.width),w=l(e.height-(a.clientY-e.top),0,e.height);g||ue(i,w),c.x=i,c.y=w,A=!0,I=performance.now()},D=()=>{A=!1,I=performance.now()},U=a=>{if(F)return;const e=C.current,i=Math.min((a-z)/16.667,3);if(z=a,g){const $=1-Math.pow(1-l(e.followSpeed,.01,.99),i),de=l(.28+e.followSpeed*.35,.08,.92),V=1-Math.pow(1-de,i);u.x+=(c.x-u.x)*$,u.y+=(c.y-u.y)*$,r[0].x=u.x,r[0].y=u.y;for(let t=1;t<p;t++)r[t].x+=(r[t-1].x-r[t].x)*V,r[t].y+=(r[t-1].y-r[t].y)*V;for(let t=0;t<p;t++)M[t*2]=r[t].x,M[t*2+1]=r[t].y}const w=a-I,me=e.idleFade&&(!A||w>e.idleTimeout),ce=16.667*i/Math.max(e.fadeDuration,16),fe=g&&e.enabled&&!me?1:0;x+=(fe-x)*Math.min(1,ce*7),o.uniforms.uPointCount.value=l(Math.round(e.trailLength),2,p),o.uniforms.uColor.value=S(e.color),o.uniforms.uSecondaryColor.value=S(e.secondaryColor),o.uniforms.uTrailWidth.value=Math.max(e.trailWidth,.1),o.uniforms.uTaper.value=l(e.trailTaper,0,1),o.uniforms.uGlowIntensity.value=Math.max(e.glowIntensity,0),o.uniforms.uGlowSpread.value=Math.max(e.glowSpread,0),o.uniforms.uHotspot.value=l(e.hotspot,0,1),o.uniforms.uBrightness.value=Math.max(e.brightness,0),o.uniforms.uOpacity.value=l(e.opacity,0,1),o.uniforms.uPulseSpeed.value=e.pulseSpeed,o.uniforms.uNoiseStrength.value=l(e.noiseStrength,0,1),o.uniforms.uNormalBlend.value=e.blendMode==="normal"?1:0,o.uniforms.uTime.value=a*.001,o.uniforms.uFade.value=x,P.render({scene:j}),F||(E=requestAnimationFrame(U))},q=new ResizeObserver(X);return q.observe(d),window.addEventListener("pointermove",y),window.addEventListener("pointerover",y),document.documentElement.addEventListener("pointerleave",D),X(),E=requestAnimationFrame(U),()=>{F=!0,cancelAnimationFrame(E),q.disconnect(),window.removeEventListener("pointermove",y),window.removeEventListener("pointerover",y),document.documentElement.removeEventListener("pointerleave",D),j.geometry.remove(),o.remove()}},[G]),N.jsxs("div",{ref:W,className:`glow-cursor${O?` ${O}`:""}`,style:le,...se,children:[N.jsx("canvas",{ref:L,className:"glow-cursor__canvas",style:{mixBlendMode:B},"aria-hidden":"true"}),_&&N.jsx("div",{className:"glow-cursor__content",children:_})]})};export{Te as default};
