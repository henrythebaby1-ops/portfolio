import{r as x,R as te,T as ae,P as ue,M as le,j as ne}from"./index-D0zNZLAK.js";const y=v=>{const n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(v);return n?[parseInt(n[1],16)/255,parseInt(n[2],16)/255,parseInt(n[3],16)/255]:[1,1,1]},re=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ie=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uColumns;
uniform float uRows;
uniform float uThickness;
uniform float uSpeed;
uniform float uTravel;
uniform float uWaveSpread;
uniform float uRowOffset;
uniform float uSoftness;
uniform float uGlow;
uniform float uBrightness;
uniform float uContrast;
uniform float uOpacity;
uniform float uVertical;
uniform float uAlternate;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uEnableMouse;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uLightMode;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 grid = vec2(max(uColumns, 1.0), max(uRows, 1.0));
  vec2 p = uv * grid;
  vec2 gv = fract(p) - 0.5;
  vec2 id = floor(p);

  float barCoord, waveId, offId, along;
  if (uVertical > 0.5) {
    barCoord = gv.x; waveId = id.y; offId = id.x; along = uv.y;
  } else {
    barCoord = gv.y; waveId = id.x; offId = id.y; along = uv.x;
  }

  float dir = 1.0;
  if (uAlternate > 0.5 && mod(offId, 2.0) >= 1.0) dir = -1.0;

  float phase = iTime * uSpeed + waveId * uWaveSpread + cos(offId * uRowOffset);
  float mv = sin(phase) * 0.5 + 0.5;
  if (dir < 0.0) mv = 1.0 - mv;

  float infl = 0.0;
  if (uEnableMouse > 0.5) {
    float md = distance(uv, uMouse);
    infl = smoothstep(uMouseRadius, 0.0, md) * uMouseStrength * uMouseActive;
  }

  float thick = clamp(uThickness + infl * 0.25, 0.0, 1.0);
  float startPos = (0.5 - thick * 0.5) * uTravel;
  float endPos = (-0.5 + thick * 0.5) * uTravel;
  float pos = mix(startPos, endPos, mv);

  float aa = max(uSoftness, 0.0005);
  float d = abs(barCoord + pos) - thick * 0.5;
  float aaWidth = fwidth(uVertical > 0.5 ? p.x : p.y);
  float edge = max(aa, aaWidth);
  float mask = smoothstep(edge, -edge, d);
  float glow = exp(-max(d, 0.0) * (7.0 / (uGlow + 0.001))) * clamp(uGlow, 0.0, 1.0);
  float intensity = clamp(mask + glow * (1.0 - mask), 0.0, 1.0);

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    intensity = clamp(intensity + (g - 0.5) * uGrainIntensity, 0.0, 1.0);
  }

  float tint = mv;
  vec3 grad = mix(uColor2, uColor1, tint);
  grad = mix(grad, uColor3, clamp(along, 0.0, 1.0) * 0.45);

  vec3 col = grad * uBrightness * (1.0 + infl * 0.6);
  col = (col - 0.5) * uContrast + 0.5;
  col = clamp(col, 0.0, 1.0);

  float a = intensity * uOpacity;
  if (uLightMode > 0.5) {
    float peak = max(col.r, max(col.g, col.b));
    vec3 chroma = pow(clamp(col / max(peak, 0.0001), 0.0, 1.0), vec3(1.16));
    fragColor = vec4(mix(vec3(1.0), chroma, a * 0.94), 1.0);
  } else {
    fragColor = vec4(col * a, a);
  }
}
`,R=new WeakMap,ce=({color1:v="#FF9FFC",color2:n="#5227FF",color3:b="#B497CF",columns:A=14,rows:S=8,barThickness:F=.1,speed:E=.35,travel:I=.7,waveSpread:T=.9,rowOffset:k=1,softness:G=.05,glow:L=0,brightness:B=1,contrast:W=1,opacity:O=.5,orientation:P="horizontal",alternate:V=!1,mouseInteraction:_=!0,mouseStrength:z=1,mouseRadius:j=.3,grain:q=!0,grainIntensity:$=.05,lightMode:H=!1,className:Z=""})=>{const f=x.useRef(null);return x.useEffect(()=>{const a=f.current;if(!a)return;const l=new te({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),e=l.gl;e.clearColor(0,0,0,0);const o=e.canvas;o.style.width="100%",o.style.height="100%",o.style.display="block",a.appendChild(o);const c=new ae(e),u=new ue(e,{vertex:re,fragment:ie,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uColumns:{value:14},uRows:{value:8},uThickness:{value:.1},uSpeed:{value:.35},uTravel:{value:.7},uWaveSpread:{value:.9},uRowOffset:{value:1},uSoftness:{value:.05},uGlow:{value:0},uBrightness:{value:1},uContrast:{value:1},uOpacity:{value:.5},uVertical:{value:0},uAlternate:{value:0},uMouse:{value:new Float32Array([.5,.5])},uMouseStrength:{value:1},uMouseRadius:{value:.3},uEnableMouse:{value:1},uMouseActive:{value:0},uGrain:{value:1},uGrainIntensity:{value:.05},uLightMode:{value:0},uColor1:{value:new Float32Array([1,1,1])},uColor2:{value:new Float32Array([1,1,1])},uColor3:{value:new Float32Array([1,1,1])}}}),m=new le(e,{geometry:c,program:u});R.set(a,{renderer:l,program:u,mesh:m});const N=()=>{const t=a.getBoundingClientRect(),s=Math.max(1,Math.floor(t.width)),oe=Math.max(1,Math.floor(t.height));l.setSize(s,oe);const U=u.uniforms.iResolution.value;U[0]=e.drawingBufferWidth,U[1]=e.drawingBufferHeight,l.render({scene:m})},X=new ResizeObserver(N);X.observe(a),N();let r=[.5,.5],d=[.5,.5],g=0,h=0;const Y=t=>{const s=o.getBoundingClientRect();d=[(t.clientX-s.left)/s.width,1-(t.clientY-s.top)/s.height],h=1},D=()=>{h=0};o.addEventListener("mousemove",Y),o.addEventListener("mouseleave",D);let i=0,p=!0,C=!document.hidden;const ee=performance.now(),J=t=>{u.uniforms.iTime.value=(t-ee)*.001,r[0]+=.05*(d[0]-r[0]),r[1]+=.05*(d[1]-r[1]),g+=.05*(h-g),u.uniforms.uMouse.value[0]=r[0],u.uniforms.uMouse.value[1]=r[1],u.uniforms.uMouseActive.value=g,l.render({scene:m}),i=requestAnimationFrame(J)},M=()=>{p&&C&&i===0&&(i=requestAnimationFrame(J))},w=()=>{i!==0&&(cancelAnimationFrame(i),i=0)},K=new IntersectionObserver(([t])=>{p=t.isIntersecting,p?M():w()},{threshold:0});K.observe(a);const Q=()=>{C=!document.hidden,C?M():w()};return document.addEventListener("visibilitychange",Q),M(),()=>{var t;w(),X.disconnect(),K.disconnect(),document.removeEventListener("visibilitychange",Q),o.removeEventListener("mousemove",Y),o.removeEventListener("mouseleave",D),R.delete(a);try{a.removeChild(o)}catch{}(t=e.getExtension("WEBGL_lose_context"))==null||t.loseContext()}},[]),x.useEffect(()=>{const a=f.current;if(!a)return;const l=R.get(a);if(!l)return;const e=l.program.uniforms;e.uColumns.value=Math.max(1,Math.round(A)),e.uRows.value=Math.max(1,Math.round(S)),e.uThickness.value=F,e.uSpeed.value=E,e.uTravel.value=I,e.uWaveSpread.value=T,e.uRowOffset.value=k,e.uSoftness.value=G,e.uGlow.value=L,e.uBrightness.value=B,e.uContrast.value=W,e.uOpacity.value=O,e.uVertical.value=P==="vertical"?1:0,e.uAlternate.value=V?1:0,e.uMouseStrength.value=z,e.uMouseRadius.value=j,e.uEnableMouse.value=_?1:0,e.uGrain.value=q?1:0,e.uGrainIntensity.value=$,e.uLightMode.value=H?1:0;const o=y(v);e.uColor1.value[0]=o[0],e.uColor1.value[1]=o[1],e.uColor1.value[2]=o[2];const c=y(n);e.uColor2.value[0]=c[0],e.uColor2.value[1]=c[1],e.uColor2.value[2]=c[2];const u=y(b);e.uColor3.value[0]=u[0],e.uColor3.value[1]=u[1],e.uColor3.value[2]=u[2]},[v,n,b,A,S,F,E,I,T,k,G,L,B,W,O,P,V,_,z,j,q,$,H]),ne.jsx("div",{ref:f,className:`sliced-waves-container ${Z}`.trim()})};export{ce as default};
