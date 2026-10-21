import{r as W,R as S,T as k,P,M as Y,j as _}from"./index-tDOHgNLd.js";function v(r){const t=r.replace("#","");return[parseInt(t.slice(0,2),16)/255,parseInt(t.slice(2,4),16)/255,parseInt(t.slice(4,6),16)/255]}const D=`
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,z=`
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uColorCycleSpeed;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;
uniform float uLightMode;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float result = sin(coord * 2.123) * 0.2;
  result += sin(coord * 3.234 + t * 4.345) * 0.1;
  result += sin(coord * 0.589 + t * 0.934) * 0.5;
  return result;
}

float displaceB(float coord, float t) {
  float result = sin(coord * 1.345) * 0.3;
  result += sin(coord * 2.734 + t * 3.345) * 0.2;
  result += sin(coord * 0.189 + t * 0.934) * 0.3;
  return result;
}

vec2 rotate2D(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = coords * 2.0 - 1.0;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  float mouseWarp = 0.0;
  if (uEnableMouse) {
    vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
    float mDist = length(coords - mPos);
    mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);
  }

  float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
  float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

  vec2 fieldA = vec2(warpAx, warpAy);
  vec2 fieldB = vec2(warpBx, warpBy);
  vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

  float fadeTop = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY = blended.y * tileCount;
  float nY = smoothNoise(abs(scaledY));

  float ridge = pow(
    step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)),
    5.0
  );

  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = vMask * lines;

  float cycleT = fullT * uColorCycleSpeed;
  float rChannel = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float gChannel = (pattern + vMask * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float bChannel = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col = (rChannel * uColor1 + gChannel * uColor2 + bChannel * uColor3) * uBrightness;
  float alpha = clamp(length(col), 0.0, 1.0);

  if (uLightMode > 0.5) {
    vec3 weights = pow(max(vec3(rChannel, gChannel, bChannel), vec3(0.0)), vec3(3.0));
    float weightSum = max(weights.r + weights.g + weights.b, 0.0001);
    vec3 chroma = (weights.r * uColor1 + weights.g * uColor2 + weights.b * uColor3) / weightSum;
    float neutral = min(chroma.r, min(chroma.g, chroma.b));
    chroma = max(chroma - vec3(neutral * 0.92), vec3(0.0));
    float peak = max(chroma.r, max(chroma.g, chroma.b));
    chroma = pow(clamp(chroma / max(peak, 0.0001), 0.0, 1.0), vec3(1.08));
    float ink = clamp(max(rChannel, max(gChannel, bChannel)) * uBrightness * 1.15, 0.0, 0.92);
    gl_FragColor = vec4(mix(vec3(1.0), chroma, ink), 1.0);
  } else {
    gl_FragColor = vec4(col, alpha);
  }
}
`;function H({speed:r=.3,innerLineCount:t=32,outerLineCount:h=36,warpIntensity:p=1,rotation:g=-45,edgeFadeWidth:x=0,colorCycleSpeed:C=1,brightness:w=.2,color1:y="#ffffff",color2:M="#ffffff",color3:T="#ffffff",enableMouseInteraction:l=!0,mouseInfluence:b=2,lightMode:E=!1}){const f=W.useRef(null);return W.useEffect(()=>{if(!f.current)return;const s=f.current,c=new S({alpha:!0,premultipliedAlpha:!1}),e=c.gl;e.clearColor(0,0,0,0);let o,n=[.5,.5],i=[.5,.5];function B(a){const u=e.canvas.getBoundingClientRect();i=[(a.clientX-u.left)/u.width,1-(a.clientY-u.top)/u.height]}function F(){i=[.5,.5]}function d(){c.setSize(s.offsetWidth,s.offsetHeight),o&&(o.uniforms.uResolution.value=[e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height])}window.addEventListener("resize",d),d();const A=new k(e),R=g*Math.PI/180;o=new P(e,{vertex:D,fragment:z,uniforms:{uTime:{value:0},uResolution:{value:[e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height]},uSpeed:{value:r},uInnerLines:{value:t},uOuterLines:{value:h},uWarpIntensity:{value:p},uRotation:{value:R},uEdgeFadeWidth:{value:x},uColorCycleSpeed:{value:C},uBrightness:{value:w},uColor1:{value:v(y)},uColor2:{value:v(M)},uColor3:{value:v(T)},uMouse:{value:new Float32Array([.5,.5])},uMouseInfluence:{value:b},uEnableMouse:{value:l},uLightMode:{value:E?1:0}}});const I=new Y(e,{geometry:A,program:o});s.appendChild(e.canvas),l&&(e.canvas.addEventListener("mousemove",B),e.canvas.addEventListener("mouseleave",F));let m;function L(a){m=requestAnimationFrame(L),o.uniforms.uTime.value=a*.001,l?(n[0]+=.05*(i[0]-n[0]),n[1]+=.05*(i[1]-n[1]),o.uniforms.uMouse.value[0]=n[0],o.uniforms.uMouse.value[1]=n[1]):(o.uniforms.uMouse.value[0]=.5,o.uniforms.uMouse.value[1]=.5),c.render({scene:I})}return m=requestAnimationFrame(L),()=>{var a;cancelAnimationFrame(m),window.removeEventListener("resize",d),l&&(e.canvas.removeEventListener("mousemove",B),e.canvas.removeEventListener("mouseleave",F)),s.removeChild(e.canvas),(a=e.getExtension("WEBGL_lose_context"))==null||a.loseContext()}},[r,t,h,p,g,x,C,w,y,M,T,l,b,E]),_.jsx("div",{ref:f,className:"line-waves-container"})}export{H as default};
