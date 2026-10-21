import{r as z,j as he}from"./index-tDOHgNLd.js";import{E as ae,R as ne,b as re,a as ce}from"./index-DX2KU2Vi.js";import{W as xe,h as ie,C as ge,S as we,s as ye,p as Ce,ap as Ee,t as Re,b as Se,v as F,u as Te,ag as Pe,L as le}from"./three.module-BgPORkTe.js";const Ae=()=>{const r=document.createElement("canvas");r.width=64,r.height=64;const i=r.getContext("2d");if(!i)throw new Error("2D context not available");i.fillStyle="black",i.fillRect(0,0,r.width,r.height);const A=new Pe(r);A.minFilter=le,A.magFilter=le,A.generateMipmaps=!1;const C=[];let E=null;const d=64;let R=.1*64;const k=1/d,I=()=>{i.fillStyle="black",i.fillRect(0,0,r.width,r.height)},_=o=>{const l={x:o.x*64,y:(1-o.y)*64};let u=1;const S=p=>Math.sin(p*Math.PI/2),g=p=>-p*(p-2);o.age<d*.3?u=S(o.age/(d*.3)):u=g(1-(o.age-d*.3)/(d*.7))||0,u*=o.force;const h=`${(o.vx+1)/2*255}, ${(o.vy+1)/2*255}, ${u*255}`,v=320;i.shadowOffsetX=v,i.shadowOffsetY=v,i.shadowBlur=R,i.shadowColor=`rgba(${h},${.22*u})`,i.beginPath(),i.fillStyle="rgba(255,0,0,1)",i.arc(l.x-v,l.y-v,R,0,Math.PI*2),i.fill()};return{canvas:r,texture:A,addTouch:o=>{let l=0,u=0,S=0;if(E){const g=o.x-E.x,h=o.y-E.y;if(g===0&&h===0)return;const v=g*g+h*h,p=Math.sqrt(v);u=g/(p||1),S=h/(p||1),l=Math.min(v*1e4,1)}E={x:o.x,y:o.y},C.push({x:o.x,y:o.y,age:0,force:l,vx:u,vy:S})},update:()=>{I();for(let o=C.length-1;o>=0;o--){const l=C[o],u=l.force*k*(1-l.age/d);l.x+=l.vx*u,l.y+=l.vy*u,l.age++,l.age>d&&C.splice(o,1)}for(let o=0;o<C.length;o++)_(C[o]);A.needsUpdate=!0},set radiusScale(o){R=.1*64*o},get radiusScale(){return R/(.1*64)},size:64}},be=(b,r)=>{const i=`
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;

    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;

      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);

      float amt = uStrength * intensity * wave;

      uv += vec2(vx, vy) * amt;
    }
    `;return new ce("LiquidEffect",i,{uniforms:new Map([["uTexture",new F(b)],["uStrength",new F((r==null?void 0:r.strength)??.025)],["uTime",new F(0)],["uFreq",new F((r==null?void 0:r.freq)??4.5)]])})},se={square:0,circle:1,triangle:2,diamond:3},Me=`
void main() {
  gl_Position = vec4(position, 1.0);
}
`,ze=`
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;

  // sRGB gamma correction - convert linear to sRGB for accurate color output
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );

  fragColor = vec4(srgbColor, M);
}
`,V=10,qe=({variant:b="square",pixelSize:r=3,color:i="#B497CF",className:A,style:C,antialias:E=!0,patternScale:d=2,patternDensity:R=1,liquid:k=!1,liquidStrength:I=.1,liquidRadius:_=1,pixelSizeJitter:L=0,enableRipples:B=!0,rippleIntensityScale:o=1,rippleThickness:l=.1,rippleSpeed:u=.3,liquidWobbleSpeed:S=4.5,autoPauseOffscreen:g=!0,speed:h=.5,transparent:v=!0,edgeFade:p=.5,noiseAmount:O=0})=>{const H=z.useRef(null),ue=z.useRef({visible:!0}),X=z.useRef(h),f=z.useRef(null),G=z.useRef(null);return z.useEffect(()=>{var $,j,Y;const w=H.current;if(!w)return;X.current=h;const fe=["antialias","liquid","noiseAmount"],K={antialias:E,liquid:k,noiseAmount:O};let D=!1;if(!f.current)D=!0;else if(G.current){for(const e of fe)if(G.current[e]!==K[e]){D=!0;break}}if(D){if(f.current){const a=f.current;($=a.resizeObserver)==null||$.disconnect(),cancelAnimationFrame(a.raf),(j=a.quad)==null||j.geometry.dispose(),a.material.dispose(),(Y=a.composer)==null||Y.dispose(),a.renderer.dispose(),a.renderer.forceContextLoss(),a.renderer.domElement.parentElement===w&&w.removeChild(a.renderer.domElement),f.current=null}const e=document.createElement("canvas"),t=new xe({canvas:e,antialias:E,alpha:!0,powerPreference:"high-performance"});t.domElement.style.width="100%",t.domElement.style.height="100%",t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),w.appendChild(t.domElement),v?t.setClearAlpha(0):t.setClearColor(0,1);const s={uResolution:{value:new ie(0,0)},uTime:{value:0},uColor:{value:new ge(i)},uClickPos:{value:Array.from({length:V},()=>new ie(-1,-1))},uClickTimes:{value:new Float32Array(V)},uShapeType:{value:se[b]??0},uPixelSize:{value:r*t.getPixelRatio()},uScale:{value:d},uDensity:{value:R},uPixelJitter:{value:L},uEnableRipples:{value:B?1:0},uRippleSpeed:{value:u},uRippleThickness:{value:l},uRippleIntensity:{value:o},uEdgeFade:{value:p}},T=new we,M=new ye(-1,1,1,-1,0,1),J=new Ce({vertexShader:Me,fragmentShader:ze,uniforms:s,transparent:!0,depthTest:!1,depthWrite:!1,glslVersion:Ee}),me=new Re(2,2),Q=new Se(me,J);T.add(Q);const W=new Te,Z=()=>{var m;const a=w.clientWidth||1,n=w.clientHeight||1;t.setSize(a,n,!1),s.uResolution.value.set(t.domElement.width,t.domElement.height),(m=f.current)!=null&&m.composer&&f.current.composer.setSize(t.domElement.width,t.domElement.height),s.uPixelSize.value=r*t.getPixelRatio()};Z();const ee=new ResizeObserver(Z);ee.observe(w);const te=(()=>{var a;if(typeof window<"u"&&((a=window.crypto)!=null&&a.getRandomValues)){const n=new Uint32Array(1);return window.crypto.getRandomValues(n),n[0]/4294967295}return Math.random()})()*1e3;let c,P,q;if(k){P=Ae(),P.radiusScale=_,c=new ae(t);const a=new ne(T,M);q=be(P.texture,{strength:I,freq:S});const n=new re(M,q);n.renderToScreen=!0,c.addPass(a),c.addPass(n)}if(O>0){c||(c=new ae(t),c.addPass(new ne(T,M)));const a=new ce("NoiseEffect","uniform float uTime; uniform float uAmount; float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);} void mainUv(inout vec2 uv){} void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){ float n=hash(floor(uv*vec2(1920.0,1080.0))+floor(uTime*60.0)); float g=(n-0.5)*uAmount; outputColor=inputColor+vec4(vec3(g),0.0);} ",{uniforms:new Map([["uTime",new F(0)],["uAmount",new F(O)]])}),n=new re(M,a);n.renderToScreen=!0,c&&c.passes.length>0&&c.passes.forEach(m=>m.renderToScreen=!1),c.addPass(n)}c&&c.setSize(t.domElement.width,t.domElement.height);const oe=a=>{const n=t.domElement.getBoundingClientRect(),m=t.domElement.width/n.width,x=t.domElement.height/n.height,y=(a.clientX-n.left)*m,pe=(n.height-(a.clientY-n.top))*x;return{fx:y,fy:pe,w:t.domElement.width,h:t.domElement.height}},de=a=>{var y;const{fx:n,fy:m}=oe(a),x=((y=f.current)==null?void 0:y.clickIx)??0;s.uClickPos.value[x].set(n,m),s.uClickTimes.value[x]=s.uTime.value,f.current&&(f.current.clickIx=(x+1)%V)},ve=a=>{if(!P)return;const{fx:n,fy:m,w:x,h:y}=oe(a);P.addTouch({x:n/x,y:m/y})};t.domElement.addEventListener("pointerdown",de,{passive:!0}),t.domElement.addEventListener("pointermove",ve,{passive:!0});let U=0;const N=()=>{if(g&&!ue.current.visible){U=requestAnimationFrame(N);return}s.uTime.value=te+W.getElapsedTime()*X.current,q&&(q.uniforms.get("uTime").value=s.uTime.value),c?(P&&P.update(),c.passes.forEach(a=>{const n=a.effects;n&&n.forEach(m=>{var y;const x=(y=m.uniforms)==null?void 0:y.get("uTime");x&&(x.value=s.uTime.value)})}),c.render()):t.render(T,M),U=requestAnimationFrame(N)};U=requestAnimationFrame(N),f.current={renderer:t,scene:T,camera:M,material:J,clock:W,clickIx:0,uniforms:s,resizeObserver:ee,raf:U,quad:Q,timeOffset:te,composer:c,touch:P,liquidEffect:q}}else{const e=f.current;if(e.uniforms.uShapeType.value=se[b]??0,e.uniforms.uPixelSize.value=r*e.renderer.getPixelRatio(),e.uniforms.uColor.value.set(i),e.uniforms.uScale.value=d,e.uniforms.uDensity.value=R,e.uniforms.uPixelJitter.value=L,e.uniforms.uEnableRipples.value=B?1:0,e.uniforms.uRippleIntensity.value=o,e.uniforms.uRippleThickness.value=l,e.uniforms.uRippleSpeed.value=u,e.uniforms.uEdgeFade.value=p,v?e.renderer.setClearAlpha(0):e.renderer.setClearColor(0,1),e.liquidEffect){const t=e.liquidEffect;t&&(t.value=I);const s=e.liquidEffect.uniforms.get("uFreq");s&&(s.value=S)}e.touch&&(e.touch.radiusScale=_)}return G.current=K,()=>{var t,s,T;if(f.current&&D||!f.current)return;const e=f.current;(t=e.resizeObserver)==null||t.disconnect(),cancelAnimationFrame(e.raf),(s=e.quad)==null||s.geometry.dispose(),e.material.dispose(),(T=e.composer)==null||T.dispose(),e.renderer.dispose(),e.renderer.forceContextLoss(),e.renderer.domElement.parentElement===w&&w.removeChild(e.renderer.domElement),f.current=null}},[E,k,O,r,d,R,B,o,l,u,L,p,v,I,_,S,g,b,i,h]),he.jsx("div",{ref:H,className:`pixel-blast-container ${A??""}`,style:C,"aria-label":"PixelBlast interactive background"})};export{qe as default};
