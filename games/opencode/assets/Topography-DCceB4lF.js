import{r as F,R as se,T as ce,P as ve,M as fe,j as me}from"./index-tDOHgNLd.js";const b=i=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[1,1,1]},de=i=>i==="uniform"?1:i==="alternating"?2:0,pe=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,he=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uMorphAmount;
uniform float uBands;
uniform float uThickness;
uniform float uScale;
uniform float uPixelSize;
uniform float uGlow;
uniform float uColorMode;
uniform float uContrast;
uniform float uBrightness;
uniform float uFillBands;
uniform float uOpacity;
uniform float uLightMode;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec4 uCtrlA;
uniform vec4 uCtrlB;
uniform vec4 uCtrlC;
uniform vec4 uCtrlD;
out vec4 fragColor;

float bez(float t, vec4 c) {
  float w = 6.2831853 * t;
  return 0.5 * (c.x * sin(w) + c.y * cos(w) + c.z * sin(2.0 * w) + c.w * cos(2.0 * w));
}

float field(vec2 uv) {
  vec2 a = vec2(bez(uv.x, uCtrlA), bez(uv.x, uCtrlB));
  vec2 b = vec2(bez(uv.y, uCtrlC), bez(uv.y, uCtrlD));
  return distance(a, b);
}

vec3 elevationColor(float e) {
  vec3 c = mix(uLow, uMid, smoothstep(0.0, 0.5, e));
  c = mix(c, uHigh, smoothstep(0.5, 1.0, e));
  return c;
}

