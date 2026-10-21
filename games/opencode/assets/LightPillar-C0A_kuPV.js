import{r as t,j as K}from"./index-D0zNZLAK.js";import{h as Z,S as ae,s as le,W as ce,p as fe,t as me,b as ve,C as z,V as F}from"./three.module-BgPORkTe.js";const Re=({topColor:w="#5227FF",bottomColor:x="#FF9FFC",intensity:C=1,rotationSpeed:P=.3,interactive:a=!1,className:q="",glowAmount:E=.005,pillarWidth:M=3,pillarHeight:S=.4,noiseIntensity:y=.5,mixBlendMode:A="screen",pillarRotation:T=0,quality:h="high",lightMode:I=!1})=>{const l=t.useRef(null),f=t.useRef(null),o=t.useRef(null),e=t.useRef(null),p=t.useRef(null),R=t.useRef(null),g=t.useRef(null),G=t.useRef(new Z(0,0)),_=t.useRef(0),j=t.useRef(P),[W,N]=t.useState(!0);return t.useEffect(()=>{const r=document.createElement("canvas");r.getContext("webgl")||r.getContext("experimental-webgl")||N(!1)},[]),t.useEffect(()=>{if(!l.current||!W)return;const r=l.current,s=r.clientWidth,i=r.clientHeight,k=new ae;p.current=k;const ee=new le(-1,1,1,-1,0,1);R.current=ee;const B=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),te=B||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4;let m=h;te&&h==="high"&&(m="medium"),B&&h!=="low"&&(m="low");const U={low:{iterations:24,waveIterations:1,pixelRatio:.5,precision:"mediump",stepMultiplier:1.5},medium:{iterations:40,waveIterations:2,pixelRatio:.65,precision:"mediump",stepMultiplier:1.2},high:{iterations:80,waveIterations:4,pixelRatio:Math.min(window.devicePixelRatio,2),precision:"highp",stepMultiplier:1}},c=U[m]||U.medium;let v;try{v=new ce({antialias:!1,alpha:!0,powerPreference:m==="high"?"high-performance":"low-power",precision:c.precision,stencil:!1,depth:!1})}catch{N(!1);return}v.setSize(s,i),v.setPixelRatio(c.pixelRatio),r.appendChild(v.domElement),o.current=v;const $=u=>{const n=new z(u);return new F(n.r,n.g,n.b)},re=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,ne=`
      precision ${c.precision} float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uLightMode;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      varying vec2 vUv;

      const float STEP_MULT = ${c.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${c.iterations};
      const int WAVE_ITER = ${c.waveIterations};

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float a = uMouse.x * 6.283185;
          rotC = cos(a);
          rotS = sin(a);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;
        
        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;
          
          float freq = 1.0;
          float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }
          
          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if(t > 50.0) break;
        }

        float widthNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / widthNorm);
        
        col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
        
        vec3 result = clamp(col * uIntensity, 0.0, 1.0);
        if (uLightMode > 0.5) {
          float energy = max(result.r, max(result.g, result.b));
          vec3 hue = result / max(energy, 0.001);
          float coverage = smoothstep(0.025, 0.95, energy);
          hue = pow(clamp(hue, 0.0, 1.0), vec3(1.25));
          result = mix(vec3(1.0), hue, coverage * 0.94);
        }
        gl_FragColor = vec4(result, 1.0);
      }
    `,H=T*Math.PI/180,oe=Math.sin(.4),ue=Math.cos(.4),V=new fe({vertexShader:re,fragmentShader:ne,uniforms:{uTime:{value:0},uResolution:{value:new Z(s,i)},uMouse:{value:G.current},uTopColor:{value:$(w)},uBottomColor:{value:$(x)},uIntensity:{value:C},uInteractive:{value:a},uGlowAmount:{value:E},uPillarWidth:{value:M},uPillarHeight:{value:S},uNoiseIntensity:{value:y},uLightMode:{value:I?1:0},uRotCos:{value:1},uRotSin:{value:0},uPillarRotCos:{value:Math.cos(H)},uPillarRotSin:{value:Math.sin(H)},uWaveSin:{value:oe},uWaveCos:{value:ue}},transparent:!0,depthWrite:!1,depthTest:!1});e.current=V;const O=new me(2,2);g.current=O;const ie=new ve(O,V);k.add(ie);let b=null;const X=u=>{if(!a||b)return;b=window.setTimeout(()=>{b=null},16);const n=r.getBoundingClientRect(),d=(u.clientX-n.left)/n.width*2-1,se=-((u.clientY-n.top)/n.height)*2+1;G.current.set(d,se)};a&&r.addEventListener("mousemove",X,{passive:!0});let D=performance.now();const Q=1e3/(m==="low"?30:60),Y=u=>{if(!e.current||!o.current||!p.current||!R.current)return;const n=u-D;if(n>=Q){_.current+=.016*j.current;const d=_.current;e.current.uniforms.uTime.value=d,e.current.uniforms.uRotCos.value=Math.cos(d*.3),e.current.uniforms.uRotSin.value=Math.sin(d*.3),o.current.render(p.current,R.current),D=u-n%Q}f.current=requestAnimationFrame(Y)};f.current=requestAnimationFrame(Y);let L=null;const J=()=>{L&&clearTimeout(L),L=window.setTimeout(()=>{if(!o.current||!e.current||!l.current)return;const u=l.current.clientWidth,n=l.current.clientHeight;o.current.setSize(u,n),e.current.uniforms.uResolution.value.set(u,n)},150)};return window.addEventListener("resize",J,{passive:!0}),()=>{window.removeEventListener("resize",J),a&&r.removeEventListener("mousemove",X),f.current&&cancelAnimationFrame(f.current),o.current&&(o.current.dispose(),o.current.forceContextLoss(),r.contains(o.current.domElement)&&r.removeChild(o.current.domElement)),e.current&&e.current.dispose(),g.current&&g.current.dispose(),o.current=null,e.current=null,p.current=null,R.current=null,g.current=null,f.current=null}},[W,h]),t.useEffect(()=>{j.current=P},[P]),t.useEffect(()=>{if(!e.current)return;const r=s=>{const i=new z(s);return new F(i.r,i.g,i.b)};e.current.uniforms.uTopColor.value=r(w)},[w]),t.useEffect(()=>{if(!e.current)return;const r=s=>{const i=new z(s);return new F(i.r,i.g,i.b)};e.current.uniforms.uBottomColor.value=r(x)},[x]),t.useEffect(()=>{e.current&&(e.current.uniforms.uIntensity.value=C)},[C]),t.useEffect(()=>{e.current&&(e.current.uniforms.uInteractive.value=a)},[a]),t.useEffect(()=>{e.current&&(e.current.uniforms.uGlowAmount.value=E)},[E]),t.useEffect(()=>{e.current&&(e.current.uniforms.uPillarWidth.value=M)},[M]),t.useEffect(()=>{e.current&&(e.current.uniforms.uPillarHeight.value=S)},[S]),t.useEffect(()=>{e.current&&(e.current.uniforms.uNoiseIntensity.value=y)},[y]),t.useEffect(()=>{e.current&&(e.current.uniforms.uLightMode.value=I?1:0)},[I]),t.useEffect(()=>{if(!e.current)return;const r=T*Math.PI/180;e.current.uniforms.uPillarRotCos.value=Math.cos(r),e.current.uniforms.uPillarRotSin.value=Math.sin(r)},[T]),W?K.jsx("div",{ref:l,className:`light-pillar-container ${q}`,style:{mixBlendMode:A}}):K.jsx("div",{className:`light-pillar-fallback ${q}`,style:{mixBlendMode:A},children:"WebGL not supported"})};export{Re as default};
