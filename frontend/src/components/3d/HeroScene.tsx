import { useRef, Suspense } from 'react';
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