void main() {
  vec2 res = iResolution.xy;
  vec2 uv = gl_FragCoord.xy / res;

  vec2 suv = (uv - 0.5) / max(uScale, 0.001) + 0.5;

  vec2 sampleUv = suv;
  if (uPixelSize > 1.0) {
    vec2 px = res / uPixelSize;
    sampleUv = (floor(suv * px) + 0.5) / px;
  }

  float fv = field(sampleUv);

  if (uMouseEnabled > 0.5) {
    vec2 d = uv - uMouse;
    d.x *= res.x / max(res.y, 1.0);
    float r = max(uMouseRadius, 0.001);
    float bump = exp(-dot(d, d) / (r * r)) * uMouseStrength * uMouseActive;
    fv += bump;
  }

  float f = fv * uBands;
  float frac = fract(f);
  float lineDist = min(frac, 1.0 - frac);

  float aa = fwidth(f) + 0.0001;
  float mask = 1.0 - smoothstep(uThickness - aa, uThickness + aa, lineDist);

  float glowR = uThickness + uGlow * 0.5 + aa;
  float glow = (1.0 - smoothstep(uThickness, glowR, lineDist)) * step(0.0001, uGlow);

  float elev = clamp(fv / (uMorphAmount * 2.5 + 0.001), 0.0, 1.0);

  vec3 lineCol;
  if (uColorMode < 0.5) {
    lineCol = elevationColor(elev);
  } else if (uColorMode < 1.5) {
    lineCol = uMid;
  } else {
    float parity = mod(floor(f), 2.0);
    lineCol = mix(uMid, uHigh, parity);
  }

  float coverage = clamp(mask + glow * 0.55, 0.0, 1.0);
  coverage = pow(coverage, max(uContrast, 0.001));

  vec3 outColor = lineCol;
  float outAlpha = coverage;

  if (uFillBands > 0.5) {
    vec3 fillCol = elevationColor(elev);
    float fillA = 0.1 * elev;
    outColor = mix(fillCol, lineCol, coverage);
    outAlpha = clamp(coverage + fillA, 0.0, 1.0);
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    outAlpha += (g - 0.5) * uGrainIntensity;
  }

  outColor *= uBrightness;
  outColor = clamp(outColor, 0.0, 1.0);

  float a = clamp(outAlpha, 0.0, 1.0) * uOpacity;
  if (uLightMode > 0.5) {
    float peak = max(outColor.r, max(outColor.g, outColor.b));
    vec3 chroma = pow(clamp(outColor / max(peak, 0.0001), 0.0, 1.0), vec3(1.18));
    fragColor = vec4(mix(vec3(1.0), chroma, a * 0.94), 1.0);
  } else {
    fragColor = vec4(outColor * a, a);
  }
}
`,S=new WeakMap,ge=[[1,-2,3,-4],[9,-8,7,-6],[5,2,5,-5],[-1,-3,8,9]],Me=({lowColor:i="#5227FF",midColor:s="#FF9FFC",highColor:B="#FFFFFF",speed:R=.35,morphAmount:T=3,morphSpeed:E=.05,bands:L=2,thickness:G=.01,scale:z=1,pixelSize:k=1,glow:P=.5,colorMode:I="elevation",contrast:D=3,brightness:H=1,fillBands:O=!1,opacity:_=1,grain:j=!0,grainIntensity:U=.05,mouseInteraction:V=!0,mouseRadius:W=.3,mouseStrength:q=.4,lightMode:N=!1,className:oe=""})=>{const h=F.useRef(null);return F.useEffect(()=>{const t=h.current;if(!t)return;const r=new se({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),u=r.gl;u.clearColor(0,0,0,0);const e=u.canvas;e.style.width="100%",e.style.height="100%",e.style.display="block",t.appendChild(e);const te=new ce(u),n=new ve(u,{vertex:pe,fragment:he,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.35},uMorphAmount:{value:3},uMorphSpeed:{value:.05},uBands:{value:2},uThickness:{value:.01},uScale:{value:1},uPixelSize:{value:1},uGlow:{value:.5},uColorMode:{value:0},uContrast:{value:3},uBrightness:{value:1},uFillBands:{value:0},uOpacity:{value:1},uLightMode:{value:0},uGrain:{value:1},uGrainIntensity:{value:.05},uLow:{value:new Float32Array([1,1,1])},uMid:{value:new Float32Array([1,1,1])},uHigh:{value:new Float32Array([1,1,1])},uMouse:{value:new Float32Array([.5,.5])},uMouseEnabled:{value:1},uMouseRadius:{value:.3},uMouseStrength:{value:.4},uMouseActive:{value:0},uCtrlA:{value:new Float32Array([0,0,0,0])},uCtrlB:{value:new Float32Array([0,0,0,0])},uCtrlC:{value:new Float32Array([0,0,0,0])},uCtrlD:{value:new Float32Array([0,0,0,0])}}}),g=new fe(u,{geometry:te,program:n});S.set(t,{renderer:r,program:n,mesh:g});const $=()=>{const o=t.getBoundingClientRect(),a=Math.max(1,Math.floor(o.width)),l=Math.max(1,Math.floor(o.height));r.setSize(a,l);const m=n.uniforms.iResolution.value;m[0]=u.drawingBufferWidth,m[1]=u.drawingBufferHeight,r.render({scene:g})},X=new ResizeObserver($);X.observe(t),$();const c=[.5,.5],f=[.5,.5];let C=0,M=0;const Y=o=>{const a=e.getBoundingClientRect();f[0]=(o.clientX-a.left)/a.width,f[1]=1-(o.clientY-a.top)/a.height,M=1},J=()=>{M=0};e.addEventListener("mousemove",Y),e.addEventListener("mouseleave",J);const ue=[n.uniforms.uCtrlA.value,n.uniforms.uCtrlB.value,n.uniforms.uCtrlC.value,n.uniforms.uCtrlD.value];let v=0,w=!0,x=!document.hidden;const ae=performance.now(),K=o=>{const a=(o-ae)*.001,l=n.uniforms;l.iTime.value=a;const m=l.uMorphAmount.value,le=l.uSpeed.value,re=l.uMorphSpeed.value;for(let d=0;d<4;d++){const ne=ue[d],ie=ge[d];for(let p=0;p<4;p++){const ee=ie[p];ne[p]=m*Math.sin(a*le*Math.sin(ee*re)+ee)}}c[0]+=.05*(f[0]-c[0]),c[1]+=.05*(f[1]-c[1]),l.uMouse.value[0]=c[0],l.uMouse.value[1]=c[1],C+=.05*(M-C),l.uMouseActive.value=C,r.render({scene:g}),v=requestAnimationFrame(K)},y=()=>{w&&x&&v===0&&(v=requestAnimationFrame(K))},A=()=>{v!==0&&(cancelAnimationFrame(v),v=0)},Q=new IntersectionObserver(([o])=>{w=o.isIntersecting,w?y():A()},{threshold:0});Q.observe(t);const Z=()=>{x=!document.hidden,x?y():A()};return document.addEventListener("visibilitychange",Z),y(),()=>{var o;A(),X.disconnect(),Q.disconnect(),document.removeEventListener("visibilitychange",Z),e.removeEventListener("mousemove",Y),e.removeEventListener("mouseleave",J),S.delete(t);try{t.removeChild(e)}catch{}(o=u.getExtension("WEBGL_lose_context"))==null||o.loseContext()}},[]),F.useEffect(()=>{const t=h.current;if(!t)return;const r=S.get(t);if(!r)return;const{program:u}=r,e=u.uniforms;e.uSpeed.value=R,e.uMorphAmount.value=T,e.uMorphSpeed.value=E,e.uBands.value=L,e.uThickness.value=G,e.uScale.value=z,e.uPixelSize.value=k,e.uGlow.value=P,e.uColorMode.value=de(I),e.uContrast.value=D,e.uBrightness.value=H,e.uFillBands.value=O?1:0,e.uOpacity.value=_,e.uLightMode.value=N?1:0,e.uGrain.value=j?1:0,e.uGrainIntensity.value=U,e.uLow.value=new Float32Array(b(i)),e.uMid.value=new Float32Array(b(s)),e.uHigh.value=new Float32Array(b(B)),e.uMouseEnabled.value=V?1:0,e.uMouseRadius.value=W,e.uMouseStrength.value=q},[i,s,B,R,T,E,L,G,z,k,P,I,D,H,O,_,j,U,V,W,q,N]),me.jsx("div",{ref:h,className:`topography-container ${oe}`.trim()})};export{Me as default};
