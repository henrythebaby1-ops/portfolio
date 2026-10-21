import{r as C,R as q,T as U,P as F,M as H,a as j,j as $,C as X}from"./index-tDOHgNLd.js";const S=12,h=8,O=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,V=`#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${h}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  float env = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${S}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`,J=`#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uRefraction;
uniform float uDispersion;

out vec4 fragColor;

vec2 toUv(vec2 p) {
  return p * (uResolution.y / uResolution) + 0.5;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  float d = length(p);
  float r = uRadius;

  float edge = fwidth(d) * 1.5;
  float mask = 1.0 - smoothstep(r - edge, r + edge, d);
  if (mask <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }

  // sphere height: 0 at the rim, 1 at the center
  float z = sqrt(max(r * r - d * d, 0.0)) / r;
  float nd = d / r; // 0 at the center, 1 at the rim

  // refraction is confined to a narrow band near the rim; the rest stays undistorted
  vec2 dir = d > 0.0 ? p / d : vec2(0.0);
  float lens = smoothstep(0.85, 1.0, nd) * pow(nd, 6.0);
  vec2 offset = -dir * lens * uRefraction * 0.15;
  vec2 disp = -dir * lens * uDispersion * 0.012;

  vec3 light;
  light.r = texture(uScene, toUv(p + offset - disp)).r;
  light.g = texture(uScene, toUv(p + offset)).g;
  light.b = texture(uScene, toUv(p + offset + disp)).b;

  // neutral fresnel rim (no color tint so the glass stays clear)
  float fres = pow(1.0 - z, 3.0);
  vec3 rim = vec3(1.0) * fres * 0.18;

  // specular highlight from the upper-left
  vec2 lightDir = normalize(vec2(-0.55, 0.6));
  float spec = pow(max(dot(p / max(r, 1e-4), lightDir), 0.0), 6.0);
  spec *= smoothstep(r, r * 0.55, d);

  vec3 emissive = light + rim + vec3(spec) * 0.4;
  float emissiveA = clamp(max(max(emissive.r, emissive.g), emissive.b), 0.0, 1.0);

  // almost clear glass body: only a faint neutral darkening, mostly near the rim
  float bodyA = 0.05 + fres * 0.05;

  // composite emissive light over the clear body (premultiplied)
  float outA = emissiveA + bodyA * (1.0 - emissiveA);
  vec3 outRGB = emissive;

  outRGB *= mask;
  outA *= mask;

  fragColor = vec4(outRGB, outA);
}
`,W=s=>{const l=s&&s.length?s:["#ffffff"],f=[];for(let r=0;r<h;r++){const v=l[r]??l[l.length-1],n=new X(v);f.push([n.r,n.g,n.b])}return f};function Q({colors:s=["#FF4242","#7C3AED","#06B6D4","#EAB308"],count:l=3,speed:f=.5,amplitude:r=1,waviness:v=1,thickness:n=.7,glow:R=2.6,taper:y=3,spread:w=1,hueShift:A=0,intensity:b=.6,saturation:T=1.5,opacity:k=1,scale:E=1.5,glass:z=!1,refraction:I=1,dispersion:D=1,glassSize:M=1,className:B="",style:L}){const c=C.useRef({});c.current={colors:s,count:l,speed:f,amplitude:r,waviness:v,thickness:n,glow:R,taper:y,spread:w,hueShift:A,intensity:b,saturation:T,opacity:k,scale:E,glass:z,refraction:I,dispersion:D,glassSize:M};const G=C.useRef(null);return C.useEffect(()=>{const u=G.current;if(!u)return;const m=new q({alpha:!0,premultipliedAlpha:!0,antialias:!0}),o=m.gl;o.clearColor(0,0,0,0),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.canvas.style.backgroundColor="transparent";const d=new U(o);d.attributes.uv&&delete d.attributes.uv;const t=new F(o,{vertex:O,fragment:V,uniforms:{uTime:{value:0},uResolution:{value:[u.offsetWidth,u.offsetHeight]},uColors:{value:W(c.current.colors)},uColorCount:{value:Math.min(c.current.colors.length,h)},uStrandCount:{value:Math.min(c.current.count,S)},uSpeed:{value:f},uAmplitude:{value:r},uWaviness:{value:v},uThickness:{value:n},uGlow:{value:R},uTaper:{value:y},uSpread:{value:w},uHueShift:{value:A},uIntensity:{value:b},uOpacity:{value:k},uScale:{value:E},uSaturation:{value:T}}}),P=new H(o,{geometry:d,program:t}),p=new j(o,{width:u.offsetWidth,height:u.offsetHeight}),i=new F(o,{vertex:O,fragment:J,uniforms:{uScene:{value:p.texture},uResolution:{value:[u.offsetWidth,u.offsetHeight]},uRadius:{value:.46*M},uRefraction:{value:I},uDispersion:{value:D}}}),N=new H(o,{geometry:d,program:i});u.appendChild(o.canvas);function g(){if(!u)return;const a=u.offsetWidth,e=u.offsetHeight;m.setSize(a,e),t.uniforms.uResolution.value=[a,e],p.setSize(a,e),i.uniforms.uResolution.value=[a,e]}window.addEventListener("resize",g),g();let x=0;const _=a=>{x=requestAnimationFrame(_);const e=c.current;t.uniforms.uTime.value=a*.001,t.uniforms.uColors.value=W(e.colors),t.uniforms.uColorCount.value=Math.min(e.colors.length,h),t.uniforms.uStrandCount.value=Math.min(Math.max(Math.round(e.count),1),S),t.uniforms.uSpeed.value=e.speed,t.uniforms.uAmplitude.value=e.amplitude,t.uniforms.uWaviness.value=e.waviness,t.uniforms.uThickness.value=e.thickness,t.uniforms.uGlow.value=e.glow,t.uniforms.uTaper.value=e.taper,t.uniforms.uSpread.value=e.spread,t.uniforms.uHueShift.value=e.hueShift,t.uniforms.uIntensity.value=e.intensity,t.uniforms.uOpacity.value=e.opacity,t.uniforms.uScale.value=e.scale,t.uniforms.uSaturation.value=e.saturation,e.glass?(m.render({scene:P,target:p}),i.uniforms.uScene.value=p.texture,i.uniforms.uRefraction.value=e.refraction,i.uniforms.uDispersion.value=e.dispersion,i.uniforms.uRadius.value=.46*e.glassSize,m.render({scene:N})):m.render({scene:P})};return x=requestAnimationFrame(_),()=>{var a;cancelAnimationFrame(x),window.removeEventListener("resize",g),u&&o.canvas.parentNode===u&&u.removeChild(o.canvas),(a=o.getExtension("WEBGL_lose_context"))==null||a.loseContext()}},[]),$.jsx("div",{ref:G,className:`strands-container ${B}`,style:L})}export{Q as default};
