import{r as i,R as K,P as Q,T as V,M as Z,j as ee}from"./index-D0zNZLAK.js";const B=8,oe=n=>{const t=n.replace("#","").padEnd(6,"0"),f=parseInt(t.slice(0,2),16)/255,m=parseInt(t.slice(2,4),16)/255,a=parseInt(t.slice(4,6),16)/255;return[f,m,a]},te=n=>{const t=(n&&n.length?n:["#FF9FFC","#5227FF"]).slice(0,B);for(t.length===1&&t.push(t[0]);t.length<B;)t.push(t[t.length-1]);const f=[];for(let a=0;a<B;a++)f.push(oe(t[a]));const m=Math.max(2,Math.min(B,(n==null?void 0:n.length)??2));return{arr:f,count:m}},ne=({className:n,dpr:t,paused:f=!1,gradientColors:m,angle:a=0,noise:E=.3,blindCount:p=16,blindMinWidth:R=60,mouseDampening:M=.15,mirrorGradient:P=!1,spotlightRadius:I=.5,spotlightSoftness:L=1,spotlightOpacity:_=1,distortAmount:N=0,shineDirection:O="left",mixBlendMode:z="lighten",lightMode:F=!1})=>{const D=i.useRef(null),y=i.useRef(null),w=i.useRef(null),d=i.useRef(null),b=i.useRef(null),A=i.useRef(null),T=i.useRef([0,0]),C=i.useRef(0),G=i.useRef(!0);return i.useEffect(()=>{const g=D.current;if(!g)return;const h=new K({dpr:t??(typeof window<"u"&&window.devicePixelRatio||1),alpha:!0,antialias:!0});A.current=h;const u=h.gl,l=u.canvas;l.style.width="100%",l.style.height="100%",l.style.display="block",g.appendChild(l);const Y=`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,$=`
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;
uniform float uLightMode;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec3 getGradientColor(float t){
  float tt = clamp(t, 0.0, 1.0);
  int count = uColorCount;
  if (count < 2) count = 2;
  float scaled = tt * float(count - 1);
  float seg = floor(scaled);
  float f = fract(scaled);

  if (seg < 1.0) return mix(uColor0, uColor1, f);
  if (seg < 2.0 && count > 2) return mix(uColor1, uColor2, f);
  if (seg < 3.0 && count > 3) return mix(uColor2, uColor3, f);
  if (seg < 4.0 && count > 4) return mix(uColor3, uColor4, f);
  if (seg < 5.0 && count > 5) return mix(uColor4, uColor5, f);
  if (seg < 6.0 && count > 6) return mix(uColor5, uColor6, f);
  if (seg < 7.0 && count > 7) return mix(uColor6, uColor7, f);
  if (count > 7) return uColor7;
  if (count > 6) return uColor6;
  if (count > 5) return uColor5;
  if (count > 4) return uColor4;
  if (count > 3) return uColor3;
  if (count > 2) return uColor2;
  return uColor1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv0 = fragCoord.xy / iResolution.xy;

    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv0 * 2.0 - 1.0;
    p.x *= aspect;
    vec2 pr = rotate2D(p, uAngle);
    pr.x /= aspect;
    vec2 uv = pr * 0.5 + 0.5;

    vec2 uvMod = uv;
    if (uDistort > 0.0) {
      float a = uvMod.y * 6.0;
      float b = uvMod.x * 6.0;
      float w = 0.01 * uDistort;
      uvMod.x += sin(a) * w;
      uvMod.y += cos(b) * w;
    }
    float t = uvMod.x;
    if (uMirror > 0.5) {
      t = 1.0 - abs(1.0 - 2.0 * fract(t));
    }
    vec3 base = getGradientColor(t);

    vec2 offset = vec2(iMouse.x/iResolution.x, iMouse.y/iResolution.y);
  float d = length(uv0 - offset);
  float r = max(uSpotlightRadius, 1e-4);
  float dn = d / r;
  float spot = (1.0 - 2.0 * pow(dn, uSpotlightSoftness)) * uSpotlightOpacity;
  vec3 cir = vec3(spot);
  float blindCount = max(uBlindCount, 1.0);
  float stripePhase = uvMod.x * blindCount;
  float stripe = fract(stripePhase);
  float stripeAA = clamp(blindCount * 1.25 / min(iResolution.x, iResolution.y), 0.001, 0.12);
  float edgeDistance = min(stripe, 1.0 - stripe);
  float edgeBlend = 1.0 - smoothstep(0.0, stripeAA, edgeDistance);
  stripe = mix(stripe, 0.5, edgeBlend);
  if (uShineFlip > 0.5) stripe = 1.0 - stripe;
    vec3 ran = vec3(stripe);
    vec3 revealSignal = cir + base - ran;

    vec3 col;
    if (uLightMode > 0.5) {
        float peak = max(base.r, max(base.g, base.b));
        vec3 pigment = base / max(peak, 0.0001);
        float neutral = min(pigment.r, min(pigment.g, pigment.b));
        pigment = max(pigment - vec3(neutral * 0.72), vec3(0.0));
        pigment /= max(max(pigment.r, max(pigment.g, pigment.b)), 0.0001);
        pigment = mix(pigment, pigment * pigment, 0.12) * 0.72;
        vec3 revealed = clamp(revealSignal, 0.0, 1.0);
        float coverage = max(revealed.r, max(revealed.g, revealed.b));
        col = mix(vec3(1.0), pigment, coverage);
        float grain = max(rand(gl_FragCoord.xy + iTime) - 0.5, 0.0);
        float grainAmount = grain * uNoise * mix(0.12, 0.18, coverage);
        col = clamp(col - vec3(grainAmount), 0.0, 1.0);
    } else {
        col = revealSignal;
        col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise;
    }

    fragColor = vec4(col, 1.0);
}

void main() {
    vec4 color;
    mainImage(color, vUv * iResolution.xy);
    gl_FragColor = color;
}
`,{arr:c,count:j}=te(m),s={iResolution:{value:[u.drawingBufferWidth,u.drawingBufferHeight,1]},iMouse:{value:[0,0]},iTime:{value:0},uAngle:{value:a*Math.PI/180},uNoise:{value:E},uBlindCount:{value:Math.max(1,p)},uSpotlightRadius:{value:I},uSpotlightSoftness:{value:L},uSpotlightOpacity:{value:_},uMirror:{value:P?1:0},uDistort:{value:N},uShineFlip:{value:O==="right"?1:0},uColor0:{value:c[0]},uColor1:{value:c[1]},uColor2:{value:c[2]},uColor3:{value:c[3]},uColor4:{value:c[4]},uColor5:{value:c[5]},uColor6:{value:c[6]},uColor7:{value:c[7]},uColorCount:{value:j},uLightMode:{value:F?1:0}},U=new Q(u,{vertex:Y,fragment:$,uniforms:s});w.current=U;const H=new V(u);b.current=H;const J=new Z(u,{geometry:H,program:U});d.current=J;const k=()=>{const o=g.getBoundingClientRect();if(h.setSize(o.width,o.height),s.iResolution.value=[u.drawingBufferWidth,u.drawingBufferHeight,1],R&&R>0){const e=Math.max(1,Math.floor(o.width/R)),r=p?Math.min(p,e):e;s.uBlindCount.value=Math.max(1,r)}else s.uBlindCount.value=Math.max(1,p);if(G.current){G.current=!1;const e=u.drawingBufferWidth/2,r=u.drawingBufferHeight/2;s.iMouse.value=[e,r],T.current=[e,r]}};k();const q=new ResizeObserver(k);q.observe(g);const X=o=>{const e=l.getBoundingClientRect(),r=h.dpr||1,v=(o.clientX-e.left)*r,x=(e.height-(o.clientY-e.top))*r;T.current=[v,x],M<=0&&(s.iMouse.value=[v,x])};l.addEventListener("pointermove",X);const W=o=>{if(y.current=requestAnimationFrame(W),s.iTime.value=o*.001,M>0){C.current||(C.current=o);const e=(o-C.current)/1e3;C.current=o;const r=Math.max(1e-4,M);let v=1-Math.exp(-e/r);v>1&&(v=1);const x=T.current,S=s.iMouse.value;S[0]+=(x[0]-S[0])*v,S[1]+=(x[1]-S[1])*v}else C.current=o;if(!f&&w.current&&d.current)try{h.render({scene:d.current})}catch(e){console.error(e)}};return y.current=requestAnimationFrame(W),()=>{y.current&&cancelAnimationFrame(y.current),l.removeEventListener("pointermove",X),q.disconnect(),l.parentElement===g&&g.removeChild(l);const o=(e,r)=>{e&&typeof e[r]=="function"&&e[r].call(e)};o(w.current,"remove"),o(b.current,"remove"),o(d.current,"remove"),o(A.current,"destroy"),w.current=null,b.current=null,d.current=null,A.current=null}},[t,f,m,a,E,p,R,M,P,I,L,_,N,O,F]),ee.jsx("div",{ref:D,className:`gradient-blinds-container ${n}`,style:{...!F&&z&&{mixBlendMode:z}}})};export{ne as default};
