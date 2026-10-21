import{r as a,R as V,P as ee,T as oe,M as re,j as te}from"./index-tDOHgNLd.js";const $=8,D=s=>{const u=s.replace("#","").padEnd(6,"0"),n=parseInt(u.slice(0,2),16)/255,c=parseInt(u.slice(2,4),16)/255,o=parseInt(u.slice(4,6),16)/255;return[n,c,o]},ue=s=>{const u=(s&&s.length?s:["#A6C8FF","#5227FF","#FF9FFC"]).slice(0,$),n=u.length,c=[];for(let r=0;r<$;r++)c.push(D(u[Math.min(r,u.length-1)]));const o=[0,0,0];for(let r=0;r<n;r++)o[0]+=c[r][0],o[1]+=c[r][1],o[2]+=c[r][2];return o[0]/=n,o[1]/=n,o[2]/=n,{arr:c,count:n,avg:o}},ne=`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ce=`
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

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uLightMode;

varying vec2 vUv;

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

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = uLightMode > 0.5
    ? vec4(0.0)
    : vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
if (uLightMode > 0.5) {
  float peak = max(colr.r, max(colr.g, colr.b));
  float coverage = smoothstep(0.035, 0.58, peak) * uOpacity;
  vec3 chroma = clamp(colr / max(peak, 1e-4), 0.0, 1.0);
  chroma = pow(chroma, vec3(1.35));
  float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
  chroma /= max(chromaPeak, 1e-4);
  o = vec4(mix(vec3(1.0), chroma, coverage * 0.94), 1.0);
} else {
    o = vec4(colr, uOpacity);
  }
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`,ae=({className:s,dpr:u,paused:n=!1,colors:c=["#A6C8FF","#5227FF","#FF9FFC"],backgroundColor:o="#0A29FF",speed:r=.5,streakCount:k=2,streakWidth:S=1,streakLength:T=1,glow:b=1,density:B=.6,twinkle:z=1,zoom:E=3,backgroundGlow:G=.5,opacity:L=1,mouseInteraction:R=!0,mouseStrength:A=.5,mouseRadius:Y=1,mouseDampening:y=.15,lightMode:q=!1,mixBlendMode:U})=>{const W=a.useRef(null),w=a.useRef(null),M=a.useRef(null),h=a.useRef(null),O=a.useRef(null),P=a.useRef(null),I=a.useRef([0,0]),C=a.useRef(0);return a.useEffect(()=>{const d=W.current;if(!d)return;const g=new V({dpr:u??(typeof window<"u"&&window.devicePixelRatio||1),alpha:!0,antialias:!0});P.current=g;const i=g.gl,l=i.canvas;l.style.width="100%",l.style.height="100%",l.style.display="block",d.appendChild(l);const{arr:f,count:J,avg:K}=ue(c),x={iResolution:{value:[i.drawingBufferWidth,i.drawingBufferHeight,1]},iMouse:{value:[0,0]},iTime:{value:0},uColor0:{value:f[0]},uColor1:{value:f[1]},uColor2:{value:f[2]},uColor3:{value:f[3]},uColor4:{value:f[4]},uColor5:{value:f[5]},uColor6:{value:f[6]},uColor7:{value:f[7]},uColorCount:{value:J},uBgColor:{value:D(o)},uMouseColor:{value:K},uSpeed:{value:r},uStreakCount:{value:Math.max(1,Math.min(16,Math.round(k)))},uStreakWidth:{value:S},uStreakLength:{value:T},uGlow:{value:b},uDensity:{value:B},uTwinkle:{value:z},uZoom:{value:E},uBgGlow:{value:G},uOpacity:{value:L},uMouseEnabled:{value:R?1:0},uMouseStrength:{value:A},uMouseRadius:{value:Y},uLightMode:{value:q?1:0}},N=new ee(i,{vertex:ne,fragment:ce,uniforms:x});M.current=N;const Z=new oe(i);O.current=Z;const Q=new re(i,{geometry:Z,program:N});h.current=Q;const _=()=>{const e=d.getBoundingClientRect();g.setSize(e.width,e.height),x.iResolution.value=[i.drawingBufferWidth,i.drawingBufferHeight,1]};_();const j=new ResizeObserver(_);j.observe(d);const H=e=>{const t=l.getBoundingClientRect(),v=g.dpr||1,m=(e.clientX-t.left)*v,p=(t.height-(e.clientY-t.top))*v;I.current=[m,p],y<=0&&(x.iMouse.value=[m,p])};R&&l.addEventListener("pointermove",H);const X=e=>{if(w.current=requestAnimationFrame(X),x.iTime.value=e*.001,y>0){C.current||(C.current=e);const t=(e-C.current)/1e3;C.current=e;const v=Math.max(1e-4,y);let m=1-Math.exp(-t/v);m>1&&(m=1);const p=I.current,F=x.iMouse.value;F[0]+=(p[0]-F[0])*m,F[1]+=(p[1]-F[1])*m}else C.current=e;if(!n&&M.current&&h.current)try{g.render({scene:h.current})}catch(t){console.error(t)}};return w.current=requestAnimationFrame(X),()=>{w.current&&cancelAnimationFrame(w.current),R&&l.removeEventListener("pointermove",H),j.disconnect(),l.parentElement===d&&d.removeChild(l);const e=(t,v)=>{t&&typeof t[v]=="function"&&t[v].call(t)};e(M.current,"remove"),e(O.current,"remove"),e(h.current,"remove"),e(P.current,"destroy"),M.current=null,O.current=null,h.current=null,P.current=null}},[u,n,c,o,r,k,S,T,b,B,z,E,G,L,R,A,Y,y,q]),te.jsx("div",{ref:W,className:`lightfall-container ${s??""}`,style:{...U&&{mixBlendMode:U}}})};export{ae as default};
