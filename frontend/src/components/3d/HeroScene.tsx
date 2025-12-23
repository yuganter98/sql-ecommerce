import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
    const earthRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);

    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    ]);

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (earthRef.current) {
            earthRef.current.rotation.y = elapsedTime / 6; // Slow Earth rotation
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = elapsedTime / 5; // Clouds rotate slightly faster
        }
    });

    return (
        <group ref={earthRef} position={[2, 0, 0]} scale={2.5}>
            {/* Earth Sphere */}
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhongMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    specularMap={specularMap}
                    shininess={5}
                />
            </mesh>
            {/* Cloud Layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[1.005, 32, 32]} />
                <meshPhongMaterial
                    map={cloudsMap}
                    transparent={true}
                    opacity={0.8}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

const HeroContent = () => {
    return (
        <>
            {/* Deep Space Background */}
            <color attach="background" args={['#050511']} />
            <fog attach="fog" args={['#050511', 10, 30]} />

            {/* Ambient Light for base illumination */}
            <ambientLight intensity={1} />

            {/* Directional Light (Sun) */}
            <directionalLight position={[5, 3, 5]} intensity={3} />

            {/* Floating Earth */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Earth />
            </Float>

            {/* Intense Starfield */}
            <Stars radius={300} depth={50} count={10000} factor={6} saturation={0} fade speed={1} />


        </>
    );
};

interface ParticleData {
    t: number;
    factor: number;
    speed: number;
    xFactor: number;
    yFactor: number;
    zFactor: number;
    mx: number;
    my: number;
}

const RepulsiveParticles = () => {
    const count = 200;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random initial positions
    const particles = useMemo<ParticleData[]>(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;

        // Mouse position in world space (normalized -1 to 1)
        const { pointer, viewport } = state;
        const mx = (pointer.x * viewport.width) / 2;
        const my = (pointer.y * viewport.height) / 2;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

            // Standard floating movement
            t = particle.t += speed / 2;
            const s = Math.cos(t);

            // Base position
            let x = (particle.mx += (mx - particle.mx) * 0.01) + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
            let y = (particle.my += (my - particle.my) * 0.01) + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
            let z = zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

            // Repulsion Logic -> Calculate distance from mouse ray
            // Simple 2D repulsion for "screen space" feel or 3D if fully projected
            // For efficiency, we just use raw cursor x/y vs particle x/y in rough world units
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 4;

            if (dist < repulsionRadius) {
                const force = (repulsionRadius - dist) / repulsionRadius; // 0 to 1
                const angle = Math.atan2(dy, dx);
                const push = force * 2; // Strength

                x += Math.cos(angle) * push;
                y += Math.sin(angle) * push;
            }

            // Update dummy object
            dummy.position.set(x, y, z);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            // Apply to instance
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshPhongMaterial color="#818cf8" emissive="#4f46e5" toneMapped={false} />
        </instancedMesh>
    );
};

const HeroScene = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]} // Handle high-DPI screens
            >
                <Suspense fallback={null}>
                    <HeroContent />
                </Suspense>

                {/* Allow mouse interaction but restrict it to keep the view clean */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2 + 0.2}
                    minPolarAngle={Math.PI / 2 - 0.2}
                />
            </Canvas>
        </div>
    );
};

export default HeroScene;
