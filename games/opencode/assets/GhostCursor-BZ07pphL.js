import{r as o,j as Ne}from"./index-tDOHgNLd.js";import{b as ye,s as Re,q as We,aq as Me,p as P,U as ue,h as v,n as K,H as Y,ad as Ge,u as je,C as A,V as _,ao as qe,ar as Ie,W as Xe,S as Ke,t as Ye,g as Ce}from"./three.module-BgPORkTe.js";class N{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const $e=new Re(-1,1,1,-1,0,1);class Je extends We{constructor(){super(),this.setAttribute("position",new Me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Me([0,2,0,0,2,0],2))}}const Ze=new Je;class _e{constructor(e){this._mesh=new ye(Ze,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,$e)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}const $={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ce extends N{constructor(e,s="tDiffuse"){super(),this.textureID=s,this.uniforms=null,this.material=null,e instanceof P?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ue.clone(e.uniforms),this.material=new P({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new _e(this.material)}render(e,s,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Se extends N{constructor(e,s){super(),this.scene=e,this.camera=s,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,s,i){const r=e.getContext(),t=e.state;t.buffers.color.setMask(!1),t.buffers.depth.setMask(!1),t.buffers.color.setLocked(!0),t.buffers.depth.setLocked(!0);let a,u;this.inverse?(a=0,u=1):(a=1,u=0),t.buffers.stencil.setTest(!0),t.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),t.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),t.buffers.stencil.setClear(u),t.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),t.buffers.color.setLocked(!1),t.buffers.depth.setLocked(!1),t.buffers.color.setMask(!0),t.buffers.depth.setMask(!0),t.buffers.stencil.setLocked(!1),t.buffers.stencil.setFunc(r.EQUAL,1,4294967295),t.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),t.buffers.stencil.setLocked(!0)}}class et extends N{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class tt{constructor(e,s){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),s===void 0){const i=e.getSize(new v);this._width=i.width,this._height=i.height,s=new K(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Y}),s.texture.name="EffectComposer.rt1"}else this._width=s.width,this._height=s.height;this.renderTarget1=s,this.renderTarget2=s.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ce($),this.copyPass.material.blending=Ge,this.clock=new je}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,s){this.passes.splice(s,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const s=this.passes.indexOf(e);s!==-1&&this.passes.splice(s,1)}isLastEnabledPass(e){for(let s=e+1;s<this.passes.length;s++)if(this.passes[s].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const s=this.renderer.getRenderTarget();let i=!1;for(let r=0,t=this.passes.length;r<t;r++){const a=this.passes[r];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const u=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(u.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(u.EQUAL,1,4294967295)}this.swapBuffers()}Se!==void 0&&(a instanceof Se?i=!0:a instanceof et&&(i=!1))}}this.renderer.setRenderTarget(s)}reset(e){if(e===void 0){const s=this.renderer.getSize(new v);this._pixelRatio=this.renderer.getPixelRatio(),this._width=s.width,this._height=s.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,s){this._width=e,this._height=s;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let t=0;t<this.passes.length;t++)this.passes[t].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class st extends N{constructor(e,s,i=null,r=null,t=null){super(),this.scene=e,this.camera=s,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=t,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new A}render(e,s,i){const r=e.autoClear;e.autoClear=!1;let t,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(t=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(t),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}}const it={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new A(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class F extends N{constructor(e,s=1,i,r){super(),this.strength=s,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new v(e.x,e.y):new v(256,256),this.clearColor=new A(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let t=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new K(t,a,{type:Y}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let c=0;c<this.nMips;c++){const w=new K(t,a,{type:Y});w.texture.name="UnrealBloomPass.h"+c,w.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(w);const z=new K(t,a,{type:Y});z.texture.name="UnrealBloomPass.v"+c,z.texture.generateMipmaps=!1,this.renderTargetsVertical.push(z),t=Math.round(t/2),a=Math.round(a/2)}const u=it;this.highPassUniforms=ue.clone(u.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new P({uniforms:this.highPassUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.separableBlurMaterials=[];const n=[3,5,7,9,11];t=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let c=0;c<this.nMips;c++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(n[c])),this.separableBlurMaterials[c].uniforms.invSize.value=new v(1/t,1/a),t=Math.round(t/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=s,this.compositeMaterial.uniforms.bloomRadius.value=.1;const E=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=E,this.bloomTintColors=[new _(1,1,1),new _(1,1,1),new _(1,1,1),new _(1,1,1),new _(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ue.clone($.uniforms),this.blendMaterial=new P({uniforms:this.copyUniforms,vertexShader:$.vertexShader,fragmentShader:$.fragmentShader,blending:qe,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new A,this._oldClearAlpha=1,this._basic=new Ie,this._fsQuad=new _e(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,s){let i=Math.round(e/2),r=Math.round(s/2);this.renderTargetBright.setSize(i,r);for(let t=0;t<this.nMips;t++)this.renderTargetsHorizontal[t].setSize(i,r),this.renderTargetsVertical[t].setSize(i,r),this.separableBlurMaterials[t].uniforms.invSize.value=new v(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,s,i,r,t){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),t&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let u=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=u.texture,this.separableBlurMaterials[n].uniforms.direction.value=F.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=F.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this._fsQuad.render(e),u=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,t&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const s=[];for(let i=0;i<e;i++)s.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new P({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new v(.5,.5)},direction:{value:new v(.5,.5)},gaussianCoefficients:{value:s}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new P({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}F.BlurDirectionX=new v(1,0);F.BlurDirectionY=new v(0,1);const ot=({className:b,style:e,trailLength:s=50,inertia:i=.5,grainIntensity:r=.05,bloomStrength:t=.1,bloomRadius:a=1,bloomThreshold:u=.025,brightness:n=1,color:E="#B497CF",mixBlendMode:c="screen",edgeIntensity:w=0,maxDevicePixelRatio:z=.5,targetPixels:Pe,fadeDelayMs:Ee,fadeDurationMs:Be,zIndex:fe=10})=>{const he=o.useRef(null),J=o.useRef(null),Z=o.useRef(null),T=o.useRef(null),De=o.useRef(null),L=o.useRef(null),V=o.useRef([]),Q=o.useRef(0),M=o.useRef(null),me=o.useRef(null),W=o.useRef(new v(.5,.5)),G=o.useRef(new v(0,0)),j=o.useRef(1),ee=o.useRef(typeof performance<"u"?performance.now():Date.now()),H=o.useRef(!1),q=o.useRef(!1),I=o.useRef(!1),B=o.useMemo(()=>typeof window<"u"&&("ontouchstart"in window||navigator.maxTouchPoints>0),[]),te=Pe??(B?9e5:13e5),se=Ee??(B?500:1e3),ve=Be??(B?1e3:1500),Ue=`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,Ae=`
    uniform float iTime;
    uniform vec3  iResolution;
    uniform vec2  iMouse;
    uniform vec2  iPrevMouse[MAX_TRAIL_LENGTH];
    uniform float iOpacity;
    uniform float iScale;
    uniform vec3  iBaseColor;
    uniform float iBrightness;
    uniform float iEdgeIntensity;
    varying vec2  vUv;

    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      f *= f * (3. - 2. * f);
      return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                 mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
    }
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for(int i=0;i<5;i++){
        v += a * noise(p);
        p = m * p * 2.0;
        a *= 0.5;
      }
      return v;
    }
    vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
    vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

    vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
      vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
      vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));

      float smoke = fbm(p * iScale + r * 0.8);
      float radius = 0.5 + 0.3 * (1.0 / iScale);
      float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
      float alpha = pow(smoke, 2.5) * distFactor;

      vec3 c1 = tint1(iBaseColor);
      vec3 c2 = tint2(iBaseColor);
      vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

      return vec4(color * alpha * intensity, alpha * intensity);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
      vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

      vec3 colorAcc = vec3(0.0);
      float alphaAcc = 0.0;

      vec4 b = blob(uv, mouse, 1.0, iOpacity);
      colorAcc += b.rgb;
      alphaAcc += b.a;

      for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {
        vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        float t = 1.0 - float(i) / float(MAX_TRAIL_LENGTH);
        t = pow(t, 2.0);
        if (t > 0.01) {
          vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
          colorAcc += bt.rgb;
          alphaAcc += bt.a;
        }
      }

      colorAcc *= iBrightness;

      vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
      float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
      float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);
      float k = clamp(iEdgeIntensity, 0.0, 1.0);
      float edgeMask = mix(1.0 - k, 1.0, distFromEdge);

      float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);
      gl_FragColor = vec4(colorAcc, outAlpha);
    }
  `,Fe=o.useMemo(()=>({uniforms:{tDiffuse:{value:null},iTime:{value:0},intensity:{value:r}},vertexShader:`
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float iTime;
        uniform float intensity;
        varying vec2 vUv;

        float hash1(float n){ return fract(sin(n)*43758.5453); }

        void main(){
          vec4 color = texture2D(tDiffuse, vUv);
          float n = hash1(vUv.x*1000.0 + vUv.y*2000.0 + iTime) * 2.0 - 1.0;
          color.rgb += n * intensity * color.rgb;
          gl_FragColor = color;
        }
      `}),[r]),ze=o.useMemo(()=>new ce({uniforms:{tDiffuse:{value:null}},vertexShader:`
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main(){
            vec4 c = texture2D(tDiffuse, vUv);
            float coverage = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
            vec3 straight = coverage > 1e-5 ? c.rgb / coverage : vec3(0.0);
            gl_FragColor = vec4(clamp(straight, 0.0, 1.0), coverage);
          }
        `}),[]);function Le(l){const h=l.getBoundingClientRect(),D=600,C=Math.min(Math.max(1,h.width),Math.max(1,h.height));return Math.max(.5,Math.min(2,C/D))}o.useEffect(()=>{const l=he.current,h=l==null?void 0:l.parentElement;if(!l||!h)return;let D=!0;const C=h.style.position;(!C||C==="static")&&(h.style.position="relative");const m=new Xe({antialias:!B,alpha:!0,depth:!1,stencil:!1,powerPreference:B?"low-power":"high-performance",premultipliedAlpha:!1,preserveDrawingBuffer:!1});m.setClearColor(0,0),J.current=m,m.domElement.style.pointerEvents="none",c?m.domElement.style.mixBlendMode=String(c):m.domElement.style.removeProperty("mix-blend-mode"),l.appendChild(m.domElement);const ie=new Ke,Qe=new Re(-1,1,1,-1,0,1),de=new Ye(2,2),pe=Math.max(1,Math.floor(s));V.current=Array.from({length:pe},()=>new v(.5,.5)),Q.current=0;const re=new A(E),O=new P({defines:{MAX_TRAIL_LENGTH:pe},uniforms:{iTime:{value:0},iResolution:{value:new _(1,1,1)},iMouse:{value:new v(.5,.5)},iPrevMouse:{value:V.current.map(d=>d.clone())},iOpacity:{value:1},iScale:{value:1},iBaseColor:{value:new _(re.r,re.g,re.b)},iBrightness:{value:n},iEdgeIntensity:{value:w}},vertexShader:Ue,fragmentShader:Ae,transparent:!0,depthTest:!1,depthWrite:!1});T.current=O;const He=new ye(de,O);ie.add(He);const g=new tt(m);Z.current=g;const Oe=new st(ie,Qe);g.addPass(Oe);const ae=new F(new v(1,1),t,a,u);De.current=ae,g.addPass(ae);const ge=new ce(Fe);L.current=ge,g.addPass(ge),g.addPass(ze);const xe=()=>{var U;if(!D)return;const d=l.getBoundingClientRect(),p=Math.floor(d.width),f=Math.floor(d.height);if(p<=0||f<=0){I.current=!1;return}const S=Math.min(typeof window<"u"&&window.devicePixelRatio||1,z),y=p*f*S*S,le=y<=te?1:Math.max(.5,Math.min(1,Math.sqrt(te/Math.max(1,y)))),R=S*le;m.setPixelRatio(R),m.setSize(p,f,!1),(U=g.setPixelRatio)==null||U.call(g,R),g.setSize(p,f);const k=Math.max(1,Math.floor(p*R)),x=Math.max(1,Math.floor(f*R));O.uniforms.iResolution.value.set(k,x,1),O.uniforms.iScale.value=Le(l),ae.setSize(k,x),I.current=!0};xe();const oe=new ResizeObserver(()=>{D&&xe()});me.current=oe,oe.observe(h),oe.observe(l);const ke=typeof performance<"u"?performance.now():Date.now(),ne=()=>{var R,k;if(!D)return;if(!I.current){M.current=requestAnimationFrame(ne);return}const d=performance.now(),p=(d-ke)/1e3,f=T.current,S=Z.current;if(H.current)G.current.set(W.current.x-f.uniforms.iMouse.value.x,W.current.y-f.uniforms.iMouse.value.y),f.uniforms.iMouse.value.copy(W.current),j.current=1;else{G.current.multiplyScalar(i),G.current.lengthSq()>1e-6&&f.uniforms.iMouse.value.add(G.current);const x=d-ee.current;if(x>se){const U=Math.min(1,(x-se)/ve);j.current=Math.max(0,1-U)}}const y=V.current.length;Q.current=(Q.current+1)%y,V.current[Q.current].copy(f.uniforms.iMouse.value);const le=f.uniforms.iPrevMouse.value;for(let x=0;x<y;x++){const U=(Q.current-x+y)%y;le[x].copy(V.current[U])}if(f.uniforms.iOpacity.value=j.current,f.uniforms.iTime.value=p,(k=(R=L.current)==null?void 0:R.uniforms)!=null&&k.iTime&&(L.current.uniforms.iTime.value=p),S.render(),!H.current&&j.current<=.001){q.current=!1,M.current=null;return}M.current=requestAnimationFrame(ne)},X=()=>{q.current||(q.current=!0,M.current=requestAnimationFrame(ne))},be=d=>{const p=h.getBoundingClientRect(),f=Ce.clamp((d.clientX-p.left)/Math.max(1,p.width),0,1),S=Ce.clamp(1-(d.clientY-p.top)/Math.max(1,p.height),0,1);W.current.set(f,S),H.current=!0,ee.current=performance.now(),X()},Te=()=>{H.current=!0,X()},we=()=>{H.current=!1,ee.current=performance.now(),X()};return window.addEventListener("pointermove",be,{passive:!0}),window.addEventListener("pointerover",Te,{passive:!0}),document.documentElement.addEventListener("pointerleave",we,{passive:!0}),X(),()=>{var d;D=!1,I.current=!1,M.current&&cancelAnimationFrame(M.current),q.current=!1,M.current=null,window.removeEventListener("pointermove",be),window.removeEventListener("pointerover",Te),document.documentElement.removeEventListener("pointerleave",we),(d=me.current)==null||d.disconnect(),ie.clear(),de.dispose(),O.dispose(),T.current=null,g.dispose(),Z.current=null,m.dispose(),m.forceContextLoss(),J.current=null,m.domElement&&m.domElement.parentElement&&m.domElement.parentElement.removeChild(m.domElement),(!C||C==="static")&&(h.style.position=C)}},[s,i,r,t,a,u,te,se,ve,B,E,n,c,w]),o.useEffect(()=>{if(T.current){const l=new A(E);T.current.uniforms.iBaseColor.value.set(l.r,l.g,l.b)}},[E]),o.useEffect(()=>{T.current&&(T.current.uniforms.iBrightness.value=n)},[n]),o.useEffect(()=>{T.current&&(T.current.uniforms.iEdgeIntensity.value=w)},[w]),o.useEffect(()=>{var l,h;(h=(l=L.current)==null?void 0:l.uniforms)!=null&&h.intensity&&(L.current.uniforms.intensity.value=r)},[r]),o.useEffect(()=>{var h;const l=(h=J.current)==null?void 0:h.domElement;l&&(c?l.style.mixBlendMode=String(c):l.style.removeProperty("mix-blend-mode"))},[c]);const Ve=o.useMemo(()=>({zIndex:fe,...e}),[fe,e]);return Ne.jsx("div",{ref:he,className:`ghost-cursor ${b??""}`,style:Ve})};export{ot as default};
