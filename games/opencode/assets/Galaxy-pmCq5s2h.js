import{r as s,R as N,T as G,P as V,C as P,M as K,j}from"./index-D0zNZLAK.js";const B=`
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,Y=`
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
uniform float uLightMode;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    float coverage = clamp(smoothstep(0.0, 0.42, energy) * 0.92, 0.0, 0.92);
    vec3 ink = clamp(col * 0.48, 0.0, 0.82);
    gl_FragColor = vec4(mix(vec3(1.0), ink, coverage), 1.0);
  } else if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;function W({focal:g=[.5,.5],rotation:R=[1,0],starSpeed:l=.5,density:y=1,hueShift:S=140,disableAnimation:A=!1,speed:b=1,mouseInteraction:i=!0,glowIntensity:w=.3,saturation:F=0,mouseRepulsion:M=!0,repulsionStrength:C=2,twinkleIntensity:T=.3,rotationSpeed:L=.1,autoCenterRepulsion:_=0,transparent:r=!0,lightMode:c=!1,...z}){const v=s.useRef(null),f=s.useRef({x:.5,y:.5}),u=s.useRef({x:.5,y:.5}),m=s.useRef(0),p=s.useRef(0);return s.useEffect(()=>{if(!v.current)return;const t=v.current,d=new N({alpha:r,premultipliedAlpha:!1}),e=d.gl;c?e.clearColor(1,1,1,1):r?(e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.clearColor(0,0,0,0)):e.clearColor(0,0,0,1);let o;function h(){d.setSize(t.offsetWidth*1,t.offsetHeight*1),o&&(o.uniforms.uResolution.value=new P(e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height))}window.addEventListener("resize",h,!1),h();const D=new G(e);o=new V(e,{vertex:B,fragment:Y,uniforms:{uTime:{value:0},uResolution:{value:new P(e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height)},uFocal:{value:new Float32Array(g)},uRotation:{value:new Float32Array(R)},uStarSpeed:{value:l},uDensity:{value:y},uHueShift:{value:S},uSpeed:{value:b},uMouse:{value:new Float32Array([u.current.x,u.current.y])},uGlowIntensity:{value:w},uSaturation:{value:F},uMouseRepulsion:{value:M},uTwinkleIntensity:{value:T},uRotationSpeed:{value:L},uRepulsionStrength:{value:C},uMouseActiveFactor:{value:0},uAutoCenterRepulsion:{value:_},uTransparent:{value:r},uLightMode:{value:c?1:0}}});const H=new K(e,{geometry:D,program:o});let x;function O(a){x=requestAnimationFrame(O),A||(o.uniforms.uTime.value=a*.001,o.uniforms.uStarSpeed.value=a*.001*l/10);const n=.05;u.current.x+=(f.current.x-u.current.x)*n,u.current.y+=(f.current.y-u.current.y)*n,p.current+=(m.current-p.current)*n,o.uniforms.uMouse.value[0]=u.current.x,o.uniforms.uMouse.value[1]=u.current.y,o.uniforms.uMouseActiveFactor.value=p.current,d.render({scene:H})}x=requestAnimationFrame(O),t.appendChild(e.canvas);function U(a){const n=t.getBoundingClientRect(),k=(a.clientX-n.left)/n.width,I=1-(a.clientY-n.top)/n.height;f.current={x:k,y:I},m.current=1}function E(){m.current=0}return i&&(t.addEventListener("mousemove",U),t.addEventListener("mouseleave",E)),()=>{var a;cancelAnimationFrame(x),window.removeEventListener("resize",h),i&&(t.removeEventListener("mousemove",U),t.removeEventListener("mouseleave",E)),t.removeChild(e.canvas),(a=e.getExtension("WEBGL_lose_context"))==null||a.loseContext()}},[g,R,l,y,S,A,b,i,w,F,M,T,L,C,_,r,c]),j.jsx("div",{ref:v,className:"galaxy-container",...z})}export{W as default};
