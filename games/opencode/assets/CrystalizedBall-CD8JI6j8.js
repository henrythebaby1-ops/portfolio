import{r as ne,R as Yt,T as Jt,b as Mt,a as bt,M as Me,P as be,j as Qt,G as Zt}from"./index-tDOHgNLd.js";const kt={plasma:{color:"#F25BD0",strands:6,crackle:.85,flares:.65,glow:.9,sparks:.6,particleCount:15e3,fill:.5,motion:"rise",particleShape:"square",depth:.6,sway:.5,twinkle:.5,haze:.7,dustSpeed:1},aurora:{color:"#5CFFC8",strands:5,crackle:.6,flares:.5,glow:.8,sparks:.45,particleCount:15e3,fill:.5,motion:"rise",particleShape:"square",depth:.6,sway:.5,twinkle:.5,haze:.7,dustSpeed:1},nebula:{color:"#9478FF",strands:6,crackle:1,flares:.5,glow:.9,sparks:.6,particleCount:18e3,fill:.45,motion:"rise",particleShape:"square",depth:.5,sway:.4,twinkle:.6,haze:.8,dustSpeed:1.2},ember:{color:"#FF8A2A",strands:5,crackle:.9,flares:.8,glow:1,sparks:.8,particleCount:12e3,fill:.35,motion:"rise",particleShape:"round",depth:.7,sway:.3,twinkle:.7,haze:.9,dustSpeed:1.6},frost:{color:"#BFE6FF",strands:3,crackle:.3,flares:.3,glow:.6,sparks:.2,particleCount:16e3,fill:.6,motion:"fall",particleShape:"round",depth:.8,sway:.4,twinkle:.4,haze:.5,dustSpeed:.7},solar:{color:"#FFD36E",strands:6,crackle:.7,flares:1,glow:1.1,sparks:.5,particleCount:15e3,fill:.55,motion:"orbit",particleShape:"square",depth:.6,sway:.7,twinkle:.5,haze:.8,dustSpeed:1},eclipse:{color:"#FFFFFF",strands:4,crackle:.5,flares:.4,glow:.7,sparks:.35,particleCount:14e3,fill:.5,motion:"drift",particleShape:"square",depth:.7,sway:.5,twinkle:.5,haze:.5,dustSpeed:.8},abyss:{color:"#3F7BFF",strands:5,crackle:.55,flares:.6,glow:.9,sparks:.4,particleCount:2e4,fill:.8,motion:"orbit",particleShape:"round",depth:.8,sway:.8,twinkle:.5,haze:.6,dustSpeed:.9}},ea={rise:0,fall:1,drift:2,orbit:3},ta={square:0,round:1},Tt=8,Ge=4,aa=4e4,U=256,oa=45e5,ra=2.2,na=7,ke=[1,1,1],Ne=[0,0,0],d=(e,o,t)=>Math.min(Math.max(e,o),t),O=(e,o,t)=>{const s=d((t-e)/(o-e),0,1);return s*s*(3-2*s)},Rt=e=>1-Math.pow(1-e,3),se=(e,o,t)=>e.map((s,u)=>s+(o[u]-s)*t),St=e=>e-Math.PI*2*Math.floor((e+Math.PI)/(Math.PI*2)),la=(e,o)=>{try{const t=document.createElement("canvas").getContext("2d");if(!t)return o;t.fillStyle="#000000",t.fillStyle=e;const s=t.fillStyle;if(s.startsWith("#")){const l=parseInt(s.slice(1),16);return[(l>>16&255)/255,(l>>8&255)/255,(l&255)/255]}const u=s.match(/[\d.]+/g);return!u||u.length<3?o:[Number(u[0])/255,Number(u[1])/255,Number(u[2])/255]}catch{return o}},sa=e=>e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4),ia=e=>e<=.0031308?e*12.92:1.055*Math.pow(e,1/2.4)-.055,me=e=>{const[o,t,s]=e.map(sa),u=Math.cbrt(.4122214708*o+.5363325363*t+.0514459929*s),l=Math.cbrt(.2119034982*o+.6806995451*t+.1073969566*s),v=Math.cbrt(.0883024619*o+.2817188376*t+.6299787005*s);return[.2104542553*u+.793617785*l-.0040720468*v,1.9779984951*u-2.428592205*l+.4505937099*v,.0259040371*u+.7827717662*l-.808675766*v]},We=([e,o,t])=>{const s=Math.pow(e+.3963377774*o+.2158037573*t,3),u=Math.pow(e-.1055613458*o-.0638541728*t,3),l=Math.pow(e-.0894841775*o-1.291485548*t,3);return[4.0767416621*s-3.3077115913*u+.2309699292*l,-1.2684380046*s+2.6097574011*u-.3413193965*l,-.0041960863*s-.7034186147*u+1.707614701*l].map(v=>d(ia(d(v,0,1)),0,1))},Ft=(e,o,t)=>We(se(me(e),me(o),t)),le=(e,o,t,s)=>{const[u,l,v]=me(e),x=Math.hypot(l,v)*s,g=Math.atan2(v,l)+o*Math.PI/180;return We([d(u+t,0,1),x*Math.cos(g),x*Math.sin(g)])},A=(e,o,t,s)=>{const[,u,l]=me(e),v=Math.max(Math.hypot(u,l)*s,.02),x=Math.atan2(l,u)+o*Math.PI/180;return We([d(t,0,1),v*Math.cos(x),v*Math.sin(x)])},ua=(e,o)=>{if(o){const t=A(e,0,Math.min(me(e)[0],.62),1.15);return{rim:t,rimHot:t,rimMid:t,rimDeep:A(e,0,.72,.8),spark:A(e,0,.6,1.2),sparkGlow:A(e,0,.78,.8),haze:A(e,0,.8,.6),edge:A(e,0,.72,.8),tones:[A(e,0,.56,1.1),A(e,16,.6,1.05),A(e,-16,.5,1.1),A(e,0,.66,.9),A(e,0,.74,.7)]}}return{rim:e,rimHot:se(e,ke,.72),rimMid:se(e,Ne,.15),rimDeep:se(e,Ne,.45),spark:se(e,ke,.45),sparkGlow:le(e,0,-.15,1),haze:se(e,Ne,.6),edge:le(e,0,-.3,.9),tones:[le(e,0,-.06,1),le(e,16,-.02,1),le(e,-16,-.12,1.05),le(Ft(e,ke,.25),0,.04,1),Ft(e,ke,.7)]}},Ve=e=>{let o=e>>>0;return()=>{o=o+1831565813>>>0;let t=o;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}},ca=()=>{const e=Ve(99),o=[[6,12,.6,1.6],[18,34,1.5,3.5],[40,70,3,7],[80,130,6,12]],t={harmonics:[],rates:[],phases:[],flareHarmonics:[],flareRates:[],flarePhases:[]};for(let s=0;s<Tt;s++){o.forEach(([l,v,x,g])=>{t.harmonics.push(Math.round(l+e()*(v-l))),t.rates.push((x+e()*(g-x))*(e()<.5?-1:1)),t.phases.push(e()*Math.PI*2)});for(let l=0;l<3;l++)t.flareHarmonics.push(4+Math.floor(e()*6)),t.flareRates.push((.4+e()*.8)*(e()<.5?-1:1)),t.flarePhases.push(e()*Math.PI*2);const u=s===0;t.flareHarmonics.push(u?.75:.95+e()*.3),t.flareRates.push(u?1.15:.8+e()*.2),t.flarePhases.push(u?1:.7+e()*.25)}return t},fa=e=>{const o=Ve(1337),t=Math.max(1,Math.ceil(e/U)),s=new Float32Array(U*t*4),u=new Float32Array(U*t*4);let l=0,v=0;for(;l<e&&v<e*80;){v++;let x,g,W;if(o()<.28){const V=o()*Math.PI*2,Z=.87+Math.sqrt(o())*.105;if(x=Math.cos(V)*Z,g=Math.sin(V)*Z,o()>O(-.6,.3,-g))continue;const ee=o();W=ee<.5?3:ee<.8?2:1}else{x=o()*2-1,g=o()*2-1;const V=Math.hypot(x,g);if(V>.975)continue;const Z=Math.pow(O(-.25,.85,-g),1.3),ee=O(.66,.96,V)*O(-.7,.3,-g),he=Math.max(Z,ee*.9);if(o()>.012+.988*he)continue;if(he<.12)W=4;else{const ie=o();W=ie<.32?0:ie<.52?1:ie<.8?2:3}}const Re=Math.sqrt(Math.max(0,.95-x*x-g*g));s[l*4]=x,s[l*4+1]=g,s[l*4+2]=(o()*2-1)*Re,s[l*4+3]=W,u[l*4]=W===4?1.8:o()<.22?2.1:1.3,u[l*4+1]=o(),u[l*4+2]=2.5+o()*3.5,u[l*4+3]=.16+o()*.26,l++}return{home:s,seed:u,count:l,rows:t}},Ue=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Ke=`
uint scramble(uint v) {
  v = v * 747796405u + 2891336453u;
  uint w = ((v >> ((v >> 28u) + 4u)) ^ v) * 277803737u;
  return (w >> 22u) ^ w;
}

float random(uint v) {
  return float(scramble(v)) * (1.0 / 4294967295.0);
}
`,zt=`
uniform float uDustTime;
uniform vec2 uTurn;
uniform float uMotion;
uniform float uFill;

vec3 settle(vec3 p, out float spread) {
  float bend = exp2((0.5 - uFill) * 1.8);
  float h = clamp((p.y + 1.0) * 0.5, 0.0, 1.0);
  float y = 2.0 * pow(h, bend) - 1.0;
  float from = sqrt(max(1.0 - p.y * p.y, 1e-4));
  float to = sqrt(max(1.0 - y * y, 0.0));
  spread = clamp(bend * pow(max(h, 1e-3), bend - 1.0) * to / from, 0.25, 1.0);
  return vec3(p.xz * (to / from), y).xzy;
}

vec3 drift(vec4 home, vec4 seed, uint id, out float life, out float spread) {
  vec3 p = settle(home.xyz, spread);
  float t = uDustTime;
  float u = fract(t / seed.z + seed.y);
  life = sin(3.14159265 * u);
  float travel = seed.w;
  if (uMotion < 0.5) {
    p.y += travel * (u - 0.5);
  } else if (uMotion < 1.5) {
    p.y -= travel * (u - 0.5);
  } else if (uMotion < 2.5) {
    p += 0.045 * vec3(
      sin(t * 0.37 + seed.y * 17.0) + 0.5 * sin(t * 0.83 + seed.z * 5.0),
      sin(t * 0.29 + seed.z * 11.0) + 0.5 * sin(t * 0.61 + seed.w * 7.0),
      sin(t * 0.33 + seed.w * 23.0)
    );
  } else {
    float loop = t * (0.6 + 0.9 * random(id * 7u + 3u)) * (random(id * 7u + 10u) < 0.5 ? -1.0 : 1.0) + seed.y * 6.2831853;
    p.xy += (0.025 + 0.05 * random(id * 7u + 16u)) * vec2(cos(loop), sin(loop));
  }
  float wobble = 0.002 + 0.006 * random(id * 7u + 1u);
  float w1 = 0.8 + 2.4 * random(id * 7u + 2u);
  float w2 = 0.8 + 2.4 * random(id * 7u + 4u);
  p += wobble * vec3(sin(t * w1 + seed.y * 40.0), cos(t * w2 + seed.z * 30.0), sin(t * (w1 + w2) * 0.5 + seed.w * 20.0));
  float cy = cos(uTurn.x);
  float sy = sin(uTurn.x);
  p.xz = mat2(cy, -sy, sy, cy) * p.xz;
  float cx = cos(uTurn.y);
  float sx = sin(uTurn.y);
  p.yz = mat2(cx, -sx, sx, cx) * p.yz;
  return p;
}
`,da=`#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform float uRadius;
uniform float uDpr;
uniform float uLine;
uniform float uTime;
uniform float uFrame;
uniform float uBins;
uniform float uStrands;
uniform float uCrackle;
uniform float uFlares;
uniform float uGlow;
uniform float uHaze;
uniform float uFill;
uniform float uPresence;
uniform float uUnfold;
uniform float uBloom;
uniform float uInside;
uniform float uEncode;
uniform vec3 uRim;
uniform vec3 uRimHot;
uniform vec3 uRimMid;
uniform vec3 uRimDeep;
uniform vec3 uSpark;
uniform vec3 uSparkGlow;
uniform vec3 uHazeColor;
uniform vec3 uEdgeColor;
uniform vec4 uHeat;
uniform vec4 uHarmonics[8];
uniform vec4 uRates[8];
uniform vec4 uPhases[8];
uniform vec4 uFlareHarmonics[8];
uniform vec4 uFlareRates[8];
uniform vec4 uFlarePhases[8];
uniform vec4 uArcs[4];

out vec4 fragColor;
${Ke}
const float PI = 3.14159265;
const float TAU = 6.28318531;
const vec4 AMPS = vec4(0.35, 0.3, 0.22, 0.13);

float bell(float d, float w) {
  float x = d / w;
  return exp(-x * x);
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  return length(pa - ba * h);
}

float pool(vec2 q) {
  float t = length(q - vec2(0.0, mix(-1.0, -0.66, uFill))) / mix(0.8, 1.35, uFill);
  return t < 0.6 ? mix(0.5, 0.22, t / 0.6) : mix(0.22, 0.0, clamp((t - 0.6) / 0.4, 0.0, 1.0));
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr - uCenter;
  float r = length(p);
  float R = uRadius;
  float theta = atan(p.y, p.x);
  float lift = p.y / max(r, 1e-3);
  float topDim = 1.0 - 0.35 * pow(max(lift, 0.0), 1.5);
  vec3 col = vec3(0.0);
  float hot = 0.0;
  uint frame = uint(uFrame);

  if (r < R) {
    vec2 q = p / R;
    float chord = sqrt(max(1.0 - dot(q, q), 0.0));
    float haze = pool(q) * (0.55 + 0.45 * chord);
    col += uHazeColor * haze * uHaze * uInside;
    float e = length(q - vec2(0.0, 0.2)) / 1.2;
    float edge = 0.5 * pow(smoothstep(0.62, 1.0, e), 1.4);
    col += uEdgeColor * edge * uInside * (0.5 + 0.5 * uHaze);
  }

  float dr = r - R;
  float halo = 1.0 - smoothstep(R * 0.05, R * 0.105, abs(dr - R * 0.0213));
  col += uRimDeep * 0.18 * halo * topDim * uGlow * uBloom;
  col += uRim * 0.12 * bell(dr + R * 0.0383, R * 0.032) * uGlow * uBloom;
  col += uRim * 0.32 * bell(dr, max(R * 0.0117, uLine)) * uPresence * uUnfold;

  float delta = mod(theta - uHeat.x + PI, TAU) - PI;
  float heat = uHeat.z * uHeat.y * exp(-delta * delta / 0.3);
  float crackle = uCrackle + heat * 0.9;
  float amp = R * 0.016 * (0.3 + 1.4 * crackle) * uUnfold;
  float jitterAmp = R * 0.0048 * (0.3 + 1.4 * uCrackle) * uUnfold * (1.0 + heat * 0.3);
  float flareAmp = R * 0.064 * (0.4 + 1.2 * crackle) * uFlares * 1.6 * uUnfold;

  if (abs(dr) < amp * 2.0 + flareAmp + R * 0.3) {
    float step = TAU / uBins;
    float binPos = (theta + PI) / step;
    float bin0 = floor(binPos);
    float binF = binPos - bin0;
    float th0 = bin0 * step - PI;
    float th1 = th0 + step;
    uint b0 = uint(mod(bin0, uBins));
    uint b1 = uint(mod(bin0 + 1.0, uBins));
    float gain = min(1.0, 2.4 / max(uStrands, 1.0));
    for (int k = 0; k < 8; k++) {
      if (float(k) >= uStrands) break;
      vec4 m = uHarmonics[k];
      vec4 lead = uRates[k] * uTime + uPhases[k];
      float wave0 = dot(AMPS, sin(m * th0 + lead));
      float wave1 = dot(AMPS, sin(m * th1 + lead));
      uint salt = uint(k) * 1013u + frame * 7919u;
      vec4 shape = uFlareHarmonics[k];
      vec4 look = uFlareRates[k];
      vec4 tone = uFlarePhases[k];
      float a = amp * shape.w;
      float off0 = a * wave0 + jitterAmp * (random(b0 + salt) - 0.5);
      float off1 = a * wave1 + jitterAmp * (random(b1 + salt) - 0.5);
      float rc = R + mix(off0, off1, binF);
      float grade = (off1 - off0) / (step * max(r, 1.0));
      float d = abs(r - rc) * inversesqrt(1.0 + grade * grade);
      float swell = 0.8 + 0.4 * (0.5 + 0.5 * sin(3.0 * theta + uTime * 0.7 + tone.x * 1.7));
      float width = uLine * look.w * swell * (1.0 + heat * 0.25);
      float core = exp(-d * d / (width * width));
      float sheath = exp(-d * d / (width * width * 3.0));
      float bright = tone.w * (1.0 + heat * 0.45) * uPresence;
      col += (uRimHot * core * 0.8 + uRim * sheath * 0.32) * bright;
      hot += core * bright;
      vec3 fargs = shape.xyz * theta + look.xyz * uTime + tone.xyz;
      float flare = max(0.0, (sin(fargs.x) + sin(fargs.y) + sin(fargs.z)) / 3.0);
      flare = (flare * flare + heat * 0.35) * flareAmp;
      float dw = abs(r - rc - flare);
      float dm = abs(r - rc - flare * 0.6);
      float dn = abs(r - rc - flare * 0.25);
      vec3 glow = uRimDeep * (0.07 * bell(dw, R * 0.09) + 0.16 * bell(dw, R * 0.05));
      glow += uRimMid * 0.28 * bell(dm, R * 0.027) + uRim * 0.38 * bell(dn, R * 0.013);
      col += glow * gain * topDim * uGlow * uBloom * (1.0 + heat * 1.4);
    }
  }

  for (int i = 0; i < 4; i++) {
    vec4 arc = uArcs[i];
    if (arc.w <= 0.002) continue;
    float mid = arc.x + arc.y * 0.5;
    vec2 center = R * 0.93 * vec2(cos(mid), sin(mid));
    if (distance(p, center) > R * (abs(arc.y) * 0.6 + 0.1) + 12.0) continue;
    float ar = R * 0.955;
    vec2 a0 = ar * vec2(cos(arc.x), sin(arc.x));
    vec2 a2 = ar * vec2(cos(arc.x + arc.y), sin(arc.x + arc.y));
    vec2 a1 = R * (0.955 - arc.z) * vec2(cos(mid), sin(mid));
    float dmin = 1e5;
    float along = 0.0;
    vec2 prev = a0;
    for (int s = 1; s <= 10; s++) {
      float u = float(s) / 10.0;
      vec2 b = mix(mix(a0, a1, u), mix(a1, a2, u), u);
      vec2 pa = p - prev;
      vec2 ba = b - prev;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
      float dist = length(pa - ba * h);
      if (dist < dmin) {
        dmin = dist;
        along = (float(s) - 1.0 + h) / 10.0;
      }
      prev = b;
    }
    float taper = sqrt(max(sin(PI * along), 0.0));
    float arcWidth = uLine * (0.55 + 0.6 * taper);
    float arcCore = exp(-dmin * dmin / (arcWidth * arcWidth));
    float arcGlow = exp(-dmin * dmin / (arcWidth * arcWidth * 12.0));
    col += (uSpark * 0.95 * arcCore + uSparkGlow * 0.4 * arcGlow) * arc.w * taper;
    hot += arcCore * arc.w * taper * 0.6;
  }

  fragColor = vec4(col, hot) * uEncode;
}
`,ma=`#version 300 es
precision highp float;

in float aIndex;

uniform sampler2D tHome;
uniform sampler2D tSeed;
uniform sampler2D tOffset;
uniform float uStirred;
uniform vec2 uCenter;
uniform vec2 uViewport;
uniform float uRadius;
uniform float uDpr;
uniform float uDepth;
uniform float uTwinkle;
uniform float uPointScale;
uniform float uReveal;
uniform float uEncode;
uniform vec3 uTones[5];
uniform vec3 uRimTone;

out vec3 vColor;
out float vSize;
${Ke}
${zt}
void main() {
  ivec2 cell = ivec2(int(mod(aIndex, ${U}.0)), int(floor(aIndex / ${U}.0)));
  uint id = uint(aIndex);
  vec4 home = texelFetch(tHome, cell, 0);
  vec4 seed = texelFetch(tSeed, cell, 0);
  float life;
  float spread;
  vec3 p = drift(home, seed, id, life, spread);
  if (uStirred > 0.5) p += texelFetch(tOffset, cell, 0).xyz;
  float len = length(p);
  float inside = 1.0 - smoothstep(0.955, 0.985, length(p.xy));
  if (len > 0.975) p *= 0.975 / len;

  float front = p.z * 0.5 + 0.5;
  float depthSize = mix(1.0, 0.7 + 0.6 * front, uDepth);
  float depthLight = mix(1.0, 0.35 + 0.8 * front, uDepth);
  float blink = sin(uDustTime * (2.0 + 6.0 * random(id * 7u + 5u)) + random(id * 7u + 6u) * 6.2831853);
  float twinkle = mix(1.0, smoothstep(-0.9, -0.6, blink), uTwinkle);
  float fade = smoothstep(0.04, 0.12, life);
  float order = (home.y + 1.0) * 0.5 * 0.55 + random(id * 7u + 8u) * 0.25;
  float reveal = smoothstep(order, order + 0.2, uReveal * 1.0);
  float alpha = random(id * 7u + 9u) < 0.5 || home.w > 3.5 ? 1.0 : 0.6;

  float size = seed.x * uPointScale * (0.35 + 0.95 * life) * depthSize * mix(0.5, 1.0, reveal);
  vec2 screen = uCenter + p.xy * uRadius;
  gl_Position = vec4(screen / uViewport * 2.0 - 1.0, 0.0, 1.0);
  float px = size * uDpr;
  gl_PointSize = px + 2.0;
  vSize = px;

  int tone = int(home.w + 0.5);
  float rimLit = smoothstep(0.8, 0.97, length(p.xy));
  vec3 color = uTones[tone] + uRimTone * rimLit * rimLit * 0.12;
  vColor = color * alpha * fade * twinkle * depthLight * reveal * inside * sqrt(spread) * uEncode;
}
`,ha=`#version 300 es
precision highp float;

uniform float uShape;

in vec3 vColor;
in float vSize;

out vec4 fragColor;

void main() {
  vec2 q = (gl_PointCoord - 0.5) * (vSize + 2.0);
  float half_ = max(vSize * 0.5, 0.5);
  float cover;
  if (uShape < 0.5) {
    vec2 c = clamp(half_ - abs(q) + 0.5, 0.0, 1.0);
    cover = c.x * c.y;
  } else {
    cover = clamp(half_ - length(q) + 0.5, 0.0, 1.0);
  }
  if (cover <= 0.0) discard;
  fragColor = vec4(vColor * cover, 0.0);
}
`,pa=`#version 300 es
precision highp float;

uniform sampler2D tHome;
uniform sampler2D tSeed;
uniform sampler2D tOffset;
uniform sampler2D tVelocity;
uniform float uDt;
uniform float uReset;
uniform vec4 uBrush;
uniform float uBrushPower;
uniform vec4 uKick;

layout(location = 0) out vec4 outOffset;
layout(location = 1) out vec4 outVelocity;
${Ke}
${zt}
vec3 swirl(vec3 p) {
  float t = uDustTime * 0.15;
  vec3 a = vec3(1.7, 1.9, 1.5) * p.yzx + vec3(t, 1.2, 2.1);
  vec3 b = vec3(2.3, 2.1, 2.7) * p.zxy + vec3(0.4, t * 1.3, 0.9);
  vec3 ca = cos(a) * vec3(1.7, 1.9, 1.5);
  vec3 cb = cos(b) * vec3(2.3, 2.1, 2.7);
  return vec3(ca.z - cb.x, cb.y - ca.x, ca.y - cb.z);
}

void main() {
  ivec2 cell = ivec2(gl_FragCoord.xy);
  if (uReset > 0.5) {
    outOffset = vec4(0.0);
    outVelocity = vec4(0.0);
    return;
  }
  uint id = uint(cell.y * ${U} + cell.x);
  vec4 home = texelFetch(tHome, cell, 0);
  vec4 seed = texelFetch(tSeed, cell, 0);
  vec3 o = texelFetch(tOffset, cell, 0).xyz;
  vec3 v = texelFetch(tVelocity, cell, 0).xyz;
  float life;
  float spread;
  vec3 base = drift(home, seed, id, life, spread);
  vec3 p = base + o;

  float k = mix(0.8, 2.2, random(id * 7u + 11u));
  vec3 acc = -k * o - 1.5 * sqrt(k) * v;

  vec2 gap = p.xy - uBrush.xy;
  float touch = exp(-dot(gap, gap) / 0.07) * uBrushPower;
  acc += (vec3(uBrush.zw, 0.0) - v) * touch * 14.0;
  float pace = length(v);
  if (pace > 1e-4) {
    vec3 heading = v / pace;
    vec3 curl = swirl(p * 1.6);
    acc += (curl - heading * dot(curl, heading)) * min(pace, 2.0) * 1.8;
  }

  if (uKick.z > 0.0) {
    vec3 jolt = vec3(random(id * 7u + 12u), random(id * 7u + 13u), random(id * 7u + 14u)) - 0.5;
    float near = exp(-dot(p.xy - uKick.xy, p.xy - uKick.xy) / 0.4);
    vec3 spinKick = vec3(-p.z, 0.0, p.x) * 0.9;
    vec3 lift = vec3(0.0, 0.5 + 0.8 * random(id * 7u + 15u), 0.0) * (0.3 + 0.7 * smoothstep(0.2, -0.8, p.y));
    v += (jolt * 0.8 + spinKick + lift) * uKick.z * (0.4 + 0.45 * near);
  }

  v += acc * uDt;
  o += v * uDt;
  vec3 q = base + o;
  float len = length(q);
  if (len > 0.97) {
    vec3 n = q / len;
    o -= n * (len - 0.97);
    v -= n * max(dot(v, n), 0.0) * 1.5;
  }
  outOffset = vec4(o, 1.0);
  outVelocity = vec4(v, 1.0);
}
`,va=`#version 300 es
precision highp float;

uniform sampler2D tScene;
uniform float uLight;
uniform float uDecode;

in vec2 vUv;
out vec4 fragColor;

vec3 soften(vec3 x) {
  vec3 over = max(x - 0.6, 0.0);
  return min(x, 0.6) + 0.4 * (1.0 - exp(-over / 0.4));
}

void main() {
  vec4 scene = texture(tScene, vUv) * uDecode;
  vec3 light = max(scene.rgb, 0.0);
  float peak = max(light.r, max(light.g, light.b));
  if (uLight > 0.5) {
    vec3 hue = light / max(peak, 1e-4);
    float cover = 1.0 - exp(-peak * 2.4);
    vec3 ink = hue * mix(0.92, 0.72, cover);
    float core = clamp(scene.a * 0.7, 0.0, 1.0) * cover;
    vec3 tint = mix(vec3(1.0), hue, 0.22);
    fragColor = vec4(tint * core + ink * cover * (1.0 - core), core + cover * (1.0 - core));
    return;
  }
  light += vec3(max(peak - 1.8, 0.0) * 0.25);
  vec3 shown = soften(light);
  fragColor = vec4(shown, max(shown.r, max(shown.g, shown.b)));
}
`,wa=({preset:e="plasma",color:o,theme:t="dark",size:s=.7,strands:u,crackle:l,flares:v,glow:x,sparks:g,particleCount:W,fill:Re,motion:V,particleShape:Z,depth:ee,sway:he,twinkle:ie,haze:Ct,speed:Pt=1,dustSpeed:Et,interactive:At=!0,hoverStrength:Dt=.7,intro:Ht=!0,paused:Lt=!1,className:Bt="",style:It})=>{const je=ne.useRef(null),Se=ne.useRef(null),ue=ne.useRef(null),qt=kt[e]||kt.plasma,M=(w,R)=>w??qt[R],$e=M(o,"color"),Ot=ne.useMemo(()=>{const w=t==="light";return{light:w,palette:ua(la($e,[.95,.36,.82]),w)}},[$e,t]);return ne.useEffect(()=>{var w;Se.current={...Ot,size:s,strands:M(u,"strands"),crackle:M(l,"crackle"),flares:M(v,"flares"),glow:M(x,"glow"),sparks:M(g,"sparks"),particleCount:M(W,"particleCount"),fill:M(Re,"fill"),motion:M(V,"motion"),particleShape:M(Z,"particleShape"),depth:M(ee,"depth"),sway:M(he,"sway"),twinkle:M(ie,"twinkle"),haze:M(Ct,"haze"),dustSpeed:M(Et,"dustSpeed"),speed:Pt,interactive:At,hoverStrength:Dt,intro:Ht,paused:Lt},(w=ue.current)==null||w.call(ue)}),ne.useEffect(()=>{var dt,mt;const w=je.current;if(!w)return;const R=new Yt({alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),r=R.gl;if(!R.isWebgl2){(dt=r.getExtension("WEBGL_lose_context"))==null||dt.loseContext();return}const _=r.canvas;_.style.display="block",_.style.width="100%",_.style.height="100%",_.setAttribute("aria-hidden","true"),w.appendChild(_);const Fe=!!r.getExtension("EXT_color_buffer_float"),pe=Fe||!!r.getExtension("EXT_color_buffer_half_float"),Te=pe?1:.25,ze=new Jt(r),G=new Mt(r),te=ca(),ce=new bt(r,{width:1,height:1,depth:!1,type:pe?r.HALF_FLOAT:r.UNSIGNED_BYTE,format:r.RGBA,internalFormat:pe?r.RGBA16F:r.RGBA,minFilter:r.NEAREST,magFilter:r.NEAREST}),fe=new Array(Ge*4).fill(0),c={uCenter:{value:[0,0]},uRadius:{value:1},uDpr:{value:1},uLine:{value:.6},uTime:{value:0},uFrame:{value:0},uBins:{value:420},uStrands:{value:5},uCrackle:{value:.6},uFlares:{value:.5},uGlow:{value:.8},uHaze:{value:.7},uFill:{value:.5},uPresence:{value:0},uUnfold:{value:0},uBloom:{value:0},uInside:{value:0},uEncode:{value:Te},uRim:{value:[1,1,1]},uRimHot:{value:[1,1,1]},uRimMid:{value:[1,1,1]},uRimDeep:{value:[1,1,1]},uSpark:{value:[1,1,1]},uSparkGlow:{value:[1,1,1]},uHazeColor:{value:[0,0,0]},uEdgeColor:{value:[0,0,0]},uHeat:{value:[0,0,0,0]},uHarmonics:{value:te.harmonics},uRates:{value:te.rates},uPhases:{value:te.phases},uFlareHarmonics:{value:te.flareHarmonics},uFlareRates:{value:te.flareRates},uFlarePhases:{value:te.flarePhases},uArcs:{value:fe}},K={uDustTime:{value:0},uTurn:{value:[0,0]},uMotion:{value:0},uFill:c.uFill,tHome:{value:G},tSeed:{value:G}},z={...K,tOffset:{value:G},uStirred:{value:0},uCenter:c.uCenter,uViewport:{value:[1,1]},uRadius:c.uRadius,uDpr:c.uDpr,uDepth:{value:.6},uTwinkle:{value:.5},uPointScale:{value:1},uReveal:{value:0},uEncode:{value:Te},uTones:{value:new Array(15).fill(1)},uRimTone:{value:[1,1,1]},uShape:{value:0}},C={...K,tOffset:{value:G},tVelocity:{value:G},uDt:{value:.016},uReset:{value:1},uBrush:{value:[0,0,0,0]},uBrushPower:{value:0},uKick:{value:[0,0,0,0]}},Xe={tScene:{value:ce.texture},uLight:{value:0},uDecode:{value:1/Te}},Ye=i=>(i.setBlendFunc(r.ONE,r.ONE),i),_t=new Me(r,{geometry:ze,program:Ye(new be(r,{vertex:Ue,fragment:da,uniforms:c,transparent:!0,depthTest:!1,depthWrite:!1}))}),Gt=Ye(new be(r,{vertex:ma,fragment:ha,uniforms:z,transparent:!0,depthTest:!1,depthWrite:!1})),N=pe?new Me(r,{geometry:ze,program:new be(r,{vertex:Ue,fragment:pa,uniforms:C,depthTest:!1,depthWrite:!1})}):null,Nt=new Me(r,{geometry:ze,program:new be(r,{vertex:Ue,fragment:va,uniforms:Xe,depthTest:!1,depthWrite:!1})}),Ce=i=>{i&&(r.deleteFramebuffer(i.buffer),i.textures.forEach(a=>r.deleteTexture(a.texture)))},Je=i=>new bt(r,{width:U,height:i,color:2,depth:!1,type:Fe?r.FLOAT:r.HALF_FLOAT,format:r.RGBA,internalFormat:Fe?r.RGBA32F:r.RGBA16F,minFilter:r.NEAREST,magFilter:r.NEAREST}),Qe=(i,a)=>new Mt(r,{image:i,width:U,height:a,type:r.FLOAT,format:r.RGBA,internalFormat:r.RGBA32F,minFilter:r.NEAREST,magFilter:r.NEAREST,generateMipmaps:!1,flipY:!1});let m=null;const Ze=()=>{m&&(m.mesh.geometry.remove(),r.deleteTexture(m.home.texture),r.deleteTexture(m.seed.texture),Ce(m.read),Ce(m.write),m=null)},et=()=>{!N||!m||!m.read||!m.write||(C.tOffset.value=G,C.tVelocity.value=G,C.uReset.value=1,R.render({scene:N,target:m.read,clear:!1}),R.render({scene:N,target:m.write,clear:!1}),C.uReset.value=0)},Ut=i=>{const a=d(Math.round(i/100)*100,0,aa);if(m&&m.requested===a)return;if(Ze(),!a){m=null;return}const n=fa(a),F=new Float32Array(n.count);for(let H=0;H<n.count;H++)F[H]=H;const T=new Zt(r,{aIndex:{size:1,data:F}});m={requested:a,rows:n.rows,home:Qe(n.home,n.rows),seed:Qe(n.seed,n.rows),mesh:new Me(r,{mode:r.POINTS,geometry:T,program:Gt}),read:N?Je(n.rows):null,write:N?Je(n.rows):null},K.tHome.value=m.home,K.tSeed.value=m.seed,et(),j=0},ve=((mt=window.matchMedia)==null?void 0:mt.call(window,"(prefers-reduced-motion: reduce)").matches)??!1,S=Ve(913);let B=1,I=1,de=0,Pe=performance.now(),Ee=0,tt=0,Ae=0,q=0,xe=!0,De=!0,D=0,j=0,He=0,$=null,Le=.3;const X=[],p={x:0,y:0,inside:!1,fresh:!0},f={angle:0,velocity:0,power:0,near:0},h={x:0,y:0,vx:0,vy:0},y={x:0,y:0,vx:0,vy:0},at=()=>{B=Math.max(1,w.clientWidth),I=Math.max(1,w.clientHeight),R.dpr=Math.min(window.devicePixelRatio||1,2,Math.sqrt(oa/(B*I))),R.setSize(B,I),ce.setSize(r.canvas.width,r.canvas.height),Y()},Be=(i,a)=>{X.length>=Ge||X.push({start:i,span:(.05+S()*.07)*(S()<.5?-1:1),curl:.02+S()*.04,life:0,duration:.2+S()*.2,drift:(S()-.5)*.3,strength:a})},ot=i=>{if(de=0,!De)return;const a=Se.current,n=Math.min(.05,Math.max(1/240,(i-Pe)/1e3));if(Pe=i,!a)return;const F=!a.paused&&!ve;q=a.intro&&!ve?Math.min(1,q+n/ra):1;const T=Rt(O(0,.42,q)),H=Rt(O(0,.32,q)),Ie=Math.sin(Math.PI*O(.22,.78,q))*.35,P=Math.max(8,d(a.size,.1,1.5)*Math.min(B,I)/2),ae=a.interactive&&!ve?d(a.hoverStrength,0,1):0,ge=p.x-B/2,ye=I/2-p.y,Wt=Math.hypot(ge,ye),qe=p.inside?ae:0;f.power<.02&&(f.angle=Math.atan2(ye,ge),f.velocity=0);const Vt=St(Math.atan2(ye,ge)-f.angle);f.velocity+=(120*Vt-19*f.velocity)*n,f.angle=St(f.angle+f.velocity*n),f.power+=(qe-f.power)*(1-Math.exp(-n/(qe>f.power?.3:.55)));const Kt=Math.exp(-Math.pow((Wt-P)/(P*.45),2));f.near+=(Kt-f.near)*(1-Math.exp(-n/.15)),D*=Math.exp(-n/.7);const oe=ge/P,re=ye/P;Math.hypot(oe-h.x,re-h.y)>.6&&(p.fresh=!0),p.fresh&&(h.x=oe,h.y=re,h.vx=0,h.vy=0,p.fresh=!1);const ht=1-Math.exp(-n/.05);h.vx+=((oe-h.x)/n-h.vx)*ht,h.vy+=((re-h.y)/n-h.vy)*ht,h.x=oe,h.y=re;const Oe=Math.hypot(h.vx,h.vy),pt=Oe>4?4/Oe:1,jt=Math.exp(-Math.max(0,Math.hypot(oe,re)-1)*6),vt=p.inside?ae*jt*T:0;if(He=He*Math.exp(-n/1.2)+vt*Math.min(Oe,4)*n,F){const E=1+D*.6+f.power*f.near*.3,b=n*Math.max(0,a.speed)*2*E;Ee+=b,tt+=n*Math.max(0,a.dustSpeed)*(1+D*.4),Ae+=n*Math.max(0,a.dustSpeed);const Xt=d(a.crackle+D*.5,0,1.5);if(a.sparks>.01&&q>.55&&(Le-=b*a.sparks*2*(.6+Xt*.6),Le<=0)){const J=f.power*f.near,Q=S()<J*.7?f.angle+(S()-.5)*.8:S()<.7?Math.PI/2+(S()-.5)*1.5:S()*Math.PI*2;Be(Q,.8+J*.6+D*.4),Le=.15+S()*.6}for(let J=X.length-1;J>=0;J--){const Q=X[J];Q.life+=b,Q.start+=Q.drift*b,Q.life>=Q.duration&&X.splice(J,1)}}else X.length=0;for(let E=0;E<Ge;E++){const b=X[E];fe[E*4]=b?b.start:0,fe[E*4+1]=b?b.span:0,fe[E*4+2]=b?b.curl:0,fe[E*4+3]=b?Math.sin(Math.PI*b.life/b.duration)*b.strength:0}Ut(a.particleCount);const L=a.palette;c.uCenter.value=[B/2,I/2],c.uRadius.value=P,c.uDpr.value=R.dpr,c.uLine.value=Math.max(.6,P*.0035),c.uTime.value=Ee,c.uFrame.value=Math.floor(Ee*24)%1e5,c.uBins.value=d(Math.round(Math.PI*2*P/2.6),240,900),c.uStrands.value=Math.round(d(a.strands,1,Tt)),c.uCrackle.value=d(a.crackle,0,1)+D*.5+Ie,c.uFlares.value=d(a.flares,0,1),c.uGlow.value=d(a.glow,0,2)*(1+D*.5+Ie)*(a.light?.35:1),c.uHaze.value=d(a.haze,0,2)*(a.light?.6:1),c.uFill.value=d(a.fill,0,1),c.uPresence.value=T,c.uUnfold.value=H,c.uBloom.value=T*T,c.uInside.value=O(.2,.95,q),c.uRim.value=L.rim,c.uRimHot.value=L.rimHot,c.uRimMid.value=L.rimMid,c.uRimDeep.value=L.rimDeep,c.uSpark.value=L.spark,c.uSparkGlow.value=L.sparkGlow,c.uHazeColor.value=L.haze,c.uEdgeColor.value=L.edge,c.uHeat.value=[f.angle,f.near,f.power*T,0],K.uDustTime.value=tt;const xt=p.inside?ae*T:0,wt=d(oe,-1.6,1.6)*xt,gt=d(re,-1.6,1.6)*xt;y.vx+=(40*(wt-y.x)-11*y.vx)*n,y.vy+=(40*(gt-y.y)-11*y.vy)*n,y.x+=y.vx*n,y.y+=y.vy*n;const yt=d(a.sway,0,1);K.uTurn.value=[yt*.42*Math.sin(Ae*.23)+y.x*.3,yt*.12*Math.sin(Ae*.17+1.3)-y.y*.16],K.uMotion.value=ea[a.motion]??0,z.uViewport.value=[B,I],z.uDepth.value=d(a.depth,0,1),z.uTwinkle.value=d(a.twinkle,0,1),z.uPointScale.value=Math.max(1,P/491),z.uReveal.value=O(.18,1,q),z.uTones.value=L.tones.flat(),z.uRimTone.value=L.rim,z.uShape.value=ta[a.particleShape]??0;const k=m;k&&N&&(He>.002||$)&&(j=na);let _e=!1;if(k&&k.read&&k.write&&N&&j>0){C.uDt.value=Math.min(n,1/30),C.uBrush.value=[h.x,h.y,h.vx*pt,h.vy*pt],C.uBrushPower.value=vt,C.uKick.value=$?[$.x,$.y,$.strength,0]:[0,0,0,0],C.tOffset.value=k.read.textures[0],C.tVelocity.value=k.read.textures[1],R.render({scene:N,target:k.write,clear:!1});const E=k.read;k.read=k.write,k.write=E,j-=n,_e=j>0,_e||(j=0,et())}$=null,z.uStirred.value=_e?1:0,z.tOffset.value=k&&k.read?k.read.textures[0]:G,r.clearColor(0,0,0,0),R.render({scene:_t,target:ce,clear:!0}),m&&R.render({scene:m.mesh,target:ce,clear:!1}),Xe.uLight.value=a.light?1:0,R.render({scene:Nt,clear:!1});const $t=Math.abs(qe-f.power)>.002||D>.002||j>0||Math.abs(f.velocity)>.01||Math.hypot(y.vx,y.vy,y.x-wt,y.y-gt)>.001;xe&&(F||q<1||$t)&&(de=requestAnimationFrame(ot))},Y=()=>{de||!xe||!De||(Pe=performance.now(),de=requestAnimationFrame(ot))},rt=i=>{const a=w.getBoundingClientRect(),n=i.clientX-a.left,F=i.clientY-a.top;return{x:n,y:F,inside:n>=0&&F>=0&&n<=a.width&&F<=a.height}},nt=i=>{const a=rt(i);a.inside&&!p.inside&&(p.fresh=!0),p.x=a.x,p.y=a.y,p.inside=a.inside,a.inside&&Y()},lt=i=>{const a=Se.current,n=rt(i);if(!a||!a.interactive||ve||!n.inside)return;p.inside||(p.fresh=!0),p.x=n.x,p.y=n.y,p.inside=!0;const F=Math.max(8,d(a.size,.1,1.5)*Math.min(B,I)/2),T=(n.x-B/2)/F,H=(I/2-n.y)/F;if(Math.hypot(T,H)>1.3)return;const P=d(a.hoverStrength,0,1);$={x:T,y:H,strength:P*1.2},D=Math.max(D,P);const ae=Math.atan2(H,T);Be(ae+(S()-.5)*.5,1.3),Be(ae+Math.PI+(S()-.5)*1.2,1.1),Y()},we=()=>{p.inside=!1,Y()},st=i=>{i.relatedTarget||we()},it=i=>{i.pointerType==="touch"&&we()},ut=()=>{document.hidden||Y()};window.addEventListener("pointermove",nt,{passive:!0}),window.addEventListener("pointerdown",lt,{passive:!0}),window.addEventListener("pointerout",st,{passive:!0}),window.addEventListener("pointerup",it,{passive:!0}),window.addEventListener("blur",we),document.addEventListener("visibilitychange",ut);const ct=new ResizeObserver(at);ct.observe(w);const ft=new IntersectionObserver(([i])=>{xe=i.isIntersecting,Y()});return ft.observe(w),ue.current=Y,at(),()=>{var i;De=!1,xe=!1,cancelAnimationFrame(de),ct.disconnect(),ft.disconnect(),window.removeEventListener("pointermove",nt),window.removeEventListener("pointerdown",lt),window.removeEventListener("pointerout",st),window.removeEventListener("pointerup",it),window.removeEventListener("blur",we),document.removeEventListener("visibilitychange",ut),ue.current=null,Ze(),Ce(ce),(i=r.getExtension("WEBGL_lose_context"))==null||i.loseContext(),_.parentNode&&_.parentNode.removeChild(_)}},[]),Qt.jsx("div",{ref:je,className:`crystalized-ball ${Bt}`.trim(),style:It})};export{wa as default};
