import{r as x,R as b,T as z,C as g,P as F,M as E,j as L}from"./index-tDOHgNLd.js";const M=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,P=`#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {                int index = 0;                                              for (int i = 0; i < 2; i++) {                                    ColorStop currentColor = colors[i];                         bool isInBetween = currentColor.position <= factor;         index = int(mix(float(index), float(i), float(isInBetween)));   }                                                           ColorStop currentColor = colors[index];                     ColorStop nextColor = colors[index + 1];                    float range = nextColor.position - currentColor.position;   float lerpFactor = (factor - currentColor.position) / range;   finalColor = mix(currentColor.color, nextColor.color, lerpFactor); }

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;function _(a){const{colorStops:p=["#5227FF","#7cff67","#5227FF"],amplitude:d=1,blend:l=.5,lightMode:c=!1}=a,i=x.useRef(a);i.current=a;const h=x.useRef(null);return x.useEffect(()=>{const e=h.current;if(!e)return;const s=new b({alpha:!0,premultipliedAlpha:!0,antialias:!0}),o=s.gl;o.clearColor(0,0,0,0),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.canvas.style.backgroundColor="transparent";let r;function u(){if(!e)return;const t=e.offsetWidth,n=e.offsetHeight;s.setSize(t,n),r&&(r.uniforms.uResolution.value=[t,n])}window.addEventListener("resize",u);const m=new z(o);m.attributes.uv&&delete m.attributes.uv;const y=p.map(t=>{const n=new g(t);return[n.r,n.g,n.b]});r=new F(o,{vertex:M,fragment:P,uniforms:{uTime:{value:0},uAmplitude:{value:d},uColorStops:{value:y},uResolution:{value:[e.offsetWidth,e.offsetHeight]},uBlend:{value:l},uLightMode:{value:c?1:0}}});const w=new E(o,{geometry:m,program:r});e.appendChild(o.canvas);let v=0;const C=t=>{v=requestAnimationFrame(C);const{time:n=t*.01,speed:S=1}=i.current;r.uniforms.uTime.value=n*S*.1,r.uniforms.uAmplitude.value=i.current.amplitude??1,r.uniforms.uBlend.value=i.current.blend??l,r.uniforms.uLightMode.value=i.current.lightMode??c?1:0;const A=i.current.colorStops??p;r.uniforms.uColorStops.value=A.map(R=>{const f=new g(R);return[f.r,f.g,f.b]}),s.render({scene:w})};return v=requestAnimationFrame(C),u(),()=>{var t;cancelAnimationFrame(v),window.removeEventListener("resize",u),e&&o.canvas.parentNode===e&&e.removeChild(o.canvas),(t=o.getExtension("WEBGL_lose_context"))==null||t.loseContext()}},[d,l,c]),L.jsx("div",{ref:h,className:"aurora-container"})}export{_ as default};
