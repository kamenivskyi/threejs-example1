import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';

import './App.css';

extend({ OrbitControls }); // for supporting

const Car = () => {
  const [model, setModel] = useState();

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = () => {
    new GLTFLoader().load('./scene.gltf', setModel);
  };

  return model ? <primitive object={model.scene} /> : null;
};

const Controls = () => {
  const orbitRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    orbitRef.current.update(); //for moving camera
  });

  return (
    <orbitControls
      autoRotate
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  );
};

const Plane = () => (
  <mesh
    penumbra={1}
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -0.5, 0]}
    receiveShadow
  >
    <planeBufferGeometry attach='geometry' args={[100, 100]} />
    <meshPhysicalMaterial attach='material' color='white' />
  </mesh>
);

// planeBufferGeometry args: [width, height]

// receiveShadow and castShadow and  onCreated={({ gl }) => {
//   gl.shadowMap.enabled = true;
//   gl.shadowMap.type = THREE.PCFSoftShadowMap;
// }} func are for shadows and all related

// Turns values into animated-values.

// useFrame(() => {
//   meshRef.current.rotation.y += 0.01;
//   meshRef.current.rotation.x += 0.01;
// }); // Render animation loop
const Box = () => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const { scale, color } = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: hovered ? 'cyan' : 'gray',
  });

  return (
    <a.mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={scale}
      onClick={() => setActive((prev) => !prev)}
      castShadow
    >
      {/* <ambientLight /> */}
      {/* <spotLight color='yellow' position={[0, 5, 10]} castShadow /> */}
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      {/* args={[width, height, depth]}: size */}
      <a.meshPhysicalMaterial attach='material' color={color} />
      {/* <a.meshBasicMaterial attach='material' color={color} /> without lightning and it's don't using <ambientLight /> and <spotLight /> */}
    </a.mesh>
  );
};

{
  /* <a.mesh /> // if we don't need to animate we say simply: mesh  */
}

function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <ambientLight />
      <spotLight color='yellow' position={[0, 5, 10]} castShadow />
      <fog attach='fog' args={['white', 5, 15]} />
      <Controls />
      {/* <Plane /> */}
      {/* <Box /> */}
      <Car />
    </Canvas>
  );

  //in onCreated func we telling three js that we need to create shadows
}
export default App;
