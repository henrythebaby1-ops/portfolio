import{r as U,j as ge}from"./index-tDOHgNLd.js";import{E as pe,R as ve,b as J,B as we,S as M,d as Pe}from"./index-DX2KU2Vi.js";import{V as u,h as f,w as N,W as xe,e as ye,S as Se,J as Le,T as Fe,K as Me,t as Z,C as w,p as E,G as K,m,b as _,Q as Ae,X as De,Y as Q,Z as S}from"./three.module-BgPORkTe.js";const R={onSpeedUp:()=>{},onSlowDown:()=>{},distortion:"turbulentDistortion",length:400,roadWidth:10,islandWidth:2,lanesPerRoad:4,fov:90,fovSpeedUp:150,speedUp:2,carLightsFade:.4,totalSideLightSticks:20,lightPairsPerRoadWay:40,shoulderLinesWidthPercentage:.05,brokenLinesWidthPercentage:.1,brokenLinesLengthPercentage:.5,lightStickWidth:[.12,.5],lightStickHeight:[1.3,1.7],movingAwaySpeed:[60,80],movingCloserSpeed:[-120,-160],carLightsLength:[400*.03,400*.2],carLightsRadius:[.05,.14],carWidthPercentage:[.3,.5],carShiftX:[-.8,.8],carFloorSeparation:[0,5],colors:{roadColor:526344,islandColor:657930,background:0,shoulderLines:16777215,brokenLines:16777215,leftCars:[14177983,6770850,12732332],rightCars:[242627,941733,3294549],sticks:242627}},ze=({effectOptions:T=R,lightMode:Y=!1})=>{const b=U.useRef(null),p=U.useRef(null);return U.useEffect(()=>{if(p.current){p.current.dispose(),p.current=null;const o=b.current;if(o)for(;o.firstChild;)o.removeChild(o.firstChild)}const I={uFreq:{value:new u(3,6,10)},uAmp:{value:new u(30,30,20)}},C={uFreq:{value:new f(5,2)},uAmp:{value:new f(25,15)}},k={uFreq:{value:new f(2,3)},uAmp:{value:new f(35,10)}},A={uFreq:{value:new N(4,8,8,1)},uAmp:{value:new N(25,5,10,10)}},L={uFreq:{value:new f(4,8)},uAmp:{value:new f(10,20)},uPowY:{value:new f(20,2)}};let P=o=>Math.sin(o)*.5+.5;const ee={mountainDistortion:{uniforms:I,getDistortion:`
          uniform vec3 uAmp;
          uniform vec3 uFreq;
          #define PI 3.14159265358979
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          vec3 getDistortion(float progress){
            float movementProgressFix = 0.02;
            return vec3( 
              cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
              nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
              nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
            );
          }
        `,getJS:(o,e)=>{let t=.02,i=I.uFreq.value,s=I.uAmp.value,r=new u(Math.cos(o*Math.PI*i.x+e)*s.x-Math.cos(t*Math.PI*i.x+e)*s.x,P(o*Math.PI*i.y+e)*s.y-P(t*Math.PI*i.y+e)*s.y,P(o*Math.PI*i.z+e)*s.z-P(t*Math.PI*i.z+e)*s.z),n=new u(2,2,2),h=new u(0,0,-5);return r.multiply(n).add(h)}},xyDistortion:{uniforms:C,getDistortion:`
          uniform vec2 uFreq;
          uniform vec2 uAmp;
          #define PI 3.14159265358979
          vec3 getDistortion(float progress){
            float movementProgressFix = 0.02;
            return vec3( 
              cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
              sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
              0.
            );
          }
        `,getJS:(o,e)=>{let t=.02,i=C.uFreq.value,s=C.uAmp.value,r=new u(Math.cos(o*Math.PI*i.x+e)*s.x-Math.cos(t*Math.PI*i.x+e)*s.x,Math.sin(o*Math.PI*i.y+e+Math.PI/2)*s.y-Math.sin(t*Math.PI*i.y+e+Math.PI/2)*s.y,0),n=new u(2,.4,1),h=new u(0,0,-3);return r.multiply(n).add(h)}},LongRaceDistortion:{uniforms:k,getDistortion:`
          uniform vec2 uFreq;
          uniform vec2 uAmp;
          #define PI 3.14159265358979
          vec3 getDistortion(float progress){
            float camProgress = 0.0125;
            return vec3( 
              sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(camProgress * PI * uFreq.x + uTime) * uAmp.x,
              sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(camProgress * PI * uFreq.y + uTime) * uAmp.y,
              0.
            );
          }
        `,getJS:(o,e)=>{let t=.0125,i=k.uFreq.value,s=k.uAmp.value,r=new u(Math.sin(o*Math.PI*i.x+e)*s.x-Math.sin(t*Math.PI*i.x+e)*s.x,Math.sin(o*Math.PI*i.y+e)*s.y-Math.sin(t*Math.PI*i.y+e)*s.y,0),n=new u(1,1,0),h=new u(0,0,-5);return r.multiply(n).add(h)}},turbulentDistortion:{uniforms:A,getDistortion:`
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              cos(PI * progress * uFreq.r + uTime) * uAmp.r +
              pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
            );
          }
          float getDistortionY(float progress){
            return (
              -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
              -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.0125),
              getDistortionY(progress) - getDistortionY(0.0125),
              0.
            );
          }
        `,getJS:(o,e)=>{const t=A.uFreq.value,i=A.uAmp.value,s=a=>Math.cos(Math.PI*a*t.x+e)*i.x+Math.pow(Math.cos(Math.PI*a*t.y+e*(t.y/t.x)),2)*i.y,r=a=>-P(Math.PI*a*t.z+e)*i.z-Math.pow(P(Math.PI*a*t.w+e/(t.z/t.w)),5)*i.w;let n=new u(s(o)-s(o+.007),r(o)-r(o+.007),0),h=new u(-2,-5,0),l=new u(0,0,-10);return n.multiply(h).add(l)}},turbulentDistortionStill:{uniforms:A,getDistortion:`
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              cos(PI * progress * uFreq.r) * uAmp.r +
              pow(cos(PI * progress * uFreq.g * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
            );
          }
          float getDistortionY(float progress){
            return (
              -nsin(PI * progress * uFreq.b) * uAmp.b +
              -pow(nsin(PI * progress * uFreq.a / (uFreq.b / uFreq.a)), 5.) * uAmp.a
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.02),
              0.
            );
          }
        `},deepDistortionStill:{uniforms:L,getDistortion:`
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          uniform vec2 uPowY;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              sin(progress * PI * uFreq.x) * uAmp.x * 2.
            );
          }
          float getDistortionY(float progress){
            return (
              pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y) * uAmp.y
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.05),
              0.
            );
          }
        `},deepDistortion:{uniforms:L,getDistortion:`
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          uniform vec2 uPowY;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              sin(progress * PI * uFreq.x + uTime) * uAmp.x
            );
          }
          float getDistortionY(float progress){
            return (
              pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y + uTime) * uAmp.y
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.02),
              0.
            );
          }
        `,getJS:(o,e)=>{const t=L.uFreq.value,i=L.uAmp.value,s=L.uPowY.value,r=d=>Math.sin(d*Math.PI*t.x+e)*i.x,n=d=>Math.pow(d*s.x,s.y)+Math.sin(d*Math.PI*t.y+e)*i.y;let h=new u(r(o)-r(o+.01),n(o)-n(o+.01),0),l=new u(-2,-4,0),a=new u(0,0,-10);return h.multiply(l).add(a)}}};class te{constructor(e,t={}){this.options=t,this.options.distortion==null&&(this.options.distortion={uniforms:se,getDistortion:ie}),this.container=e,this.hasValidSize=!1;const i=Math.max(1,e.offsetWidth),s=Math.max(1,e.offsetHeight);this.renderer=new xe({antialias:!1,alpha:!0}),this.renderer.setSize(i,s,!1),this.renderer.setPixelRatio(window.devicePixelRatio),this.composer=new pe(this.renderer),e.append(this.renderer.domElement),this.camera=new ye(t.fov,i/s,.1,1e4),this.camera.position.z=-5,this.camera.position.y=8,this.camera.position.x=0,this.scene=new Se,this.scene.background=null;let r=new Le(t.colors.background,t.length*.2,t.length*500);this.scene.fog=r,this.fogUniforms={fogColor:{value:r.color},fogNear:{value:r.near},fogFar:{value:r.far}},this.timer=new Fe,this.timer.connect(document),this.assets={},this.disposed=!1,this.road=new ue(this,t),this.leftCarLights=new V(this,t,t.colors.leftCars,t.movingAwaySpeed,new f(0,1-t.carLightsFade)),this.rightCarLights=new V(this,t,t.colors.rightCars,t.movingCloserSpeed,new f(1,0+t.carLightsFade)),this.leftSticks=new ne(this,t),this.fovTarget=t.fov,this.speedUpTarget=0,this.speedUp=0,this.timeOffset=0,this.tick=this.tick.bind(this),this.init=this.init.bind(this),this.setSize=this.setSize.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this.onWindowResize=this.onWindowResize.bind(this),window.addEventListener("resize",this.onWindowResize),e.offsetWidth>0&&e.offsetHeight>0&&(this.hasValidSize=!0)}onWindowResize(){const e=this.container.offsetWidth,t=this.container.offsetHeight;if(e<=0||t<=0){this.hasValidSize=!1;return}this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.composer.setSize(e,t),this.hasValidSize=!0}initPasses(){this.renderPass=new ve(this.scene,this.camera),this.bloomPass=new J(this.camera,new we({luminanceThreshold:.2,luminanceSmoothing:0,resolutionScale:1}));const e=new J(this.camera,new M({preset:Pe.MEDIUM,searchImage:M.searchImageDataURL,areaImage:M.areaImageDataURL}));this.renderPass.renderToScreen=!1,this.bloomPass.renderToScreen=!1,e.renderToScreen=!0,this.composer.addPass(this.renderPass),this.composer.addPass(this.bloomPass),this.composer.addPass(e)}loadAssets(){const e=this.assets;return new Promise(t=>{const i=new Me(t),s=new Image,r=new Image;e.smaa={},s.addEventListener("load",function(){e.smaa.search=this,i.itemEnd("smaa-search")}),r.addEventListener("load",function(){e.smaa.area=this,i.itemEnd("smaa-area")}),i.itemStart("smaa-search"),i.itemStart("smaa-area"),s.src=M.searchImageDataURL,r.src=M.areaImageDataURL})}init(){this.initPasses();const e=this.options;this.road.init(),this.leftCarLights.init(),this.leftCarLights.mesh.position.setX(-e.roadWidth/2-e.islandWidth/2),this.rightCarLights.init(),this.rightCarLights.mesh.position.setX(e.roadWidth/2+e.islandWidth/2),this.leftSticks.init(),this.leftSticks.mesh.position.setX(-(e.roadWidth+e.islandWidth/2)),this.container.addEventListener("mousedown",this.onMouseDown),this.container.addEventListener("mouseup",this.onMouseUp),this.container.addEventListener("mouseout",this.onMouseUp),this.container.addEventListener("touchstart",this.onTouchStart,{passive:!0}),this.container.addEventListener("touchend",this.onTouchEnd,{passive:!0}),this.container.addEventListener("touchcancel",this.onTouchEnd,{passive:!0}),this.container.addEventListener("contextmenu",this.onContextMenu),this.tick()}onMouseDown(e){this.options.onSpeedUp&&this.options.onSpeedUp(e),this.fovTarget=this.options.fovSpeedUp,this.speedUpTarget=this.options.speedUp}onMouseUp(e){this.options.onSlowDown&&this.options.onSlowDown(e),this.fovTarget=this.options.fov,this.speedUpTarget=0}onTouchStart(e){this.options.onSpeedUp&&this.options.onSpeedUp(e),this.fovTarget=this.options.fovSpeedUp,this.speedUpTarget=this.options.speedUp}onTouchEnd(e){this.options.onSlowDown&&this.options.onSlowDown(e),this.fovTarget=this.options.fov,this.speedUpTarget=0}onContextMenu(e){e.preventDefault()}update(e){let t=Math.exp(-(-60*Math.log2(.9))*e);this.speedUp+=X(this.speedUp,this.speedUpTarget,t,1e-5),this.timeOffset+=this.speedUp*e;const i=this.timer.getElapsed()+this.timeOffset;this.rightCarLights.update(i),this.leftCarLights.update(i),this.leftSticks.update(i),this.road.update(i);let s=!1,r=X(this.camera.fov,this.fovTarget,t);if(r!==0&&(this.camera.fov+=r*e*6,s=!0),this.options.distortion.getJS){const n=this.options.distortion.getJS(.025,i);this.camera.lookAt(new u(this.camera.position.x+n.x,this.camera.position.y+n.y,this.camera.position.z+n.z)),s=!0}s&&this.camera.updateProjectionMatrix()}render(e){this.composer.render(e)}dispose(){this.disposed=!0,this.timer.dispose(),this.scene&&(this.scene.traverse(e=>{const t=e;t.isMesh&&(t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(i=>i.dispose()):t.material.dispose()))}),this.scene.clear()),this.renderer&&(this.renderer.dispose(),this.renderer.forceContextLoss(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)),this.composer&&this.composer.dispose(),window.removeEventListener("resize",this.onWindowResize),this.container&&(this.container.removeEventListener("mousedown",this.onMouseDown),this.container.removeEventListener("mouseup",this.onMouseUp),this.container.removeEventListener("mouseout",this.onMouseUp),this.container.removeEventListener("touchstart",this.onTouchStart),this.container.removeEventListener("touchend",this.onTouchEnd),this.container.removeEventListener("touchcancel",this.onTouchEnd),this.container.removeEventListener("contextmenu",this.onContextMenu))}setSize(e,t,i){if(e<=0||t<=0){this.hasValidSize=!1;return}this.composer.setSize(e,t,i),this.hasValidSize=!0}tick(){if(!this.disposed){if(!this.hasValidSize){const e=this.container.offsetWidth,t=this.container.offsetHeight;if(e>0&&t>0)this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.composer.setSize(e,t),this.hasValidSize=!0,this.timer.reset();else{requestAnimationFrame(this.tick);return}}if(me(this.renderer,this.setSize)){const e=this.renderer.domElement;this.hasValidSize&&(this.camera.aspect=e.clientWidth/e.clientHeight,this.camera.updateProjectionMatrix())}if(this.hasValidSize){this.timer.update();const e=this.timer.getDelta();this.render(e),this.update(e)}requestAnimationFrame(this.tick)}}}const se={uDistortionX:{value:new f(80,3)},uDistortionY:{value:new f(-40,2.5)}},ie=`
      #define PI 3.14159265358979
      uniform vec2 uDistortionX;
      uniform vec2 uDistortionY;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      vec3 getDistortion(float progress){
        progress = clamp(progress, 0., 1.);
        float xAmp = uDistortionX.r;
        float xFreq = uDistortionX.g;
        float yAmp = uDistortionY.r;
        float yFreq = uDistortionY.g;
        return vec3( 
          xAmp * nsin(progress * PI * xFreq - PI / 2.),
          yAmp * nsin(progress * PI * yFreq - PI / 2.),
          0.
        );
      }
    `,g=o=>Array.isArray(o)?Math.random()*(o[1]-o[0])+o[0]:Math.random()*o,O=o=>Array.isArray(o)?o[Math.floor(Math.random()*o.length)]:o;function X(o,e,t=.1,i=.001){let s=(e-o)*t;return Math.abs(s)<i&&(s=e-o),s}class V{constructor(e,t,i,s,r){this.webgl=e,this.options=t,this.colors=i,this.speed=s,this.fade=r}init(){const e=this.options;let t=new Ae(new u(0,0,0),new u(0,0,-1)),i=new De(t,40,1,8,!1),s=new Q().copy(i);s.instanceCount=e.lightPairsPerRoadWay*2;let r=e.roadWidth/e.lanesPerRoad,n=[],h=[],l=[],a=this.colors;Array.isArray(a)?a=a.map(c=>new w(c)):a=new w(a);for(let c=0;c<e.lightPairsPerRoadWay;c++){let F=g(e.carLightsRadius),D=g(e.carLightsLength),x=g(this.speed),W=c%e.lanesPerRoad*r-e.roadWidth/2+r/2,$=g(e.carWidthPercentage)*r,fe=g(e.carShiftX)*r;W+=fe;let G=g(e.carFloorSeparation)+F*1.3,H=-g(e.length);n.push(W-$/2),n.push(G),n.push(H),n.push(W+$/2),n.push(G),n.push(H),h.push(F),h.push(D),h.push(x),h.push(F),h.push(D),h.push(x);let y=O(a);l.push(y.r),l.push(y.g),l.push(y.b),l.push(y.r),l.push(y.g),l.push(y.b)}s.setAttribute("aOffset",new S(new Float32Array(n),3,!1)),s.setAttribute("aMetrics",new S(new Float32Array(h),3,!1)),s.setAttribute("aColor",new S(new Float32Array(l),3,!1));let d=new E({fragmentShader:oe,vertexShader:re,transparent:!0,uniforms:Object.assign({uTime:{value:0},uTravelLength:{value:e.length},uFade:{value:this.fade}},this.webgl.fogUniforms,e.distortion.uniforms)});d.onBeforeCompile=c=>{c.vertexShader=c.vertexShader.replace("#include <getDistortion_vertex>",e.distortion.getDistortion)};let v=new _(s,d);v.frustumCulled=!1,this.webgl.scene.add(v),this.mesh=v}update(e){this.mesh.material.uniforms.uTime.value=e}}const oe=`
      #define USE_FOG;
      ${m.fog_pars_fragment}
      varying vec3 vColor;
      varying vec2 vUv; 
      uniform vec2 uFade;
      void main() {
        vec3 color = vec3(vColor);
        float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
        gl_FragColor = vec4(color, alpha);
        if (gl_FragColor.a < 0.0001) discard;
        ${m.fog_fragment}
      }
    `,re=`
      #define USE_FOG;
      ${m.fog_pars_vertex}
      attribute vec3 aOffset;
      attribute vec3 aMetrics;
      attribute vec3 aColor;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec2 vUv; 
      varying vec3 vColor; 
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        float radius = aMetrics.r;
        float myLength = aMetrics.g;
        float speed = aMetrics.b;

        transformed.xy *= radius;
        transformed.z *= myLength;

        transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
        transformed.xy += aOffset.xy;

        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);

        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        vColor = aColor;
        ${m.fog_vertex}
      }
    `;class ne{constructor(e,t){this.webgl=e,this.options=t}init(){const e=this.options,t=new Z(1,1);let i=new Q().copy(t),s=e.totalSideLightSticks;i.instanceCount=s;let r=e.length/(s-1);const n=[],h=[],l=[];let a=e.colors.sticks;Array.isArray(a)?a=a.map(c=>new w(c)):a=new w(a);for(let c=0;c<s;c++){let F=g(e.lightStickWidth),D=g(e.lightStickHeight);n.push((c-1)*r*2+r*Math.random());let x=O(a);h.push(x.r),h.push(x.g),h.push(x.b),l.push(F),l.push(D)}i.setAttribute("aOffset",new S(new Float32Array(n),1,!1)),i.setAttribute("aColor",new S(new Float32Array(h),3,!1)),i.setAttribute("aMetrics",new S(new Float32Array(l),2,!1));const d=new E({fragmentShader:he,vertexShader:ae,side:K,uniforms:Object.assign({uTravelLength:{value:e.length},uTime:{value:0}},this.webgl.fogUniforms,e.distortion.uniforms)});d.onBeforeCompile=c=>{c.vertexShader=c.vertexShader.replace("#include <getDistortion_vertex>",e.distortion.getDistortion)};const v=new _(i,d);v.frustumCulled=!1,this.webgl.scene.add(v),this.mesh=v}update(e){this.mesh.material.uniforms.uTime.value=e}}const ae=`
      #define USE_FOG;
      ${m.fog_pars_vertex}
      attribute float aOffset;
      attribute vec3 aColor;
      attribute vec2 aMetrics;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec3 vColor;
      mat4 rotationY( in float angle ) {
        return mat4(	cos(angle),		0,		sin(angle),	0,
                     0,		1.0,			 0,	0,
                -sin(angle),	0,		cos(angle),	0,
                0, 		0,				0,	1);
      }
      #include <getDistortion_vertex>
      void main(){
        vec3 transformed = position.xyz;
        float width = aMetrics.x;
        float height = aMetrics.y;

        transformed.xy *= vec2(width, height);
        float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);

        transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;

        transformed.z += - uTravelLength + time;

        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);

        transformed.y += height / 2.;
        transformed.x += -width / 2.;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vColor = aColor;
        ${m.fog_vertex}
      }
    `,he=`
      #define USE_FOG;
      ${m.fog_pars_fragment}
      varying vec3 vColor;
      void main(){
        vec3 color = vec3(vColor);
        gl_FragColor = vec4(color,1.);
        ${m.fog_fragment}
      }
    `;class ue{constructor(e,t){this.webgl=e,this.options=t,this.uTime={value:0}}createPlane(e,t,i){const s=this.options;let r=100;const n=new Z(i?s.roadWidth:s.islandWidth,s.length,20,r);let h={uTravelLength:{value:s.length},uColor:{value:new w(i?s.colors.roadColor:s.colors.islandColor)},uTime:this.uTime};i&&(h=Object.assign(h,{uLanes:{value:s.lanesPerRoad},uBrokenLinesColor:{value:new w(s.colors.brokenLines)},uShoulderLinesColor:{value:new w(s.colors.shoulderLines)},uShoulderLinesWidthPercentage:{value:s.shoulderLinesWidthPercentage},uBrokenLinesLengthPercentage:{value:s.brokenLinesLengthPercentage},uBrokenLinesWidthPercentage:{value:s.brokenLinesWidthPercentage}}));const l=new E({fragmentShader:i?ce:le,vertexShader:de,side:K,uniforms:Object.assign(h,this.webgl.fogUniforms,s.distortion.uniforms)});l.onBeforeCompile=d=>{d.vertexShader=d.vertexShader.replace("#include <getDistortion_vertex>",s.distortion.getDistortion)};const a=new _(n,l);return a.rotation.x=-Math.PI/2,a.position.z=-s.length/2,a.position.x+=(this.options.islandWidth/2+s.roadWidth/2)*e,this.webgl.scene.add(a),a}init(){this.leftRoadWay=this.createPlane(-1,this.options.roadWidth,!0),this.rightRoadWay=this.createPlane(1,this.options.roadWidth,!0),this.island=this.createPlane(0,this.options.islandWidth,!1)}update(e){this.uTime.value=e}}const B=`
      #define USE_FOG;
      varying vec2 vUv; 
      uniform vec3 uColor;
      uniform float uTime;
      #include <roadMarkings_vars>
      ${m.fog_pars_fragment}
      void main() {
        vec2 uv = vUv;
        vec3 color = vec3(uColor);
        #include <roadMarkings_fragment>
        gl_FragColor = vec4(color, 1.);
        ${m.fog_fragment}
      }
    `,le=B.replace("#include <roadMarkings_fragment>","").replace("#include <roadMarkings_vars>",""),ce=B.replace("#include <roadMarkings_fragment>",`
      uv.y = mod(uv.y + uTime * 0.05, 1.);
      float laneWidth = 1.0 / uLanes;
      float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
      float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

      float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
      float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);

      brokenLines = mix(brokenLines, sideLines, uv.x);
    `).replace("#include <roadMarkings_vars>",`
      uniform float uLanes;
      uniform vec3 uBrokenLinesColor;
      uniform vec3 uShoulderLinesColor;
      uniform float uShoulderLinesWidthPercentage;
      uniform float uBrokenLinesWidthPercentage;
      uniform float uBrokenLinesLengthPercentage;
      highp float random(vec2 co) {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt = dot(co.xy, vec2(a, b));
        highp float sn = mod(dt, 3.14);
        return fract(sin(sn) * c);
      }
    `),de=`
      #define USE_FOG;
      uniform float uTime;
      ${m.fog_pars_vertex}
      uniform float uTravelLength;
      varying vec2 vUv; 
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
        transformed.x += distortion.x;
        transformed.z += distortion.y;
        transformed.y += -1. * distortion.z;  
        
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        ${m.fog_vertex}
      }
    `;function me(o,e){const t=o.domElement,i=t.clientWidth,s=t.clientHeight;if(i<=0||s<=0)return!1;const r=t.width!==i||t.height!==s;return r&&e(i,s,!1),r}const j=b.current;if(!j)return;const q={...R,...T,colors:{...R.colors,...T.colors,...Y?{roadColor:16777215,islandColor:16316410,background:16777215,shoulderLines:8141549,brokenLines:12616956}:{}}};q.distortion=ee[q.distortion];const z=new te(j,q);return p.current=z,z.loadAssets().then(z.init),()=>{p.current&&(p.current.dispose(),p.current=null)}},[T,Y]),ge.jsx("div",{id:"lights",ref:b})};export{ze as default};
