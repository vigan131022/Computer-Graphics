import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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
scene.add(ambientLight)

const dir = new THREE.DirectionalLight(0xffffff, 2.5)
dir.position.set(5,8,5)
scene.add(dir)

const position = new Float32Array([
  0,1.5,0,
  0,-1.5,0,
  1,0,0,
  0,0,1,
  -1,0,0,
  0,0,-1,

])

const index = [
  0,3,2,
  0,4,3,
  0,5,4,
  0,2,5, // 4 faqe lart
  1,2,3,
  1,3,4,
  1,4,5,
  1,5,2, // 4 faqe posht
]

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
geometry.setIndex(index);
geometry.computeVertexNormals();

const mesh = new THREE.Mesh(geometry,
  new THREE.MeshStandardMaterial({color:0x66aaff,roughness:0.4})
)
scene.add(mesh)

const nonIndex = geometry.toNonIndexed();
nonIndex.computeVertexNormals()

console.log('kulme', geometry.attributes.position.count, 'faqe', index.length/3, 'e indeksuar')
console.log('kulme', nonIndex.attributes.position.count, 'faqe', index.length/3, 'jo e indeksuar')

window.addEventListener('keydown',(e)=>{
  if(e.key === 'f')
  {
    mesh.geometry = mesh.geometry === geometry ? nonIndex : geometry
  }
})


function animate(){
  requestAnimationFrame(animate)
  control.update()
  mesh.rotation.y+=0.005
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})