import{r as d,R as le,T as ie,P as re,M as se,j as ce}from"./index-tDOHgNLd.js";const M=l=>{const i=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(l);return i?[parseInt(i[1],16)/255,parseInt(i[2],16)/255,parseInt(i[3],16)/255]:[1,1,1]},fe=l=>l==="horizontal"?1:l==="diagonal"?2:0,ve=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,pe=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepFalloff;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uBandDensity;
uniform float uLineSharpness;
uniform float uGlow;
uniform float uColorSpread;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoftness;
uniform float uVignette;
uniform float uOpacity;
uniform float uScanline;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uDirection;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

const float TAU = 6.2831853;

float signalField(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

vec3 palette(float f) {
  f = clamp(f, 0.0, 1.0);
  f = pow(f, uContrast);
  vec3 c = mix(uColor1, uColor2, smoothstep(0.08, 0.6, f));
  return mix(c, uColor3, smoothstep(0.68, 1.0, f));
}

float scanBand(float x, float aa, float sharp) {
  float v = mix(0.5, 0.5 + 0.5 * cos(x * TAU), aa);
  return pow(v, sharp);
}

void main() {
  float aspect = iResolution.x / iResolution.y;
  vec2 uv0 = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec2 p = uv0 / max(uScale, 0.001);

  float t = iTime * uSpeed;

  float mouseBoost = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mUv = vec2((uMouse.x * 2.0 - 1.0) * aspect, uMouse.y * 2.0 - 1.0);
    vec2 md = uv0 - mUv;
    float r = max(uMouseRadius, 0.001);
    mouseBoost = exp(-dot(md, md) / (r * r)) * uMouseStrength * uMouseActive;
  }

  float axis;
  if (uDirection < 0.5) axis = p.y;
  else if (uDirection < 1.5) axis = p.x;
  else axis = (p.x + p.y) * 0.70710678;

  float sig = signalField(p * uFrequency, t);
  float coord = axis + sig * uRipple;

  float phase = coord / max(uSweepWidth, 0.05) - t * uSweepSpeed;
  float sweep = pow(0.5 + 0.5 * cos(phase * TAU), max(uSweepFalloff, 0.1));

  float lc = coord * uBandDensity;
  float aa = 1.0 / (1.0 + uSoftness * fwidth(lc) * 3.0);
  aa = clamp(aa * (1.0 + mouseBoost * 0.6), 0.0, 1.0);

  float bodyBase = clamp(0.5 + 0.5 * sig, 0.0, 1.0);
  float body = bodyBase * bodyBase * uGlow * sweep;

  float sharp = max(uLineSharpness, 0.1);
  float split = uColorSpread * 0.16;
  float fr = clamp(scanBand(lc + split, aa, sharp) * sweep + body, 0.0, 1.0);
  float fg = clamp(scanBand(lc, aa, sharp) * sweep + body, 0.0, 1.0);
  float fb = clamp(scanBand(lc - split, aa, sharp) * sweep + body, 0.0, 1.0);

  vec3 col = vec3(palette(fr).r, palette(fg).g, palette(fb).b);

  float inten = (fr + fg + fb) * 0.3333333 * uBrightness;
  inten *= 1.0 + mouseBoost * 0.9;

  if (uScanline > 0.5) {
    inten *= 1.0 - 0.18 * (0.5 + 0.5 * cos(gl_FragCoord.y * 1.7));
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    inten += (g - 0.5) * uGrainIntensity;
  }

  inten *= clamp(1.0 - uVignette * smoothstep(0.55, 1.65, length(uv0)), 0.0, 1.0);
  inten = clamp(inten, 0.0, 1.0);

  float a = clamp(inten * uOpacity, 0.0, 1.0);
  fragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`,F=new WeakMap,de=({color1:l="#5227FF",color2:i="#FF9FFC",color3:b="#FFFFFF",speed:R=.5,sweepSpeed:B=.25,sweepWidth:A=1.6,sweepFalloff:E=6,scale:G=1.5,frequency:L=2,ripple:T=.22,bandDensity:D=11,lineSharpness:V=5.5,glow:O=.22,scanDirection:W="vertical",colorSpread:_=.7,brightness:q=1,contrast:I=1.15,softness:P=1.4,vignette:U=.45,scanline:z=!0,grain:j=!0,grainIntensity:k=.05,opacity:$=1,mouseInteraction:p=!0,mouseRadius:H=.5,mouseStrength:N=.5,className:ae=""})=>{const h=d.useRef(null),X=d.useRef(p);return d.useEffect(()=>{const t=h.current;if(!t)return;const n=new le({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),u=n.gl;u.clearColor(0,0,0,0);const e=u.canvas;e.style.width="100%",e.style.height="100%",e.style.display="block",t.appendChild(e);const v=new ie(u),a=new re(u,{vertex:ve,fragment:pe,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.5},uSweepSpeed:{value:.25},uSweepWidth:{value:1.6},uSweepFalloff:{value:6},uScale:{value:1.5},uFrequency:{value:2},uRipple:{value:.22},uBandDensity:{value:11},uLineSharpness:{value:5.5},uGlow:{value:.22},uColorSpread:{value:.7},uBrightness:{value:1},uContrast:{value:1.15},uSoftness:{value:1.4},uVignette:{value:.45},uOpacity:{value:1},uScanline:{value:1},uGrain:{value:1},uGrainIntensity:{value:.05},uDirection:{value:0},uMouse:{value:new Float32Array([.5,.5])},uMouseEnabled:{value:1},uMouseRadius:{value:.5},uMouseStrength:{value:.5},uMouseActive:{value:0},uColor1:{value:new Float32Array([1,1,1])},uColor2:{value:new Float32Array([1,1,1])},uColor3:{value:new Float32Array([1,1,1])}}}),r=new se(u,{geometry:v,program:a});F.set(t,{renderer:n,program:a,mesh:r});const Y=()=>{const o=t.getBoundingClientRect(),f=Math.max(1,Math.floor(o.width)),ne=Math.max(1,Math.floor(o.height));n.setSize(f,ne);const te=a.uniforms.iResolution.value;te[0]=u.drawingBufferWidth,te[1]=u.drawingBufferHeight,n.render({scene:r})},J=new ResizeObserver(Y);J.observe(t),Y();let s=[.5,.5],g=[.5,.5],w=0,m=0;const K=o=>{const f=e.getBoundingClientRect();g=[(o.clientX-f.left)/f.width,1-(o.clientY-f.top)/f.height],m=1},Q=()=>{m=0};e.addEventListener("mousemove",K),e.addEventListener("mouseleave",Q);let c=0,y=!0,S=!document.hidden;const ue=performance.now(),Z=o=>{a.uniforms.iTime.value=(o-ue)*.001,X.current||(m=0),s[0]+=.05*(g[0]-s[0]),s[1]+=.05*(g[1]-s[1]),a.uniforms.uMouse.value[0]=s[0],a.uniforms.uMouse.value[1]=s[1],w+=.05*(m-w),a.uniforms.uMouseActive.value=w,n.render({scene:r}),c=requestAnimationFrame(Z)},x=()=>{y&&S&&c===0&&(c=requestAnimationFrame(Z))},C=()=>{c!==0&&(cancelAnimationFrame(c),c=0)},ee=new IntersectionObserver(([o])=>{y=o.isIntersecting,y?x():C()},{threshold:0});ee.observe(t);const oe=()=>{S=!document.hidden,S?x():C()};return document.addEventListener("visibilitychange",oe),x(),()=>{var o;C(),J.disconnect(),ee.disconnect(),document.removeEventListener("visibilitychange",oe),e.removeEventListener("mousemove",K),e.removeEventListener("mouseleave",Q),F.delete(t);try{t.removeChild(e)}catch{}(o=u.getExtension("WEBGL_lose_context"))==null||o.loseContext()}},[]),d.useEffect(()=>{const t=h.current;if(!t)return;const n=F.get(t);if(!n)return;const{program:u}=n,e=u.uniforms;e.uSpeed.value=R,e.uSweepSpeed.value=B,e.uSweepWidth.value=A,e.uSweepFalloff.value=E,e.uScale.value=G,e.uFrequency.value=L,e.uRipple.value=T,e.uBandDensity.value=D,e.uLineSharpness.value=V,e.uGlow.value=O,e.uColorSpread.value=_,e.uBrightness.value=q,e.uContrast.value=I,e.uSoftness.value=P,e.uVignette.value=U,e.uOpacity.value=$,e.uScanline.value=z?1:0,e.uGrain.value=j?1:0,e.uGrainIntensity.value=k,e.uDirection.value=fe(W),e.uMouseEnabled.value=p?1:0,e.uMouseRadius.value=H,e.uMouseStrength.value=N;const v=M(l),a=M(i),r=M(b);e.uColor1.value[0]=v[0],e.uColor1.value[1]=v[1],e.uColor1.value[2]=v[2],e.uColor2.value[0]=a[0],e.uColor2.value[1]=a[1],e.uColor2.value[2]=a[2],e.uColor3.value[0]=r[0],e.uColor3.value[1]=r[1],e.uColor3.value[2]=r[2],X.current=p},[R,B,A,E,G,L,T,D,V,O,_,q,I,P,U,$,z,j,k,W,p,H,N,l,i,b]),ce.jsx("div",{ref:h,className:`scanner-container ${ae}`.trim()})};export{de as default};
