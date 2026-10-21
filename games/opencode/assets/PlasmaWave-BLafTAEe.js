import{r as v,R as U,f as X,G as H,P as V,M as J,j as K}from"./index-D0zNZLAK.js";import{C as Q}from"./Camera-CETj5Gul.js";function l(a){const s=parseInt(a.slice(1,3),16)/255,u=parseInt(a.slice(3,5),16)/255,f=parseInt(a.slice(5,7),16)/255;return[s,u,f]}const Y=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Z=`
precision highp float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  uOffset;
uniform float uRotation;
uniform float uFocalLength;
uniform float uSpeed1;
uniform float uSpeed2;
uniform float uDir2;
uniform float uBend1;
uniform float uBend2;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform float uLightMode;

const float lt   = 0.3;
const float pi   = 3.14159;
const float pi2  = 6.28318;
const float pi_2 = 1.5708;
#define MAX_STEPS 14

void mainImage(out vec4 C, in vec2 U) {
  float t = iTime * pi;
  float s = 1.0;
  float d = 0.0;
  vec2  R = iResolution;

  vec3 o = vec3(0.0, 0.0, -7.0);
  vec3 u = normalize(vec3((U - 0.5 * R) / R.y, uFocalLength));
  vec2 k = vec2(0.0);
  vec3 p;

  float t1 = t * 0.7;
  float t2 = t * 0.9;
  float tSpeed1 = t * uSpeed1;
  float tSpeed2 = t * uSpeed2 * uDir2;

  for (int i = 0; i < MAX_STEPS; ++i) {
    p = o + u * d;
    p.x -= 15.0;

    float px = p.x;
    float wob1 = uBend1 + sin(t1 + px * 0.8) * 0.1;
    float wob2 = uBend2 + cos(t2 + px * 1.1) * 0.1;

    float px2 = px + pi_2;
    vec2 sinOffset = sin(vec2(px, px2) + tSpeed1) * wob1;
    vec2 cosOffset = cos(vec2(px, px2) + tSpeed2) * wob2;

    vec2 yz = p.yz;
    float pxLt = px + lt;
    k.x = max(pxLt, length(yz - sinOffset) - lt);
    k.y = max(pxLt, length(yz - cosOffset) - lt);

    float current = min(k.x, k.y);
    s = min(s, current);
    if (s < 0.001 || d > 300.0) break;
    d += s * 0.7;
  }

  float sqrtD = sqrt(d);
  vec3 raw = max(cos(d * pi2) - s * sqrtD - vec3(k, 0.0), 0.0);
  float field = max(raw.r, max(raw.g, raw.b));
  float outerMask = smoothstep(0.0, 0.055, field);
  float glowMask = smoothstep(0.012, 0.13, field);
  float coreMask = smoothstep(0.075, 0.27, field);
  if (uLightMode < 0.5 && field < 0.15) discard;
  raw.gb += uLightMode > 0.5 ? 0.1 * glowMask : 0.1;
  raw = raw * 0.4 + raw.brg * 0.6 + raw * raw;
  float lum = dot(raw, vec3(0.299, 0.587, 0.114));
  float w1 = max(0.0, 1.0 - k.x * 2.0);
  float w2 = max(0.0, 1.0 - k.y * 2.0);
  float wt = w1 + w2 + 0.001;
  vec3 baseColor = (uColor1 * w1 + uColor2 * w2) / wt;
  vec3 c = baseColor * lum * 3.5;
  if (uLightMode > 0.5) {
    float lightW1 = exp(-max(k.x, 0.0) * 4.0);
    float lightW2 = exp(-max(k.y, 0.0) * 4.0);
    vec3 lightBase = (uColor1 * lightW1 + uColor2 * lightW2) / (lightW1 + lightW2 + 0.001);
    float lightLuma = dot(lightBase, vec3(0.299, 0.587, 0.114));
    vec3 vividColor = clamp(pow(max(mix(vec3(lightLuma), lightBase, 1.35), 0.0), vec3(0.64)) * 1.14, 0.0, 1.0);
    float colorPresence = clamp(outerMask * 0.34 + glowMask * 1.08 + coreMask * 0.22, 0.0, 1.0);
    vec3 lightColor = mix(vec3(1.0), vividColor, colorPresence);
    lightColor = mix(lightColor, vec3(1.0), coreMask * smoothstep(0.16, 0.95, lum) * 0.1);
    C = vec4(lightColor, 1.0);
  } else {
    C = vec4(c, 1.0);
  }
}

void main() {
  vec2 coord = gl_FragCoord.xy + uOffset;
  coord -= 0.5 * iResolution;
  float c = cos(uRotation), s = sin(uRotation);
  coord = mat2(c, -s, s, c) * coord;
  coord += 0.5 * iResolution;

  vec4 color;
  mainImage(color, coord);
  gl_FragColor = color;
}
`;function oe(a){const{xOffset:s=0,yOffset:u=0,rotationDeg:f=0,focalLength:b=.8,speed1:L=.05,speed2:k=.05,dir2:y=1,bend1:B=1,bend2:S=.5,colors:p=["#A855F7","#06B6D4"],lightMode:F=!1}=a,g=v.useRef(a);g.current=a;const h=v.useRef(null);return v.useEffect(()=>{const t=h.current;if(!t)return;const i=new U({alpha:!0,dpr:Math.min(window.devicePixelRatio,1.5),antialias:!0,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"}),e=i.gl;e.clearColor(0,0,0,0),t.appendChild(e.canvas);const O=new Q(e),w=new X,P=new H(e,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])}}),c=new Float32Array([s,u]),m=new Float32Array([1,1]),A=l(p[0]),D=l(p[1]),o=new V(e,{vertex:Y,fragment:Z,uniforms:{iTime:{value:0},iResolution:{value:m},uOffset:{value:c},uRotation:{value:f*Math.PI/180},uFocalLength:{value:b},uSpeed1:{value:L},uSpeed2:{value:k},uDir2:{value:y},uBend1:{value:B},uBend2:{value:S},uColor1:{value:A},uColor2:{value:D},uLightMode:{value:F?1:0}}});new J(e,{geometry:P,program:o}).setParent(w);function x(){if(!t)return;const{width:r,height:n}=t.getBoundingClientRect();i.setSize(r,n),m[0]=r*i.dpr,m[1]=n*i.dpr,e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight)}const C=new ResizeObserver(x);C.observe(t),x();const T=performance.now();let d;const R=r=>{const{xOffset:n=0,yOffset:z=0,rotationDeg:W=0,focalLength:_=.8,speed1:E=.05,speed2:I=.05,dir2:q=1,bend1:G=1,bend2:j=.5,colors:M=["#A855F7","#06B6D4"],lightMode:N=!1}=g.current;c[0]=n,c[1]=z,o.uniforms.iTime.value=(r-T)*.001,o.uniforms.uRotation.value=W*Math.PI/180,o.uniforms.uFocalLength.value=_,o.uniforms.uSpeed1.value=E,o.uniforms.uSpeed2.value=I,o.uniforms.uDir2.value=q,o.uniforms.uBend1.value=G,o.uniforms.uBend2.value=j,o.uniforms.uColor1.value=l(M[0]),o.uniforms.uColor2.value=l(M[1]),o.uniforms.uLightMode.value=N?1:0,i.render({scene:w,camera:O}),d=requestAnimationFrame(R)};return d=requestAnimationFrame(R),()=>{var r;cancelAnimationFrame(d),C.disconnect(),t&&e.canvas.parentNode===t&&t.removeChild(e.canvas),(r=e.getExtension("WEBGL_lose_context"))==null||r.loseContext()}},[]),K.jsx("div",{ref:h,className:"plasma-wave-container"})}export{oe as default};
