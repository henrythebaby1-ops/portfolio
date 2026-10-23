(function () {
  if (document.body.getAttribute('data-app') !== 'autopilot-sim') {
    return;
  }

  initCarSimulator();
  initFlightSimulator();
  initRobotZone();

  function initCarSimulator() {
    var canvas = document.getElementById('autopilot-canvas');
    if (!canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var startBtn = document.getElementById('sim-start');
    var pauseBtn = document.getElementById('sim-pause');
    var resetBtn = document.getElementById('sim-reset');
    var autopilotToggle = document.getElementById('sim-autopilot');
    var addTrafficBtn = document.getElementById('sim-traffic');
    var clearTrafficBtn = document.getElementById('sim-clear');
    var cityBtn = document.getElementById('sim-city');
    var highwayBtn = document.getElementById('sim-highway');
    var roadChangeBtn = document.getElementById('sim-road-change');

    var statusEl = document.querySelector('[data-sim-status]');
    var speedEl = document.querySelector('[data-sim-speed]');
    var laneEl = document.querySelector('[data-sim-lane]');
    var objectsEl = document.querySelector('[data-sim-objects]');
    var roadTypeEl = document.querySelector('[data-sim-roadtype]');
    var lightEl = document.querySelector('[data-sim-light]');

    var roadTop = 20;
    var roadBottom = canvas.height - 20;
    var running = false;
    var roadOffset = 0;

    var state = {
      speed: 0,
      targetSpeed: 36,
      laneIndex: 1,
      x: canvas.width / 2,
      y: 510,
      objects: [],
      autopilot: true,
      frameId: null,
      mode: 'city',
      laneCount: 3,
      roadWidth: 280,
      roadCurveAmp: 18,
      roadPhase: 0,
      roadProfileName: 'Gentle Curve',
      trafficLight: {
        active: true,
        state: 'green',
        timer: 0,
        y: 120
      }
    };

    var roadProfiles = [
      { name: 'Straight', curveAmp: 4 },
      { name: 'Gentle Curve', curveAmp: 18 },
      { name: 'S-Curve', curveAmp: 30 },
      { name: 'Construction Shift', curveAmp: 24 }
    ];

    function setStatus(text) {
      if (statusEl) {
        statusEl.textContent = text;
      }
    }

    function modeLabel() {
      return state.mode === 'highway' ? 'Highway / Freeway' : 'City Streets';
    }

    function laneLabel(index) {
      if (state.laneCount === 2) {
        return index === 0 ? 'Left' : 'Right';
      }
      if (state.laneCount === 3) {
        return ['Left', 'Center', 'Right'][index] || 'Lane';
      }
      if (state.laneCount === 4) {
        return ['Far Left', 'Left', 'Right', 'Far Right'][index] || 'Lane';
      }
      return 'Lane ' + (index + 1);
    }

    function roadCenterAt(y) {
      return canvas.width / 2 + Math.sin((roadOffset * 0.03) + (y * 0.008) + state.roadPhase) * state.roadCurveAmp;
    }

    function laneCenterAt(lane, y) {
      var center = roadCenterAt(y);
      var laneWidth = state.roadWidth / state.laneCount;
      var leftEdge = center - (state.roadWidth / 2);
      return leftEdge + laneWidth * (lane + 0.5);
    }

    function maxSpeedForMode() {
      return state.mode === 'highway' ? 82 : 48;
    }

    function cruiseSpeedForMode() {
      return state.mode === 'highway' ? 66 : 36;
    }

    function randomLane() {
      return Math.floor(Math.random() * state.laneCount);
    }

    function spawnTraffic(count) {
      for (var i = 0; i < count; i += 1) {
        var lane = randomLane();
        var y = 80 + Math.random() * 320;
        state.objects.push({
          lane: lane,
          x: laneCenterAt(lane, y),
          y: y,
          speed: (state.mode === 'highway' ? 34 : 14) + Math.random() * (state.mode === 'highway' ? 22 : 14),
          width: 34,
          height: 58,
          color: 'rgba(155, 166, 178, 0.95)'
        });
      }
    }

    function applyMode(mode) {
      state.mode = mode;
      state.laneCount = mode === 'highway' ? 4 : 3;
      state.roadWidth = mode === 'highway' ? 320 : 280;
      state.targetSpeed = cruiseSpeedForMode();
      state.laneIndex = Math.min(state.laneIndex, state.laneCount - 1);

      state.trafficLight.active = mode === 'city';
      state.trafficLight.y = 120;
      state.trafficLight.timer = 0;
      state.trafficLight.state = 'green';

      state.objects = [];
      spawnTraffic(mode === 'highway' ? 10 : 6);
      updateModeButtons();
      updateStats();
    }

    function updateModeButtons() {
      if (!cityBtn || !highwayBtn) {
        return;
      }

      if (state.mode === 'city') {
        cityBtn.classList.add('btn-primary');
        cityBtn.classList.remove('btn-outline');
        highwayBtn.classList.add('btn-outline');
        highwayBtn.classList.remove('btn-primary');
      } else {
        highwayBtn.classList.add('btn-primary');
        highwayBtn.classList.remove('btn-outline');
        cityBtn.classList.add('btn-outline');
        cityBtn.classList.remove('btn-primary');
      }
    }

    function setRandomRoadProfile() {
      var profile = roadProfiles[Math.floor(Math.random() * roadProfiles.length)];
      state.roadCurveAmp = profile.curveAmp;
      state.roadProfileName = profile.name;
      state.roadPhase = Math.random() * Math.PI * 2;
      setStatus('Road changed: ' + profile.name);
    }

    function resetSimulation() {
      roadOffset = 0;
      state.speed = 0;
      state.y = 510;
      state.laneIndex = Math.min(1, state.laneCount - 1);
      state.x = laneCenterAt(state.laneIndex, state.y);
      state.objects = [];
      spawnTraffic(state.mode === 'highway' ? 10 : 6);
      state.trafficLight.y = 120;
      state.trafficLight.timer = 0;
      state.trafficLight.state = 'green';
      updateStats();
      setStatus('Ready');
      draw();
    }

    function updateStats() {
      if (speedEl) {
        speedEl.textContent = Math.round(state.speed);
      }
      if (laneEl) {
        laneEl.textContent = laneLabel(state.laneIndex);
      }
      if (objectsEl) {
        objectsEl.textContent = String(state.objects.length);
      }
      if (roadTypeEl) {
        roadTypeEl.textContent = modeLabel() + ' (' + state.roadProfileName + ')';
      }
      if (lightEl) {
        if (!state.trafficLight.active) {
          lightEl.textContent = 'N/A (highway mode)';
        } else {
          lightEl.textContent = state.trafficLight.state.toUpperCase();
        }
      }
    }

    function nearestObjectInLane(lane) {
      var nearest = null;
      for (var i = 0; i < state.objects.length; i += 1) {
        var obj = state.objects[i];
        if (obj.lane !== lane) {
          continue;
        }
        var distance = state.y - obj.y;
        if (distance > 0 && distance < 260) {
          if (!nearest || distance < nearest.distance) {
            nearest = { object: obj, distance: distance };
          }
        }
      }
      return nearest;
    }

    function laneIsClear(lane) {
      for (var i = 0; i < state.objects.length; i += 1) {
        var obj = state.objects[i];
        if (obj.lane !== lane) {
          continue;
        }
        var delta = Math.abs(obj.y - state.y);
        if (delta < 140) {
          return false;
        }
      }
      return true;
    }

    function lightDistanceAhead() {
      if (!state.trafficLight.active) {
        return null;
      }
      var distance = state.y - state.trafficLight.y;
      if (distance > 0 && distance < 280) {
        return distance;
      }
      return null;
    }

    function autopilotDecision() {
      var currentThreat = nearestObjectInLane(state.laneIndex);
      state.targetSpeed = cruiseSpeedForMode();

      var signalDistance = lightDistanceAhead();
      if (signalDistance !== null) {
        if (state.trafficLight.state === 'red') {
          if (signalDistance < 100) {
            state.targetSpeed = 0;
            setStatus('Autopilot: Stopping at red light');
            return;
          }
          state.targetSpeed = 14;
          setStatus('Autopilot: Slowing for red light');
        } else if (state.trafficLight.state === 'yellow' && signalDistance < 140) {
          state.targetSpeed = 16;
          setStatus('Autopilot: Preparing to stop for yellow light');
        }
      }

      if (currentThreat && currentThreat.distance < 150) {
        state.targetSpeed = Math.min(state.targetSpeed, state.mode === 'highway' ? 42 : 20);

        var leftLane = state.laneIndex - 1;
        var rightLane = state.laneIndex + 1;

        if (leftLane >= 0 && laneIsClear(leftLane)) {
          state.laneIndex = leftLane;
          setStatus('Autopilot: Changing lane left');
        } else if (rightLane < state.laneCount && laneIsClear(rightLane)) {
          state.laneIndex = rightLane;
          setStatus('Autopilot: Changing lane right');
        } else {
          setStatus('Autopilot: Slowing for traffic');
        }
      } else if (signalDistance === null || state.trafficLight.state === 'green') {
        setStatus('Autopilot: Lane centering active');
      }
    }

    function updateTrafficLight(dt) {
      if (!state.trafficLight.active) {
        return;
      }

      state.trafficLight.timer += dt;

      if (state.trafficLight.state === 'green' && state.trafficLight.timer > 240) {
        state.trafficLight.state = 'yellow';
        state.trafficLight.timer = 0;
      } else if (state.trafficLight.state === 'yellow' && state.trafficLight.timer > 70) {
        state.trafficLight.state = 'red';
        state.trafficLight.timer = 0;
      } else if (state.trafficLight.state === 'red' && state.trafficLight.timer > 200) {
        state.trafficLight.state = 'green';
        state.trafficLight.timer = 0;
      }

      state.trafficLight.y += state.speed * 0.45 * dt;
      if (state.trafficLight.y > canvas.height + 120) {
        state.trafficLight.y = -180;
      }
    }

    function moveObjects(dt) {
      var relativeSpeed = state.speed * 0.46;

      for (var i = state.objects.length - 1; i >= 0; i -= 1) {
        var obj = state.objects[i];
        obj.y += (relativeSpeed - obj.speed) * dt;

        if (obj.y > canvas.height + 90) {
          obj.y = -80 - Math.random() * 220;
          obj.lane = randomLane();
          obj.speed = (state.mode === 'highway' ? 34 : 14) + Math.random() * (state.mode === 'highway' ? 22 : 14);
        }

        obj.x = laneCenterAt(obj.lane, obj.y);
      }
    }

    function update(dt) {
      if (state.autopilot) {
        autopilotDecision();
      } else {
        setStatus('Manual mode');
        state.targetSpeed = Math.max(0, Math.min(maxSpeedForMode(), state.targetSpeed));
      }

      state.speed += (state.targetSpeed - state.speed) * 0.07;
      state.x += (laneCenterAt(state.laneIndex, state.y) - state.x) * 0.16;

      moveObjects(dt);
      updateTrafficLight(dt);

      roadOffset += state.speed * 0.12;
      if (roadOffset > 1000) {
        roadOffset = 0;
      }

      updateStats();
    }

    function drawRoad() {
      ctx.fillStyle = '#1f2329';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      var points = [];
      for (var y = roadTop; y <= roadBottom; y += 12) {
        var center = roadCenterAt(y);
        points.push({
          y: y,
          left: center - (state.roadWidth / 2),
          right: center + (state.roadWidth / 2)
        });
      }

      ctx.fillStyle = '#2f343c';
      ctx.beginPath();
      ctx.moveTo(points[0].left, points[0].y);
      for (var i = 1; i < points.length; i += 1) {
        ctx.lineTo(points[i].left, points[i].y);
      }
      for (var j = points.length - 1; j >= 0; j -= 1) {
        ctx.lineTo(points[j].right, points[j].y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#5d6674';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var k = 0; k < points.length; k += 1) {
        if (k === 0) {
          ctx.moveTo(points[k].left, points[k].y);
        } else {
          ctx.lineTo(points[k].left, points[k].y);
        }
      }
      for (var m = 0; m < points.length; m += 1) {
        if (m === 0) {
          ctx.moveTo(points[m].right, points[m].y);
        } else {
          ctx.lineTo(points[m].right, points[m].y);
        }
      }
      ctx.stroke();

      ctx.strokeStyle = '#95a0ae';
      ctx.lineWidth = 2;
      ctx.setLineDash([18, 14]);

      for (var lane = 1; lane < state.laneCount; lane += 1) {
        ctx.beginPath();
        for (var n = 0; n < points.length; n += 1) {
          var laneWidth = state.roadWidth / state.laneCount;
          var laneX = points[n].left + laneWidth * lane;
          var dashShift = roadOffset % 32;
          if (n === 0) {
            ctx.moveTo(laneX, points[n].y + dashShift);
          } else {
            ctx.lineTo(laneX, points[n].y + dashShift);
          }
        }
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    function drawTrafficLight() {
      if (!state.trafficLight.active) {
        return;
      }

      var center = roadCenterAt(state.trafficLight.y);
      var poleX = center + (state.roadWidth / 2) + 16;

      ctx.strokeStyle = '#6f7786';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(poleX, state.trafficLight.y + 40);
      ctx.lineTo(poleX, state.trafficLight.y - 35);
      ctx.stroke();

      ctx.fillStyle = '#1c2128';
      ctx.fillRect(poleX - 20, state.trafficLight.y - 62, 40, 54);

      var colors = {
        red: '#2a0b0b',
        yellow: '#2c2609',
        green: '#0c2a12'
      };
      colors[state.trafficLight.state] = {
        red: '#ff5d5d',
        yellow: '#ffd85a',
        green: '#63ff90'
      }[state.trafficLight.state];

      var states = ['red', 'yellow', 'green'];
      for (var i = 0; i < states.length; i += 1) {
        ctx.fillStyle = colors[states[i]];
        ctx.beginPath();
        ctx.arc(poleX, state.trafficLight.y - 52 + i * 16, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (state.trafficLight.state !== 'green') {
        var stopY = state.trafficLight.y + 10;
        var left = roadCenterAt(stopY) - state.roadWidth / 2 + 8;
        var right = roadCenterAt(stopY) + state.roadWidth / 2 - 8;
        ctx.strokeStyle = '#f0f4fb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(left, stopY);
        ctx.lineTo(right, stopY);
        ctx.stroke();
      }
    }

    function drawRoadSign(y, text, color) {
      var center = roadCenterAt(y);
      var signX = center - state.roadWidth / 2 - 32;

      ctx.fillStyle = '#666e79';
      ctx.fillRect(signX + 12, y - 4, 4, 42);
      ctx.fillStyle = color;
      ctx.fillRect(signX - 18, y - 28, 54, 24);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(signX - 18, y - 28, 54, 24);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 10px Space Grotesk, sans-serif';
      ctx.fillText(text, signX - 12, y - 12);
    }

    function drawCar(x, y, width, height, color) {
      ctx.fillStyle = color;
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y - height / 2, width, height, 9);
        ctx.fill();
      } else {
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
      }

      ctx.fillStyle = '#cfd5dc';
      ctx.fillRect(x - width / 2 + 5, y - height / 2 + 8, width - 10, 10);
      ctx.fillRect(x - width / 2 + 8, y + height / 2 - 14, width - 16, 8);
    }

    function drawSensors() {
      var front = nearestObjectInLane(state.laneIndex);
      var signalDistance = lightDistanceAhead();
      var distance = 240;

      if (front) {
        distance = Math.min(distance, Math.max(30, front.distance));
      }
      if (signalDistance !== null && state.trafficLight.state !== 'green') {
        distance = Math.min(distance, Math.max(30, signalDistance));
      }

      var gradient = ctx.createLinearGradient(state.x, state.y - distance, state.x, state.y - 20);
      gradient.addColorStop(0, 'rgba(94, 255, 165, 0.08)');
      gradient.addColorStop(1, 'rgba(94, 255, 165, 0.28)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(state.x - 20, state.y - 10);
      ctx.lineTo(state.x + 20, state.y - 10);
      ctx.lineTo(state.x + 56, state.y - distance);
      ctx.lineTo(state.x - 56, state.y - distance);
      ctx.closePath();
      ctx.fill();
    }

    function drawHUD() {
      ctx.fillStyle = 'rgba(8, 10, 13, 0.75)';
      ctx.fillRect(12, 10, canvas.width - 24, 66);

      ctx.fillStyle = '#f3f6fb';
      ctx.font = '600 14px Space Grotesk, sans-serif';
      ctx.fillText('Autopilot ' + (state.autopilot ? 'ON' : 'OFF') + ' | ' + modeLabel(), 22, 30);
      ctx.fillText(Math.round(state.speed) + ' MPH | ' + state.roadProfileName, 22, 50);

      ctx.fillStyle = '#87f7ff';
      ctx.font = '700 22px Space Grotesk, sans-serif';
      ctx.fillText(String(Math.round(state.speed)), canvas.width - 82, 41);
      ctx.fillStyle = '#d1ecff';
      ctx.font = '600 12px Space Grotesk, sans-serif';
      ctx.fillText('MPH', canvas.width - 80, 58);
    }

    function draw() {
      drawRoad();
      drawTrafficLight();

      if (state.mode === 'highway') {
        drawRoadSign(140, 'I-5 N', '#1f6ccf');
        drawRoadSign(260, 'EXIT 11', '#1f6ccf');
      } else {
        drawRoadSign(165, '35 MPH', '#2f8f46');
      }

      drawSensors();

      for (var i = 0; i < state.objects.length; i += 1) {
        var obj = state.objects[i];
        drawCar(obj.x, obj.y, obj.width, obj.height, obj.color);
      }

      drawCar(state.x, state.y, 36, 64, '#8f959e');
      drawHUD();
    }

    function frame() {
      if (!running) {
        return;
      }

      update(1);
      draw();
      state.frameId = requestAnimationFrame(frame);
    }

    function start() {
      if (running) {
        return;
      }
      running = true;
      setStatus(state.autopilot ? 'Autopilot: Lane centering active' : 'Manual mode');
      frame();
    }

    function pause() {
      running = false;
      if (state.frameId) {
        cancelAnimationFrame(state.frameId);
      }
      setStatus('Paused');
    }

    function onKey(event) {
      if (state.autopilot) {
        return;
      }

      if (event.key === 'ArrowUp') {
        state.targetSpeed = Math.min(maxSpeedForMode(), state.targetSpeed + 4);
      }
      if (event.key === 'ArrowDown') {
        state.targetSpeed = Math.max(0, state.targetSpeed - 4);
      }
      if (event.key === 'ArrowLeft') {
        state.laneIndex = Math.max(0, state.laneIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        state.laneIndex = Math.min(state.laneCount - 1, state.laneIndex + 1);
      }
    }

    if (startBtn) {
      startBtn.addEventListener('click', start);
    }
    if (pauseBtn) {
      pauseBtn.addEventListener('click', pause);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        pause();
        resetSimulation();
      });
    }

    if (cityBtn) {
      cityBtn.addEventListener('click', function () {
        applyMode('city');
        setStatus('Mode: City Streets');
      });
    }

    if (highwayBtn) {
      highwayBtn.addEventListener('click', function () {
        applyMode('highway');
        setStatus('Mode: Highway / Freeway');
      });
    }

    if (roadChangeBtn) {
      roadChangeBtn.addEventListener('click', function () {
        setRandomRoadProfile();
      });
    }

    if (autopilotToggle) {
      autopilotToggle.addEventListener('change', function () {
        state.autopilot = !!autopilotToggle.checked;
        if (state.autopilot) {
          state.targetSpeed = cruiseSpeedForMode();
          setStatus('Autopilot: Lane centering active');
        } else {
          setStatus('Manual mode');
        }
      });
    }

    if (addTrafficBtn) {
      addTrafficBtn.addEventListener('click', function () {
        spawnTraffic(3);
        updateStats();
      });
    }

    if (clearTrafficBtn) {
      clearTrafficBtn.addEventListener('click', function () {
        state.objects = [];
        updateStats();
      });
    }

    window.addEventListener('keydown', onKey);

    applyMode('city');
    setRandomRoadProfile();
    resetSimulation();
    start();
  }

  function initFlightSimulator() {
    var canvas = document.getElementById('flight-canvas');
    if (!canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var startBtn = document.getElementById('flight-start');
    var pauseBtn = document.getElementById('flight-pause');
    var resetBtn = document.getElementById('flight-reset');

    var statusEl = document.querySelector('[data-flight-status]');
    var autopilotEl = document.querySelector('[data-flight-autopilot]');
    var speedEl = document.querySelector('[data-flight-speed]');
    var altitudeEl = document.querySelector('[data-flight-altitude]');
    var trafficEl = document.querySelector('[data-flight-traffic]');
    var nextEl = document.querySelector('[data-flight-next]');

    var running = false;
    var frameId = null;
    var lastTs = 0;

    var state = {
      speedMph: 465,
      altitudeFt: 34000,
      targetAltitude: 34000,
      heading: 0,
      roll: 0,
      pitch: 0,
      spawnMs: 180000,
      spawnTimer: 180000,
      worldScroll: 0,
      planes: []
    };

    function setStatus(text) {
      if (statusEl) {
        statusEl.textContent = text;
      }
    }

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function spawnPlane(distance) {
      state.planes.push({
        x: rand(-600, 600),
        y: rand(1200, 6000),
        z: typeof distance === 'number' ? distance : rand(1200, 6000),
        vx: rand(-8, 8),
        vy: rand(-4, 4),
        vz: rand(120, 190)
      });
    }

    function resetPlanes() {
      state.planes = [];
      spawnPlane(1400);
      spawnPlane(2200);
      spawnPlane(3000);
    }

    function reset() {
      state.speedMph = 465;
      state.altitudeFt = 34000;
      state.targetAltitude = 34000;
      state.heading = 0;
      state.roll = 0;
      state.pitch = 0;
      state.spawnTimer = state.spawnMs;
      state.worldScroll = 0;
      resetPlanes();
      updateStats();
      setStatus('Ready');
      draw();
    }

    function updateStats() {
      if (autopilotEl) {
        autopilotEl.textContent = 'ON';
      }
      if (speedEl) {
        speedEl.textContent = String(Math.round(state.speedMph));
      }
      if (altitudeEl) {
        altitudeEl.textContent = String(Math.round(state.altitudeFt));
      }
      if (trafficEl) {
        trafficEl.textContent = String(state.planes.length);
      }
      if (nextEl) {
        nextEl.textContent = String(Math.max(0, Math.ceil(state.spawnTimer / 1000)));
      }
    }

    function project(point) {
      if (point.z < 40) {
        return null;
      }
      var focal = 360;
      var sx = canvas.width / 2 + (point.x * focal) / point.z;
      var sy = canvas.height * 0.63 - (point.y * focal) / point.z;
      return { x: sx, y: sy, scale: focal / point.z };
    }

    function drawBackground() {
      var gradSky = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.62);
      gradSky.addColorStop(0, '#031a3f');
      gradSky.addColorStop(1, '#1e6bb8');
      ctx.fillStyle = gradSky;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.63);

      var gradGround = ctx.createLinearGradient(0, canvas.height * 0.63, 0, canvas.height);
      gradGround.addColorStop(0, '#6f7e55');
      gradGround.addColorStop(1, '#405134');
      ctx.fillStyle = gradGround;
      ctx.fillRect(0, canvas.height * 0.63, canvas.width, canvas.height * 0.37);

      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      for (var c = 0; c < 7; c += 1) {
        var cloudX = (c * 140 + state.worldScroll * 0.05) % (canvas.width + 180) - 90;
        var cloudY = 40 + ((c % 3) * 25);
        ctx.beginPath();
        ctx.ellipse(cloudX, cloudY, 38, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawRunwayGrid() {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;

      for (var i = 0; i < 12; i += 1) {
        var z = 220 + i * 250 + (state.worldScroll % 250);
        var left = project({ x: -700, y: -2200, z: z });
        var right = project({ x: 700, y: -2200, z: z });
        if (!left || !right) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }

      for (var lane = -3; lane <= 3; lane += 1) {
        var near = project({ x: lane * 180, y: -2200, z: 250 });
        var far = project({ x: lane * 180, y: -2200, z: 3300 });
        if (!near || !far) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(near.x, near.y);
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
      }
    }

    function drawPlaneAt(point, color) {
      var p = project(point);
      if (!p) {
        return;
      }

      var wing = Math.max(4, 42 * p.scale);
      var body = Math.max(2, 30 * p.scale);

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, 2.4 * p.scale + 0.8);

      ctx.beginPath();
      ctx.moveTo(p.x - wing, p.y);
      ctx.lineTo(p.x + wing, p.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.x, p.y - body * 0.65);
      ctx.lineTo(p.x, p.y + body);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.x - wing * 0.4, p.y + body * 0.2);
      ctx.lineTo(p.x + wing * 0.4, p.y + body * 0.2);
      ctx.stroke();
    }

    function drawHUD() {
      ctx.fillStyle = 'rgba(6, 12, 17, 0.7)';
      ctx.fillRect(12, 12, canvas.width - 24, 52);

      ctx.fillStyle = '#d8f3ff';
      ctx.font = '700 14px Space Grotesk, sans-serif';
      ctx.fillText('FLIGHT AP ON', 22, 34);
      ctx.fillText(Math.round(state.speedMph) + ' MPH', 170, 34);
      ctx.fillText(Math.round(state.altitudeFt) + ' FT', 280, 34);
      ctx.fillText('Traffic ' + state.planes.length, 410, 34);
    }

    function drawOwnPlane() {
      var centerX = canvas.width / 2;
      var centerY = canvas.height * 0.68;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(state.roll * 0.015);
      ctx.strokeStyle = '#80ffe0';
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.moveTo(-28, 0);
      ctx.lineTo(28, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(0, 18);
      ctx.stroke();

      ctx.restore();
    }

    function draw() {
      drawBackground();
      drawRunwayGrid();

      for (var i = 0; i < state.planes.length; i += 1) {
        drawPlaneAt(state.planes[i], 'rgba(255, 238, 152, 0.95)');
      }

      drawOwnPlane();
      drawHUD();
    }

    function update(dtMs) {
      var dtSec = dtMs / 1000;
      state.worldScroll += 220 * dtSec;

      var altitudeErr = state.targetAltitude - state.altitudeFt;
      state.pitch += (altitudeErr / 1200 - state.pitch) * 0.04;
      state.altitudeFt += state.pitch * 28;
      state.roll += (Math.sin(state.worldScroll * 0.002) * 6 - state.roll) * 0.08;
      state.heading += state.roll * 0.002;

      state.spawnTimer -= dtMs;
      if (state.spawnTimer <= 0) {
        spawnPlane(3200 + Math.random() * 800);
        state.spawnTimer += state.spawnMs;
        setStatus('Autopilot: New nearby aircraft detected');
      } else {
        setStatus('Autopilot: Holding course and altitude');
      }

      for (var i = state.planes.length - 1; i >= 0; i -= 1) {
        var p = state.planes[i];
        p.x += p.vx * dtSec;
        p.y += p.vy * dtSec;
        p.z -= p.vz * dtSec;

        if (p.z < 70 || Math.abs(p.x) > 1500) {
          state.planes.splice(i, 1);
          spawnPlane(3600 + Math.random() * 1200);
        }
      }

      updateStats();
    }

    function loop(ts) {
      if (!running) {
        return;
      }

      if (!lastTs) {
        lastTs = ts;
      }
      var dt = Math.min(80, ts - lastTs);
      lastTs = ts;

      update(dt);
      draw();
      frameId = requestAnimationFrame(loop);
    }

    function start() {
      if (running) {
        return;
      }
      running = true;
      lastTs = 0;
      setStatus('Autopilot: Holding course and altitude');
      frameId = requestAnimationFrame(loop);
    }

    function pause() {
      running = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      setStatus('Paused');
    }

    if (startBtn) {
      startBtn.addEventListener('click', start);
    }
    if (pauseBtn) {
      pauseBtn.addEventListener('click', pause);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        pause();
        reset();
      });
    }

    reset();
    start();
  }

  function initRobotZone() {
    var cameraVideo = document.getElementById('rps-camera');
    var cameraBtn = document.getElementById('rps-camera-start');
    var resetBtn = document.getElementById('rps-reset');
    var moveButtons = document.querySelectorAll('[data-rps-move]');

    var visionEl = document.querySelector('[data-rps-vision]');
    var userEl = document.querySelector('[data-rps-user]');
    var botEl = document.querySelector('[data-rps-bot]');
    var resultEl = document.querySelector('[data-rps-result]');
    var scoreEl = document.querySelector('[data-rps-score]');

    var chatLog = document.getElementById('oneword-log');
    var chatForm = document.getElementById('oneword-form');
    var chatInput = document.getElementById('oneword-input');

    if (!cameraVideo || !chatLog || !chatForm || !chatInput) {
      return;
    }

    var score = { user: 0, bot: 0 };
    var cameraStream = null;

    function updateScore() {
      if (scoreEl) {
        scoreEl.textContent = 'You ' + score.user + ' - ' + score.bot + ' Robot';
      }
    }

    function setVision(text) {
      if (visionEl) {
        visionEl.textContent = text;
      }
    }

    function winningMoveAgainst(move) {
      if (move === 'rock') {
        return 'paper';
      }
      if (move === 'paper') {
        return 'scissors';
      }
      return 'rock';
    }

    function playRound(userMove) {
      var botMove = winningMoveAgainst(userMove);

      if (userEl) {
        userEl.textContent = userMove;
      }
      if (botEl) {
        botEl.textContent = botMove;
      }
      if (resultEl) {
        resultEl.textContent = 'Robot wins';
      }

      score.bot += 1;
      updateScore();
      setVision(cameraStream ? 'Locked on move: ' + userMove : 'Predictive mode');
    }

    function addChatMessage(text, kind) {
      var line = document.createElement('div');
      line.className = 'chat-msg ' + (kind === 'user' ? 'chat-user' : 'chat-ai');
      line.textContent = text;
      chatLog.appendChild(line);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    function oneWordReply(text) {
      var t = text.toLowerCase();
      if (t.indexOf('hi') !== -1 || t.indexOf('hello') !== -1) {
        return 'Hello';
      }
      if (t.indexOf('mom') !== -1) {
        return 'Proud';
      }
      if (t.indexOf('love') !== -1) {
        return 'Always';
      }
      if (t.indexOf('help') !== -1) {
        return 'Sure';
      }
      if (t.indexOf('autopilot') !== -1 || t.indexOf('sim') !== -1) {
        return 'Epic';
      }
      if (t.indexOf('bye') !== -1) {
        return 'Later';
      }
      var fallback = ['Interesting', 'Nice', 'Wild', 'Okay', 'Focus', 'Solid'];
      return fallback[Math.floor(Math.random() * fallback.length)];
    }

    function resetRps() {
      score.user = 0;
      score.bot = 0;
      if (userEl) {
        userEl.textContent = 'None';
      }
      if (botEl) {
        botEl.textContent = 'None';
      }
      if (resultEl) {
        resultEl.textContent = 'Ready';
      }
      setVision(cameraStream ? 'Online' : 'Offline');
      updateScore();
    }

    if (cameraBtn) {
      cameraBtn.addEventListener('click', function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setVision('Camera unsupported');
          return;
        }

        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            cameraStream = stream;
            cameraVideo.srcObject = stream;
            setVision('Online');
          })
          .catch(function () {
            setVision('Access denied');
          });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', resetRps);
    }

    for (var i = 0; i < moveButtons.length; i += 1) {
      moveButtons[i].addEventListener('click', function () {
        var move = this.getAttribute('data-rps-move');
        playRound(move);
      });
    }

    chatForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var text = chatInput.value.trim();
      if (!text) {
        return;
      }

      addChatMessage('You: ' + text, 'user');
      addChatMessage('Robot: ' + oneWordReply(text), 'bot');
      chatInput.value = '';
    });

    window.addEventListener('beforeunload', function () {
      if (!cameraStream) {
        return;
      }
      var tracks = cameraStream.getTracks();
      for (var i = 0; i < tracks.length; i += 1) {
        tracks[i].stop();
      }
    });

    addChatMessage('Robot: Hello', 'bot');
    resetRps();
  }
})();
