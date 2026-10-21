import{r as t,j as Q}from"./index-D0zNZLAK.js";import{h as s,S as Z,s as ee,t as ue,p as te,C as D,b as ae,W as re,f as ne,u as oe}from"./three.module-BgPORkTe.js";const ie=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,le=`
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uBackgroundColor;
uniform float uCurvature;
uniform float uScanlineStrength;
uniform float uScanlineFrequency;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uBloom;
uniform float uBloomRadius;
uniform float uNoise;
uniform float uVignette;
uniform float uBrightness;
uniform float uPixelation;
uniform float uRgbShift;
uniform vec2 uPointer;
uniform float uMouseStrength;
uniform float uMouseReact;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 crtCurve(vec2 uv, float radius) {
  vec2 p = (uv - 0.5) * 2.0;
  float safeRadius = max(radius, 1.415);
  float cornerScale = safeRadius / sqrt(max(safeRadius * safeRadius - 2.0, 0.001));
  p = safeRadius * p / sqrt(max(safeRadius * safeRadius - dot(p, p), 0.001));
  p /= cornerScale;
  return p * 0.5 + 0.5;
}

float referencePlasma(vec2 uv, float t) {
  float frequencyScale = max(uWaveFrequency / 2.2, 0.001);
  uv = (uv - 0.5) * frequencyScale + 0.5;

  float scanline = 0.5 - 0.5 * cos(uv.y * 3.14159265 * uScanlineFrequency);
  scanline = mix(1.0, scanline, uScanlineStrength);

  uv *= vec2(80.0, 24.0);
  uv = ceil(uv);
  uv /= vec2(80.0, 24.0);

  float amplitude = uWaveAmplitude / 0.28;
  float field = 0.0;
  field += 0.7 * sin(0.5 * uv.x + t / 5.0);
  field += 3.0 * sin(1.6 * uv.y + t / 5.0);
  field += sin(10.0 * (uv.y * sin(t / 2.0) + uv.x * cos(t / 5.0)) + t / 2.0);

  float cx = uv.x + 0.5 * sin(t / 2.0);
  float cy = uv.y + 0.5 * cos(t / 4.0);
  field += 0.4 * sin(sqrt(100.0 * cx * cx + 100.0 * cy * cy + 1.0) + t);
  field += 0.9 * sin(sqrt(75.0 * cx * cx + 25.0 * cy * cy + 1.0) + t);
  field -= 1.4 * sin(sqrt(256.0 * cx * cx + 25.0 * cy * cy + 1.0) + t);
  field += 0.3 * sin(0.5 * uv.y + uv.x + sin(t));

  return scanline * floor(3.0 * (0.5 + 0.499 * sin(field * amplitude))) / 3.0;
}

void main() {
  vec2 uv = vUv;
  if (uPixelation > 1.001) {
    vec2 cells = max(uResolution / uPixelation, vec2(1.0));
    uv = (floor(uv * cells) + 0.5) / cells;
  }

  float curveRadius = 1.1 + 0.42 / max(uCurvature, 0.001);
  if (uMouseReact > 0.5) {
    curveRadius *= exp(-uPointer.y * uMouseStrength * 0.4);
  }
  vec2 curvedUv = crtCurve(uv, curveRadius);
  if (uMouseReact > 0.5) {
    curvedUv.x -= uPointer.x * uMouseStrength * 0.035;
  }

  float signal = referencePlasma(curvedUv, uTime);
  float radius = 0.01 * uBloomRadius;
  float glow = signal * 0.2;
  glow += referencePlasma(curvedUv + vec2(radius, 0.0), uTime) * 0.12;
  glow += referencePlasma(curvedUv - vec2(radius, 0.0), uTime) * 0.12;
  glow += referencePlasma(curvedUv + vec2(0.0, radius), uTime) * 0.12;
  glow += referencePlasma(curvedUv - vec2(0.0, radius), uTime) * 0.12;
  glow += referencePlasma(curvedUv + vec2(radius), uTime) * 0.08;
  glow += referencePlasma(curvedUv - vec2(radius), uTime) * 0.08;
  glow += referencePlasma(curvedUv + vec2(radius, -radius), uTime) * 0.08;
  glow += referencePlasma(curvedUv + vec2(-radius, radius), uTime) * 0.08;

  float redSignal = referencePlasma(curvedUv + vec2(uRgbShift, 0.0), uTime);
  float blueSignal = referencePlasma(curvedUv - vec2(uRgbShift, 0.0), uTime);
  vec3 channelSignal = vec3(redSignal, signal, blueSignal);
  vec3 waveColor = uColor * (0.3 + signal * 0.7 + glow * uBloom * 0.65);
  waveColor += (channelSignal - signal) * 0.42;

  float edge = clamp(1.0 - dot(vUv - 0.5, vUv - 0.5) * 2.0, 0.0, 1.0);
  float edgeFade = mix(1.0, smoothstep(0.0, 1.0, edge), uVignette);
  float waveMask = clamp(signal * 0.82 + glow * 0.52, 0.0, 1.0) * edgeFade;

  float grain = hash21(gl_FragCoord.xy + vec2(fract(uTime) * 173.0));
  waveColor = max(waveColor * uBrightness, vec3(0.0));
  vec3 color = mix(uBackgroundColor, waveColor, waveMask);
  color += (grain - 0.5) * uNoise;
  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;function ve({color:R="#c755f7",backgroundColor:p="#05010a",speed:x=.5,curvature:w=.25,scanlineStrength:S=.25,scanlineFrequency:y=200,waveAmplitude:P=.3,waveFrequency:C=2.5,bloom:M=1.5,bloomRadius:E=1,noise:U=.1,vignette:B=0,brightness:T=1.25,pixelation:q=1,rgbShift:b=.015,mouseReact:F=!0,mouseStrength:W=.5,dpr:k=1,fps:c=30,paused:v=!1,className:X,style:Y}){const f=t.useRef(null),m=t.useRef(null),d=t.useRef(null),L=t.useRef(null),z=t.useRef(v),g=t.useRef(new s(0,0)),A=t.useRef(new s(0,0)),N=t.useRef(!0),O=t.useRef(c),h=t.useRef(0);return t.useEffect(()=>{z.current=v},[v]),t.useEffect(()=>{O.current=Math.max(1,c)},[c]),t.useEffect(()=>{const u=f.current;if(!u)return;const o=new Z,e=new ee(-1,1,1,-1,0,1),l=new ue(2,2),i=new te({vertexShader:ie,fragmentShader:le,uniforms:{uResolution:{value:new s(1,1)},uTime:{value:0},uSpeed:{value:.5},uColor:{value:new D("#c755f7")},uBackgroundColor:{value:new D("#05010a")},uCurvature:{value:.25},uScanlineStrength:{value:.25},uScanlineFrequency:{value:200},uWaveAmplitude:{value:.3},uWaveFrequency:{value:2.5},uBloom:{value:1.5},uBloomRadius:{value:1},uNoise:{value:.1},uVignette:{value:0},uBrightness:{value:1.25},uPixelation:{value:1},uRgbShift:{value:.015},uPointer:{value:new s(0,0)},uMouseStrength:{value:.5},uMouseReact:{value:1}}});m.current=i;const $=new ae(l,i);o.add($);const a=new re({antialias:!1,alpha:!1,powerPreference:"low-power"});d.current=a,a.outputColorSpace=ne,a.setPixelRatio(Math.min(window.devicePixelRatio||1,1)),a.domElement.style.width="100%",a.domElement.style.height="100%",a.domElement.style.display="block",u.appendChild(a.domElement);const V=()=>{const r=Math.max(u.clientWidth,1),n=Math.max(u.clientHeight,1);a.setSize(r,n,!1),i.uniforms.uResolution.value.set(a.domElement.width,a.domElement.height)},j=new ResizeObserver(V);j.observe(u),V();const J=new oe,G=new IntersectionObserver(([r])=>{N.current=r.isIntersecting});G.observe(u);const _=r=>{if(L.current=requestAnimationFrame(_),!N.current||document.hidden)return;const n=1e3/O.current;if(r-h.current<n)return;h.current=r-(r-h.current)%n;const K=Math.min(J.getDelta(),.1);z.current||(i.uniforms.uTime.value+=K*i.uniforms.uSpeed.value),A.current.lerp(g.current,.08),i.uniforms.uPointer.value.copy(A.current),a.render(o,e)};_(0);const H=r=>{const n=u.getBoundingClientRect();g.current.set((r.clientX-n.left)/Math.max(n.width,1)*2-1,-((r.clientY-n.top)/Math.max(n.height,1)*2-1))},I=()=>g.current.set(0,0);return u.addEventListener("pointermove",H,{passive:!0}),u.addEventListener("pointerleave",I),()=>{cancelAnimationFrame(L.current),j.disconnect(),G.disconnect(),u.removeEventListener("pointermove",H),u.removeEventListener("pointerleave",I),l.dispose(),i.dispose(),a.dispose(),a.domElement.remove(),m.current=null,d.current=null}},[]),t.useEffect(()=>{const u=m.current,o=d.current;if(!u||!o)return;const e=u.uniforms;e.uColor.value.set(R),e.uBackgroundColor.value.set(p),e.uSpeed.value=x,e.uCurvature.value=w,e.uScanlineStrength.value=S,e.uScanlineFrequency.value=y,e.uWaveAmplitude.value=P,e.uWaveFrequency.value=C,e.uBloom.value=M,e.uBloomRadius.value=E,e.uNoise.value=U,e.uVignette.value=B,e.uBrightness.value=T,e.uPixelation.value=q,e.uRgbShift.value=b,e.uMouseReact.value=F?1:0,e.uMouseStrength.value=W,o.setPixelRatio(Math.min(window.devicePixelRatio||1,k));const l=f.current;l&&(o.setSize(Math.max(l.clientWidth,1),Math.max(l.clientHeight,1),!1),e.uResolution.value.set(o.domElement.width,o.domElement.height))},[p,M,E,T,R,w,k,F,W,U,q,b,y,S,x,c,B,P,C]),Q.jsx("div",{ref:f,className:`crt-warp-container ${X||""}`,style:Y})}export{ve as default};
