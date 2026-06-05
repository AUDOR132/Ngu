import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { SimulationConfig } from '../types';

interface WebGLCanvasProps {
  config: SimulationConfig;
  onHover: (isHovering: boolean) => void;
  onPop: (color: string) => void;
  popVolume: number; // 0 to 1
}

// Map color schemes to nice hex values
const COLOR_SCHEME_MAP = {
  default: [0xFF3366, 0x33CCFF, 0xFFCC00, 0x9933FF, 0x00FF66, 0xFF6600],
  pastel: [0xE9D5FF, 0xFEE2E2, 0xCFFAFE, 0xECFDF5, 0xFEF3C7],
  monochrome: [0x27272A, 0x52525B, 0xE4E4E7, 0x18181B, 0xD4D4D8],
  neon: [0xFF0055, 0x33CCFF, 0xFFCC00, 0x9933FF, 0x00FF66],
  sunset: [0xF97316, 0xEC4899, 0xEAB308, 0xEF4444, 0xF43F5E]
};

export default function WebGLCanvas({ config, onHover, onPop, popVolume }: WebGLCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Keep refs of updated props to access them inside the anim loop without re-triggering useEffect
  const configRef = useRef(config);
  configRef.current = config;
  
  const popVolumeRef = useRef(popVolume);
  popVolumeRef.current = popVolume;

  const onPopRef = useRef(onPop);
  onPopRef.current = onPop;

  // Web Audio Context for synthesizer sounds
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // --- 1. SETUP THREE.JS SCENE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFDFBF7);
    scene.fog = new THREE.FogExp2(0xFDFBF7, 0.015);

    // --- 2. CAMERA ---
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;
    camera.position.y = 2;

    // --- 3. RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- 4. LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.6);
    rimLight.position.set(-15, 10, -10);
    scene.add(rimLight);

    // Dynamic blue atmospheric fill light
    const fillLight = new THREE.DirectionalLight(0xbfdbfe, 0.3);
    fillLight.position.set(-10, -10, 10);
    scene.add(fillLight);

    // --- 5. AUDIO SYNTHESIZER ---
    const playPopSynth = (pitchModifier = 1) => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        // Base juicy FM sweep pitch
        const baseHz = (140 + Math.random() * 120) * pitchModifier;
        const endHz = (800 + Math.random() * 400) * pitchModifier;

        osc.frequency.setValueAtTime(baseHz, now);
        osc.frequency.exponentialRampToValueAtTime(endHz, now + 0.07);

        gainNode.gain.setValueAtTime(popVolumeRef.current * 0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        osc.type = 'triangle';
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (err) {
        console.warn('Synth playback bypassed:', err);
      }
    };

    // --- 6. BALLOON SCHEMAS ---
    const balloonGeo = new THREE.SphereGeometry(1, 32, 32);
    balloonGeo.scale(1, 1.25, 1); // Oval stretch
    
    const knotGeo = new THREE.CylinderGeometry(0.12, 0.22, 0.25, 16);

    let balloonsGroup: THREE.Group[] = [];
    let interactableMeshes: THREE.Mesh[] = [];

    // Particle manager for popping explodes
    const particles: THREE.Mesh[] = [];
    const particleGeo = new THREE.SphereGeometry(0.09, 8, 8);

    const createExplosion = (pos: THREE.Vector3, color: THREE.Color) => {
      const count = 15;
      const pMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.95 });

      for (let i = 0; i < count; i++) {
        const particle = new THREE.Mesh(particleGeo, pMat);
        particle.position.copy(pos);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = 0.2 + Math.random() * 0.45;

        particle.userData = {
          vx: speed * Math.sin(phi) * Math.cos(theta),
          vy: speed * Math.sin(phi) * Math.sin(theta),
          vz: speed * Math.cos(phi),
          life: 1.0
        };

        scene.add(particle);
        particles.push(particle);
      }
    };

    const resetBalloonPosition = (group: THREE.Group, isInitialSetup = false) => {
      const cfg = configRef.current;
      const xRange = 26;
      const zRange = 16;
      
      const x = (Math.random() - 0.5) * xRange;
      const z = (Math.random() - 0.5) * zRange - 2;
      let y = 0;

      if (cfg.gravity === 'up') {
        y = isInitialSetup ? (Math.random() - 0.5) * 20 : -14;
      } else if (cfg.gravity === 'down') {
        y = isInitialSetup ? (Math.random() - 0.5) * 20 : 14;
      } else {
        // Drift sideways
        y = (Math.random() - 0.5) * 14;
        group.position.x = isInitialSetup ? (Math.random() - 0.5) * xRange : -xRange / 2 - 2;
      }

      group.position.set(cfg.gravity === 'drift' ? group.position.x : x, y, z);
      group.scale.set(1, 1, 1);
      group.visible = true;
      group.userData.isPopping = false;
    };

    // Rebuild balloon arrays based on active settings
    const buildBalloons = () => {
      // Clear existing
      balloonsGroup.forEach(g => scene.remove(g));
      balloonsGroup = [];
      interactableMeshes = [];

      const cfg = configRef.current;
      const colors = COLOR_SCHEME_MAP[cfg.colorScheme] || COLOR_SCHEME_MAP.default;

      for (let i = 0; i < cfg.count; i++) {
        const group = new THREE.Group();
        const hexColor = colors[i % colors.length];

        const mat = new THREE.MeshPhysicalMaterial({
          color: hexColor,
          metalness: cfg.metalness,
          roughness: cfg.glossiness,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          transmission: cfg.transmission,
          thickness: cfg.transmission > 0 ? 0.6 : 0,
          ior: 1.35
        });

        // Balloon core
        const body = new THREE.Mesh(balloonGeo, mat);
        body.castShadow = true;
        body.receiveShadow = true;
        body.userData = { parentGroup: group, isBody: true };
        group.add(body);

        // Tie knot
        const knot = new THREE.Mesh(knotGeo, mat);
        knot.position.y = -1.3;
        knot.rotation.x = Math.PI / 2;
        knot.castShadow = true;
        group.add(knot);

        // Floating behavior parameters
        group.userData = {
          speedY: (0.015 + Math.random() * 0.03) * cfg.speed,
          speedX: (0.01 + Math.random() * 0.02) * cfg.speed,
          wobbleSpeed: 0.012 + Math.random() * 0.015,
          wobbleAmount: 0.04 + Math.random() * 0.04,
          timeOffset: Math.random() * Math.PI * 2,
          isPopping: false,
          color: hexColor
        };

        resetBalloonPosition(group, true);
        scene.add(group);
        balloonsGroup.push(group);
        interactableMeshes.push(body);
      }
    };

    buildBalloons();

    // --- 7. RESIZING WATCH ---
    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // --- 8. MOUSE & CURSOR PHYSICS COLLIDERS ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMouse(e.clientX, e.clientY);
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableMeshes);
      
      if (intersects.length > 0) {
        onHover(true);
      } else {
        onHover(false);
      }
    };

    const popBalloon = (balloonGroup: THREE.Group, hitMesh: THREE.Mesh) => {
      if (balloonGroup.userData.isPopping) return;
      balloonGroup.userData.isPopping = true;
      
      onHover(false);

      // Web Audio Synth high pitch if balloon is smaller, low pitch if bigger
      const currentScale = balloonGroup.scale.x;
      const pitchModifier = 1.0 / currentScale;
      playPopSynth(pitchModifier);

      // Callback to React layout (e.g., custom trigger flashes or logs)
      const colorHexStr = `#${(hitMesh.material as THREE.MeshPhysicalMaterial).color.getHexString()}`;
      onPopRef.current(colorHexStr);

      // GSAP Expansion Pop
      gsap.to(balloonGroup.scale, {
        x: 1.6,
        y: 1.6,
        z: 1.6,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          balloonGroup.visible = false;
          
          const worldPos = new THREE.Vector3();
          balloonGroup.getWorldPosition(worldPos);
          createExplosion(worldPos, (hitMesh.material as THREE.MeshPhysicalMaterial).color);

          // Reset balloon in background after shorter interval
          setTimeout(() => {
            resetBalloonPosition(balloonGroup);
          }, 1500);
        }
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      updateMouse(e.clientX, e.clientY);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const gp = clickedMesh.userData.parentGroup;
        if (gp) popBalloon(gp, clickedMesh);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      updateMouse(touch.clientX, touch.clientY);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const gp = clickedMesh.userData.parentGroup;
        if (gp) popBalloon(gp, clickedMesh);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });

    // --- 9. RENDER LOOP ---
    const clock = new THREE.Clock();
    let frameId: number;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const elapsedTime = clock.getElapsedTime();
      const cfg = configRef.current;

      // Move balloons
      balloonsGroup.forEach(group => {
        if (!group.userData.isPopping && group.visible) {
          const wobble = Math.sin(elapsedTime * 8 * group.userData.wobbleSpeed + group.userData.timeOffset) * group.userData.wobbleAmount;
          
          if (cfg.gravity === 'up') {
            group.position.y += group.userData.speedY;
            group.position.x += wobble;
            if (group.position.y > 15) resetBalloonPosition(group);
          } else if (cfg.gravity === 'down') {
            group.position.y -= group.userData.speedY;
            group.position.x += wobble;
            if (group.position.y < -15) resetBalloonPosition(group);
          } else {
            // drifting sideways
            group.position.x += group.userData.speedX;
            group.position.y += wobble * 0.5; // less vertical wobble during side glide
            if (group.position.x > 18) resetBalloonPosition(group);
          }
          
          // Gentle rotation matching the hover/sway
          group.rotation.z = Math.sin(elapsedTime * 4 * group.userData.wobbleSpeed) * 0.08;
          group.rotation.y = Math.cos(elapsedTime * 2 * group.userData.wobbleSpeed) * 0.05;
        }
      });

      // Move particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;
        p.position.z += p.userData.vz;

        p.userData.vy -= 0.0075; // gravity pull
        p.userData.life -= 0.024;

        p.scale.setScalar(Math.max(0, p.userData.life));

        if (p.userData.life <= 0) {
          scene.remove(p);
          (p.material as THREE.MeshBasicMaterial).dispose();
          particles.splice(i, 1);
        }
      }

      // Smooth camera parallax
      const targetCamX = mouse.x * 3.5;
      const targetCamY = 2 + mouse.y * 2.2;
      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.lookAt(0, 2, -2);

      renderer.render(scene, camera);
    };

    tick();

    // Trigger update if variables change
    const updateMaterialsAndCount = () => {
      buildBalloons();
    };

    // Watch config changes
    container.setAttribute('data-config-watch', JSON.stringify(config));
    updateMaterialsAndCount();

    // --- 10. UNMOUNT CLEANUP ---
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);

      // Dispose resources
      balloonsGroup.forEach(g => {
        g.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        scene.remove(g);
      });

      particles.forEach(p => {
        p.geometry.dispose();
        if (Array.isArray(p.material)) {
          p.material.forEach(m => m.dispose());
        } else {
          p.material.dispose();
        }
        scene.remove(p);
      });

      balloonGeo.dispose();
      knotGeo.dispose();
      particleGeo.dispose();
      renderer.dispose();
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [config.colorScheme, config.count, config.glossiness, config.metalness, config.transmission, config.gravity, config.speed]);

  return (
    <div 
      ref={containerRef} 
      id="webgl-container" 
      className="absolute inset-0 z-0 h-full w-full outline-hidden"
    />
  );
}
