import{r as se,R as Ue,T as qe,P as We,M as Ne,j as Ye}from"./index-tDOHgNLd.js";const Xe=({height:z=3.5,baseWidth:U=5.5,animationType:d="rotate",glow:q=1,offset:i={x:0,y:0},noise:W=.5,transparent:H=!0,scale:N=3.6,hueShift:Y=0,colorFrequency:j=1,hoverStrength:G=2,inertia:X=.05,bloom:k=1,suspendWhenOffscreen:P=!1,timeScale:V=.5,lightMode:Z=!1})=>{const D=se.useRef(null);return se.useEffect(()=>{const c=D.current;if(!c)return;const b=Math.max(.001,z),I=Math.max(.001,U)*.5,ce=Math.max(0,q),Q=Math.max(0,W),re=(i==null?void 0:i.x)??0,le=(i==null?void 0:i.y)??0,ue=H?1.5:1,y=Math.max(.001,N),me=Y||0,fe=Math.max(0,j||1),ve=Math.max(0,k||1),he=1,de=1,xe=1,R=Math.max(0,V||1),J=Math.max(0,G||1),K=Math.max(0,Math.min(1,X||.12)),A=Math.min(2,window.devicePixelRatio||1),F=new Ue({dpr:A,alpha:H,antialias:!1}),o=F.gl;o.disable(o.DEPTH_TEST),o.disable(o.CULL_FACE),o.disable(o.BLEND),Object.assign(o.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),c.appendChild(o.canvas);const pe=`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,we=`
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;
      uniform float uLightMode;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y;
        return max(oct, halfSpace);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;

        vec3 p;
        vec4 o = vec4(0.0);

        float centerShift = uCenterShift;
        float cf = uColorFreq;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        if (uLightMode > 0.5) {
          float peak = max(col.r, max(col.g, col.b));
          vec3 chroma = pow(clamp(col / max(peak, 0.0001), 0.0, 1.0), vec3(1.14));
          gl_FragColor = vec4(mix(vec3(1.0), chroma, o.a * 0.94), 1.0);
        } else {
          gl_FragColor = vec4(col, o.a);
        }
      }
    `,Me=new qe(o),L=new Float32Array(2),C=new Float32Array(2),r=new We(o,{vertex:pe,fragment:we,uniforms:{iResolution:{value:L},iTime:{value:0},uHeight:{value:b},uBaseHalf:{value:I},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:ce},uOffsetPx:{value:C},uNoise:{value:Q},uSaturation:{value:ue},uScale:{value:y},uHueShift:{value:me},uColorFreq:{value:fe},uBloom:{value:ve},uCenterShift:{value:b*.25},uInvBaseHalf:{value:1/I},uInvHeight:{value:1/b},uMinAxis:{value:Math.min(I,b)},uPxScale:{value:1/((o.drawingBufferHeight||1)*.1*y)},uTimeScale:{value:R},uLightMode:{value:Z?1:0}}}),Se=new Ne(o,{geometry:Me,program:r}),$=()=>{const e=c.clientWidth||1,a=c.clientHeight||1;F.setSize(e,a),L[0]=o.drawingBufferWidth,L[1]=o.drawingBufferHeight,C[0]=re*A,C[1]=le*A,r.uniforms.uPxScale.value=1/((o.drawingBufferHeight||1)*.1*y)},ee=new ResizeObserver($);ee.observe(c),$();const s=new Float32Array(9),te=(e,a,n,t)=>{const u=Math.cos(e),m=Math.sin(e),f=Math.cos(a),h=Math.sin(a),M=Math.cos(n),g=Math.sin(n),ye=u*M+m*h*g,Ae=-u*g+m*h*M,Fe=m*f,Le=f*g,Ce=f*M,Oe=-h,_e=-m*M+u*h*g,Te=m*g+u*h*M,ze=u*f;return t[0]=ye,t[1]=Le,t[2]=_e,t[3]=Ae,t[4]=Ce,t[5]=Te,t[6]=Fe,t[7]=Oe,t[8]=ze,t},ge=Q<1e-6;let v=0;const be=performance.now(),B=()=>{v||(v=requestAnimationFrame(ie))},oe=()=>{v&&(cancelAnimationFrame(v),v=0)},S=()=>Math.random(),Re=(.3+S()*.6)*he,Be=(.2+S()*.7)*de,Ee=(.1+S()*.5)*xe,He=S()*Math.PI*2,Pe=S()*Math.PI*2;let x=0,p=0,w=0,O=0,_=0;const T=(e,a,n)=>e+(a-e)*n,l={x:0,y:0,inside:!0},Ie=e=>{const a=Math.max(1,window.innerWidth),n=Math.max(1,window.innerHeight),t=a*.5,u=n*.5,m=(e.clientX-t)/(a*.5),f=(e.clientY-u)/(n*.5);l.x=Math.max(-1,Math.min(1,m)),l.y=Math.max(-1,Math.min(1,f)),l.inside=!0},ae=()=>{l.inside=!1},ne=()=>{l.inside=!1};let E=null;d==="hover"?(E=e=>{Ie(e),B()},window.addEventListener("pointermove",E,{passive:!0}),window.addEventListener("mouseleave",ae),window.addEventListener("blur",ne),r.uniforms.uUseBaseWobble.value=0):d==="3drotate"?r.uniforms.uUseBaseWobble.value=0:r.uniforms.uUseBaseWobble.value=1;const ie=e=>{const a=(e-be)*.001;r.uniforms.iTime.value=a;let n=!0;if(d==="hover"){const t=.6*J,u=.6*J;O=(l.inside?-l.x:0)*u,_=(l.inside?l.y:0)*t;const m=x,f=p,h=w;x=T(m,O,K),p=T(f,_,K),w=T(h,0,.1),r.uniforms.uRot.value=te(x,p,w,s),ge&&Math.abs(x-O)<1e-4&&Math.abs(p-_)<1e-4&&Math.abs(w)<1e-4&&(n=!1)}else if(d==="3drotate"){const t=a*R;x=t*Be,p=Math.sin(t*Re+He)*.6,w=Math.sin(t*Ee+Pe)*.5,r.uniforms.uRot.value=te(x,p,w,s),R<1e-6&&(n=!1)}else s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=1,s[5]=0,s[6]=0,s[7]=0,s[8]=1,r.uniforms.uRot.value=s,R<1e-6&&(n=!1);F.render({scene:Se}),n?v=requestAnimationFrame(ie):v=0};if(P){const e=new IntersectionObserver(a=>{a.some(t=>t.isIntersecting)?B():oe()});e.observe(c),B(),c.__prismIO=e}else B();return()=>{if(oe(),ee.disconnect(),d==="hover"&&(E&&window.removeEventListener("pointermove",E),window.removeEventListener("mouseleave",ae),window.removeEventListener("blur",ne)),P){const e=c.__prismIO;e&&e.disconnect(),delete c.__prismIO}o.canvas.parentElement===c&&c.removeChild(o.canvas)}},[z,U,d,q,W,i==null?void 0:i.x,i==null?void 0:i.y,N,H,Y,j,V,G,X,k,P,Z]),Ye.jsx("div",{className:"prism-container",ref:D})};export{Xe as default};
