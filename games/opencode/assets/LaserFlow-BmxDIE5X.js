import{r,j as Me}from"./index-tDOHgNLd.js";import{W as Se,f as Oe,S as ye,s as be,q as De,r as Pe,V as _e,w as We,ak as Ie,al as Ce,b as He,h as ve,C as Fe,u as Xe}from"./three.module-BgPORkTe.js";const Be=`
precision highp float;
attribute vec3 position;
void main(){
  gl_Position = vec4(position, 1.0);
}
`,Ne=`
#ifdef GL_ES
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
precision mediump int;

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform float uWispDensity;
uniform float uTiltScale;
uniform float uFlowTime;
uniform float uFogTime;
uniform float uBeamXFrac;
uniform float uBeamYFrac;
uniform float uFlowSpeed;
uniform float uVLenFactor;
uniform float uHLenFactor;
uniform float uFogIntensity;
uniform float uFogScale;
uniform float uWSpeed;
uniform float uWIntensity;
uniform float uFlowStrength;
uniform float uDecay;
uniform float uFalloffStart;
uniform float uFogFallSpeed;
uniform vec3 uColor;
uniform float uFade;

// Core beam/flare shaping and dynamics
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define EPS 1e-6
#define EDGE_SOFT (DT_LOCAL*4.0)
#define DT_LOCAL 0.0038
#define TAP_RADIUS 6
#define R_H 150.0
#define R_V 150.0
#define FLARE_HEIGHT 16.0
#define FLARE_AMOUNT 8.0
#define FLARE_EXP 2.0
#define TOP_FADE_START 0.1
#define TOP_FADE_EXP 1.0
#define FLOW_PERIOD 0.5
#define FLOW_SHARPNESS 1.5

// Wisps (animated micro-streaks) that travel along the beam
#define W_BASE_X 1.5
#define W_LAYER_GAP 0.25
#define W_LANES 10
#define W_SIDE_DECAY 0.5
#define W_HALF 0.01
#define W_AA 0.15
#define W_CELL 20.0
#define W_SEG_MIN 0.01
#define W_SEG_MAX 0.55
#define W_CURVE_AMOUNT 15.0
#define W_CURVE_RANGE (FLARE_HEIGHT - 3.0)
#define W_BOTTOM_EXP 10.0

// Volumetric fog controls
#define FOG_ON 1
#define FOG_CONTRAST 1.2
#define FOG_SPEED_U 0.1
#define FOG_SPEED_V -0.1
#define FOG_OCTAVES 5
#define FOG_BOTTOM_BIAS 0.8
#define FOG_TILT_TO_MOUSE 0.05
#define FOG_TILT_DEADZONE 0.01
#define FOG_TILT_MAX_X 0.35
#define FOG_TILT_SHAPE 1.5
#define FOG_BEAM_MIN 0.0
#define FOG_BEAM_MAX 0.75
#define FOG_MASK_GAMMA 0.5
#define FOG_EXPAND_SHAPE 12.2
#define FOG_EDGE_MIX 0.5

// Horizontal vignette for the fog volume
#define HFOG_EDGE_START 0.20
#define HFOG_EDGE_END 0.98
#define HFOG_EDGE_GAMMA 1.4
#define HFOG_Y_RADIUS 25.0
#define HFOG_Y_SOFT 60.0

// Beam extents and edge masking
#define EDGE_X0 0.22
#define EDGE_X1 0.995
#define EDGE_X_GAMMA 1.25
#define EDGE_LUMA_T0 0.0
#define EDGE_LUMA_T1 2.0
#define DITHER_STRENGTH 1.0

    float g(float x){return x<=0.00031308?12.92*x:1.055*pow(x,1.0/2.4)-0.055;}
    float bs(vec2 p,vec2 q,float powr){
        float d=distance(p,q),f=powr*uFalloffStart,r=(f*f)/(d*d+EPS);
        return powr*min(1.0,r);
    }
    float bsa(vec2 p,vec2 q,float powr,vec2 s){
        vec2 d=p-q; float dd=(d.x*d.x)/(s.x*s.x)+(d.y*d.y)/(s.y*s.y),f=powr*uFalloffStart,r=(f*f)/(dd+EPS);
        return powr*min(1.0,r);
    }
    float tri01(float x){float f=fract(x);return 1.0-abs(f*2.0-1.0);}
    float tauWf(float t,float tmin,float tmax){float a=smoothstep(tmin,tmin+EDGE_SOFT,t),b=1.0-smoothstep(tmax-EDGE_SOFT,tmax,t);return max(0.0,a*b);} 
    float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+34.123);return fract(p.x*p.y);}
    float vnoise(vec2 p){
        vec2 i=floor(p),f=fract(p);
        float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));
        vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
    }
    float fbm2(vec2 p){
        float v=0.0,amp=0.6; mat2 m=mat2(0.86,0.5,-0.5,0.86);
        for(int i=0;i<FOG_OCTAVES;++i){v+=amp*vnoise(p); p=m*p*2.03+17.1; amp*=0.52;}
        return v;
    }
    float rGate(float x,float l){float a=smoothstep(0.0,W_AA,x),b=1.0-smoothstep(l,l+W_AA,x);return max(0.0,a*b);}
    float flareY(float y){float t=clamp(1.0-(clamp(y,0.0,FLARE_HEIGHT)/max(FLARE_HEIGHT,EPS)),0.0,1.0);return pow(t,FLARE_EXP);}

    float vWisps(vec2 uv,float topF){
    float y=uv.y,yf=(y+uFlowTime*uWSpeed)/W_CELL;
    float dRaw=clamp(uWispDensity,0.0,2.0),d=dRaw<=0.0?1.0:dRaw;
    float lanesF=floor(float(W_LANES)*min(d,1.0)+0.5); // WebGL1-safe
    int lanes=int(max(1.0,lanesF));
    float sp=min(d,1.0),ep=max(d-1.0,0.0);
    float fm=flareY(max(y,0.0)),rm=clamp(1.0-(y/max(W_CURVE_RANGE,EPS)),0.0,1.0),cm=fm*rm;
    const float G=0.05; float xS=1.0+(FLARE_AMOUNT*W_CURVE_AMOUNT*G)*cm;
    float sPix=clamp(y/R_V,0.0,1.0),bGain=pow(1.0-sPix,W_BOTTOM_EXP),sum=0.0;
    for(int s=0;s<2;++s){
        float sgn=s==0?-1.0:1.0;
        for(int i=0;i<W_LANES;++i){
            if(i>=lanes) break;
            float off=W_BASE_X+float(i)*W_LAYER_GAP,xc=sgn*(off*xS);
            float dx=abs(uv.x-xc),lat=1.0-smoothstep(W_HALF,W_HALF+W_AA,dx),amp=exp(-off*W_SIDE_DECAY);
            float seed=h21(vec2(off,sgn*17.0)),yf2=yf+seed*7.0,ci=floor(yf2),fy=fract(yf2);
            float seg=mix(W_SEG_MIN,W_SEG_MAX,h21(vec2(ci,off*2.3)));
            float spR=h21(vec2(ci,off+sgn*31.0)),seg1=rGate(fy,seg)*step(spR,sp);
            if(ep>0.0){float spR2=h21(vec2(ci*3.1+7.0,off*5.3+sgn*13.0)); float f2=fract(fy+0.5); seg1+=rGate(f2,seg*0.9)*step(spR2,ep);}
            sum+=amp*lat*seg1;
        }
    }
    float span=smoothstep(-3.0,0.0,y)*(1.0-smoothstep(R_V-6.0,R_V,y));
    return uWIntensity*sum*topF*bGain*span;
}

void mainImage(out vec4 fc,in vec2 frag){
    vec2 C=iResolution.xy*.5; float invW=1.0/max(C.x,1.0);
    vec2 sc=(512.0/iResolution.xy)*.4;
    vec2 uv=(frag-C)*sc,off=vec2(uBeamXFrac*iResolution.x*sc.x,uBeamYFrac*iResolution.y*sc.y);
    vec2 uvc = uv - off;
    float a=0.0,b=0.0;
    float basePhase=1.5*PI+uDecay*.5; float tauMin=basePhase-uDecay; float tauMax=basePhase;
    float cx=clamp(uvc.x/(R_H*uHLenFactor),-1.0,1.0),tH=clamp(TWO_PI-acos(cx),tauMin,tauMax);
    for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
        float tu=tH+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax); if(wt<=0.0) continue;
        float spd=max(abs(sin(tu)),0.02),u=clamp((basePhase-tu)/max(uDecay,EPS),0.0,1.0),env=pow(1.0-abs(u*2.0-1.0),0.8);
        vec2 p=vec2((R_H*uHLenFactor)*cos(tu),0.0);
        a+=wt*bs(uvc,p,env*spd);
    }
    float yPix=uvc.y,cy=clamp(-yPix/(R_V*uVLenFactor),-1.0,1.0),tV=clamp(TWO_PI-acos(cy),tauMin,tauMax);
    for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
        float tu=tV+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax); if(wt<=0.0) continue;
        float yb=(-R_V)*cos(tu),s=clamp(yb/R_V,0.0,1.0),spd=max(abs(sin(tu)),0.02);
        float env=pow(1.0-s,0.6)*spd;
        float cap=1.0-smoothstep(TOP_FADE_START,1.0,s); cap=pow(cap,TOP_FADE_EXP); env*=cap;
        float ph=s/max(FLOW_PERIOD,EPS)+uFlowTime*uFlowSpeed;
        float fl=pow(tri01(ph),FLOW_SHARPNESS);
        env*=mix(1.0-uFlowStrength,1.0,fl);
        float yp=(-R_V*uVLenFactor)*cos(tu),m=pow(smoothstep(FLARE_HEIGHT,0.0,yp),FLARE_EXP),wx=1.0+FLARE_AMOUNT*m;
        vec2 sig=vec2(wx,1.0),p=vec2(0.0,yp);
        float mask=step(0.0,yp);
        b+=wt*bsa(uvc,p,mask*env,sig);
    }
    float sPix=clamp(yPix/R_V,0.0,1.0),topA=pow(1.0-smoothstep(TOP_FADE_START,1.0,sPix),TOP_FADE_EXP);
    float L=a+b*topA;
    float w=vWisps(vec2(uvc.x,yPix),topA);
    float fog=0.0;
#if FOG_ON
    vec2 fuv=uvc*uFogScale;
    float mAct=step(1.0,length(iMouse.xy)),nx=((iMouse.x-C.x)*invW)*mAct;
    float ax = abs(nx);
    float stMag = mix(ax, pow(ax, FOG_TILT_SHAPE), 0.35);
    float st = sign(nx) * stMag * uTiltScale;
    st = clamp(st, -FOG_TILT_MAX_X, FOG_TILT_MAX_X);
    vec2 dir=normalize(vec2(st,1.0));
    fuv+=uFogTime*uFogFallSpeed*dir;
    vec2 prp=vec2(-dir.y,dir.x);
    fuv+=prp*(0.08*sin(dot(uvc,prp)*0.08+uFogTime*0.9));
    float n=fbm2(fuv+vec2(fbm2(fuv+vec2(7.3,2.1)),fbm2(fuv+vec2(-3.7,5.9)))*0.6);
    n=pow(clamp(n,0.0,1.0),FOG_CONTRAST);
    float pixW = 1.0 / max(iResolution.y, 1.0);
#ifdef GL_OES_standard_derivatives
    float wL = max(fwidth(L), pixW);
#else
    float wL = pixW;
#endif
    float m0=pow(smoothstep(FOG_BEAM_MIN - wL, FOG_BEAM_MAX + wL, L),FOG_MASK_GAMMA);
    float bm=1.0-pow(1.0-m0,FOG_EXPAND_SHAPE); bm=mix(bm*m0,bm,FOG_EDGE_MIX);
    float yP=1.0-smoothstep(HFOG_Y_RADIUS,HFOG_Y_RADIUS+HFOG_Y_SOFT,abs(yPix));
    float nxF=abs((frag.x-C.x)*invW),hE=1.0-smoothstep(HFOG_EDGE_START,HFOG_EDGE_END,nxF); hE=pow(clamp(hE,0.0,1.0),HFOG_EDGE_GAMMA);
    float hW=mix(1.0,hE,clamp(yP,0.0,1.0));
    float bBias=mix(1.0,1.0-sPix,FOG_BOTTOM_BIAS);
    float browserFogIntensity = uFogIntensity;
    browserFogIntensity *= 1.8;
    float radialFade = 1.0 - smoothstep(0.0, 0.7, length(uvc) / 120.0);
    float safariFog = n * browserFogIntensity * bBias * bm * hW * radialFade;
    fog = safariFog;
#endif
    float LF=L+fog;
    float dith=(h21(frag)-0.5)*(DITHER_STRENGTH/255.0);
    float tone=g(LF+w);
    vec3 col=tone*uColor+dith;
    float alpha=clamp(g(L+w*0.6)+dith*0.6,0.0,1.0);
    float nxE=abs((frag.x-C.x)*invW),xF=pow(clamp(1.0-smoothstep(EDGE_X0,EDGE_X1,nxE),0.0,1.0),EDGE_X_GAMMA);
    float scene=LF+max(0.0,w)*0.5,hi=smoothstep(EDGE_LUMA_T0,EDGE_LUMA_T1,scene);
    float eM=mix(xF,1.0,hi);
    col*=eM; alpha*=eM;
    col*=uFade; alpha*=uFade;
    fc=vec4(col,alpha);
}

void main(){
  vec4 fc;
  mainImage(fc, gl_FragCoord.xy);
  gl_FragColor = fc;
}
`,Ue=({className:Ee,style:he,wispDensity:g=1,dpr:K,mouseSmoothTime:xe=0,mouseTiltStrength:w=.01,horizontalBeamOffset:G=.1,verticalBeamOffset:L=0,flowSpeed:M=.35,verticalSizing:S=2,horizontalSizing:O=.5,fogIntensity:y=.45,fogScale:b=.3,wispSpeed:D=15,wispIntensity:P=5,flowStrength:W=.25,decay:I=1.1,falloffStart:C=1.2,fogFallSpeed:H=.6,color:z="#FF79C6",backgroundColor:A="#000000"})=>{const X=r.useRef(null),Z=r.useRef(null),$=r.useRef(null),R=r.useRef(!1),J=r.useRef(null),B=r.useRef(1),u=r.useRef(1),Q=r.useRef({width:0,height:0,dpr:0}),N=r.useRef([]),V=r.useRef(performance.now()),k=r.useRef(16.7),_=r.useRef(!1),ee=r.useRef(!0),Ae=e=>{let a=e.trim();a[0]==="#"&&(a=a.slice(1)),a.length===3&&(a=a.split("").map(v=>v+v).join(""));const n=parseInt(a.slice(0,6),16)||16777215;return{r:(n>>16&255)/255,g:(n>>8&255)/255,b:(n&255)/255}};return r.useEffect(()=>{const e=X.current,a=new Se({antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:"high-performance",premultipliedAlpha:!1,preserveDrawingBuffer:!1,failIfMajorPerformanceCaveat:!1,logarithmicDepthBuffer:!1});Z.current=a,B.current=Math.min(K??(window.devicePixelRatio||1),2),u.current=B.current,a.setPixelRatio(u.current),a.shadowMap.enabled=!1,a.outputColorSpace=Oe,a.setClearColor(0,1);const n=a.domElement;n.style.width="100%",n.style.height="100%",n.style.display="block",(t=>{const s=new Fe(t||"#000000"),i=s.r*.2126+s.g*.7152+s.b*.0722>.72;e.style.backgroundColor=t||"#000000",n.style.filter=i?"invert(1) hue-rotate(180deg)":"none",n.style.mixBlendMode=i?"normal":"screen"})(A),e.appendChild(n);const m=new ye,F=new be(-1,1,1,-1,0,1),d=new De;d.setAttribute("position",new Pe(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const c={iTime:{value:0},iResolution:{value:new _e(1,1,1)},iMouse:{value:new We(0,0,0,0)},uWispDensity:{value:g},uTiltScale:{value:w},uFlowTime:{value:0},uFogTime:{value:0},uBeamXFrac:{value:G},uBeamYFrac:{value:L},uFlowSpeed:{value:M},uVLenFactor:{value:S},uHLenFactor:{value:O},uFogIntensity:{value:y},uFogScale:{value:b},uWSpeed:{value:D},uWIntensity:{value:P},uFlowStrength:{value:W},uDecay:{value:I},uFalloffStart:{value:C},uFogFallSpeed:{value:H},uColor:{value:new _e(1,1,1)},uFade:{value:R.current?1:0}};$.current=c;const E=new Ie({vertexShader:Be,fragmentShader:Ne,uniforms:c,transparent:!1,depthTest:!1,depthWrite:!1,blending:Ce}),h=new He(d,E);h.frustumCulled=!1,m.add(h);const Re=new Xe;let te=0,T=R.current?1:0;const U=new ve(0,0),Y=new ve(0,0),q=()=>{const t=e.clientWidth||1,s=e.clientHeight||1,o=u.current,i=Q.current,l=Math.abs(t-i.width)>.5||Math.abs(s-i.height)>.5,f=Math.abs(o-i.dpr)>.01;!l&&!f||(Q.current={width:t,height:s,dpr:o},a.setPixelRatio(o),a.setSize(t,s,!1),c.iResolution.value.set(t*o,s*o,o),J.current=n.getBoundingClientRect(),_.current||a.render(m,F))};let j=0;const ae=()=>{j&&cancelAnimationFrame(j),j=requestAnimationFrame(q)};q();const oe=new ResizeObserver(ae);oe.observe(e);const ne=new IntersectionObserver(t=>{var s;ee.current=((s=t[0])==null?void 0:s.isIntersecting)??!0},{root:null,threshold:0});ne.observe(e);const se=()=>{_.current=document.hidden};document.addEventListener("visibilitychange",se,{passive:!0});const Te=(t,s)=>{const o=J.current;if(!o)return;const i=t-o.left,l=s-o.top,f=u.current,x=o.height*f;U.set(i*f,x-l*f)},p=t=>Te(t.clientX,t.clientY),re=()=>U.set(0,0);window.addEventListener("pointermove",p,{passive:!0}),window.addEventListener("pointerdown",p,{passive:!0}),window.addEventListener("pointerover",p,{passive:!0}),document.documentElement.addEventListener("pointerleave",re,{passive:!0});const ie=t=>{t.preventDefault(),_.current=!0},le=()=>{_.current=!1,ae()};n.addEventListener("webglcontextlost",ie,!1),n.addEventListener("webglcontextrestored",le,!1);let fe=0;const ue=(t,s,o)=>Math.max(s,Math.min(o,t)),ce=.6,ge=50,we=58;let me=0;const Ge=2e3,Le=t=>{if(t-V.current<750)return;const o=N.current;if(o.length===0){V.current=t;return}const i=o.reduce((x,pe)=>x+pe,0)/o.length;let l=u.current;const f=B.current;i<ge?l=ue(u.current*.85,ce,f):i>we&&u.current<f&&(l=ue(u.current*1.1,ce,f)),Math.abs(l-u.current)>.01&&t-me>Ge&&(u.current=l,me=t,q()),N.current=[],V.current=t},de=()=>{if(fe=requestAnimationFrame(de),_.current||!ee.current)return;const t=Re.getElapsedTime(),s=Math.max(0,t-te);te=t;const o=s*1e3;k.current=k.current*.9+o*.1;const i=1e3/Math.max(1,k.current);N.current.push(i),c.iTime.value=t;const l=Math.min(.033,Math.max(.001,s));c.uFlowTime.value+=l,c.uFogTime.value+=l,R.current||(T=Math.min(1,T+l/1),c.uFade.value=T,T>=1&&(R.current=!0));const f=Math.max(.001,xe),x=1-Math.exp(-l/f);Y.lerp(U,x),c.iMouse.value.set(Y.x,Y.y,0,0),a.render(m,F),Le(performance.now())};return de(),()=>{cancelAnimationFrame(fe),oe.disconnect(),ne.disconnect(),document.removeEventListener("visibilitychange",se),window.removeEventListener("pointermove",p),window.removeEventListener("pointerdown",p),window.removeEventListener("pointerover",p),document.documentElement.removeEventListener("pointerleave",re),n.removeEventListener("webglcontextlost",ie),n.removeEventListener("webglcontextrestored",le),d.dispose(),E.dispose(),a.dispose(),a.forceContextLoss(),e.contains(n)&&e.removeChild(n)}},[K]),r.useEffect(()=>{var F;const e=$.current;if(!e)return;e.uWispDensity.value=g,e.uTiltScale.value=w,e.uBeamXFrac.value=G,e.uBeamYFrac.value=L,e.uFlowSpeed.value=M,e.uVLenFactor.value=S,e.uHLenFactor.value=O,e.uFogIntensity.value=y,e.uFogScale.value=b,e.uWSpeed.value=D,e.uWIntensity.value=P,e.uFlowStrength.value=W,e.uDecay.value=I,e.uFalloffStart.value=C,e.uFogFallSpeed.value=H;const{r:a,g:n,b:v}=Ae(z||"#FFFFFF");e.uColor.value.set(a,n,v);const m=(F=Z.current)==null?void 0:F.domElement;if(m){const d=new Fe(A||"#000000"),E=d.r*.2126+d.g*.7152+d.b*.0722>.72,h=X.current;h&&(h.style.backgroundColor=A||"#000000"),m.style.filter=E?"invert(1) hue-rotate(180deg)":"none",m.style.mixBlendMode=E?"normal":"screen"}},[g,w,G,L,M,S,O,y,b,D,P,W,I,C,H,z,A]),Me.jsx("div",{ref:X,className:`laser-flow-container ${Ee||""}`,style:he})};export{Ue as LaserFlow,Ue as default};
