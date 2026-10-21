import{r as m,j as ce}from"./index-tDOHgNLd.js";import{h,S as ue,s as fe,W as se,V as p,p as me,t as de,b as ve,u as ge}from"./three.module-BgPORkTe.js";const he=`
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,pe=`
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;
uniform vec3 backgroundColor;
uniform bool lightMode;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;
  
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  return gradientColor * 0.5;
}

  float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1;
    }
  }

if (lightMode) {
  vec3 energy = max(col, vec3(0.0));
  float peak = max(energy.r, max(energy.g, energy.b));
  float coverage = smoothstep(0.018, 0.5, peak);
  vec3 chroma = clamp(energy / max(peak, 0.0001), 0.0, 1.0);
  chroma = pow(chroma, vec3(1.35));
  float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
  chroma /= max(chromaPeak, 0.0001);
  vec3 ink = mix(chroma, clamp(chroma * 0.82, 0.0, 1.0), smoothstep(0.5, 1.0, coverage));
  fragColor = vec4(mix(vec3(1.0), ink, coverage * 0.94), 1.0);
} else {
    fragColor = vec4(col, 1.0);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`,q=8;function J(v){let e=v.trim();e.startsWith("#")&&(e=e.slice(1));let a=255,c=255,n=255;return e.length===3?(a=parseInt(e[0]+e[0],16),c=parseInt(e[1]+e[1],16),n=parseInt(e[2]+e[2],16)):e.length===6&&(a=parseInt(e.slice(0,2),16),c=parseInt(e.slice(2,4),16),n=parseInt(e.slice(4,6),16)),new p(a/255,c/255,n/255)}function be({linesGradient:v,enabledWaves:e=["top","middle","bottom"],lineCount:a=[6],lineDistance:c=[5],topWavePosition:n,middleWavePosition:i,bottomWavePosition:l={x:2,y:-.7,rotate:-1},animationSpeed:I=1,interactive:x=!0,bendRadius:G=5,bendStrength:k=-.5,mouseDamping:C=.05,parallax:b=!0,parallaxStrength:L=.2,mixBlendMode:Q="screen",backgroundColor:B="#000000",lightMode:R=!1}){const O=m.useRef(null),S=m.useRef(new h(-1e3,-1e3)),T=m.useRef(new h(-1e3,-1e3)),w=m.useRef(0),E=m.useRef(0),_=m.useRef(new h(0,0)),z=m.useRef(new h(0,0)),U=o=>{if(typeof a=="number")return a;if(!e.includes(o))return 0;const u=e.indexOf(o);return a[u]??6},M=o=>{if(typeof c=="number")return c;if(!e.includes(o))return .1;const u=e.indexOf(o);return c[u]??.1},Z=e.includes("top")?U("top"):0,$=e.includes("middle")?U("middle"):0,P=e.includes("bottom")?U("bottom"):0,W=e.includes("top")?M("top")*.01:.01,ee=e.includes("middle")?M("middle")*.01:.01,te=e.includes("bottom")?M("bottom")*.01:.01;return m.useEffect(()=>{const o=O.current;if(!o)return;let u=!0;const A=new ue,D=new fe(-1,1,1,-1,0,1);D.position.z=1;const t=new se({antialias:!0,alpha:!1});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.domElement.style.width="100%",t.domElement.style.height="100%",o.appendChild(t.domElement);const f={iTime:{value:0},iResolution:{value:new p(1,1,1)},animationSpeed:{value:I},enableTop:{value:e.includes("top")},enableMiddle:{value:e.includes("middle")},enableBottom:{value:e.includes("bottom")},topLineCount:{value:Z},middleLineCount:{value:$},bottomLineCount:{value:P},topLineDistance:{value:W},middleLineDistance:{value:ee},bottomLineDistance:{value:te},topWavePosition:{value:new p((n==null?void 0:n.x)??10,(n==null?void 0:n.y)??.5,(n==null?void 0:n.rotate)??-.4)},middleWavePosition:{value:new p((i==null?void 0:i.x)??5,(i==null?void 0:i.y)??0,(i==null?void 0:i.rotate)??.2)},bottomWavePosition:{value:new p((l==null?void 0:l.x)??2,(l==null?void 0:l.y)??-.7,(l==null?void 0:l.rotate)??.4)},iMouse:{value:new h(-1e3,-1e3)},interactive:{value:x},bendRadius:{value:G},bendStrength:{value:k},bendInfluence:{value:0},parallax:{value:b},parallaxStrength:{value:L},parallaxOffset:{value:new h(0,0)},lineGradient:{value:Array.from({length:q},()=>new p(1,1,1))},lineGradientCount:{value:0},backgroundColor:{value:J(B)},lightMode:{value:R}};if(v&&v.length>0){const d=v.slice(0,q);f.lineGradientCount.value=d.length,d.forEach((r,g)=>{const s=J(r);f.lineGradient.value[g].set(s.x,s.y,s.z)})}const F=new me({uniforms:f,vertexShader:he,fragmentShader:pe}),K=new de(2,2),ne=new ve(K,F);A.add(ne);const oe=new ge,V=()=>{if(!u)return;const d=o.clientWidth||1,r=o.clientHeight||1;t.setSize(d,r,!1);const g=t.domElement.width,s=t.domElement.height;f.iResolution.value.set(g,s,1)};V();const y=typeof ResizeObserver<"u"?new ResizeObserver(()=>{u&&V()}):null;y&&y.observe(o);const j=d=>{const r=t.domElement.getBoundingClientRect(),g=d.clientX-r.left,s=d.clientY-r.top,H=t.getPixelRatio();if(S.current.set(g*H,(r.height-s)*H),w.current=1,b){const re=r.width/2,ie=r.height/2,le=(g-re)/r.width,ae=-(s-ie)/r.height;_.current.set(le*L,ae*L)}},N=()=>{w.current=0};x&&(t.domElement.addEventListener("pointermove",j),t.domElement.addEventListener("pointerleave",N));let X=0;const Y=()=>{u&&(f.iTime.value=oe.getElapsedTime(),x&&(T.current.lerp(S.current,C),f.iMouse.value.copy(T.current),E.current+=(w.current-E.current)*C,f.bendInfluence.value=E.current),b&&(z.current.lerp(_.current,C),f.parallaxOffset.value.copy(z.current)),t.render(A,D),X=requestAnimationFrame(Y))};return Y(),()=>{u=!1,cancelAnimationFrame(X),y&&y.disconnect(),x&&(t.domElement.removeEventListener("pointermove",j),t.domElement.removeEventListener("pointerleave",N)),K.dispose(),F.dispose(),t.dispose(),t.forceContextLoss(),t.domElement.parentElement&&t.domElement.parentElement.removeChild(t.domElement)}},[v,e,a,c,n,i,l,I,x,G,k,C,b,L,B,R]),ce.jsx("div",{ref:O,className:"floating-lines-container",style:{mixBlendMode:R?"normal":Q}})}export{be as default};
