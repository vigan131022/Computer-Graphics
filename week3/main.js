import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(12, 10, 16)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0x75c518, emissive: 0xE8431c, emissiveIntensity: 0.6 })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)
 
//MARS
const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit);

const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xFF0000, roughness: 0.9 })
)
mars.position.x = 9
marsOrbit.add(mars)

const phobosOrbit = new THREE.Object3D()
mars.add(phobosOrbit);

const phobos = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xD9D9D9, roughness: 0.8 })
)
phobos.position.x = 1.2
phobosOrbit.add(phobos)
 //EARTH
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)
 //MOON
const moonOrbit = new THREE.Object3D()
earth.add(moonOrbit);

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xD9D9D9, roughness: 0.8 })
)
moon.position.x = 1.8
moonOrbit.add(moon)

const control = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate)
    control.update()
    earthOrbit.rotation.y += 0.01

    marsOrbit.rotation.y += 0.008
    phobosOrbit.rotation.y += 0.04

    moonOrbit.rotation.y += 0.04
    earth.rotation.y += 0.05

    sun.rotation.y += 0.002

    renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
