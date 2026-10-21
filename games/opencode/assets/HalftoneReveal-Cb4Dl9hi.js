import{r as o,R as X,b as J,P as Q,M as V,T as Z,j as ee}from"./index-D0zNZLAK.js";const te="",d=l=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(l||"");return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[0,0,0]},F={mono:0,duotone:1,color:2},H={circle:0,square:1,diamond:2,line:3},_={off:0,hover:1,always:2},ae=`#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ne=`#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec2 iResolution;
uniform vec2 uImageSize;
uniform vec2 uMouse;
uniform float uActivity;

uniform float uDotSize;
uniform float uDensity;
uniform float uAngle;
uniform int uShape;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform int uMode;
uniform float uContrast;
uniform float uInvert;

uniform float uRevealRadius;
uniform float uEdge;
uniform float uIdleReveal;
uniform int uTrigger;

in vec2 vUv;
out vec4 fragColor;

vec2 uAspect() {
  return vec2(iResolution.x / max(iResolution.y, 1.0), 1.0);
}

vec2 coverUv(vec2 uv) {
  float ia = uImageSize.x / max(uImageSize.y, 1.0);
  float pa = iResolution.x / max(iResolution.y, 1.0);
  vec2 s = pa > ia ? vec2(1.0, ia / pa) : vec2(pa / ia, 1.0);
  return (uv - 0.5) * s + 0.5;
}

vec3 gradeRGB(vec3 c) {
  c = clamp((c - 0.5) * uContrast + 0.5, 0.0, 1.0);
  return mix(c, 1.0 - c, uInvert);
}

