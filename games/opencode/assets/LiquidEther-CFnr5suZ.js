import{r as v,j as Fe}from"./index-tDOHgNLd.js";import{C as q,w as se,z as Ce,E as Ae,L as U,y as V,h as a,W as Ee,u as ke,S as re,am as oe,b as $,t as J,ak as H,H as Re,F as Le,n as Ie,q as Be,r as Ue,an as Ve,ao as He}from"./three.module-BgPORkTe.js";function Ye({mouseForce:_=20,cursorSize:b=100,isViscous:S=!1,viscous:D=30,iterationsViscous:T=32,iterationsPoisson:z=32,dt:M=.014,BFECC:F=!0,resolution:p=.5,isBounce:C=!1,colors:K=["#5227FF","#FF9FFC","#B497CF"],style:ne={},className:ae="",autoDemo:A=!0,autoSpeed:E=.5,autoIntensity:k=2.2,takeoverDuration:R=.25,autoResumeDelay:L=1e3,autoRampDuration:I=.6,backgroundColor:Q="#FFFFFF",lightMode:O=!1}){const G=v.useRef(null),c=v.useRef(null),X=v.useRef(null),f=v.useRef(null),Y=v.useRef(null),Z=v.useRef(!0),N=v.useRef(null);return v.useEffect(()=>{if(!G.current)return;function u(s){let e;Array.isArray(s)&&s.length>0?s.length===1?e=[s[0],s[0]]:e=s:e=["#ffffff","#ffffff"];const t=e.length,i=new Uint8Array(t*4);for(let o=0;o<t;o++){const l=new q(e[o]);i[o*4+0]=Math.round(l.r*255),i[o*4+1]=Math.round(l.g*255),i[o*4+2]=Math.round(l.b*255),i[o*4+3]=255}const r=new Ce(i,t,1,Ae);return r.magFilter=U,r.minFilter=U,r.wrapS=V,r.wrapT=V,r.generateMipmaps=!1,r.needsUpdate=!0,r}const m=u(K),y=new q(Q),B=O?new se(y.r,y.g,y.b,1):new se(0,0,0,0);class ce{constructor(){this.width=0,this.height=0,this.aspect=1,this.pixelRatio=1,this.isMobile=!1,this.breakpoint=768,this.fboWidth=null,this.fboHeight=null,this.time=0,this.delta=0,this.container=null,this.renderer=null,this.clock=null}init(e){this.container=e,this.pixelRatio=Math.min(window.devicePixelRatio||1,2),this.resize(),this.renderer=new Ee({antialias:!0,alpha:!0}),this.renderer.autoClear=!1,this.renderer.setClearColor(new q(0),0),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(this.width,this.height),this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",this.clock=new ke,this.clock.start()}resize(){if(!this.container)return;const e=this.container.getBoundingClientRect();this.width=Math.max(1,Math.floor(e.width)),this.height=Math.max(1,Math.floor(e.height)),this.aspect=this.width/this.height,this.renderer&&this.renderer.setSize(this.width,this.height,!1)}update(){this.delta=this.clock.getDelta(),this.time+=this.delta}}const n=new ce;class ue{constructor(){this.mouseMoved=!1,this.coords=new a,this.coords_old=new a,this.diff=new a,this.timer=null,this.container=null,this.docTarget=null,this.listenerTarget=null,this.isHoverInside=!1,this.hasUserControl=!1,this.isAutoActive=!1,this.autoIntensity=2,this.takeoverActive=!1,this.takeoverStartTime=0,this.takeoverDuration=.25,this.takeoverFrom=new a,this.takeoverTo=new a,this.onInteract=null,this._onMouseMove=this.onDocumentMouseMove.bind(this),this._onTouchStart=this.onDocumentTouchStart.bind(this),this._onTouchMove=this.onDocumentTouchMove.bind(this),this._onTouchEnd=this.onTouchEnd.bind(this),this._onDocumentLeave=this.onDocumentLeave.bind(this)}init(e){this.container=e,this.docTarget=e.ownerDocument||null;const t=this.docTarget&&this.docTarget.defaultView||(typeof window<"u"?window:null);t&&(this.listenerTarget=t,this.listenerTarget.addEventListener("mousemove",this._onMouseMove),this.listenerTarget.addEventListener("touchstart",this._onTouchStart,{passive:!0}),this.listenerTarget.addEventListener("touchmove",this._onTouchMove,{passive:!0}),this.listenerTarget.addEventListener("touchend",this._onTouchEnd),this.docTarget&&this.docTarget.addEventListener("mouseleave",this._onDocumentLeave))}dispose(){this.listenerTarget&&(this.listenerTarget.removeEventListener("mousemove",this._onMouseMove),this.listenerTarget.removeEventListener("touchstart",this._onTouchStart),this.listenerTarget.removeEventListener("touchmove",this._onTouchMove),this.listenerTarget.removeEventListener("touchend",this._onTouchEnd)),this.docTarget&&this.docTarget.removeEventListener("mouseleave",this._onDocumentLeave),this.listenerTarget=null,this.docTarget=null,this.container=null}isPointInside(e,t){if(!this.container)return!1;const i=this.container.getBoundingClientRect();return i.width===0||i.height===0?!1:e>=i.left&&e<=i.right&&t>=i.top&&t<=i.bottom}updateHoverState(e,t){return this.isHoverInside=this.isPointInside(e,t),this.isHoverInside}setCoords(e,t){if(!this.container)return;this.timer&&window.clearTimeout(this.timer);const i=this.container.getBoundingClientRect();if(i.width===0||i.height===0)return;const r=(e-i.left)/i.width,o=(t-i.top)/i.height;this.coords.set(r*2-1,-(o*2-1)),this.mouseMoved=!0,this.timer=window.setTimeout(()=>{this.mouseMoved=!1},100)}setNormalized(e,t){this.coords.set(e,t),this.mouseMoved=!0}onDocumentMouseMove(e){if(this.updateHoverState(e.clientX,e.clientY)){if(this.onInteract&&this.onInteract(),this.isAutoActive&&!this.hasUserControl&&!this.takeoverActive){if(!this.container)return;const t=this.container.getBoundingClientRect();if(t.width===0||t.height===0)return;const i=(e.clientX-t.left)/t.width,r=(e.clientY-t.top)/t.height;this.takeoverFrom.copy(this.coords),this.takeoverTo.set(i*2-1,-(r*2-1)),this.takeoverStartTime=performance.now(),this.takeoverActive=!0,this.hasUserControl=!0,this.isAutoActive=!1;return}this.setCoords(e.clientX,e.clientY),this.hasUserControl=!0}}onDocumentTouchStart(e){if(e.touches.length!==1)return;const t=e.touches[0];this.updateHoverState(t.clientX,t.clientY)&&(this.onInteract&&this.onInteract(),this.setCoords(t.clientX,t.clientY),this.hasUserControl=!0)}onDocumentTouchMove(e){if(e.touches.length!==1)return;const t=e.touches[0];this.updateHoverState(t.clientX,t.clientY)&&(this.onInteract&&this.onInteract(),this.setCoords(t.clientX,t.clientY))}onTouchEnd(){this.isHoverInside=!1}onDocumentLeave(){this.isHoverInside=!1}update(){if(this.takeoverActive){const e=(performance.now()-this.takeoverStartTime)/(this.takeoverDuration*1e3);if(e>=1)this.takeoverActive=!1,this.coords.copy(this.takeoverTo),this.coords_old.copy(this.coords),this.diff.set(0,0);else{const t=e*e*(3-2*e);this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo,t)}}this.diff.subVectors(this.coords,this.coords_old),this.coords_old.copy(this.coords),this.coords_old.x===0&&this.coords_old.y===0&&this.diff.set(0,0),this.isAutoActive&&!this.takeoverActive&&this.diff.multiplyScalar(this.autoIntensity)}}const h=new ue;class le{constructor(e,t,i){this.mouse=e,this.manager=t,this.enabled=i.enabled,this.speed=i.speed,this.resumeDelay=i.resumeDelay||3e3,this.rampDurationMs=(i.rampDuration||0)*1e3,this.active=!1,this.current=new a(0,0),this.target=new a,this.lastTime=performance.now(),this.activationTime=0,this.margin=.2,this._tmpDir=new a,this.pickNewTarget()}pickNewTarget(){const e=Math.random;this.target.set((e()*2-1)*(1-this.margin),(e()*2-1)*(1-this.margin))}forceStop(){this.active=!1,this.mouse.isAutoActive=!1}update(){if(!this.enabled)return;const e=performance.now();if(e-this.manager.lastUserInteraction<this.resumeDelay){this.active&&this.forceStop();return}if(this.mouse.isHoverInside){this.active&&this.forceStop();return}if(this.active||(this.active=!0,this.current.copy(this.mouse.coords),this.lastTime=e,this.activationTime=e),!this.active)return;this.mouse.isAutoActive=!0;let i=(e-this.lastTime)/1e3;this.lastTime=e,i>.2&&(i=.016);const r=this._tmpDir.subVectors(this.target,this.current),o=r.length();if(o<.01){this.pickNewTarget();return}r.normalize();let l=1;if(this.rampDurationMs>0){const j=Math.min(1,(e-this.activationTime)/this.rampDurationMs);l=j*j*(3-2*j)}const W=this.speed*i*l,w=Math.min(W,o);this.current.addScaledVector(r,w),this.mouse.setNormalized(this.current.x,this.current.y)}}const g=`
  attribute vec3 position;
  uniform vec2 px;
  uniform vec2 boundarySpace;
  varying vec2 uv;
  precision highp float;
  void main(){
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5)+(pos.xy)*0.5;
  gl_Position = vec4(pos, 1.0);
}
`,he=`
  attribute vec3 position;
  uniform vec2 px;
  precision highp float;
  varying vec2 uv;
  void main(){
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}
`,ve=`
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 pos = position.xy * scale * 2.0 * px + center;
    vUv = uv;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`,P=`
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform bool isBFECC;
    uniform vec2 fboSize;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
    if(isBFECC == false){
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
    } else {
        vec2 spot_new = uv;
        vec2 vel_old = texture2D(velocity, uv).xy;
        vec2 spot_old = spot_new - vel_old * dt * ratio;
        vec2 vel_new1 = texture2D(velocity, spot_old).xy;
        vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
        vec2 error = spot_new2 - spot_new;
        vec2 spot_new3 = spot_new - error / 2.0;
        vec2 vel_2 = texture2D(velocity, spot_new3).xy;
        vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
        vec2 newVel2 = texture2D(velocity, spot_old2).xy; 
        gl_FragColor = vec4(newVel2, 0.0, 0.0);
    }
}
`,de=`
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D palette;
    uniform vec4 bgColor;
    uniform bool lightMode;
    varying vec2 uv;
    void main(){
    vec2 vel = texture2D(velocity, uv).xy;
    float lenv = clamp(length(vel), 0.0, 1.0);
    vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
    float peak = max(c.r, max(c.g, c.b));
    vec3 chroma = clamp(c / max(peak, 0.0001), 0.0, 1.0);
    chroma = pow(chroma, vec3(1.25));
    vec3 ink = lightMode ? chroma : c;
    vec3 outRGB = mix(bgColor.rgb, ink, lenv);
    float outA = mix(bgColor.a, 1.0, lenv);
    gl_FragColor = vec4(outRGB, outA);
}
`,pe=`
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
    float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
    float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
    float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
    float divergence = (x1 - x0 + y1 - y0) / 2.0;
    gl_FragColor = vec4(divergence / dt);
}
`,fe=`
    precision highp float;
    uniform vec2 force;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 circle = (vUv - 0.5) * 2.0;
    float d = 1.0 - min(length(circle), 1.0);
    d *= d;
    gl_FragColor = vec4(force * d, 0.0, 1.0);
}
`,me=`
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D divergence;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
    float div = texture2D(divergence, uv).r;
    float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
    gl_FragColor = vec4(newP);
}
`,ge=`
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D velocity;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    float step = 1.0;
    float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
    vec2 v = texture2D(velocity, uv).xy;
    vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
    v = v - gradP * dt;
    gl_FragColor = vec4(v, 0.0, 1.0);
}
`,xe=`
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D velocity_new;
    uniform float v;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    vec2 old = texture2D(velocity, uv).xy;
    vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
    vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
    vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
    vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
    vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
    newv /= 4.0 * (1.0 + v * dt);
    gl_FragColor = vec4(newv, 0.0, 0.0);
}
`;class x{constructor(e){var t;this.props=e||{},this.uniforms=(t=this.props.material)==null?void 0:t.uniforms,this.scene=null,this.camera=null,this.material=null,this.geometry=null,this.plane=null}init(){this.scene=new re,this.camera=new oe,this.uniforms&&(this.material=new H(this.props.material),this.geometry=new J(2,2),this.plane=new $(this.geometry,this.material),this.scene.add(this.plane))}update(){n.renderer.setRenderTarget(this.props.output||null),n.renderer.render(this.scene,this.camera),n.renderer.setRenderTarget(null)}}class ye extends x{constructor(e){super({material:{vertexShader:g,fragmentShader:P,uniforms:{boundarySpace:{value:e.cellScale},px:{value:e.cellScale},fboSize:{value:e.fboSize},velocity:{value:e.src.texture},dt:{value:e.dt},isBFECC:{value:!0}}},output:e.dst}),this.uniforms=this.props.material.uniforms,this.init()}init(){super.init(),this.createBoundary()}createBoundary(){const e=new Be,t=new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]);e.setAttribute("position",new Ue(t,3));const i=new H({vertexShader:he,fragmentShader:P,uniforms:this.uniforms});this.line=new Ve(e,i),this.scene.add(this.line)}update({dt:e,isBounce:t,BFECC:i}){this.uniforms.dt.value=e,this.line.visible=t,this.uniforms.isBFECC.value=i,super.update()}}class we extends x{constructor(e){super({output:e.dst}),this.init(e)}init(e){super.init();const t=new J(1,1),i=new H({vertexShader:ve,fragmentShader:fe,blending:He,depthWrite:!1,uniforms:{px:{value:e.cellScale},force:{value:new a(0,0)},center:{value:new a(0,0)},scale:{value:new a(e.cursor_size,e.cursor_size)}}});this.mouse=new $(t,i),this.scene.add(this.mouse)}update(e){const t=h.diff.x/2*e.mouse_force,i=h.diff.y/2*e.mouse_force,r=e.cursor_size*e.cellScale.x,o=e.cursor_size*e.cellScale.y,l=Math.min(Math.max(h.coords.x,-1+r+e.cellScale.x*2),1-r-e.cellScale.x*2),W=Math.min(Math.max(h.coords.y,-1+o+e.cellScale.y*2),1-o-e.cellScale.y*2),w=this.mouse.material.uniforms;w.force.value.set(t,i),w.center.value.set(l,W),w.scale.value.set(e.cursor_size,e.cursor_size),super.update()}}class _e extends x{constructor(e){super({material:{vertexShader:g,fragmentShader:xe,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},velocity_new:{value:e.dst_.texture},v:{value:e.viscous},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update({viscous:e,iterations:t,dt:i}){let r,o;this.uniforms.v.value=e;for(let l=0;l<t;l++)l%2===0?(r=this.props.output0,o=this.props.output1):(r=this.props.output1,o=this.props.output0),this.uniforms.velocity_new.value=r.texture,this.props.output=o,this.uniforms.dt.value=i,super.update();return o}}class be extends x{constructor(e){super({material:{vertexShader:g,fragmentShader:pe,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update({vel:e}){this.uniforms.velocity.value=e.texture,super.update()}}class Se extends x{constructor(e){super({material:{vertexShader:g,fragmentShader:me,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.dst_.texture},divergence:{value:e.src.texture},px:{value:e.cellScale}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update({iterations:e}){let t,i;for(let r=0;r<e;r++)r%2===0?(t=this.props.output0,i=this.props.output1):(t=this.props.output1,i=this.props.output0),this.uniforms.pressure.value=t.texture,this.props.output=i,super.update();return i}}class De extends x{constructor(e){super({material:{vertexShader:g,fragmentShader:ge,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.src_p.texture},velocity:{value:e.src_v.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update({vel:e,pressure:t}){this.uniforms.velocity.value=e.texture,this.uniforms.pressure.value=t.texture,super.update()}}class Te{constructor(e){this.options={iterations_poisson:32,iterations_viscous:32,mouse_force:20,resolution:.5,cursor_size:100,viscous:30,isBounce:!1,dt:.014,isViscous:!1,BFECC:!0,...e},this.fbos={vel_0:null,vel_1:null,vel_viscous0:null,vel_viscous1:null,div:null,pressure_0:null,pressure_1:null},this.fboSize=new a,this.cellScale=new a,this.boundarySpace=new a,this.init()}init(){this.calcSize(),this.createAllFBO(),this.createShaderPass()}getFloatType(){return/(iPad|iPhone|iPod)/i.test(navigator.userAgent)?Re:Le}createAllFBO(){const t={type:this.getFloatType(),depthBuffer:!1,stencilBuffer:!1,minFilter:U,magFilter:U,wrapS:V,wrapT:V};for(let i in this.fbos)this.fbos[i]=new Ie(this.fboSize.x,this.fboSize.y,t)}createShaderPass(){this.advection=new ye({cellScale:this.cellScale,fboSize:this.fboSize,dt:this.options.dt,src:this.fbos.vel_0,dst:this.fbos.vel_1}),this.externalForce=new we({cellScale:this.cellScale,cursor_size:this.options.cursor_size,dst:this.fbos.vel_1}),this.viscous=new _e({cellScale:this.cellScale,boundarySpace:this.boundarySpace,viscous:this.options.viscous,src:this.fbos.vel_1,dst:this.fbos.vel_viscous1,dst_:this.fbos.vel_viscous0,dt:this.options.dt}),this.divergence=new be({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.vel_viscous0,dst:this.fbos.div,dt:this.options.dt}),this.poisson=new Se({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.div,dst:this.fbos.pressure_1,dst_:this.fbos.pressure_0}),this.pressure=new De({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src_p:this.fbos.pressure_0,src_v:this.fbos.vel_viscous0,dst:this.fbos.vel_0,dt:this.options.dt})}calcSize(){const e=Math.max(1,Math.round(this.options.resolution*n.width)),t=Math.max(1,Math.round(this.options.resolution*n.height)),i=1/e,r=1/t;this.cellScale.set(i,r),this.fboSize.set(e,t)}resize(){this.calcSize();for(let e in this.fbos)this.fbos[e].setSize(this.fboSize.x,this.fboSize.y)}update(){this.options.isBounce?this.boundarySpace.set(0,0):this.boundarySpace.copy(this.cellScale),this.advection.update({dt:this.options.dt,isBounce:this.options.isBounce,BFECC:this.options.BFECC}),this.externalForce.update({cursor_size:this.options.cursor_size,mouse_force:this.options.mouse_force,cellScale:this.cellScale});let e=this.fbos.vel_1;this.options.isViscous&&(e=this.viscous.update({viscous:this.options.viscous,iterations:this.options.iterations_viscous,dt:this.options.dt})),this.divergence.update({vel:e});const t=this.poisson.update({iterations:this.options.iterations_poisson});this.pressure.update({vel:e,pressure:t})}}class ze{constructor(){this.init()}init(){this.simulation=new Te,this.scene=new re,this.camera=new oe,this.output=new $(new J(2,2),new H({vertexShader:g,fragmentShader:de,transparent:!0,depthWrite:!1,uniforms:{velocity:{value:this.simulation.fbos.vel_0.texture},boundarySpace:{value:new a},palette:{value:m},bgColor:{value:B},lightMode:{value:O}}})),this.scene.add(this.output)}addScene(e){this.scene.add(e)}resize(){this.simulation.resize()}render(){n.renderer.setRenderTarget(null),n.renderer.render(this.scene,this.camera)}update(){this.simulation.update(),this.render()}}class Me{constructor(e){this.props=e,n.init(e.$wrapper),h.init(e.$wrapper),h.autoIntensity=e.autoIntensity,h.takeoverDuration=e.takeoverDuration,this.lastUserInteraction=performance.now(),h.onInteract=()=>{this.lastUserInteraction=performance.now(),this.autoDriver&&this.autoDriver.forceStop()},this.autoDriver=new le(h,this,{enabled:e.autoDemo,speed:e.autoSpeed,resumeDelay:e.autoResumeDelay,rampDuration:e.autoRampDuration}),this.init(),this._loop=this.loop.bind(this),this._resize=this.resize.bind(this),window.addEventListener("resize",this._resize),this._onVisibility=()=>{document.hidden?this.pause():Z.current&&this.start()},document.addEventListener("visibilitychange",this._onVisibility),this.running=!1}init(){this.props.$wrapper.prepend(n.renderer.domElement),this.output=new ze}resize(){n.resize(),this.output.resize()}render(){this.autoDriver&&this.autoDriver.update(),h.update(),n.update(),this.output.update()}loop(){this.running&&(this.render(),f.current=requestAnimationFrame(this._loop))}start(){this.running||(this.running=!0,this._loop())}pause(){this.running=!1,f.current&&(cancelAnimationFrame(f.current),f.current=null)}dispose(){try{if(window.removeEventListener("resize",this._resize),document.removeEventListener("visibilitychange",this._onVisibility),h.dispose(),n.renderer){const e=n.renderer.domElement;e&&e.parentNode&&e.parentNode.removeChild(e),n.renderer.dispose(),n.renderer.forceContextLoss()}}catch{}}}const d=G.current;d.style.position=d.style.position||"relative",d.style.overflow=d.style.overflow||"hidden";const ee=new Me({$wrapper:d,autoDemo:A,autoSpeed:E,autoIntensity:k,takeoverDuration:R,autoResumeDelay:L,autoRampDuration:I});c.current=ee,(()=>{var t;if(!c.current)return;const s=(t=c.current.output)==null?void 0:t.simulation;if(!s)return;const e=s.options.resolution;Object.assign(s.options,{mouse_force:_,cursor_size:b,isViscous:S,viscous:D,iterations_viscous:T,iterations_poisson:z,dt:M,BFECC:F,resolution:p,isBounce:C}),p!==e&&s.resize()})(),ee.start();const te=new IntersectionObserver(s=>{const e=s[0],t=e.isIntersecting&&e.intersectionRatio>0;Z.current=t,c.current&&(t&&!document.hidden?c.current.start():c.current.pause())},{threshold:[0,.01,.1]});te.observe(d),Y.current=te;const ie=new ResizeObserver(()=>{c.current&&(N.current&&cancelAnimationFrame(N.current),N.current=requestAnimationFrame(()=>{c.current&&c.current.resize()}))});return ie.observe(d),X.current=ie,()=>{if(f.current&&cancelAnimationFrame(f.current),X.current)try{X.current.disconnect()}catch{}if(Y.current)try{Y.current.disconnect()}catch{}c.current&&c.current.dispose(),c.current=null}},[F,b,M,C,S,z,T,_,p,D,K,A,E,k,R,L,I,Q,O]),v.useEffect(()=>{var B;const u=c.current;if(!u)return;const m=(B=u.output)==null?void 0:B.simulation;if(!m)return;const y=m.options.resolution;Object.assign(m.options,{mouse_force:_,cursor_size:b,isViscous:S,viscous:D,iterations_viscous:T,iterations_poisson:z,dt:M,BFECC:F,resolution:p,isBounce:C}),u.autoDriver&&(u.autoDriver.enabled=A,u.autoDriver.speed=E,u.autoDriver.resumeDelay=L,u.autoDriver.rampDurationMs=I*1e3,u.autoDriver.mouse&&(u.autoDriver.mouse.autoIntensity=k,u.autoDriver.mouse.takeoverDuration=R)),p!==y&&m.resize()},[_,b,S,D,T,z,M,F,p,C,A,E,k,R,L,I]),Fe.jsx("div",{ref:G,className:`liquid-ether-container ${ae||""}`,style:ne})}export{Ye as default};
