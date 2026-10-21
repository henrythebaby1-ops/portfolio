import{r as E,j as ro}from"./index-D0zNZLAK.js";import{i as _o,s as Wo,f as Oo,u as Pe,d as Ho,t as Me,a as Vo,e as ae}from"./index-22RFDNDE.js";const io={right:0,left:1,center:2,full:3},pt={pearl:0,chrome:1,satin:2},A={none:0,repel:1,attract:2},I={none:0,dither:1,ascii:2},no={stream:0,vortex:1,ribbon:2},xo=4.2,ut=1.8,vt={pearl:{roughness:.46,brightness:.92,glow:.54,highlightMix:.78},chrome:{roughness:.1,brightness:1.12,glow:.38,highlightMix:.9},satin:{roughness:.74,brightness:.84,glow:.42,highlightMix:.66}},so={bold:{count:.58,size:1.32},balanced:{count:1,size:.96},fine:{count:1.15,size:.7}},lo={low:{count:1900,dpr:1.5,supersamplePixels:3e6},medium:{count:3200,dpr:2,supersamplePixels:6e6},high:{count:4600,dpr:2,supersamplePixels:8e6}},ft=[{countScale:1},{countScale:.86},{countScale:.72}],co=[.25,.22,.18],F={interactive:{interval:1e3/60,continuous:!0},settling:{interval:1e3/60,continuous:!0},ambient:{interval:1e3/60,continuous:!0},partial:{interval:1e3/12,continuous:!1}},fo=(e,t)=>e.continuous?Math.max(e.interval,t):e.interval,Yo=(e,t,a,r)=>{const i=t+a;return r||i<=e-.5?e+a:i},b=(e,t,a)=>Math.min(a,Math.max(t,e)),po=e=>({weights:bo(e),velocity:[0,0,0,0]}),uo=(e,t,a,r,i)=>{const l=bo(t);if(i){e.weights=l,e.velocity.fill(0);return}const c=6/r,g=Math.exp(-c*a);for(let u=0;u<4;u+=1){const w=e.weights[u]-l[u],y=e.velocity[u]+c*w;e.weights[u]=l[u]+(w+y*a)*g,e.velocity[u]=(e.velocity[u]-c*y*a)*g}e.weights.every((u,w)=>Math.abs(u-l[w])<1e-4&&Math.abs(e.velocity[w])<.001)&&(e.weights=l,e.velocity.fill(0))},$o=(e,t)=>{const a=2.65+.61*e+.09*e*e,r=2.3+2*e+.35*e*e,i=Math.hypot(2.44*e,Math.sqrt(5)),l=Math.hypot(2.56*e,1);return e<.82?l*(t[0]+t[1]+t[2])+i*t[3]:a*(t[0]+t[1])+r*t[2]+i*t[3]},vo=()=>({pointerId:null,elapsed:0,amount:0,velocity:0,phase:0}),jo=(e,t,a)=>{if(a){e.pointerId=null,e.elapsed=0,e.amount=0,e.velocity=0;return}const r=e.elapsed;e.elapsed=e.pointerId===null?0:e.elapsed+t;const i=e.pointerId!==null&&e.elapsed>.15,l=i&&r<.15?e.elapsed-.15:t,c=i?1:0,g=i?3.8:3.2,u=Math.exp(-g*l),w=e.amount-c,y=e.velocity+g*w;e.amount=c+(w+y*l)*u,e.velocity=(e.velocity-g*y*l)*u,Math.abs(e.amount-c)<1e-4&&Math.abs(e.velocity)<.001&&(e.amount=c,e.velocity=0),e.amount>0&&(e.phase+=t*(.35+e.amount*.5))},re=e=>{e.velocity??(e.velocity=[0,0]),e.velocity[0]=0,e.velocity[1]=0,e.presenceVelocity=0},Xo=(e,t)=>{if(t<=0)return;const a=26,r=Math.exp(-a*t);for(let y=0;y<2;y+=1){const Y=e.position[y]-e.raw[y],$=e.velocity[y]+a*Y;e.position[y]=e.raw[y]+(Y+$*t)*r,e.velocity[y]=(e.velocity[y]-a*$*t)*r}const i=e.active?1:0,l=e.active?24:12,c=Math.exp(-l*t),g=e.presence-i,u=e.presenceVelocity+l*g,w=i+(g+u*t)*c;e.presence=b(w,0,1),e.presenceVelocity=(e.presenceVelocity-l*u*t)*c,w!==e.presence&&(e.presenceVelocity=0),Math.abs(e.presence-i)<.001&&Math.abs(e.presenceVelocity)<.01&&(e.presence=i,e.presenceVelocity=0)},ho=()=>Array.from({length:4},()=>({origin:[.5,.5],age:0,duration:0,strength:0})),mo=(e,t,a,r=1)=>{const i=e.find(g=>g.strength===0);if(!i)return!1;i.origin=[...t],i.age=0;const l=(1+Math.abs(t[0]*2-1))*a,c=1+Math.abs(t[1]*2-1);return i.duration=Math.hypot(l,c)/xo+ut,i.strength=r,!0},Go=(e,t,a)=>{for(const r of e)a&&(r.strength=0),r.strength&&(r.age+=t,r.age>=r.duration&&(r.strength=0))},bo=e=>[0,1,2,3].map(t=>t===e?1:0),ht=(e,t,a)=>[e[0]+(t[0]-e[0])*a,e[1]+(t[1]-e[1])*a,e[2]+(t[2]-e[2])*a,1],Uo=`
struct ViewParams {
  viewport: vec4f,
  shape: vec4f,
  effects: vec4f,
  composition: vec4f,
  transport: vec4f,
  formation: vec4f,
  gather: vec4f,
  pointer: vec4f,
  shock: vec4f,
  shockB: vec4f,
  shockC: vec4f,
  shockD: vec4f,
  material: vec4f,
  light: vec4f,
  environment: vec4f,
  baseColor: vec4f,
  highlightColor: vec4f,
  accentColor: vec4f,
}

struct PathSample {
  position: vec3f,
  tangent: vec3f,
  phase: f32,
}

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) @interpolate(flat, first) baseAlpha: vec4f,
  @location(1) @interpolate(flat, first) creaseColor: vec3f,
  @location(2) localCoord: vec2f,
}

@group(0) @binding(0) var<uniform> view: ViewParams;

fn hashU32(value: u32) -> u32 {
  var state = value * 747796405u + 2891336453u;
  let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn unitFloat(value: u32) -> f32 {
  return f32(hashU32(value)) * (1.0 / 4294967296.0);
}

fn safeNormalize(value: vec3f) -> vec3f {
  return value / max(length(value), 0.0001);
}

fn safeNormalize2(value: vec2f) -> vec2f {
  return value / max(length(value), 0.0001);
}

fn cubic(p0: f32, p1: f32, p2: f32, p3: f32, t: f32) -> f32 {
  let oneMinusT = 1.0 - t;
  return oneMinusT * oneMinusT * oneMinusT * p0
    + 3.0 * oneMinusT * oneMinusT * t * p1
    + 3.0 * oneMinusT * t * t * p2
    + t * t * t * p3;
}

fn cubicDerivative(p0: f32, p1: f32, p2: f32, p3: f32, t: f32) -> f32 {
  let oneMinusT = 1.0 - t;
  return 3.0 * oneMinusT * oneMinusT * (p1 - p0)
    + 6.0 * oneMinusT * t * (p2 - p1)
    + 3.0 * t * t * (p3 - p2);
}

fn sideArc(phase: f32) -> f32 {
  let lookup = array<f32, 32>(
    0.000000, 0.052475, 0.097829, 0.135121, 0.166845, 0.195164, 0.221458, 0.246639,
    0.271368, 0.296184, 0.321577, 0.348019, 0.375973, 0.405832, 0.437746, 0.471327,
    0.505474, 0.538781, 0.570323, 0.599945, 0.628000, 0.655048, 0.681734, 0.708795,
    0.737169, 0.768244, 0.804295, 0.848010, 0.894805, 0.935083, 0.969270, 1.000000,
  );
  let scaled = clamp(phase, 0.0, 0.999999) * 31.0;
  let index = min(u32(floor(scaled)), 30u);
  return mix(lookup[index], lookup[index + 1u], fract(scaled));
}

fn fullArc(phase: f32) -> f32 {
  let lookup = array<f32, 32>(
    0.000000, 0.028092, 0.055939, 0.083892, 0.112291, 0.141449, 0.171637, 0.203033,
    0.235650, 0.269282, 0.303537, 0.337982, 0.372308, 0.406392, 0.440263, 0.474026,
    0.507794, 0.541636, 0.575553, 0.609470, 0.643257, 0.676761, 0.709855, 0.742465,
    0.774594, 0.806319, 0.837790, 0.869218, 0.900862, 0.933020, 0.965991, 1.000000,
  );
  let scaled = clamp(phase, 0.0, 0.999999) * 31.0;
  let index = min(u32(floor(scaled)), 30u);
  return mix(lookup[index], lookup[index + 1u], fract(scaled));
}

fn centerArc(phase: f32) -> f32 {
  let lookup = array<f32, 32>(
    0.000000, 0.028692, 0.059794, 0.096620, 0.140315, 0.179839, 0.212476, 0.241834,
    0.270282, 0.299332, 0.329968, 0.362347, 0.395341, 0.427241, 0.457283, 0.485900,
    0.514192, 0.543773, 0.577230, 0.618093, 0.661144, 0.696770, 0.727388, 0.756064,
    0.784657, 0.814415, 0.845979, 0.878880, 0.911508, 0.942489, 0.971712, 1.000000,
  );
  let scaled = clamp(phase, 0.0, 0.999999) * 31.0;
  let index = min(u32(floor(scaled)), 30u);
  return mix(lookup[index], lookup[index + 1u], fract(scaled));
}

fn mobileArc(phase: f32) -> f32 {
  let lookup = array<f32, 32>(
    0.000000, 0.028885, 0.057970, 0.087431, 0.117400, 0.147935, 0.179017, 0.210560,
    0.242467, 0.274689, 0.307272, 0.340367, 0.374193, 0.408970, 0.444794, 0.481483,
    0.518517, 0.555206, 0.591030, 0.625807, 0.659633, 0.692728, 0.725311, 0.757533,
    0.789440, 0.820983, 0.852065, 0.882600, 0.912569, 0.942030, 0.971115, 1.000000,
  );
  let scaled = clamp(phase, 0.0, 0.999999) * 31.0;
  let index = min(u32(floor(scaled)), 30u);
  return mix(lookup[index], lookup[index + 1u], fract(scaled));
}

fn sidePath(seedPhase: f32, distance: f32, aspect: f32, mirror: f32) -> PathSample {
  let pi = 3.14159265359;
  let pathLength = 2.65 + 0.61 * aspect + 0.09 * aspect * aspect;
  let phase = fract(seedPhase + distance / pathLength);
  let t = sideArc(phase);
  let x = cubic(1.24, 1.02, -0.28, 0.12, t) + sin(t * pi * 4.0 + 0.34) * 0.055;
  let y = cubic(1.38, 0.72, -0.56, -1.38, t) + sin(t * pi * 2.0 - 0.6) * 0.04;
  let z = sin(t * pi * 3.0) * 0.18;
  let derivative = vec3f(
    mirror * aspect * (
      cubicDerivative(1.24, 1.02, -0.28, 0.12, t)
        + cos(t * pi * 4.0 + 0.34) * pi * 4.0 * 0.055
    ),
    cubicDerivative(1.38, 0.72, -0.56, -1.38, t)
      + cos(t * pi * 2.0 - 0.6) * pi * 2.0 * 0.04,
    cos(t * pi * 3.0) * pi * 3.0 * 0.18,
  );
  var sample: PathSample;
  sample.position = vec3f(mirror * aspect * x, y, z);
  sample.tangent = safeNormalize(derivative);
  sample.phase = phase;
  return sample;
}

fn centerPath(seedPhase: f32, distance: f32, aspect: f32) -> PathSample {
  let pi = 3.14159265359;
  let pathLength = 2.3 + 2.0 * aspect + 0.35 * aspect * aspect;
  let phase = fract(seedPhase + distance / pathLength);
  let t = centerArc(phase);
  let angle = mix(-0.25 * pi, 1.75 * pi, t);
  let angleDerivative = 2.0 * pi;
  let radius = 0.72 + sin(t * pi * 4.0) * 0.12;
  let radiusDerivative = cos(t * pi * 4.0) * pi * 4.0 * 0.12;
  let derivative = vec3f(
    aspect * (
      -sin(angle) * angleDerivative * radius
        + cos(angle) * radiusDerivative
    ),
    cos(angle) * angleDerivative * radius
      + sin(angle) * radiusDerivative,
    cos(t * pi * 2.0) * pi * 2.0 * 0.16,
  );
  var sample: PathSample;
  sample.position = vec3f(
    cos(angle) * radius * aspect,
    sin(angle) * radius,
    sin(t * pi * 2.0) * 0.16,
  );
  sample.tangent = safeNormalize(derivative);
  sample.phase = phase;
  return sample;
}

fn fullPath(seedPhase: f32, distance: f32, aspect: f32) -> PathSample {
  let pi = 3.14159265359;
  let pathWidth = 2.44 * aspect;
  let pathLength = sqrt(pathWidth * pathWidth + 5.0);
  let phase = fract(seedPhase + distance / pathLength);
  let t = fullArc(phase);
  let derivative = vec3f(
    aspect * 2.44,
    cos((t * 1.72 - 0.2) * pi) * 1.72 * pi * 0.54
      + cos(t * pi * 3.0) * pi * 3.0 * 0.12,
    -sin(t * pi * 2.0 - 0.7) * pi * 2.0 * 0.22,
  );
  var sample: PathSample;
  sample.position = vec3f(
    mix(-aspect * 1.22, aspect * 1.22, t),
    sin((t * 1.72 - 0.2) * pi) * 0.54 + sin(t * pi * 3.0) * 0.12,
    cos(t * pi * 2.0 - 0.7) * 0.22,
  );
  sample.tangent = safeNormalize(derivative);
  sample.phase = phase;
  return sample;
}

fn mobilePath(seedPhase: f32, distance: f32, aspect: f32) -> PathSample {
  let pi = 3.14159265359;
  let pathWidth = 2.56 * aspect;
  let pathLength = sqrt(pathWidth * pathWidth + 1.0);
  let phase = fract(seedPhase + distance / pathLength);
  let t = mobileArc(phase);
  let derivative = vec3f(
    aspect * 2.56,
    cos(t * pi) * pi * 0.28 + cos(t * pi * 3.0) * pi * 3.0 * 0.06,
    -sin(t * pi * 2.0) * pi * 2.0 * 0.16,
  );
  var sample: PathSample;
  sample.position = vec3f(
    mix(-aspect * 1.28, aspect * 1.28, t),
    -0.86 + sin(t * pi) * 0.28 + sin(t * pi * 3.0) * 0.06,
    cos(t * pi * 2.0) * 0.16,
  );
  sample.tangent = safeNormalize(derivative);
  sample.phase = phase;
  return sample;
}

fn weightedPath(seedPhase: f32, phaseOffset: f32, aspect: f32, weights: vec4f) -> PathSample {
  // Every placement samples the same point along the stream, including its wrap seam.
  let phase = fract(seedPhase + phaseOffset);
  var result: PathSample;
  result.position = vec3f(0.0);
  result.tangent = vec3f(0.0);
  result.phase = phase;

  if (aspect < 0.82) {
    let compactWeight = weights.x + weights.y + weights.z;
    if (compactWeight > 0.0001) {
      let compact = mobilePath(phase, 0.0, aspect);
      result.position += compact.position * compactWeight;
      result.tangent += compact.tangent * compactWeight;
    }
    if (weights.w > 0.0001) {
      let wide = fullPath(phase, 0.0, aspect);
      result.position += wide.position * weights.w;
      result.tangent += wide.tangent * weights.w;
    }
  } else {
    if (weights.x > 0.0001) {
      let right = sidePath(phase, 0.0, aspect, 1.0);
      result.position += right.position * weights.x;
      result.tangent += right.tangent * weights.x;
    }
    if (weights.y > 0.0001) {
      let left = sidePath(phase, 0.0, aspect, -1.0);
      result.position += left.position * weights.y;
      result.tangent += left.tangent * weights.y;
    }
    if (weights.z > 0.0001) {
      let center = centerPath(phase, 0.0, aspect);
      result.position += center.position * weights.z;
      result.tangent += center.tangent * weights.z;
    }
    if (weights.w > 0.0001) {
      let wide = fullPath(phase, 0.0, aspect);
      result.position += wide.position * weights.w;
      result.tangent += wide.tangent * weights.w;
    }
  }

  result.tangent = safeNormalize(result.tangent + vec3f(0.0001, 0.0, 0.0));
  return result;
}

fn pointerField(delta: vec2f, radius: f32, flow: vec2f, depth: f32) -> vec2f {
  // A curved Gaussian follows the flow, with a long, boundary-free tail.
  let offset = delta / max(radius, 0.001);
  let along = dot(offset, flow);
  let across = dot(offset, vec2f(-flow.y, flow.x));
  let alongSquared = along * along;
  let layer = depth * inverseSqrt(1.0 + depth * depth);
  let bend = (0.22 * alongSquared + 0.12 * layer * along) / (1.0 + alongSquared);
  let curvedAcross = (across + bend) / (1.0 + layer * 0.18);
  let falloff = exp(-0.28 * alongSquared - 1.2 * curvedAcross * curvedAcross);
  return offset * falloff;
}

fn rippleWave(age: f32) -> f32 {
  if (age <= 0.0 || age >= ${ut}) { return 0.0; }
  let attack = smoothstep(0.0, 0.14, age);
  let release = 1.0 - smoothstep(1.4, ${ut}, age);
  return sin(age * 10.0) * exp(-age * 3.2) * attack * release;
}

fn rippleDisplacement(position: vec3f, pulse: vec4f) -> vec4f {
  if (pulse.w <= 0.0001) { return vec4f(0.0); }
  let perspective = 1.0 / max(0.62, 1.0 - position.z * 0.34);
  let delta = (position.xy * perspective - pulse.xy) * view.viewport.z;
  let distance = sqrt(dot(delta, delta) + 0.0016) - 0.04;
  let wave = rippleWave(pulse.z - distance / ${xo}) * pulse.w;
  let radial = delta / (distance + 0.12);
  return vec4f(radial * wave * 0.28, wave * 0.12, abs(wave));
}

fn shardVertex(index: u32) -> vec3f {
  let fold = 0.34;
  let vertices = array<vec3f, 6>(
    vec3f(0.0, 1.0, fold),
    vec3f(-0.72, 0.0, 0.0),
    vec3f(0.0, -1.0, fold),
    vec3f(0.0, 1.0, fold),
    vec3f(0.0, -1.0, fold),
    vec3f(0.72, 0.0, 0.0)
  );
  return vertices[index % 6u];
}

fn softbox(direction: vec3f, center: vec2f, size: vec2f) -> f32 {
  let q = abs((direction.xy - center) / size);
  let q2 = q * q;
  let q4 = q2 * q2;
  return exp(-(q4.x + q4.y));
}

fn aces(color: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((color * (a * color + b)) / (color * (c * color + d) + e), vec3f(0.0), vec3f(1.0));
}

@vertex
fn vs_main(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> VertexOut {
  let seedPhase = unitFloat(instanceIndex * 1664525u + 1013904223u);
  let seedLane = unitFloat(instanceIndex * 2246822519u + 3266489917u);
  let seedDepth = unitFloat(instanceIndex * 668265263u + 374761393u);
  let seedScale = unitFloat(instanceIndex * 1597334677u + 3812015801u);
  let aspect = view.viewport.x;
  let path = weightedPath(seedPhase, view.transport.x, aspect, view.composition);
  var direction = path.tangent;
  var planarNormal = safeNormalize2(vec2f(-direction.y, direction.x));

  let signedLane = seedLane * 2.0 - 1.0;
  let lane = sign(signedLane) * pow(abs(signedLane), 0.72);
  let widthProfile = 0.46 + pow(max(sin(path.phase * 3.14159265359), 0.0), 0.72) * 0.54;
  let looseSeed = unitFloat(instanceIndex * 3266489917u + 668265263u);
  let loose = smoothstep(0.92, 1.0, looseSeed);
  let flowWave = sin(path.phase * 37.6991118431 + seedDepth * 12.0);
  let laneWidth = (lane * 0.56 + flowWave * 0.055 * view.shape.z) * view.shape.x
    * widthProfile * (1.0 + loose * 0.72);
  let depthLane = (seedDepth * 2.0 - 1.0) * view.shape.y
    + cos(path.phase * 31.4159265359 + seedLane * 8.0) * 0.06 * view.shape.z;
  var renderPosition = path.position + vec3f(planarNormal * laneWidth, depthLane);

  if (view.formation.y + view.formation.z > 0.00001) {
    let center = vec2f((view.composition.x - view.composition.y) * aspect * 0.56, 0.0);
    var formedPosition = renderPosition * view.formation.x;
    var formedDirection = direction * view.formation.x;
    if (view.formation.y > 0.00001) {
      let radius = 0.16 + sqrt(seedLane) * 0.74 * (0.45 + view.shape.x * 0.55);
      // Constant tangential travel speed; inner rings turn faster without speeding up.
      let angle = seedPhase * 6.28318530718 + view.viewport.w / radius;
      let radial = vec2f(cos(angle), sin(angle));
      let position = vec3f(center + radial * radius, (seedDepth - 0.5) * view.shape.y * 0.65 + radial.y * 0.2);
      formedPosition += position * view.formation.y;
      formedDirection += safeNormalize(vec3f(-radial.y, radial.x, radial.x * 0.2)) * view.formation.y;
    }
    if (view.formation.z > 0.00001) {
      let phase = fract(seedPhase + view.viewport.w / (aspect * 3.0 + 2.0));
      let angle = phase * 6.28318530718;
      let ribbonWidth = (seedLane - 0.5) * 0.54 * view.shape.x;
      let position = vec3f(
        mix(-aspect * 1.35, aspect * 1.35, phase) + center.x * 0.5,
        sin(angle) * 0.42 + cos(angle * 2.0) * ribbonWidth,
        (cos(angle) * 0.35 + sin(angle * 2.0) * ribbonWidth + (seedDepth - 0.5) * 0.12) * view.shape.y
      );
      let tangent = safeNormalize(vec3f(aspect * 2.7, cos(angle) * 2.638938, -sin(angle) * 2.199115 * view.shape.y));
      formedPosition += position * view.formation.z;
      formedDirection += tangent * view.formation.z;
    }
    renderPosition = formedPosition;
    direction = safeNormalize(formedDirection + vec3f(0.0, 0.0, 0.02 * view.formation.x * (1.0 - view.formation.x)));
    planarNormal = safeNormalize2(vec2f(-direction.y, direction.x));
  }

  if (abs(view.pointer.w) > 0.0001) {
    let field = pointerField(
      view.pointer.xy - renderPosition.xy,
      view.pointer.z,
      vec2f(planarNormal.y, -planarNormal.x),
      renderPosition.z,
    );
    let lateral = field - direction.xy * dot(field, direction.xy);
    renderPosition += vec3f(lateral * view.pointer.w * 0.36, 0.0);
    direction = safeNormalize(vec3f(direction.xy + lateral * view.pointer.w * 0.65, direction.z));
  }

  if (view.gather.z > 0.00001) {
    // A Gaussian cloud has a dense center and soft outskirts, never a ring or a hard outline.
    let relative = (renderPosition.xy - view.gather.xy) * view.viewport.z;
    let reach = length(relative);
    let radius = sqrt(-2.0 * log(max(seedLane, 0.0001)));
    let angle = seedPhase * 6.28318530718 + view.gather.w * (0.3 + seedDepth * 0.18);
    let orbit = vec2f(cos(angle), sin(angle));
    let layer = seedDepth * 6.28318530718;
    let drift = vec2f(sin(layer + view.gather.w * 0.22), cos(layer * 1.7 - view.gather.w * 0.18)) * 0.055;
    let cloud = orbit * radius * vec2f(0.2, 0.16) + drift;
    let cluster = vec3f(view.gather.xy + cloud / view.viewport.z, (seedDepth - 0.5) * 0.42);
    // Distant layers arrive later; there is no single closing boundary.
    let amount = pow(view.gather.z, 1.0 + seedDepth * 0.65 + min(reach, 4.0) * 0.12);
    let curledDirection = safeNormalize(vec3f(-orbit.y, orbit.x, sin(layer) * 0.35));
    renderPosition = mix(renderPosition, cluster, amount);
    direction = safeNormalize(mix(direction, curledDirection, amount));
  }

  var rippleLight = 0.0;
  if (view.shock.w + view.shockB.w + view.shockC.w + view.shockD.w > 0.0001) {
    let displacement = rippleDisplacement(renderPosition, view.shock)
      + rippleDisplacement(renderPosition, view.shockB)
      + rippleDisplacement(renderPosition, view.shockC)
      + rippleDisplacement(renderPosition, view.shockD);
    rippleLight = min(displacement.w, 1.5);
    if (dot(displacement.xyz, displacement.xyz) > 0.0) {
      renderPosition += displacement.xyz;
      direction = safeNormalize(direction + displacement.xyz * 0.7);
    }
  }

  let shapeLocal = shardVertex(vertexIndex);
  var local = shapeLocal;
  local.x *= mix(0.72, 1.08, seedLane);
  local.y *= mix(0.82, 1.12, seedDepth);
  local.x += (seedDepth - 0.5) * (1.0 - abs(local.y)) * 0.16;

  var side = cross(vec3f(0.0, 0.0, 1.0), direction);
  let sideLengthSquared = dot(side, side);
  if (sideLengthSquared > 0.0001) {
    side *= inverseSqrt(sideLengthSquared);
  } else {
    side = vec3f(1.0, 0.0, 0.0);
  }
  let facing = cross(direction, side);
  let rollDirection = mix(-1.5, 1.7, seedDepth);
  let roll = seedLane * 6.28318530718 + view.viewport.w * rollDirection * view.effects.x * 2.4;
  let rollSin = sin(roll);
  let rollCos = cos(roll);
  let bankedSide = side * rollCos + facing * rollSin;
  let bankedFacing = facing * rollCos - side * rollSin;
  let depthScale = mix(0.56, 1.58, clamp(renderPosition.z * 0.62 + 0.5, 0.0, 1.0));
  let scaleShape = 0.46 + seedScale * 0.58 + pow(seedScale, 12.0) * 1.55;
  let size = view.viewport.y * scaleShape * depthScale * (1.0 - view.gather.z * 0.3);
  let width = size * 0.72;
  let lengthScale = size * 1.26 * view.effects.z;
  let world = renderPosition
    + direction * local.y * lengthScale
    + bankedSide * local.x * width
    + bankedFacing * local.z * width;

  let perspective = 1.0 / max(0.62, 1.0 - world.z * 0.34);
  let ndc = world.xy * view.viewport.z / vec2f(aspect, 1.0) * perspective;
  let depth = clamp(0.56 - world.z * 0.24, 0.03, 0.97);
  let triangle = vertexIndex / 3u;
  let corner = vertexIndex % 3u;
  var mapped = vec3f(0.0);
  var mappedCrease = vec3f(0.0);
  var shardAlpha = 0.0;

  if (corner == 0u) {
    let facetSide = select(-1.0, 1.0, triangle == 1u);
    let localNormal = vec3f(facetSide * 0.394903, 0.0, 0.918723);
    let normal = bankedSide * localNormal.x + bankedFacing * localNormal.z;
    let viewDirection = normalize(vec3f(-renderPosition.xy * 0.08, 1.0));
    let pointerShift = vec2f(view.light.w, view.shape.w);
    let keyDirection = view.light.xyz;
    let halfDirection = normalize(keyDirection + viewDirection);
    let roughness = clamp(view.material.x, 0.04, 0.96);
    let materialKind = view.material.y;
    let glow = view.material.w;
    let reflection = reflect(-viewDirection, normal);
    let broad = softbox(
      reflection,
      vec2f(-0.34, 0.28) + pointerShift * 0.36,
      vec2f(0.52, 0.22) + roughness * 0.3,
    );
    let strip = softbox(
      reflection,
      vec2f(0.48, -0.08) - pointerShift * 0.2,
      vec2f(0.12, 0.72),
    );
    let diffuse = max(dot(normal, keyDirection), 0.0);
    let specularPower = mix(92.0, 9.0, roughness);
    let specular = pow(max(dot(normal, halfDirection), 0.0), specularPower);
    let fresnelBase = 1.0 - max(dot(normal, viewDirection), 0.0);
    let fresnelSquared = fresnelBase * fresnelBase;
    let fresnel = fresnelSquared * fresnelSquared;
    let facet = mix(0.76, 1.0, smoothstep(-0.08, 0.08, normal.x));
    let depthFog = smoothstep(-0.68, 0.58, renderPosition.z);
    let depthTint = mix(view.accentColor.rgb * 0.52, view.baseColor.rgb, depthFog);
    var color = depthTint * (0.1 + diffuse * 0.3) * facet;
    color += view.highlightColor.rgb * (broad * mix(0.3, 0.86, 1.0 - roughness)) * (1.0 + glow * 0.14);
    color += view.accentColor.rgb * strip * (0.12 + fresnel * 0.42);
    color += view.highlightColor.rgb * specular * mix(0.82, 1.0, seedDepth);
    color += mix(view.baseColor.rgb, view.accentColor.rgb, seedLane) * fresnel * (0.15 + glow * 0.16);
    color += view.accentColor.rgb * (broad * 0.045 + fresnel * 0.075) * glow;
    var creaseColor = color + view.highlightColor.rgb * (0.08 + specular * 0.22);

    if (materialKind > 0.5 && materialKind < 1.5) {
      let materialLight = view.highlightColor.rgb * (broad + specular) * 0.32;
      color = color * 1.1 + materialLight;
      creaseColor = creaseColor * 1.1 + materialLight;
    } else if (materialKind >= 1.5) {
      let satinColor = view.baseColor.rgb * (0.46 + diffuse * 0.46);
      color = mix(color, satinColor, 0.56);
      creaseColor = mix(creaseColor, satinColor, 0.56);
    }

    // A light page acts as a broad fill light, keeping shaded facets in the chosen palette.
    let fill = mix(view.accentColor.rgb, view.baseColor.rgb, depthFog)
      * (0.38 + diffuse * 0.12) * facet * view.environment.x;
    color += fill;
    creaseColor += fill;

    // Reuse the displacement wave, so the accent catches each facet as the ripple arrives.
    let pulseColor = mix(view.accentColor.rgb, view.highlightColor.rgb, 0.18);
    color += pulseColor * rippleLight * (0.85 + fresnel * 0.45);
    creaseColor += pulseColor * rippleLight * 1.35;

    let fog = mix(0.42, 1.0, depthFog);
    let exposure = fog * view.material.z * view.effects.w;
    mapped = aces(color * exposure);
    mappedCrease = aces(creaseColor * exposure);
    shardAlpha = mix(0.58, 0.97, depthFog);
    // Open path endpoints can cross the viewport while morphing. Taper only that moving seam.
    let seam = smoothstep(0.0, 0.035, path.phase) * (1.0 - smoothstep(0.965, 1.0, path.phase));
    shardAlpha *= mix(1.0, seam, view.transport.y * view.formation.x * (1.0 - view.gather.z));
  }

  var out: VertexOut;
  out.position = vec4f(ndc, depth, 1.0);
  out.baseAlpha = vec4f(mapped, shardAlpha);
  out.creaseColor = mappedCrease - mapped;
  out.localCoord = shapeLocal.xy;
  return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4f {
  let crease = (1.0 - smoothstep(0.015, 0.11, abs(in.localCoord.x)))
    * (1.0 - smoothstep(0.78, 1.0, abs(in.localCoord.y)));
  var coverage = 1.0;
  if (view.effects.y > 0.001) {
    let diamondDistance = 1.0 - abs(in.localCoord.y) - abs(in.localCoord.x) / 0.72;
    let edgeWidth = max(fwidth(diamondDistance) * view.effects.y, 0.0001);
    coverage = smoothstep(0.0, edgeWidth, diamondDistance);
  }
  let mapped = in.baseAlpha.rgb + in.creaseColor * crease;
  let coveredAlpha = in.baseAlpha.a * coverage;
  return vec4f(mapped * coveredAlpha, coveredAlpha);
}
`,Qo=`
struct PostParams {
  viewport: vec4f,
  bloomInfo: vec4f,
  finishing: vec4f,
  background: vec4f,
  temporal: vec4f,
  tint: vec4f,
}

@group(0) @binding(0) var sceneTexture: texture_2d<f32>;
@group(0) @binding(1) var sceneSampler: sampler;
@group(0) @binding(2) var<uniform> post: PostParams;

fn visibleResidual(uv: vec2f) -> vec4f {
  let scene = textureSampleLevel(sceneTexture, sceneSampler, uv, 0.0).rgb;
  let residual = scene - post.background.rgb;
  let energy = dot(abs(residual), vec3f(0.2126, 0.7152, 0.0722));
  let threshold = post.bloomInfo.z;
  let knee = post.bloomInfo.w;
  let contribution = smoothstep(threshold - knee, threshold + knee, energy);
  let coverage = energy * contribution;
  // Store a premultiplied palette halo on light surfaces, never negative radiance.
  return vec4f(mix(residual * contribution, post.tint.rgb * coverage, post.finishing.w), coverage);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let offset = post.bloomInfo.xy * 0.25;
  var glow = visibleResidual(uv + offset);
  glow += visibleResidual(uv - offset);
  glow += visibleResidual(uv + vec2f(offset.x, -offset.y));
  glow += visibleResidual(uv + vec2f(-offset.x, offset.y));
  return glow * 0.25;
}
`,go=`
struct BlurParams {
  direction: vec4f,
}

@group(0) @binding(0) var bloomTexture: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> blur: BlurParams;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let nearOffset = blur.direction.xy * 1.3846153846;
  let farOffset = blur.direction.xy * 3.2307692308;
  var color = textureSampleLevel(bloomTexture, linearSampler, uv, 0.0) * 0.2270270270;
  color += textureSampleLevel(bloomTexture, linearSampler, uv + nearOffset, 0.0) * 0.3162162162;
  color += textureSampleLevel(bloomTexture, linearSampler, uv - nearOffset, 0.0) * 0.3162162162;
  color += textureSampleLevel(bloomTexture, linearSampler, uv + farOffset, 0.0) * 0.0702702703;
  color += textureSampleLevel(bloomTexture, linearSampler, uv - farOffset, 0.0) * 0.0702702703;
  return color;
}
`,ie=[[0,0,0,0,0,0,0],[0,0,0,0,0,12,12],[0,12,12,0,12,12,0],[0,0,0,31,0,0,0],[0,0,31,0,31,0,0],[4,4,4,4,4,4,4],[1,2,2,4,8,8,16],[16,8,8,4,2,2,1],[0,4,4,31,4,4,0],[0,21,14,31,14,21,0],[0,17,10,4,10,17,0],[2,4,8,16,8,4,2],[8,4,2,1,2,4,8],[3,4,8,8,8,4,3],[24,4,2,2,2,4,24],[0,0,14,17,17,14,0],[14,17,17,17,17,17,14],[10,10,31,10,31,10,10],[14,17,23,21,23,16,14],[17,27,21,21,17,17,17],[17,17,17,21,21,27,17],[14,17,17,31,17,17,17]],yo=[[.28,.26],[.72,.14],[.28,.56],[.72,.44],[.28,.86],[.72,.74]],mt=ie.map(e=>yo.map(([t,a])=>{let r=0,i=0;for(let l=0;l<28;l+=1)for(let c=0;c<20;c+=1)((c+.5)/20-t)**2*.36+((l+.5)/28-a)**2>.26**2||(r+=e[Math.floor(l/4)]>>4-Math.floor(c/4)&1,i+=1);return r/Math.max(i,1)}));for(let e=0;e<6;e+=1){const t=Math.max(...mt.map(a=>a[e]));for(const a of mt)a[e]/=Math.max(t,.001)}const So=`
struct StyleParams {
  viewport: vec4f,
  background: vec4f,
  mode: vec4f,
}
@group(0) @binding(0) var sourceTexture: texture_2d<f32>;
@group(0) @binding(1) var sourceSampler: sampler;
@group(0) @binding(2) var<uniform> style: StyleParams;

fn sampleSource(pixel: vec2f) -> vec3f {
  if (any(pixel < vec2f(0.0)) || any(pixel >= style.viewport.xy)) { return style.background.rgb; }
  return textureSampleLevel(sourceTexture, sourceSampler, pixel / style.viewport.xy, 0.0).rgb;
}
fn inkLevel(color: vec3f) -> f32 {
  // Measure contrast against the chosen background, not black: white stays empty too.
  return clamp(dot(abs(color - style.background.rgb), vec3f(0.2126, 0.7152, 0.0722)) * 2.4, 0.0, 1.0);
}
`,Ko=`${So}
const INNER = array<vec2f, 6>(${yo.map(e=>`vec2f(${e.join(", ")})`).join(", ")});
const OUTER = array<vec2f, 10>(
  vec2f(0.28, -0.2), vec2f(0.72, -0.2), vec2f(-0.22, 0.25), vec2f(1.22, 0.25),
  vec2f(-0.22, 0.5), vec2f(1.22, 0.5), vec2f(-0.22, 0.75), vec2f(1.22, 0.75),
  vec2f(0.28, 1.2), vec2f(0.72, 1.2)
);
const RING = array<vec2f, 6>(vec2f(1.0, 0.0), vec2f(0.5, 0.8660254), vec2f(-0.5, 0.8660254),
  vec2f(-1.0, 0.0), vec2f(-0.5, -0.8660254), vec2f(0.5, -0.8660254));
const SHAPES = array<vec3f, ${ie.length*2}>(
  ${mt.flatMap(e=>[e.slice(0,3),e.slice(3)]).map(e=>`vec3f(${e.map(t=>t.toFixed(6)).join(", ")})`).join(`,
  `)}
);
fn edgeContrast(value: f32, outside: f32) -> f32 {
  let peak = max(max(value, outside), 0.0001);
  return value * value / peak;
}
@fragment
fn fs_main(@builtin(position) pixel: vec4f) -> @location(0) vec4f {
  let base = floor(pixel.xy) * style.viewport.zw;
  var values: array<f32, 6>;
  var colorSum = vec3f(0.0);
  var weightSum = 0.0;
  for (var i = 0u; i < 6u; i++) {
    let center = base + INNER[i] * style.viewport.zw;
    var color = sampleSource(center);
    for (var tap = 0u; tap < 6u; tap++) {
      color += sampleSource(center + RING[tap] * style.viewport.w * 0.161);
    }
    color /= 7.0;
    values[i] = inkLevel(color);
    colorSum += color * values[i];
    weightSum += values[i];
  }
  if (weightSum < 0.025) { return vec4f(style.background.rgb, 0.0); }
  var edges: array<f32, 10>;
  for (var i = 0u; i < 10u; i++) { edges[i] = inkLevel(sampleSource(base + OUTER[i] * style.viewport.zw)); }
  values[0] = edgeContrast(values[0], max(max(edges[0], edges[1]), max(edges[2], edges[4])));
  values[1] = edgeContrast(values[1], max(max(edges[0], edges[1]), max(edges[3], edges[5])));
  values[2] = edgeContrast(values[2], max(edges[2], max(edges[4], edges[6])));
  values[3] = edgeContrast(values[3], max(edges[3], max(edges[5], edges[7])));
  values[4] = edgeContrast(values[4], max(max(edges[4], edges[6]), max(edges[8], edges[9])));
  values[5] = edgeContrast(values[5], max(max(edges[5], edges[7]), max(edges[8], edges[9])));
  let peak = max(max(max(values[0], values[1]), max(values[2], values[3])), max(values[4], values[5]));
  let gain = 1.0 / max(peak, 0.001);
  let a = vec3f(values[0], values[1], values[2]);
  let b = vec3f(values[3], values[4], values[5]);
  // Normalize shape separately from ink color so thin, dim shards do not all select space.
  let shapeA = a * sqrt(a * gain) * gain;
  let shapeB = b * sqrt(b * gain) * gain;
  var best = 0u;
  var bestDistance = 100.0;
  for (var glyph = 0u; glyph < ${ie.length}u; glyph++) {
    let da = shapeA - SHAPES[glyph * 2u];
    let db = shapeB - SHAPES[glyph * 2u + 1u];
    let distance = dot(da, da) + dot(db, db);
    if (distance < bestDistance) { best = glyph; bestDistance = distance; }
  }
  // RGB stores the scene palette; alpha is an exact byte-sized glyph index, not opacity.
  let ink = style.background.rgb + (colorSum / weightSum - style.background.rgb) * 2.2;
  return vec4f(clamp(ink, vec3f(0.0), vec3f(1.0)), f32(best) / 255.0);
}
`,Jo=`${So}
@group(0) @binding(3) var asciiCells: texture_2d<f32>;
const GLYPHS = array<vec2u, ${ie.length}>(
  ${ie.map(e=>`vec2u(${e.slice(0,4).reduce((t,a,r)=>t+a*2**(r*5),0)}u, ${e.slice(4).reduce((t,a,r)=>t+a*2**(r*5),0)}u)`).join(`,
  `)}
);
// A centered Bayer screen distributes quantization error across a stable 4×4 grid.
const THRESHOLDS = array<f32, 16>(
  0.03125, 0.53125, 0.15625, 0.65625, 0.78125, 0.28125, 0.90625, 0.40625,
  0.21875, 0.71875, 0.09375, 0.59375, 0.96875, 0.46875, 0.84375, 0.34375
);
fn glyphBit(glyph: u32, point: vec2i) -> f32 {
  if (any(point < vec2i(0)) || point.x >= 5 || point.y >= 7) { return 0.0; }
  let row = u32(point.y);
  let bits = select(GLYPHS[glyph].x, GLYPHS[glyph].y, row >= 4u);
  let shift = (row % 4u) * 5u + 4u - u32(point.x);
  return f32((bits >> shift) & 1u);
}
fn orderedDither(color: vec3f, background: vec3f, threshold: f32) -> vec3f {
  let residual = color - background;
  let levels = abs(residual) * 3.0;
  let quantized = (floor(levels) + step(vec3f(threshold), fract(levels))) / 3.0;
  return clamp(background + sign(residual) * quantized, vec3f(0.0), vec3f(1.0));
}
@fragment
fn fs_main(@builtin(position) pixel: vec4f) -> @location(0) vec4f {
  let cellPosition = pixel.xy / style.viewport.zw;
  let cell = vec2i(floor(cellPosition));
  if (style.mode.x < 1.5) {
    let color = sampleSource((vec2f(cell) + 0.5) * style.viewport.zw);
    let index = u32(cell.x % 4) * 4u + u32(cell.y % 4);
    return vec4f(orderedDither(color, style.background.rgb, THRESHOLDS[index]), 1.0);
  }
  let info = textureLoad(asciiCells, clamp(cell, vec2i(0), vec2i(textureDimensions(asciiCells)) - 1), 0);
  let glyph = min(u32(round(info.a * 255.0)), ${ie.length-1}u);
  // Integrate the compact glyph over each display pixel; keep subpixel strokes visible.
  let local = fract(cellPosition) * vec2f(6.0, 10.0) - vec2f(0.5, 1.5);
  let footprint = vec2f(6.0, 10.0) / style.viewport.zw;
  let low = local - footprint * 0.5;
  let high = local + footprint * 0.5;
  let origin = vec2i(floor(low));
  var coverage = 0.0;
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      let point = origin + vec2i(x, y);
      let overlap = max(vec2f(0.0), min(high, vec2f(point + 1)) - max(low, vec2f(point)));
      coverage += glyphBit(glyph, point) * overlap.x * overlap.y;
    }
  }
  coverage /= footprint.x * footprint.y;
  return vec4f(mix(style.background.rgb, info.rgb, clamp(coverage, 0.0, 1.0)), 1.0);
}
`,Zo=`
struct PostParams {
  viewport: vec4f,
  bloomInfo: vec4f,
  finishing: vec4f,
  background: vec4f,
  temporal: vec4f,
  tint: vec4f,
}

@group(0) @binding(0) var sceneTexture: texture_2d<f32>;
@group(0) @binding(1) var bloomTexture: texture_2d<f32>;
@group(0) @binding(2) var linearSampler: sampler;
@group(0) @binding(3) var<uniform> post: PostParams;

fn hash12(value: vec2f) -> f32 {
  let p = fract(value * vec2f(0.1031, 0.1030));
  let mixed = p + dot(p, p.yx + 33.33);
  return fract((mixed.x + mixed.y) * mixed.x);
}

@fragment
fn fs_main(@location(0) uv: vec2f, @builtin(position) pixel: vec4f) -> @location(0) vec4f {
  let background = post.background.rgb;
  // Scene and output have identical dimensions; never filter the sharp base image.
  var scene = textureLoad(sceneTexture, vec2i(pixel.xy), 0).rgb;

  if (post.finishing.z > 0.000001) {
    let aspect = post.viewport.x / max(post.viewport.y, 1.0);
    let centered = (uv - vec2f(0.5)) * vec2f(aspect, 1.0);
    let radius = clamp(length(centered) / 0.78, 0.0, 1.0);
    let radialDirection = centered / max(length(centered), 0.0001);
    let minResolution = min(post.viewport.x, post.viewport.y);
    let pixelOffset = radialDirection * (post.finishing.z * minResolution * radius * radius);
    let uvOffset = pixelOffset * post.viewport.zw;
    let positive = textureSampleLevel(sceneTexture, linearSampler, uv + uvOffset, 0.0).rgb;
    let negative = textureSampleLevel(sceneTexture, linearSampler, uv - uvOffset, 0.0).rgb;
    scene = vec3f(positive.r, scene.g, negative.b);
  }

  var foreground = scene - background;
  if (post.finishing.x > 0.0001) {
    let bloom = textureSampleLevel(bloomTexture, linearSampler, uv, 0.0);
    // A colored haze remains visible on white; protect the opaque facet colors underneath.
    let haloMask = 1.0 - smoothstep(0.04, 0.4, length(foreground));
    let haloOpacity = min(bloom.a * post.finishing.x * 1.8, 0.65) * haloMask;
    let haloColor = bloom.rgb / max(bloom.a, 0.00001);
    let lightForeground = mix(foreground, haloColor - background, haloOpacity);
    foreground = mix(foreground + bloom.rgb * post.finishing.x, lightForeground, post.finishing.w);
  }

  let signal = smoothstep(0.008, 0.18, length(foreground));
  if (post.finishing.y > 0.0001) {
    let grainSeed = floor(post.temporal.x * 60.0);
    let noise = hash12(floor(pixel.xy) + vec2f(grainSeed, grainSeed * 1.6180339)) - 0.5;
    foreground += vec3f(noise * post.finishing.y * signal);
  }

  return vec4f(clamp(background + foreground, vec3f(0.0), vec3f(1.0)), 1.0);
}
`,dt=(e,t)=>{const r=/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(e)||/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(t);return[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255,1]},ea=e=>{const t=navigator.deviceMemory||6,a=navigator.hardwareConcurrency||6,r=Math.max(1,e.clientWidth*e.clientHeight);return e.clientWidth<640||t<=4||a<=4?"low":r<=36e4&&t>=8&&a>=12?"high":"medium"},wo=(e,t)=>{const a=Math.max(1,t.clientWidth*t.clientHeight),r=Math.sqrt(e.supersamplePixels/a);return Math.max(1,Math.min(window.devicePixelRatio||1,e.dpr,r))},gt=(e,t=0)=>{const a=co[t]??co[0];return[Math.max(1,Math.round(e[0]*a)),Math.max(1,Math.round(e[1]*a))]},ta=(e,t,a=gt(t))=>{const r=Pe(e,{viewport:[1,.0132,1,0],shape:[1,1,.36,0],effects:[1,2,1,1.12],composition:[0,0,0,1],transport:[0,0,0,0],formation:[1,0,0,0],gather:[0,0,0,0],pointer:[0,0,.54,0],shock:[0,0,4,0],shockB:[0,0,0,0],shockC:[0,0,0,0],shockD:[0,0,0,0],material:[.46,pt.pearl,.92,.54],light:[-.321,.49,.845,0],environment:[0,0,0,0],baseColor:[.5372549019607843,.41568627450980394,.7411764705882353,1],highlightColor:ht([.6588235294117647,.3333333333333333,.9686274509803922,1],[1,1,1,1],vt.pearl.highlightMix),accentColor:[.6588235294117647,.3333333333333333,.9686274509803922,1]}),i=Pe(e,{viewport:[t[0],t[1],1/t[0],1/t[1]],bloomInfo:[1/a[0],1/a[1],.2,.12],finishing:[.5,.05,.0075,0],background:[.071,.059,.09,1],temporal:[0,0,0,0],tint:[137/255,106/255,189/255,1]}),l=Ho(e,{shader:Uo,vertices:6,blend:"premultiplied",cull:"none",depth:!1,label:"aero-shards-procedural"});l.set({view:r});const c=Me(e,{size:t,format:"rgba8unorm",label:"aero-shards-scene"}),g=Me(e,{size:a,format:"rgba16float",label:"aero-shards-bloom"}),u=Me(e,{size:a,format:"rgba16float",label:"aero-shards-bloom-scratch"}),w=Vo(e,{minFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=ae(e,Qo,{label:"aero-shards-bloom-prefilter",set:{sceneTexture:c,sceneSampler:w,post:i}}),Y=Pe(e,{direction:[1/a[0],0,0,0]}),$=Pe(e,{direction:[0,1/a[1],0,0]}),ne=ae(e,go,{label:"aero-shards-bloom-horizontal",set:{bloomTexture:g,linearSampler:w,blur:Y}}),Oe=ae(e,go,{label:"aero-shards-bloom-vertical",set:{bloomTexture:u,linearSampler:w,blur:$}}),He=ae(e,Zo,{label:"aero-shards-finish",set:{sceneTexture:c,bloomTexture:g,linearSampler:w,post:i}}),Ve=Me(e,{size:[1,1],format:"rgba8unorm",label:"aero-shards-style"}),Te=Me(e,{size:[1,1],format:"rgba8unorm",label:"aero-shards-ascii-cells"}),se=Pe(e,{viewport:[t[0],t[1],6,10],background:[.071,.059,.09,1],mode:[0,0,0,0]}),Ye=ae(e,Ko,{label:"aero-shards-ascii-match",set:{sourceTexture:c,sourceSampler:w,style:se}}),$e=ae(e,Jo,{label:"aero-shards-style-resolve",set:{sourceTexture:c,sourceSampler:w,style:se,asciiCells:Te}});return{viewParams:r,postParams:i,shardDraw:l,sceneTarget:c,bloomTarget:g,bloomScratchTarget:u,bloomEffect:y,blurParamsX:Y,blurParamsY:$,bloomBlurX:ne,bloomBlurY:Oe,finishEffect:He,styleTarget:Ve,asciiTarget:Te,styleParams:se,asciiEffect:Ye,styleEffect:$e,styleSignature:""}},oa=(e,t,a,r)=>{const i=t.effect,l=[i,...a,...r,...t.background].join("|");if(l===e.styleSignature)return;e.styleSignature=l;const c=(i===I.ascii?3.6:1)*a[0]/Math.max(r[0],1),g=(i===I.ascii?6:1)*a[1]/Math.max(r[1],1);e.styleTarget.resize(i?a:[1,1]),e.asciiTarget.resize(i===I.ascii?[Math.max(1,Math.ceil(a[0]/c)),Math.max(1,Math.ceil(a[1]/g))]:[1,1]),e.styleParams.set({viewport:[a[0],a[1],c,g],background:t.background,mode:[i,0,0,0]});const u=i?e.styleTarget:e.sceneTarget;e.bloomEffect.set({sceneTexture:u}),e.finishEffect.set({sceneTexture:u})},aa=async(e,t)=>{await Promise.all([e.shardDraw.compile({colors:[t]}),e.shardDraw.compile(e.sceneTarget),e.bloomEffect.compile(e.bloomTarget),e.bloomBlurX.compile(e.bloomScratchTarget),e.bloomBlurY.compile(e.bloomTarget),e.finishEffect.compile({colors:[t]}),e.asciiEffect.compile(e.asciiTarget),e.styleEffect.compile(e.styleTarget)])};function sa({backgroundColor:e="#120F17",shardColor:t="#896ABD",accentColor:a="#A855F7",placement:r="full",flow:i="stream",material:l="pearl",detail:c="balanced",effect:g="none",scale:u=1,spread:w=1,depth:y=1,speed:Y=1,spin:$=1,interaction:ne="repel",density:Oe=1.5,shardSize:He=1.1,stretch:Ve=1,turbulence:Te=1,glow:se=1,edgeSoftness:Ye=2,bloom:$e=.5,grain:Po=.05,chromaticAberration:Mo=.0075,transitionDuration:To=1,interactionRadius:Do=1.5,interactionStrength:ko=.5,rippleIntensity:wt=1,holdToGather:xt=!0,paused:bt=!1,className:Lo="",onError:yt}){const St=E.useRef(null),Pt=E.useRef(null),De=E.useRef(yt),T=E.useRef(null),je=E.useRef(()=>{}),N=E.useRef({raw:[.5,.5],position:[.5,.5],velocity:[0,0],active:0,presence:0,presenceVelocity:0,initialized:!1}),U=E.useRef(ho()),M=E.useRef(vo()),[Co,Mt]=E.useState(!1),ke=vt[l]||vt.pearl,Tt=so[c]||so.balanced,Le=I[g]??I.none,zo=Le===I.none?1:.4,Eo=Le===I.none?1:1.75,Dt=b(u,.5,2.5),Ce=dt(e,"#120F17"),Ao=dt(t,"#896ABD"),kt=dt(a,"#A855F7"),Lt=b(w,.15,1.1),Ct=b(y,0,1.25),Xe=b(Y,0,2),zt=b($,0,2),Io=A[ne]??A.repel,Et=b(Oe,.5,1.5),At=b(He,.5,1.5),It=b(Ve,.6,1.8),Rt=b(Te,0,2),Ft=b(se,0,2),Nt=b(Ye,0,2),Bt=b($e,0,3),qt=b(Po,0,.12),_t=b(Mo,0,.01),Wt=b(To,.2,2),Ot=b(Do,.5,2),Ht=b(ko,0,2),Ro=Ce[0]*.2126+Ce[1]*.7152+Ce[2]*.0722,Ge=b((Ro-.58)/.24,0,1),Vt=Ge*Ge*(3-2*Ge);T.current={background:Ce,shard:Ao,highlight:ht(kt,[1,1,1,1],ke.highlightMix),accent:kt,composition:io[r]??io.full,flow:no[i]??no.stream,material:pt[l]??pt.pearl,effect:Le,detailCount:Tt.count*Et*zo,shardSize:Tt.size*At*Eo,scale:Dt,stretch:It*(1+Math.min(Xe*.34,1.2)*.1),speed:Xe,spin:zt,turbulence:.36*Rt,spread:Lt,depth:Ct,roughness:ke.roughness,brightness:ke.brightness,glow:ke.glow*Ft,edgeSoftness:Nt,bloom:Bt,grain:qt,chromaticAberration:_t*(Le===I.none?1:.2),exposure:1.12+(.96-1.12)*Vt,lightSurface:Vt,transitionDuration:Wt,interaction:Io,interactionRadius:(ne==="attract"?.27:.18)*Ot,interactionStrength:Ht,rippleIntensity:b(wt,0,2),holdToGather:xt,paused:bt,signature:[e,t,a,r,i,l,c,g,Dt,Lt,Ct,Xe,zt,ne,Et,At,It,Rt,Ft,Nt,Bt,qt,_t,Wt,Ot,Ht,wt,xt,bt].join("|")};const Fo=T.current.signature;return De.current=yt,E.useEffect(()=>{je.current()},[Fo]),E.useEffect(()=>{const P=Pt.current,ze=St.current;if(!P||!ze)return;re(N.current),U.current=ho(),M.current=vo();let _=!1,le=!1,L,B=0,R=0,j,X,W,O,G=!0,Ue=1,ce=!0,fe=0,de=0,C=ze.getBoundingClientRect(),Qe=!1,Ee=!0,z=()=>{ce=!0};const Q=window.matchMedia("(prefers-reduced-motion: reduce)"),Ke=s=>{var d;if(_||le)return;le=!0,B&&cancelAnimationFrame(B),R&&window.clearTimeout(R),O==null||O.disconnect(),W==null||W.disconnect(),j==null||j(),X==null||X();const n=L;L=void 0,n==null||n.dispose();const h=s instanceof Error?s:new Error(String(s));(d=De.current)==null||d.call(De,h)},Yt=()=>{C=ze.getBoundingClientRect(),Qe=!1},$t=(s,n)=>{if(Qe&&Yt(),C.width<=0||C.height<=0)return null;const h=(s-C.left)/C.width,d=(n-C.top)/C.height;return h<0||h>1||d<0||d>1?null:[h,d]},jt=s=>{const n=N.current;!n.initialized||!n.active&&n.presence===0?(n.raw=[...s],n.position=[...s],n.presence=0,re(n),n.initialized=!0):(n.raw[0]=s[0],n.raw[1]=s[1]),n.active=1},K=()=>{N.current.active=0,M.current.pointerId=null;const s=performance.now();fe=s+140,de=s+680,z()},Xt=s=>{const n=T.current;if(!s.isPrimary||!G||n.interaction===A.none)return;const h=$t(s.clientX,s.clientY);if(!h){const p=N.current;(p.active||p.presence>0)&&K();return}jt(h);const d=performance.now();fe=d+140,de=d+680,z()},Gt=s=>{const n=T.current;if(!s.isPrimary||s.button!==0||!G||n.interaction===A.none||s.target instanceof Element&&s.target.closest('a, button, input, textarea, select, [role="button"], [contenteditable="true"]'))return;const h=$t(s.clientX,s.clientY);if(!h)return;!n.paused&&!Q.matches&&n.speed>1e-4&&(mo(U.current,h,C.width/Math.max(C.height,1)),n.holdToGather&&(M.current.pointerId=s.pointerId,M.current.elapsed=0)),jt(h);const d=performance.now();fe=d+220,de=d+800,z()},Ut=s=>{const n=M.current;if(n.pointerId===s.pointerId){n.pointerId=null;const h=T.current;n.amount>.1&&!h.paused&&!Q.matches&&h.interaction!==A.none&&mo(U.current,N.current.raw,C.width/Math.max(C.height,1),1+n.amount*.8),z()}s.pointerType!=="mouse"&&K()},Qt=()=>{Qe=!0},J=()=>{Ee=!0,M.current.pointerId=null,re(N.current),z()};return window.addEventListener("pointermove",Xt,{passive:!0}),window.addEventListener("pointerdown",Gt,{passive:!0}),window.addEventListener("pointerup",Ut,{passive:!0}),window.addEventListener("pointercancel",K,{passive:!0}),window.addEventListener("blur",K),window.addEventListener("scroll",Qt,{passive:!0,capture:!0}),document.addEventListener("visibilitychange",J),window.addEventListener("focus",J),Q.addEventListener("change",J),W=new IntersectionObserver(s=>{const n=s[0];if(Ue=(n==null?void 0:n.intersectionRatio)??1,G=n?n.isIntersecting&&Ue>=.02:!0,G)Ee=!0;else{fe=0,de=0;const h=N.current;h.active=0,h.presence=0,M.current.pointerId=null,re(h)}z()},{threshold:[0,.02,.25]}),W.observe(ze),(async()=>{try{Mt(!1);const s=ea(P),n=lo[s]||lo.medium;if(L=await _o({powerPreference:"low-power"}),_)return L.dispose();X=L.onError(Ke);const h=navigator.gpu.getPreferredCanvasFormat(),d=Wo(L,P,{dpr:wo(n,P),autoResize:!1,format:h}),p=ta(L,d.size,gt([P.clientWidth,P.clientHeight]));if(await aa(p,h),_)return;let Kt="",Je=0,pe=0,ue=0,Jt=0,Ze=0,Zt=0,Ae=!0;const et=po(T.current.composition);let ve=et.weights,eo=!1;const tt=po(T.current.flow);let H=T.current.scale,q=0,ot=0,Ie=!1,Z=0,at=performance.now(),rt=0,Re=0,it=0,nt=0,he=1e3/60;const me=new Float32Array(30);let st=0,lt=0;const to=f=>{const o=N.current,x=Math.abs(o.presence-o.active)>.004;return f<fe||x||U.current.some(v=>v.strength>0)||eo||M.current.pointerId!==null||M.current.amount>0||tt.weights[T.current.flow]<1||Math.abs(T.current.scale-H)>.001?F.interactive:f<de?F.settling:Ue<.25?F.partial:F.ambient},Fe=(f=ot)=>{const o=Math.max(1,d.size[0]),x=Math.max(1,d.size[1]),v=gt([P.clientWidth,P.clientHeight],f);p.sceneTarget.resize([o,x]),p.bloomTarget.resize(v),p.bloomScratchTarget.resize(v),p.blurParamsX.set({direction:[1/v[0],0,0,0]}),p.blurParamsY.set({direction:[0,1/v[1],0,0]}),p.postParams.set({viewport:[o,x,1/o,1/x],bloomInfo:[1/v[0],1/v[1],.2,.12]})},No=()=>{Yt();const f=wo(n,P),o=[Math.max(1,Math.round(P.clientWidth*f)),Math.max(1,Math.round(P.clientHeight*f))];(o[0]!==d.size[0]||o[1]!==d.size[1])&&d.resize(o),Fe()};j=d.onResize(()=>{Fe(),ce=!0,z()}),O=new ResizeObserver(()=>{No(),z()}),O.observe(P);const oo=(f,o,x)=>{const v=Math.max(0,Math.min(ft.length-1,f));v!==q&&(q=v,Z=0,at=o,rt=o,x===F.interactive||x===F.settling?Ie=!0:(ot=q,Ie=!1,Fe()))},Bo=f=>{const o=T.current,x=o.paused||Q.matches||o.speed<=1e-4,v=Ee||!Je?0:Math.min(.05,Math.max(0,(it-Je)/1e3));if(Ee=!1,Je=it,Kt=o.signature,ce=!1,x||(Jt+=v*o.speed*.34,Zt+=v),x?H=o.scale:H+=(o.scale-H)*(1-Math.exp(-v*12)),uo(et,o.composition,v,o.transitionDuration,x),ve=et.weights,eo=ve[o.composition]!==1,!x){const m=d.size[0]/Math.max(d.size[1],1);Ze=(Ze+v*o.speed*.34/$o(m,ve))%1}const S=N.current;uo(tt,o.flow,v,o.transitionDuration,x),jo(M.current,v,x||!o.holdToGather||o.interaction===A.none),o.interaction===A.none?(S.active=0,S.presence=0,re(S)):x?(S.position=[...S.raw],S.presence=S.active,re(S)):S.initialized&&Xo(S,v),Go(U.current,v,x||o.interaction===A.none);const D=ft[q],ge=Math.max(700,Math.round(n.count*o.detailCount*D.countScale)),Be=Math.pow(1/D.countScale,.2),we=.0125*o.shardSize*Be,ee=d.size[0]/Math.max(d.size[1],1),qe=o.interaction===A.none?0:S.presence,k=(S.position[0]-.5)*.38*qe,xe=(S.position[1]-.5)*-.24*qe,_e=-.38+k,te=.58+xe,be=Math.hypot(_e,te,1),ct=o.interaction===A.attract?1:-1,ye=o.interaction===A.none?0:S.presence*o.interactionStrength*ct*(1-M.current.amount),V=(S.position[0]*2-1)*ee/H,oe=(1-S.position[1]*2)/H,Se=1/H,We=U.current.map(m=>[(m.origin[0]*2-1)*ee*Se,(1-m.origin[1]*2)*Se,m.age,m.strength*o.interactionStrength*o.rippleIntensity*Se]);p.viewParams.set({viewport:[ee,we,H,Jt],shape:[o.spread,o.depth,o.turbulence,xe],effects:[o.spin,o.edgeSoftness,o.stretch,o.exposure],composition:ve,transport:[Ze,Math.min(1,(1-Math.max(...ve))*12),0,0],formation:tt.weights,gather:[V,oe,M.current.amount,M.current.phase],pointer:[V,oe,o.interactionRadius*2*Se,ye*Se],shock:We[0],shockB:We[1],shockC:We[2],shockD:We[3],material:[o.roughness,o.material,o.brightness,o.glow],light:[_e/be,te/be,1/be,k],environment:[o.lightSurface,0,0,0],baseColor:o.shard,highlightColor:o.highlight,accentColor:o.accent}),p.postParams.set({finishing:[o.bloom,o.grain,o.chromaticAberration,o.lightSurface],background:o.background,tint:ht(o.shard,o.accent,.4),temporal:[Zt,0,0,0]}),oa(p,o,d.size,[P.clientWidth,P.clientHeight]),o.effect!==I.none||o.bloom>1e-4||o.grain>1e-4||o.chromaticAberration>1e-6?(f.pass({target:p.sceneTarget,clear:o.background},m=>{m.draw(p.shardDraw,{instances:ge})}),o.effect===I.ascii&&f.pass({target:p.asciiTarget,clear:[0,0,0,0]},m=>{m.draw(p.asciiEffect)}),o.effect!==I.none&&f.pass({target:p.styleTarget,clear:o.background},m=>{m.draw(p.styleEffect)}),o.bloom>1e-4&&(f.pass({target:p.bloomTarget,clear:[0,0,0,1]},m=>{m.draw(p.bloomEffect)}),f.pass({target:p.bloomScratchTarget,clear:[0,0,0,1]},m=>{m.draw(p.bloomBlurX)}),f.pass({target:p.bloomTarget,clear:[0,0,0,1]},m=>{m.draw(p.bloomBlurY)})),f.pass({target:d,clear:o.background},m=>{m.draw(p.finishEffect)})):f.pass({target:d,clear:o.background},m=>{m.draw(p.shardDraw,{instances:ge})}),Ae&&(Ae=!1,requestAnimationFrame(()=>{_||Mt(!0)}))},Ne=()=>{_||le||B||!G||document.hidden||(B=requestAnimationFrame(qo))},ao=f=>{if(_||le||R||B||!G||document.hidden)return;const o=Math.max(0,f-performance.now()-10);R=window.setTimeout(()=>{R=0,Ne()},o)},qo=f=>{if(B=0,_||le||!G||document.hidden)return;if(nt){const V=f-nt;if(V>3&&V<35){me[lt]=V,lt=(lt+1)%me.length,st=Math.min(st+1,me.length),he=me[0];for(let oe=1;oe<st;oe+=1)he=Math.min(he,me[oe])}}nt=f;const o=T.current,x=o.signature!==Kt,v=o.paused||Q.matches||o.speed<=1e-4;if(v&&!Ae&&!x&&!ce)return;const S=Ae||x||!pe,D=to(performance.now()),ge=fo(D,he),Be=pe+ge,we=ue?Math.min(ue,Be):Be;if(!S&&f<we-.5){D.continuous?Ne():ao(we);return}Ie&&D!==F.interactive&&D!==F.settling&&(ot=q,Ie=!1,Fe());const ee=pe?f-pe:1/0;it=f;const qe=performance.now();try{Oo(L,Bo)}catch(V){Ke(V);return}pe=f;const k=performance.now(),xe=k-qe;Re=Re?Re*.9+xe*.1:xe;const _e=Number.isFinite(ee)&&ee>ge*1.65,te=Re>4||_e;te?Z||(Z=k):Z=0,(te||D!==F.ambient)&&(at=k);const be=Z>0&&k-Z>1800,ct=k-rt>2200;q<ft.length-1&&ct&&be?oo(q+1,k,D):q>0&&D===F.ambient&&!te&&k-at>15e3&&k-rt>15e3&&oo(q-1,k,D);const ye=to(performance.now());ue=Yo(f,we,fo(ye,he),S||ye.continuous!==D.continuous),!v&&(ye.continuous?Ne():ao(ue))};z=()=>{ce=!0,B||(ue=0),R&&(window.clearTimeout(R),R=0),Ne()},je.current=z,z()}catch(s){Ke(s)}})(),()=>{_=!0,window.removeEventListener("pointermove",Xt),window.removeEventListener("pointerdown",Gt),window.removeEventListener("pointerup",Ut),window.removeEventListener("pointercancel",K),window.removeEventListener("blur",K),window.removeEventListener("scroll",Qt,!0),document.removeEventListener("visibilitychange",J),window.removeEventListener("focus",J),Q.removeEventListener("change",J),W==null||W.disconnect(),O==null||O.disconnect(),j==null||j(),X==null||X(),B&&cancelAnimationFrame(B),R&&window.clearTimeout(R),je.current=()=>{},L==null||L.dispose()}},[]),ro.jsx("div",{ref:St,className:`aero-shards ${Lo}`,"data-ready":Co,style:{backgroundColor:e},"aria-hidden":"true",children:ro.jsx("canvas",{ref:Pt,className:"aero-shards__canvas"})})}export{sa as default};
