import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

let aspect = window.innerWidth / window.innerHeight

// Perspective camera: objects further away look smaller
const perspective = new THREE.PerspectiveCamera(
    75,
    aspect,
    0.1,
    1000
)
perspective.position.set(2, 2, 10)
perspective.lookAt(0, 0, 0)
scene.add(perspective)

// Orthographic camera: objects keep the same size no matter how far away
const size = 8
const orthographic = new THREE.OrthographicCamera(
    -size * aspect,
    size * aspect,
    size,
    -size,
    0.1,
    100
)
orthographic.position.set(0, 0, 10)
orthographic.lookAt(0, 0, 0)

const cameras = [perspective, orthographic]
let current = 0
console.log('Active: Perspective')

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambient = new THREE.AmbientLight(0xffffff, 0.35)
scene.add(ambient)
const dir = new THREE.DirectionalLight(0xffffff, 2.5)
dir.position.set(5, 8, 4)
scene.add(dir)

// Three copies of the model at different depths (z)
const depth = [0, -3, -7]
const colors = [0xff0000, 0x00ff00, 0x0000ff]

// The model is in public/models/, which Vite serves from the root
new PLYLoader().load(
    '/models/3DObject.ply',
    (geo) => {
        geo.center()

        depth.forEach((z, i) => {
            const mesh = new THREE.Mesh(
                geo,
                new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.5 })
            )
            mesh.scale.setScalar(0.02)
            mesh.rotation.x = Math.PI
            mesh.position.x = i * 2
            mesh.position.z = z
            scene.add(mesh)
        })
    },
    undefined,
    (error) => console.error('Could not load 3DObject.ply', error)
)

// Space switches between the perspective and orthographic camera
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault()
        current = (current + 1) % cameras.length
        console.log('Active:', current === 0 ? 'Perspective' : 'Orthographic')
    }
})

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, cameras[current])
}
animate()

// Keep both cameras correct when the window size changes
window.addEventListener('resize', () => {
    aspect = window.innerWidth / window.innerHeight

    perspective.aspect = aspect
    perspective.updateProjectionMatrix()

    orthographic.left = -size * aspect
    orthographic.right = size * aspect
    orthographic.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})
