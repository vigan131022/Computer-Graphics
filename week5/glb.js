import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(5 ,8 ,4)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const dir = new THREE.DirectionalLight(0xffffff, 2.5)
dir.position.set(5,8,5)
scene.add(dir, ambientLight)

const loader = new GLTFLoader();
// Files in Vite's public/ folder are served from the root, so the URL is /modeli.glb
loader.load(
  '/modeli.glb',
  (gltf) => {
    scene.add(gltf.scene)
  },
  undefined,
  (error) => console.error('Could not load modeli.glb', error)
);


function animate(){
  requestAnimationFrame(animate)
  control.update()
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})