import{r as f,R as K,P as Q,T as Z,M as D,j as ee}from"./index-D0zNZLAK.js";const V=8,oe=c=>{const n=c.replace("#","").padEnd(6,"0"),l=parseInt(n.slice(0,2),16)/255,u=parseInt(n.slice(2,4),16)/255,o=parseInt(n.slice(4,6),16)/255;return[l,u,o]},re=c=>{const n=(c&&c.length?c:["#4F46E5","#06B6D4","#E0F2FE"]).slice(0,V),l=n.length,u=[];for(let r=0;r<V;r++)u.push(oe(n[Math.min(r,n.length-1)]));const o=[0,0,0];for(let r=0;r<l;r++)o[0]+=u[r][0],o[1]+=u[r][1],o[2]+=u[r][2];return o[0]/=l,o[1]/=l,o[2]/=l,{arr:u,count:l,avg:o}},te=c=>{switch(c){case"up":return[0,1];case"down":return[0,-1];case"left":return[-1,0];case"right":return[1,0];default:return[0,-1]}},ne=`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,le=`
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uMouseColor;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

#define PI 3.14159265

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = iTime;

  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);

  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }

  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 col = palette(h);

  vec3 outc = col * ltn;
  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
  fragColor = vec4(outc, a * uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`,ae=({className:c,dpr:n,paused:l=!1,colors:u=["#ffffff","#ffffff","#ffffff"],speed:o=.5,scale:r=1.6,turbulence:k=1,fluidity:E=.1,rimWidth:T=.2,sharpness:P=2.5,shimmer:B=1.5,glow:G=2,flowDirection:I="down",opacity:O=1,mouseInteraction:R=!0,mouseStrength:z=1,mouseRadius:A=.35,mouseDampening:w=.15,mixBlendMode:U})=>{const W=f.useRef(null),y=f.useRef(null),b=f.useRef(null),m=f.useRef(null),S=f.useRef(null),F=f.useRef(null),L=f.useRef([0,0]),h=f.useRef(0);return f.useEffect(()=>{const p=W.current;if(!p)return;const g=new K({dpr:n??(typeof window<"u"&&window.devicePixelRatio||1),alpha:!0,antialias:!0});F.current=g;const i=g.gl,s=i.canvas;i.clearColor(0,0,0,0),s.style.width="100%",s.style.height="100%",s.style.display="block",p.appendChild(s);const{arr:v,count:Y,avg:$}=re(u),C={iResolution:{value:[i.drawingBufferWidth,i.drawingBufferHeight,1]},iMouse:{value:[0,0]},iTime:{value:0},uColor0:{value:v[0]},uColor1:{value:v[1]},uColor2:{value:v[2]},uColor3:{value:v[3]},uColor4:{value:v[4]},uColor5:{value:v[5]},uColor6:{value:v[6]},uColor7:{value:v[7]},uColorCount:{value:Y},uMouseColor:{value:$},uFlow:{value:te(I)},uSpeed:{value:o},uScale:{value:r},uTurbulence:{value:k},uFluidity:{value:E},uRimWidth:{value:T},uSharpness:{value:P},uShimmer:{value:B},uGlow:{value:G},uOpacity:{value:O},uMouseEnabled:{value:R?1:0},uMouseStrength:{value:z},uMouseRadius:{value:A}},_=new Q(i,{vertex:ne,fragment:le,uniforms:C});b.current=_;const q=new Z(i);S.current=q;const J=new D(i,{geometry:q,program:_});m.current=J;const H=()=>{const e=p.getBoundingClientRect();g.setSize(e.width,e.height),C.iResolution.value=[i.drawingBufferWidth,i.drawingBufferHeight,1]};H();const X=new ResizeObserver(H);X.observe(p);const j=e=>{const t=s.getBoundingClientRect(),d=g.dpr||1,a=(e.clientX-t.left)*d,x=(t.height-(e.clientY-t.top))*d;L.current=[a,x],w<=0&&(C.iMouse.value=[a,x])};R&&s.addEventListener("pointermove",j);const N=e=>{if(y.current=requestAnimationFrame(N),C.iTime.value=e*.001,w>0){h.current||(h.current=e);const t=(e-h.current)/1e3;h.current=e;const d=Math.max(1e-4,w);let a=1-Math.exp(-t/d);a>1&&(a=1);const x=L.current,M=C.iMouse.value;M[0]+=(x[0]-M[0])*a,M[1]+=(x[1]-M[1])*a}else h.current=e;if(!l&&b.current&&m.current)try{g.render({scene:m.current})}catch(t){console.error(t)}};return y.current=requestAnimationFrame(N),()=>{y.current&&cancelAnimationFrame(y.current),R&&s.removeEventListener("pointermove",j),X.disconnect(),s.parentElement===p&&p.removeChild(s);const e=(t,d)=>{const a=t&&t[d];typeof a=="function"&&a.call(t)};e(b.current,"remove"),e(S.current,"remove"),e(m.current,"remove"),e(F.current,"destroy"),b.current=null,S.current=null,m.current=null,F.current=null}},[n,l,u,o,r,k,E,T,P,B,G,I,O,R,z,A,w]),ee.jsx("div",{ref:W,className:`ferrofluid-container ${c??""}`,style:{...U&&{mixBlendMode:U}}})};export{ae as default};
