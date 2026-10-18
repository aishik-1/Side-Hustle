import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ActiveTab } from '../types';
import { 
  ArrowUpRight, 
  Receipt, 
  Camera, 
  MapPin, 
  TrendingUp, 
  Calculator, 
  MessageSquare,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { 
  createBitcoinFaceTexture, 
  createBitcoinBumpTexture, 
  createReededEdgeTexture 
} from '../utils/coinTextures';
import { TechAndWorkflowDeepDive } from './TechAndWorkflowDeepDive';

interface SuperlocalHero3DProps {
  onSelectModule: (tab: ActiveTab) => void;
  receiptCount: number;
}

interface FloatingNode {
  id: ActiveTab;
  title: string;
  subtitle: string;
  category: string;
  icon: any;
  x: number;
  y: number;
  size: number;
  imageTag?: string;
}

const NODES: FloatingNode[] = [
  {
    id: 'receipts',
    title: 'Receipts',
    subtitle: 'Private on-device ledger',
    category: 'Finance',
    icon: Receipt,
    x: -160,
    y: -90,
    size: 78,
    imageTag: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'listings',
    title: 'Listings',
    subtitle: 'Descriptions & photos',
    category: 'Commerce',
    icon: Camera,
    x: 150,
    y: -80,
    size: 84,
    imageTag: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'maps-radar',
    title: 'Venues',
    subtitle: 'Markets & pop-up spaces',
    category: 'Locations',
    icon: MapPin,
    x: -180,
    y: 70,
    size: 80,
    imageTag: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'search-trends',
    title: 'Trends',
    subtitle: 'Market demand & fees',
    category: 'Research',
    icon: TrendingUp,
    x: 170,
    y: 80,
    size: 74,
    imageTag: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'economics',
    title: 'Economics',
    subtitle: 'Margins & break-even',
    category: 'Analysis',
    icon: Calculator,
    x: 0,
    y: -155,
    size: 72,
    imageTag: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'chatbot',
    title: 'Advisor',
    subtitle: 'Strategy & pricing copilot',
    category: 'Advisory',
    icon: MessageSquare,
    x: 0,
    y: 155,
    size: 76,
    imageTag: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=160&auto=format&fit=crop&q=80',
  },
];

export const SuperlocalHero3D: React.FC<SuperlocalHero3DProps> = ({
  onSelectModule,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<FloatingNode | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // Dynamic metallic lighting for realistic coin reflections
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3d6, 3.2);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const goldSpecularLight = new THREE.DirectionalLight(0xfef08a, 2.5);
    goldSpecularLight.position.set(-6, -3, 5);
    scene.add(goldSpecularLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.0);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    // 3D Bitcoin Medallion Group
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);

    // Generate procedural high-res textures
    const faceTexture = createBitcoinFaceTexture();
    const bumpTexture = createBitcoinBumpTexture();
    const { map: reededMap, bumpMap: reededBump } = createReededEdgeTexture();

    // Thick real coin geometry: Cylinder with 128 radial segments, height: 0.46
    const coinRadius = 1.85;
    const coinThickness = 0.46;
    const coinGeom = new THREE.CylinderGeometry(
      coinRadius,
      coinRadius,
      coinThickness,
      128,
      1,
      false
    );

    // Edge (reeded / milled vertical grooves) material
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      map: reededMap,
      bumpMap: reededBump,
      bumpScale: 0.06,
      roughness: 0.32,
      metalness: 0.94,
    });

    // Front face material with embossed "SIDE HUSTLE" and dual-stripe monogram
    const frontMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      map: faceTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.08,
      roughness: 0.25,
      metalness: 0.92,
    });

    // Back face material
    const backMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      map: faceTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.08,
      roughness: 0.25,
      metalness: 0.92,
    });

    // In Three.js CylinderGeometry: Index 0 is side, Index 1 is top face (+Y), Index 2 is bottom face (-Y)
    const coinMesh = new THREE.Mesh(coinGeom, [edgeMat, frontMat, backMat]);
    coinMesh.rotation.x = Math.PI / 2; // Face forward
    coinGroup.add(coinMesh);

    // Raised outer beveled collars (Torus rims) for genuine 3D bullion edge relief
    const rimRadius = coinRadius - 0.04;
    const rimThickness = 0.05;
    const rimGeom = new THREE.TorusGeometry(rimRadius, rimThickness, 24, 96);
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.2,
      metalness: 0.96,
    });

    const frontRim = new THREE.Mesh(rimGeom, goldRimMat);
    frontRim.position.z = coinThickness / 2 + 0.01;
    coinGroup.add(frontRim);

    const backRim = new THREE.Mesh(rimGeom, goldRimMat);
    backRim.position.z = -coinThickness / 2 - 0.01;
    coinGroup.add(backRim);

    // Warm floating ambient orbs
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const orbColors = [0xf3b89b, 0xe08b64, 0xfce5d4, 0xd4774e, 0xdfc2a8];
    const orbMeshes: THREE.Mesh[] = [];

    orbColors.forEach((color, i) => {
      const orbGeom = new THREE.SphereGeometry(0.2 + (i % 3) * 0.06, 32, 32);
      const orbMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.25,
        metalness: 0.35,
        transparent: true,
        opacity: 0.85,
      });
      const orb = new THREE.Mesh(orbGeom, orbMat);
      const angle = (i / orbColors.length) * Math.PI * 2;
      const radius = 2.45 + (i % 2) * 0.35;
      orb.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.2);
      orbGroup.add(orb);
      orbMeshes.push(orb);
    });

    // Parallax, Drag, and Scroll-Driven Spin Dynamics
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let scrollVelocity = 0;

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        dragVelocityX = deltaX * 0.012;
        dragVelocityY = deltaY * 0.012;
        coinGroup.rotation.y += dragVelocityX;
        coinGroup.rotation.x += dragVelocityY;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Scroll feature: scrolling accelerates coin rotation
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaScroll = currentScrollY - lastScrollY;
      scrollVelocity += deltaScroll * 0.008;
      lastScrollY = currentScrollY;
    };

    const handleWheel = (e: WheelEvent) => {
      scrollVelocity += e.deltaY * 0.0025;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: true });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Continuous rotation + scroll acceleration + drag momentum
      const baseRotationSpeed = 0.55;
      coinGroup.rotation.y += (baseRotationSpeed + scrollVelocity) * delta;
      coinGroup.rotation.x += dragVelocityY * 0.92;

      // Dampen scroll and drag velocities
      scrollVelocity *= 0.94;
      dragVelocityX *= 0.92;
      dragVelocityY *= 0.92;

      // Subtle natural tilt
      if (!isDragging) {
        coinGroup.rotation.x = THREE.MathUtils.damp(
          coinGroup.rotation.x,
          mouseY * 0.35 + Math.sin(clock.getElapsedTime() * 0.8) * 0.05,
          3,
          delta
        );
      }
      coinGroup.rotation.z = Math.sin(clock.getElapsedTime() * 0.6) * 0.05;

      // Ambient orbs
      orbGroup.rotation.z -= delta * 0.18;
      orbMeshes.forEach((mesh, idx) => {
        mesh.position.y += Math.sin(clock.getElapsedTime() * 1.8 + idx) * 0.0025;
      });

      // Camera parallax
      camera.position.x = THREE.MathUtils.damp(camera.position.x, mouseX * 0.5, 3, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, -mouseY * 0.35, 3, delta);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coinGeom.dispose();
      rimGeom.dispose();
      edgeMat.dispose();
      frontMat.dispose();
      backMat.dispose();
      goldRimMat.dispose();
      faceTexture.dispose();
      bumpTexture.dispose();
      reededMap.dispose();
      reededBump.dispose();
    };
  }, []);

  const scrollToWorkflowSection = () => {
    const el = document.getElementById('tech-workflow-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full flex flex-col justify-between select-none">
      {/* Central 3D Bitcoin Medallion Viewport */}
      <div className="relative w-full min-h-[88vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Three.js canvas container */}
        <div 
          ref={mountRef} 
          className="absolute inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing" 
          title="Drag to spin 3D coin • Scroll mouse to rotate"
        />

        {/* Floating circular module nodes */}
        <div className="relative z-10 w-full max-w-4xl h-[470px] pointer-events-none flex items-center justify-center">
          {NODES.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                onClick={() => onSelectModule(node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="absolute pointer-events-auto cursor-pointer group transition-all duration-300 hover:scale-108 active:scale-95"
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                }}
              >
                {/* Circular image vignette disc */}
                <div 
                  className="rounded-full overflow-hidden border-2 border-stone-100 shadow-[0_6px_20px_rgba(70,50,40,0.12)] relative flex items-center justify-center bg-stone-200 group-hover:border-[#d97346] transition-all"
                  style={{ width: `${node.size}px`, height: `${node.size}px` }}
                >
                  {node.imageTag ? (
                    <img
                      src={node.imageTag}
                      alt={node.title}
                      className="w-full h-full object-cover saturate-90 group-hover:saturate-110 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f4ebe1] flex items-center justify-center text-stone-700">
                      <Icon className="w-6 h-6" />
                    </div>
                  )}

                  {/* Gentle hover overlay */}
                  <div className="absolute inset-0 bg-[#d97346]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-white drop-shadow" />
                  </div>
                </div>

                {/* Floating minimal label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap opacity-85 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] font-medium tracking-tight bg-white/95 text-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200 shadow-sm block text-center">
                    {node.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Information Tooltip */}
        {hoveredNode && (
          <div className="absolute bottom-16 z-20 pointer-events-none bg-white/95 text-stone-800 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 shadow-[0_6px_24px_rgba(40,30,20,0.08)] flex items-center gap-2.5 transition">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#c86438] font-semibold">
              {hoveredNode.category}
            </span>
            <span className="text-xs font-bold text-stone-900">
              {hoveredNode.title}
            </span>
            <span className="text-xs text-stone-500">
              • {hoveredNode.subtitle}
            </span>
          </div>
        )}

        {/* Scroll Feature & Cue Button */}
        <div className="absolute bottom-4 z-10 flex flex-col items-center pointer-events-auto">
          <button
            onClick={scrollToWorkflowSection}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 text-xs font-medium border border-stone-200/90 shadow-sm transition cursor-pointer backdrop-blur-md animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d97346]" />
            <span>Scroll to see How People Work & How Technology Works</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
          </button>
        </div>
      </div>

      {/* Comprehensive How People Work & How Technology Works Section */}
      <TechAndWorkflowDeepDive onSelectModule={onSelectModule} />
    </div>
  );
};
