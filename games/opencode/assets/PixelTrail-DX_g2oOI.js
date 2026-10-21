import{r as d,j as c}from"./index-D0zNZLAK.js";import{a as w,C,u as v}from"./react-three-fiber.esm-nR5vKGpt.js";import{p as M,v as T,U,g as b,ag as j,ah as m,y as g,C as S,h as z}from"./three.module-BgPORkTe.js";function E(a,e,t,s){var r;return r=class extends M{constructor(o){super({vertexShader:e,fragmentShader:t,...o});for(const n in a)this.uniforms[n]=new T(a[n]),Object.defineProperty(this,n,{get(){return this.uniforms[n].value},set(i){this.uniforms[n].value=i}});this.uniforms=U.clone(this.uniforms)}},r.key=b.generateUUID(),r}function A(a,e,t=.9){return e*t+a*(1-t)}const F=a=>Math.sqrt(1-Math.pow(a-1,2));class P{constructor({size:e=256,maxAge:t=750,radius:s=.3,intensity:r=.2,interpolate:o=0,smoothing:n=0,minForce:i=.3,blend:l="screen",ease:h=F}={}){this.size=e,this.maxAge=t,this.radius=s,this.intensity=r,this.ease=h,this.interpolate=o,this.smoothing=n,this.minForce=i,this.blend=l,this.trail=[],this.force=0,this.initTexture()}initTexture(){this.canvas=document.createElement("canvas"),this.canvas.width=this.canvas.height=this.size;const e=this.canvas.getContext("2d");if(e===null)throw new Error("2D not available");this.ctx=e,this.ctx.fillStyle="black",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.texture=new j(this.canvas),this.canvas.id="touchTexture",this.canvas.style.width=this.canvas.style.height=`${this.canvas.width}px`}update(e){this.clear(),this.trail.forEach((t,s)=>{t.age+=e*1e3,t.age>this.maxAge&&this.trail.splice(s,1)}),this.trail.length||(this.force=0),this.trail.forEach(t=>{this.drawTouch(t)}),this.texture.needsUpdate=!0}clear(){this.ctx.globalCompositeOperation="source-over",this.ctx.fillStyle="black",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}addTouch(e){const t=this.trail[this.trail.length-1];if(t){const s=t.x-e.x,r=t.y-e.y,o=s*s+r*r,n=Math.max(this.minForce,Math.min(o*1e4,1));if(this.force=A(n,this.force,this.smoothing),this.interpolate){const i=Math.ceil(o/Math.pow(this.radius*.5/this.interpolate,2));if(i>1)for(let l=1;l<i;l++)this.trail.push({x:t.x-s/i*l,y:t.y-r/i*l,age:0,force:n})}}this.trail.push({x:e.x,y:e.y,age:0,force:this.force})}drawTouch(e){const t={x:e.x*this.size,y:(1-e.y)*this.size};let s=1;e.age<this.maxAge*.3?s=this.ease(e.age/(this.maxAge*.3)):s=this.ease(1-(e.age-this.maxAge*.3)/(this.maxAge*.7)),s*=e.force,this.ctx.globalCompositeOperation=this.blend;const r=this.size*this.radius*s,o=this.ctx.createRadialGradient(t.x,t.y,Math.max(0,r*.25),t.x,t.y,Math.max(0,r));o.addColorStop(0,`rgba(255, 255, 255, ${this.intensity})`),o.addColorStop(1,"rgba(0, 0, 0, 0.0)"),this.ctx.beginPath(),this.ctx.fillStyle=o,this.ctx.arc(t.x,t.y,Math.max(0,r),0,Math.PI*2),this.ctx.fill()}}function D(a={}){const{size:e,maxAge:t,radius:s,intensity:r,interpolate:o,smoothing:n,minForce:i,blend:l,ease:h}=a,u=d.useMemo(()=>new P(a),[e,t,s,r,o,n,i,l,h]);w((f,y)=>void u.update(y));const x=d.useCallback(f=>u.addTouch(f.uv),[u]);return[u.texture,x]}const G=({id:a="goo-filter",strength:e=10})=>c.jsx("svg",{className:"goo-filter-container",children:c.jsx("defs",{children:c.jsxs("filter",{id:a,children:[c.jsx("feGaussianBlur",{in:"SourceGraphic",stdDeviation:e,result:"blur"}),c.jsx("feColorMatrix",{in:"blur",type:"matrix",values:"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9",result:"goo"}),c.jsx("feComposite",{in:"SourceGraphic",in2:"goo",operator:"atop"})]})})}),k=E({resolution:new z,mouseTrail:null,gridSize:100,pixelColor:new S("#ffffff")},`
    varying vec2 vUv;
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,`
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 gridUv = fract(uv * gridSize);
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      float trail = texture2D(mouseTrail, gridUvCenter).r;

      gl_FragColor = vec4(pixelColor, trail);
    }
  `),p=a=>a;function _({gridSize:a,trailSize:e,maxAge:t,interpolate:s,easingFunction:r,pixelColor:o}){const n=v(f=>f.size),i=v(f=>f.viewport),l=d.useMemo(()=>new k,[]);d.useEffect(()=>()=>l.dispose(),[l]),d.useEffect(()=>{l.uniforms.pixelColor.value.set(o)},[l,o]);const[h,u]=D({size:512,radius:e,maxAge:t,interpolate:s||.1,ease:r||p});d.useEffect(()=>{h&&(h.minFilter=m,h.magFilter=m,h.wrapS=g,h.wrapT=g)},[h]);const x=Math.max(i.width,i.height)/2;return c.jsxs("mesh",{scale:[x,x,1],onPointerMove:u,children:[c.jsx("planeGeometry",{args:[2,2]}),c.jsx("primitive",{object:l,attach:"material",gridSize:a,resolution:[n.width*i.dpr,n.height*i.dpr],mouseTrail:h})]})}function $({gridSize:a=40,trailSize:e=.1,maxAge:t=250,interpolate:s=5,easingFunction:r=p,canvasProps:o={},glProps:n={antialias:!1,powerPreference:"high-performance",alpha:!0},gooeyFilter:i,color:l="#ffffff",className:h=""}){return c.jsxs(c.Fragment,{children:[i&&c.jsx(G,{id:i.id,strength:i.strength}),c.jsx(C,{eventSource:typeof document<"u"?document.body:void 0,eventPrefix:"client",...o,dpr:o.dpr??[1,1.25],gl:n,className:`pixel-canvas ${h}`,style:i&&{filter:`url(#${i.id})`},children:c.jsx(_,{gridSize:a,trailSize:e,maxAge:t,interpolate:s,easingFunction:r,pixelColor:l})})]})}export{$ as default};
