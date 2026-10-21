import{r as t,j as Y}from"./index-D0zNZLAK.js";import{h as m,S as J,s as K,t as Q,V as N,p as Z,b as ee,W as re,f as ne,u as oe}from"./three.module-BgPORkTe.js";const k=8,te=`
#define MAX_COLORS ${k}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3); // strong response across 0..1
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); // allow >1 to amplify displacement
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`,ue=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;function ie({className:_,style:X,rotation:M=90,speed:v=.2,colors:P=[],transparent:i=!0,autoRotate:F=0,scale:p=1,frequency:d=1,warpStrength:h=1,mouseInfluence:w=1,parallax:C=.5,noise:g=.15,iterations:y=1,intensity:R=1.5,bandWidth:x=6}){const B=t.useRef(null),W=t.useRef(null),S=t.useRef(null),E=t.useRef(null),I=t.useRef(null),T=t.useRef(M),O=t.useRef(F),b=t.useRef(new m(0,0)),U=t.useRef(new m(0,0)),V=t.useRef(8);return t.useEffect(()=>{const e=B.current,u=new J,c=new K(-1,1,1,-1,0,1),a=new Q(2,2),o=Array.from({length:k},()=>new N(0,0,0)),r=new Z({vertexShader:ue,fragmentShader:te,uniforms:{uCanvas:{value:new m(1,1)},uTime:{value:0},uSpeed:{value:v},uRot:{value:new m(1,0)},uColorCount:{value:0},uColors:{value:o},uTransparent:{value:i?1:0},uScale:{value:p},uFrequency:{value:d},uWarpStrength:{value:h},uPointer:{value:new m(0,0)},uMouseInfluence:{value:w},uParallax:{value:C},uNoise:{value:g},uIterations:{value:y},uIntensity:{value:R},uBandWidth:{value:x}},premultipliedAlpha:!0,transparent:!0});E.current=r;const s=new ee(a,r);u.add(s);const n=new re({antialias:!1,powerPreference:"high-performance",alpha:!0});W.current=n,n.outputColorSpace=ne,n.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),n.setClearColor(0,i?0:1),n.domElement.style.width="100%",n.domElement.style.height="100%",n.domElement.style.display="block",e.appendChild(n.domElement);const A=new oe,q=()=>{const l=e.clientWidth||1,f=e.clientHeight||1;n.setSize(l,f,!1),r.uniforms.uCanvas.value.set(l,f)};if(q(),"ResizeObserver"in window){const l=new ResizeObserver(q);l.observe(e),I.current=l}else window.addEventListener("resize",q);const L=()=>{const l=A.getDelta(),f=A.elapsedTime;r.uniforms.uTime.value=f;const j=(T.current%360+O.current*f)*Math.PI/180,G=Math.cos(j),D=Math.sin(j);r.uniforms.uRot.value.set(G,D);const z=U.current,$=b.current,H=Math.min(1,l*V.current);z.lerp($,H),r.uniforms.uPointer.value.copy(z),n.render(u,c),S.current=requestAnimationFrame(L)};return S.current=requestAnimationFrame(L),()=>{S.current!==null&&cancelAnimationFrame(S.current),I.current?I.current.disconnect():window.removeEventListener("resize",q),a.dispose(),r.dispose(),n.dispose(),n.forceContextLoss(),n.domElement&&n.domElement.parentElement===e&&e.removeChild(n.domElement)}},[x,d,R,y,w,g,C,p,v,i,h]),t.useEffect(()=>{const e=E.current,u=W.current;if(!e)return;T.current=M,O.current=F,e.uniforms.uSpeed.value=v,e.uniforms.uScale.value=p,e.uniforms.uFrequency.value=d,e.uniforms.uWarpStrength.value=h,e.uniforms.uMouseInfluence.value=w,e.uniforms.uParallax.value=C,e.uniforms.uNoise.value=g,e.uniforms.uIterations.value=y,e.uniforms.uIntensity.value=R,e.uniforms.uBandWidth.value=x;const c=o=>{const r=o.replace("#","").trim(),s=r.length===3?[parseInt(r[0]+r[0],16),parseInt(r[1]+r[1],16),parseInt(r[2]+r[2],16)]:[parseInt(r.slice(0,2),16),parseInt(r.slice(2,4),16),parseInt(r.slice(4,6),16)];return new N(s[0]/255,s[1]/255,s[2]/255)},a=(P||[]).filter(Boolean).slice(0,k).map(c);for(let o=0;o<k;o++){const r=e.uniforms.uColors.value[o];o<a.length?r.copy(a[o]):r.set(0,0,0)}e.uniforms.uColorCount.value=a.length,e.uniforms.uTransparent.value=i?1:0,u&&u.setClearColor(0,i?0:1)},[M,F,v,p,d,h,w,C,g,y,R,x,P,i]),t.useEffect(()=>{const e=E.current,u=B.current;if(!e||!u)return;const c=a=>{const o=u.getBoundingClientRect(),r=(a.clientX-o.left)/(o.width||1)*2-1,s=-((a.clientY-o.top)/(o.height||1)*2-1);b.current.set(r,s)};return u.addEventListener("pointermove",c),()=>{u.removeEventListener("pointermove",c)}},[]),Y.jsx("div",{ref:B,className:`color-bends-container ${_}`,style:X})}export{ie as default};
