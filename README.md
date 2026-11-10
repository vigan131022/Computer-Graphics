# Computer Graphics – Lab Exercises

Weekly three.js lab exercises.

| Week | Topic |
|------|-------|
| [week1](week1) | Hello three.js: scene, camera, renderer, lights, rotating cube and sphere |
| [week2](week2) | Vectors: a, b, a + b, dot product, cross product and angle, editable with lil-gui |
| [week3](week3) | Solar system: scene-graph hierarchy (Sun, Earth + Moon, Mars + Phobos) |
| [week4](week4) | Robotic arm: hierarchical transforms, controlled with Q/A, W/S, E/D |
| [week5](week5) | Custom BufferGeometry (indexed vs. non-indexed, press F) and loading a GLB model |
| [week6](week6) | Perspective vs. orthographic camera with a PLY model at three depths (press Space to switch) |
| [week7](week7) | Raycasting: click to select and drag different shapes over the floor; lil-gui hover toggle, scale slider, background color and reset (position + scale) |

## How to run

Each week is a separate Vite project:

```bash
cd week1
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

In week 5, `index.html` loads the GLB model (`glb.js`). To see the custom geometry instead, change the script in `index.html` to `main.js`.
