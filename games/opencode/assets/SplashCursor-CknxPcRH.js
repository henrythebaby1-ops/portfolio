import{r as Y,j as ue}from"./index-tDOHgNLd.js";function nt({SIM_RESOLUTION:ce=128,DYE_RESOLUTION:le=1440,CAPTURE_RESOLUTION:tt=512,DENSITY_DISSIPATION:se=3.5,VELOCITY_DISSIPATION:fe=2,PRESSURE:ve=.1,PRESSURE_ITERATIONS:de=20,CURL:me=3,SPLAT_RADIUS:he=.2,SPLAT_FORCE:xe=6e3,SHADING:Te=!0,COLOR_UPDATE_SPEED:ge=10,BACK_COLOR:rt={r:.5,g:0,b:0},TRANSPARENT:it=!0,RAINBOW_MODE:Re=!0,COLOR:pe="#ff0000"}){const V=Y.useRef(null),b=Y.useRef(null);return Y.useEffect(()=>{const l=V.current;if(!l)return;let H=!0;function Ee(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[0,0,0]}let v={SIM_RESOLUTION:ce,DYE_RESOLUTION:le,DENSITY_DISSIPATION:se,VELOCITY_DISSIPATION:fe,PRESSURE:ve,PRESSURE_ITERATIONS:de,CURL:me,SPLAT_RADIUS:he,SPLAT_FORCE:xe,SHADING:Te,COLOR_UPDATE_SPEED:ge,RAINBOW_MODE:Re,COLOR:pe},A=[new Ee];const{gl:t,ext:p}=Se(l);p.supportLinearFiltering||(v.DYE_RESOLUTION=256,v.SHADING=!1);function Se(e){const r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let i=e.getContext("webgl2",r);const o=!!i;o||(i=e.getContext("webgl",r)||e.getContext("experimental-webgl",r));let n,a;o?(i.getExtension("EXT_color_buffer_float"),a=i.getExtension("OES_texture_float_linear")):(n=i.getExtension("OES_texture_half_float"),a=i.getExtension("OES_texture_half_float_linear")),i.clearColor(0,0,0,1);const u=o?i.HALF_FLOAT:n&&n.HALF_FLOAT_OES;let f,s,R;return o?(f=S(i,i.RGBA16F,i.RGBA,u),s=S(i,i.RG16F,i.RG,u),R=S(i,i.R16F,i.RED,u)):(f=S(i,i.RGBA,i.RGBA,u),s=S(i,i.RGBA,i.RGBA,u),R=S(i,i.RGBA,i.RGBA,u)),{gl:i,ext:{formatRGBA:f,formatRG:s,formatR:R,halfFloatTexType:u,supportLinearFiltering:a}}}function S(e,r,i,o){if(!De(e,r,i,o))switch(r){case e.R16F:return S(e,e.RG16F,e.RG,o);case e.RG16F:return S(e,e.RGBA16F,e.RGBA,o);default:return null}return{internalFormat:r,format:i}}function De(e,r,i,o){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,i,o,null);const a=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE}class ye{constructor(r,i){this.vertexShader=r,this.fragmentShaderSource=i,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(r){let i=0;for(let n=0;n<r.length;n++)i+=et(r[n]);let o=this.programs[i];if(o==null){let n=h(t.FRAGMENT_SHADER,this.fragmentShaderSource,r);o=W(this.vertexShader,n),this.programs[i]=o}o!==this.activeProgram&&(this.uniforms=k(o),this.activeProgram=o)}bind(){t.useProgram(this.activeProgram)}}class E{constructor(r,i){this.uniforms={},this.program=W(r,i),this.uniforms=k(this.program)}bind(){t.useProgram(this.program)}}function W(e,r){let i=t.createProgram();return t.attachShader(i,e),t.attachShader(i,r),t.linkProgram(i),t.getProgramParameter(i,t.LINK_STATUS)||console.trace(t.getProgramInfoLog(i)),i}function k(e){let r=[],i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;o++){let n=t.getActiveUniform(e,o).name;r[n]=t.getUniformLocation(e,n)}return r}function h(e,r,i){r=Ae(r,i);const o=t.createShader(e);return t.shaderSource(o,r),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)||console.trace(t.getShaderInfoLog(o)),o}function Ae(e,r){if(!r)return e;let i="";return r.forEach(o=>{i+="#define "+o+`
`}),i+e}const T=h(t.VERTEX_SHADER,`
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `),_e=h(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `),Fe=h(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `),we=`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `,be=h(t.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `),Ue=h(t.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,p.supportLinearFiltering?null:["MANUAL_FILTERING"]),Le=h(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `),Be=h(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `),Pe=h(t.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),Xe=h(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `),Ce=h(t.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),m=(t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0),(e,r=!1)=>{e==null?(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)):(t.viewport(0,0,e.width,e.height),t.bindFramebuffer(t.FRAMEBUFFER,e.fbo)),r&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT)),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0)});let d,c,C,z,D;const K=new E(T,_e),M=new E(T,Fe),y=new E(T,be),x=new E(T,Ue),I=new E(T,Le),N=new E(T,Be),F=new E(T,Pe),U=new E(T,Xe),L=new E(T,Ce),B=new ye(T,we);function j(){let e=ee(v.SIM_RESOLUTION),r=ee(v.DYE_RESOLUTION);const i=p.halfFloatTexType,o=p.formatRGBA,n=p.formatRG,a=p.formatR,u=p.supportLinearFiltering?t.LINEAR:t.NEAREST;t.disable(t.BLEND),d?d=q(d,r.width,r.height,o.internalFormat,o.format,i,u):d=O(r.width,r.height,o.internalFormat,o.format,i,u),c?c=q(c,e.width,e.height,n.internalFormat,n.format,i,u):c=O(e.width,e.height,n.internalFormat,n.format,i,u),C=w(e.width,e.height,a.internalFormat,a.format,i,t.NEAREST),z=w(e.width,e.height,a.internalFormat,a.format,i,t.NEAREST),D=O(e.width,e.height,a.internalFormat,a.format,i,t.NEAREST)}function w(e,r,i,o,n,a){t.activeTexture(t.TEXTURE0);let u=t.createTexture();t.bindTexture(t.TEXTURE_2D,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,i,e,r,0,o,n,null);let f=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,f),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,u,0),t.viewport(0,0,e,r),t.clear(t.COLOR_BUFFER_BIT);let s=1/e,R=1/r;return{texture:u,fbo:f,width:e,height:r,texelSizeX:s,texelSizeY:R,attach(_){return t.activeTexture(t.TEXTURE0+_),t.bindTexture(t.TEXTURE_2D,u),_}}}function O(e,r,i,o,n,a){let u=w(e,r,i,o,n,a),f=w(e,r,i,o,n,a);return{width:e,height:r,texelSizeX:u.texelSizeX,texelSizeY:u.texelSizeY,get read(){return u},set read(s){u=s},get write(){return f},set write(s){f=s},swap(){let s=u;u=f,f=s}}}function ze(e,r,i,o,n,a,u){let f=w(r,i,o,n,a,u);return K.bind(),t.uniform1i(K.uniforms.uTexture,e.attach(0)),m(f),f}function q(e,r,i,o,n,a,u){return e.width===r&&e.height===i||(e.read=ze(e.read,r,i,o,n,a,u),e.write=w(r,i,o,n,a,u),e.width=r,e.height=i,e.texelSizeX=1/r,e.texelSizeY=1/i),e}function Me(){let e=[];v.SHADING&&e.push("SHADING"),B.setKeywords(e)}Me(),j();let J=Date.now(),P=0;function Q(){if(!H)return;const e=Ie();Ne()&&j(),Oe(e),Ge(),Ye(e),Ve(null),b.current=requestAnimationFrame(Q)}function Ie(){let e=Date.now(),r=(e-J)/1e3;return r=Math.min(r,.016666),J=e,r}function Ne(){let e=g(l.clientWidth),r=g(l.clientHeight);return l.width!==e||l.height!==r?(l.width=e,l.height=r,!0):!1}function Oe(e){P+=e*v.COLOR_UPDATE_SPEED,P>=1&&(P=$e(P,0,1),A.forEach(r=>{r.color=X()}))}function Ge(){A.forEach(e=>{e.moved&&(e.moved=!1,We(e))})}function Ye(e){t.disable(t.BLEND),N.bind(),t.uniform2f(N.uniforms.texelSize,c.texelSizeX,c.texelSizeY),t.uniform1i(N.uniforms.uVelocity,c.read.attach(0)),m(z),F.bind(),t.uniform2f(F.uniforms.texelSize,c.texelSizeX,c.texelSizeY),t.uniform1i(F.uniforms.uVelocity,c.read.attach(0)),t.uniform1i(F.uniforms.uCurl,z.attach(1)),t.uniform1f(F.uniforms.curl,v.CURL),t.uniform1f(F.uniforms.dt,e),m(c.write),c.swap(),I.bind(),t.uniform2f(I.uniforms.texelSize,c.texelSizeX,c.texelSizeY),t.uniform1i(I.uniforms.uVelocity,c.read.attach(0)),m(C),M.bind(),t.uniform1i(M.uniforms.uTexture,D.read.attach(0)),t.uniform1f(M.uniforms.value,v.PRESSURE),m(D.write),D.swap(),U.bind(),t.uniform2f(U.uniforms.texelSize,c.texelSizeX,c.texelSizeY),t.uniform1i(U.uniforms.uDivergence,C.attach(0));for(let i=0;i<v.PRESSURE_ITERATIONS;i++)t.uniform1i(U.uniforms.uPressure,D.read.attach(1)),m(D.write),D.swap();L.bind(),t.uniform2f(L.uniforms.texelSize,c.texelSizeX,c.texelSizeY),t.uniform1i(L.uniforms.uPressure,D.read.attach(0)),t.uniform1i(L.uniforms.uVelocity,c.read.attach(1)),m(c.write),c.swap(),x.bind(),t.uniform2f(x.uniforms.texelSize,c.texelSizeX,c.texelSizeY),p.supportLinearFiltering||t.uniform2f(x.uniforms.dyeTexelSize,c.texelSizeX,c.texelSizeY);let r=c.read.attach(0);t.uniform1i(x.uniforms.uVelocity,r),t.uniform1i(x.uniforms.uSource,r),t.uniform1f(x.uniforms.dt,e),t.uniform1f(x.uniforms.dissipation,v.VELOCITY_DISSIPATION),m(c.write),c.swap(),p.supportLinearFiltering||t.uniform2f(x.uniforms.dyeTexelSize,d.texelSizeX,d.texelSizeY),t.uniform1i(x.uniforms.uVelocity,c.read.attach(0)),t.uniform1i(x.uniforms.uSource,d.read.attach(1)),t.uniform1f(x.uniforms.dissipation,v.DENSITY_DISSIPATION),m(d.write),d.swap()}function Ve(e){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),He(e)}function He(e){let r=t.drawingBufferWidth,i=t.drawingBufferHeight;B.bind(),v.SHADING&&t.uniform2f(B.uniforms.texelSize,1/r,1/i),t.uniform1i(B.uniforms.uTexture,d.read.attach(0)),m(e)}function We(e){let r=e.deltaX*v.SPLAT_FORCE,i=e.deltaY*v.SPLAT_FORCE;Z(e.texcoordX,e.texcoordY,r,i,e.color)}function ke(e){const r=X();r.r*=10,r.g*=10,r.b*=10;let i=10*(Math.random()-.5),o=30*(Math.random()-.5);Z(e.texcoordX,e.texcoordY,i,o,r)}function Z(e,r,i,o,n){y.bind(),t.uniform1i(y.uniforms.uTarget,c.read.attach(0)),t.uniform1f(y.uniforms.aspectRatio,l.width/l.height),t.uniform2f(y.uniforms.point,e,r),t.uniform3f(y.uniforms.color,i,o,0),t.uniform1f(y.uniforms.radius,Ke(v.SPLAT_RADIUS/100)),m(c.write),c.swap(),t.uniform1i(y.uniforms.uTarget,d.read.attach(0)),t.uniform3f(y.uniforms.color,n.r,n.g,n.b),m(d.write),d.swap()}function Ke(e){let r=l.width/l.height;return r>1&&(e*=r),e}function $(e,r,i,o){e.id=r,e.down=!0,e.moved=!1,e.texcoordX=i/l.width,e.texcoordY=1-o/l.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=X()}function G(e,r,i,o){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=r/l.width,e.texcoordY=1-i/l.height,e.deltaX=qe(e.texcoordX-e.prevTexcoordX),e.deltaY=Je(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0,e.color=o}function je(e){e.down=!1}function qe(e){let r=l.width/l.height;return r<1&&(e*=r),e}function Je(e){let r=l.width/l.height;return r>1&&(e/=r),e}function Qe(e){let r=e.replace("#","");r.length===3&&(r=r[0]+r[0]+r[1]+r[1]+r[2]+r[2]);const i=parseInt(r.slice(0,2),16)/255,o=parseInt(r.slice(2,4),16)/255,n=parseInt(r.slice(4,6),16)/255;return{r:i*.15,g:o*.15,b:n*.15}}function X(){if(!v.RAINBOW_MODE)return Qe(v.COLOR);let e=Ze(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function Ze(e,r,i){let o,n,a,u,f,s,R,_;switch(u=Math.floor(e*6),f=e*6-u,s=i*(1-r),R=i*(1-f*r),_=i*(1-(1-f)*r),u%6){case 0:o=i,n=_,a=s;break;case 1:o=R,n=i,a=s;break;case 2:o=s,n=i,a=_;break;case 3:o=s,n=R,a=i;break;case 4:o=_,n=s,a=i;break;case 5:o=i,n=s,a=R;break}return{r:o,g:n,b:a}}function $e(e,r,i){const o=i-r;return(e-r)%o+r}function ee(e){let r=t.drawingBufferWidth/t.drawingBufferHeight;r<1&&(r=1/r);const i=Math.round(e),o=Math.round(e*r);return t.drawingBufferWidth>t.drawingBufferHeight?{width:o,height:i}:{width:i,height:o}}function g(e){const r=window.devicePixelRatio||1;return Math.floor(e*r)}function et(e){if(e.length===0)return 0;let r=0;for(let i=0;i<e.length;i++)r=(r<<5)-r+e.charCodeAt(i),r|=0;return r}function te(e){let r=A[0],i=g(e.clientX),o=g(e.clientY);$(r,-1,i,o),ke(r)}let re=!1;function ie(e){let r=A[0],i=g(e.clientX),o=g(e.clientY);if(re)G(r,i,o,r.color);else{let n=X();G(r,i,o,n),re=!0}}function oe(e){const r=e.targetTouches;let i=A[0];for(let o=0;o<r.length;o++){let n=g(r[o].clientX),a=g(r[o].clientY);$(i,r[o].identifier,n,a)}}function ne(e){const r=e.targetTouches;let i=A[0];for(let o=0;o<r.length;o++){let n=g(r[o].clientX),a=g(r[o].clientY);G(i,n,a,i.color)}}function ae(e){const r=e.changedTouches;let i=A[0];for(let o=0;o<r.length;o++)je(i)}return window.addEventListener("mousedown",te),window.addEventListener("mousemove",ie),window.addEventListener("touchstart",oe),window.addEventListener("touchmove",ne,!1),window.addEventListener("touchend",ae),Q(),()=>{H=!1,b.current&&(cancelAnimationFrame(b.current),b.current=null),window.removeEventListener("mousedown",te),window.removeEventListener("mousemove",ie),window.removeEventListener("touchstart",oe),window.removeEventListener("touchmove",ne),window.removeEventListener("touchend",ae)}},[]),ue.jsx("div",{style:{position:"fixed",top:0,left:0,zIndex:50,pointerEvents:"none",width:"100%",height:"100%"},children:ue.jsx("canvas",{ref:V,id:"fluid",style:{width:"100vw",height:"100vh",display:"block"}})})}export{nt as default};
