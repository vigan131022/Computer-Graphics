import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100)
camera.position.set(0,5,9)

const renderer = new THREE.WebGLRenderer({antialias:true });
renderer.setSize(innerWidth,innerHeight)

document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.5 ))
const sun = new THREE.DirectionalLight(0xffffff, 3)
sun.position.set(4,6,5)
scene.add(sun)

scene.add(new THREE.GridHelper(20, 20))


const controls = new OrbitControls(camera, renderer.domElement)

// TODO 1: different shapes, colors and sizes
const shapes = [
  { geometry: new THREE.BoxGeometry(1,1,1),             color: 0xff4444, size: 1 },
  { geometry: new THREE.SphereGeometry(0.5,32,16),      color: 0x44ff44, size: 1.2 },
  { geometry: new THREE.ConeGeometry(0.5,1,32),         color: 0x4488ff, size: 1.4 },
  { geometry: new THREE.CylinderGeometry(0.5,0.5,1,32), color: 0xffcc00, size: 0.8 },
  { geometry: new THREE.TorusGeometry(0.4,0.15,16,48),  color: 0xff66cc, size: 1.2 },
  { geometry: new THREE.DodecahedronGeometry(0.5),      color: 0x00cccc, size: 1 },
]

const pickables = []

for(let i=0;i<shapes.length;i++){
  const shape = shapes[i]
  const material = new THREE.MeshStandardMaterial({color:shape.color})
  const mesh = new THREE.Mesh(shape.geometry, material)
  mesh.name = 'Objekti' + (i+1)

  // Distance from the centre to the bottom of the shape, so it stands on the floor
  shape.geometry.computeBoundingBox()
  mesh.userData.halfHeight = -shape.geometry.boundingBox.min.y

  mesh.scale.setScalar(shape.size)
  mesh.position.set(-7.5+i*3, mesh.userData.halfHeight*shape.size, 0)

  // TODO 2: remember the starting position AND scale for the reset button
  mesh.userData.startPosition = mesh.position.clone()
  mesh.userData.startScale = mesh.scale.clone()

  scene.add(mesh)
  pickables.push(mesh)
}

const pointer = new THREE.Vector2();

// Pixel position of the mouse -> NDC (x and y from -1 to 1)
function updatePointer(event){
  const rect = renderer.domElement.getBoundingClientRect()
  const px = event.clientX - rect.left
  const py = event.clientY - rect.top

  const W = rect.width
  const H = rect.height

  pointer.x=(2*px)/W-1
  pointer.y=1-(2*py)/H
  return pointer
}

let selected = null;
let hovered = null;
let dragging = false;
const raycaster = new THREE.Raycaster();

const settings = {
  hoverHighlight: true,
  scale: 1,
  background: '#000000',
  resetObjects(){
    // TODO 2: put back both the position and the scale of every object
    for(const mesh of pickables){
      mesh.position.copy(mesh.userData.startPosition)
      mesh.scale.copy(mesh.userData.startScale)
    }
    if(selected){
      selected.material.emissive.setHex(0x000000)
      selected = null
    }
  }
}

// Grey glow on the object under the mouse (the selected one stays orange)
function setHovered(object){
  if(hovered && hovered !== selected){
    hovered.material.emissive.setHex(0x000000)
  }
  hovered = object
  if(hovered && hovered !== selected){
    hovered.material.emissive.setHex(0x333333)
  }
}

renderer.domElement.addEventListener('pointerdown',(event)=>{
  raycaster.setFromCamera(updatePointer(event),camera)
  const hits = raycaster.intersectObjects(pickables)
  if(selected){
    selected.material.emissive.setHex(0x000000)
  }
  selected = hits.length>0?hits[0].object :null;
  if(selected){
    selected.material.emissive.setHex(0x882200)
    dragging = true
    controls.enabled = false

    // Show the size of the clicked object on the scale slider
    settings.scale = selected.scale.x
    scaleController.updateDisplay()
  }
})

renderer.domElement.addEventListener('pointerup',()=>{
  dragging = false
  controls.enabled = true
})

const plane = new THREE.Plane(new THREE.Vector3(0,1,0), 0)
const intersect = new THREE.Vector3()
renderer.domElement.addEventListener('pointermove',(event)=>{
  raycaster.setFromCamera(updatePointer(event), camera)

  if(dragging){
    if(raycaster.ray.intersectPlane(plane, intersect)){
      selected.position.x = intersect.x;
      selected.position.z = intersect.z;
    }
    return
  }

  if(settings.hoverHighlight){
    const hits = raycaster.intersectObjects(pickables)
    setHovered(hits.length>0?hits[0].object :null)
  }
})

const gui = new GUI()
gui.add(settings, 'hoverHighlight').name('Hover highlight').onChange((on)=>{
  if(!on){
    setHovered(null)
  }
})

// Changes the size of the selected object (the reset button puts it back)
const scaleController = gui.add(settings, 'scale', 0.3, 3, 0.1).name('Selected scale').onChange((value)=>{
  if(selected){
    selected.scale.setScalar(value)
    selected.position.y = selected.userData.halfHeight*value
  }
})

// TODO 3: change the background color of the scene
gui.addColor(settings, 'background').name('Background').onChange((value)=>{
  scene.background.set(value)
})

gui.add(settings, 'resetObjects').name('Reset objects')


function loop(){
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene,camera)
}
loop()