float shapeDist(vec2 f) {
  if (uShape == 1) return max(abs(f.x), abs(f.y));
  if (uShape == 2) return abs(f.x) + abs(f.y);
  if (uShape == 3) return abs(f.y);
  return length(f);
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

vec4 sampleCell(vec2 st, float dens, float ang) {
  vec2 rp = rot(ang) * st * dens;
  vec2 center = floor(rp) + 0.5;
  vec2 stC = rot(-ang) * (center / dens);
  vec2 uvC = stC / uAspect();
  return texture(tMap, clamp(coverUv(uvC), 0.0, 1.0));
}

float coverage(vec2 st, float dens, float ang, float ink, float rscale) {
  vec2 rp = rot(ang) * st * dens;
  vec2 f = fract(rp) - 0.5;
  float d = shapeDist(f);
  float r = sqrt(clamp(ink, 0.0, 1.0)) * 0.72 * rscale * uDotSize;
  float w = length(fwidth(rp)) * 0.6 + 1e-4;
  return smoothstep(r + w, r - w, d);
}

void main() {
  vec2 aspect = uAspect();
  vec2 st = vUv * aspect;
  float ang = radians(uAngle);

  vec2 duv = (vUv - uMouse) * aspect;
  float dist = length(duv);

  float act = uTrigger == 2 ? 1.0 : (uTrigger == 0 ? 0.0 : uActivity);
  float radius = max(uRevealRadius, 1e-4) * mix(0.4, 1.0, act);

  float px = 1.4 / max(iResolution.y, 1.0);
  float band = max(px, radius * (1.0 - clamp(uEdge, 0.0, 1.0)) * 0.45);
  float loupe = 1.0 - smoothstep(radius - band, radius + band, dist);
  float focus = clamp(max(loupe * act, uIdleReveal), 0.0, 1.0);

  float dens = uDensity;

  vec3 print;
  if (uMode == 2) {
    vec3 gc = gradeRGB(sampleCell(st, dens, ang + radians(15.0)).rgb);
    vec3 gm = gradeRGB(sampleCell(st, dens, ang + radians(75.0)).rgb);
    vec3 gy = gradeRGB(sampleCell(st, dens, ang).rgb);
    vec3 gk = gradeRGB(sampleCell(st, dens, ang + radians(45.0)).rgb);
    float c = 1.0 - gc.r;
    float m = 1.0 - gm.g;
    float y = 1.0 - gy.b;
    float k = 1.0 - dot(gk, vec3(0.299, 0.587, 0.114));
    float gcr = min(min(c, m), y) * 0.5;
    c = clamp(c - gcr, 0.0, 1.0);
    m = clamp(m - gcr, 0.0, 1.0);
    y = clamp(y - gcr, 0.0, 1.0);
    k = clamp(max(gcr, k * k * 0.9), 0.0, 1.0);
    float covC = coverage(st, dens, ang + radians(15.0), c, 0.82);
    float covM = coverage(st, dens, ang + radians(75.0), m, 0.82);
    float covY = coverage(st, dens, ang, y, 0.82);
    float covK = coverage(st, dens, ang + radians(45.0), k, 0.78);
    print = uPaper;
    print = mix(print, print * vec3(0.10, 0.72, 0.90), covC);
    print = mix(print, print * vec3(0.92, 0.10, 0.52), covM);
    print = mix(print, print * vec3(0.98, 0.86, 0.10), covY);
    print = mix(print, print * vec3(0.08), covK);
  } else if (uMode == 1) {
    vec3 ink2 = mix(uInk.gbr, vec3(0.90, 0.24, 0.30), 0.7);
    float lumA = dot(gradeRGB(sampleCell(st, dens, ang).rgb), vec3(0.299, 0.587, 0.114));
    float lumB = dot(gradeRGB(sampleCell(st, dens, ang + radians(38.0)).rgb), vec3(0.299, 0.587, 0.114));
    float covA = coverage(st, dens, ang, 1.0 - lumA, 1.0);
    float covB = coverage(st, dens, ang + radians(38.0), pow(1.0 - lumB, 1.4), 0.92);
    print = uPaper;
    print = mix(print, ink2, covB * 0.85);
    print = mix(print, uInk, covA);
  } else {
    float lum = dot(gradeRGB(sampleCell(st, dens, ang).rgb), vec3(0.299, 0.587, 0.114));
    float cov = coverage(st, dens, ang, 1.0 - lum, 1.0);
    print = mix(uPaper, uInk, cov);
  }

  float t = clamp(dist / radius, 0.0, 1.0);
  float bend = t * t * t * t;
  vec2 dir = dist > 1e-5 ? duv / dist : vec2(0.0);
  vec2 off = dir * bend * radius * 0.22 / aspect;
  vec2 ca = dir * bend * 0.0045 / aspect;
  vec3 sharp = gradeRGB(vec3(
    texture(tMap, clamp(coverUv(vUv - off - ca), 0.0, 1.0)).r,
    texture(tMap, clamp(coverUv(vUv - off), 0.0, 1.0)).g,
    texture(tMap, clamp(coverUv(vUv - off + ca), 0.0, 1.0)).b
  ));

  vec3 col = mix(print, sharp, focus);
  fragColor = vec4(col, 1.0);
}
`,oe=({src:l=te,inkColor:s="#141414",paperColor:p="#fff7e6",mode:g="mono",dotSize:x=1,dotDensity:h=71,angle:R=45,shape:y="circle",contrast:w=1.15,invert:M=!1,revealRadius:b=.4,edge:I=.8,follow:E=.37,idleReveal:C=0,trigger:A="hover",borderRadius:j="16px",className:N="",style:O})=>{const k=o.useRef(null),B=o.useRef(null),S=o.useRef(null),v=o.useRef(null),U=o.useRef(E),i=o.useRef({x:.5,y:.5,sx:.5,sy:.5,active:0,target:0});return o.useEffect(()=>{U.current=E},[E]),o.useEffect(()=>{const e=k.current;if(!e)return;const W=typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,f=new X({dpr:Math.min(window.devicePixelRatio||1,2),alpha:!1,antialias:!0});B.current=f;const t=f.gl;t.clearColor(0,0,0,1),t.canvas.style.width="100%",t.canvas.style.height="100%",t.canvas.style.display="block",e.appendChild(t.canvas);const G=new J(t,{generateMipmaps:!1}),c={tMap:{value:G},iResolution:{value:[1,1]},uImageSize:{value:[1,1]},uMouse:{value:[.5,.5]},uActivity:{value:0},uDotSize:{value:x},uDensity:{value:h},uAngle:{value:R},uShape:{value:H[y]??0},uInk:{value:d(s)},uPaper:{value:d(p)},uMode:{value:F[g]??0},uContrast:{value:w},uInvert:{value:M?1:0},uRevealRadius:{value:b},uEdge:{value:I},uIdleReveal:{value:C},uTrigger:{value:_[A]??1}};S.current=c;const Y=new Q(t,{vertex:ae,fragment:ne,uniforms:c}),K=new V(t,{geometry:new Z(t),program:Y}),u=new Image;u.crossOrigin="anonymous",u.src=l,u.onload=()=>{G.image=u,c.uImageSize.value=[u.naturalWidth,u.naturalHeight]};const D=()=>{const n=e.clientWidth||1,r=e.clientHeight||1;f.setSize(n,r),c.iResolution.value=[t.canvas.width,t.canvas.height]};D();const P=new ResizeObserver(D);P.observe(e);const m=n=>{const r=e.getBoundingClientRect();i.current.x=(n.clientX-r.left)/r.width,i.current.y=1-(n.clientY-r.top)/r.height,i.current.target=W?0:1},T=()=>{i.current.target=0};window.addEventListener("pointermove",m,{passive:!0}),window.addEventListener("pointerover",m,{passive:!0}),document.documentElement.addEventListener("pointerleave",T,{passive:!0});let z=performance.now();const L=n=>{v.current=requestAnimationFrame(L);const r=Math.min(.05,Math.max(.001,(n-z)/1e3));z=n;const a=i.current,q=1-Math.exp(-r/Math.max(.001,U.current));a.sx+=(a.x-a.sx)*q,a.sy+=(a.y-a.sy)*q;const $=1-Math.exp(-r/.18);a.active+=(a.target-a.active)*$,c.uMouse.value[0]=a.sx,c.uMouse.value[1]=a.sy,c.uActivity.value=a.active,f.render({scene:K})};return v.current=requestAnimationFrame(L),()=>{v.current&&cancelAnimationFrame(v.current),P.disconnect(),window.removeEventListener("pointermove",m),window.removeEventListener("pointerover",m),document.documentElement.removeEventListener("pointerleave",T);const n=t.getExtension("WEBGL_lose_context");n&&n.loseContext(),t.canvas.parentNode&&t.canvas.parentNode.removeChild(t.canvas),B.current=null,S.current=null}},[l]),o.useEffect(()=>{const e=S.current;e&&(e.uDotSize.value=x,e.uDensity.value=h,e.uAngle.value=R,e.uShape.value=H[y]??0,e.uInk.value=d(s),e.uPaper.value=d(p),e.uMode.value=F[g]??0,e.uContrast.value=w,e.uInvert.value=M?1:0,e.uRevealRadius.value=b,e.uEdge.value=I,e.uIdleReveal.value=C,e.uTrigger.value=_[A]??1)},[x,h,R,y,s,p,g,w,M,b,I,C,A]),ee.jsx("div",{ref:k,className:`halftone-reveal ${N}`.trim(),style:{borderRadius:j,...O}})};export{oe as default};
