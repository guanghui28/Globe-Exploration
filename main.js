import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

const canvasContainer = document.getElementById("canvasContainer");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	canvasContainer.offsetWidth / canvasContainer.offsetHeight,
	0.1,
	1000
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: document.getElementById("myCanvas"),
});
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// create the sphere
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(5, 50, 50),
	new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		uniforms: {
			globeTexture: {
				value: new THREE.TextureLoader().load("./earth-img.jpg"),
			},
		},
	})
);

// create atmosphere
const atmosphere = new THREE.Mesh(
	new THREE.SphereGeometry(5, 50, 50),
	new THREE.ShaderMaterial({
		vertexShader: atmosphereVertexShader,
		fragmentShader: atmosphereFragmentShader,
		blending: THREE.AdditiveBlending,
		side: THREE.BackSide,
	})
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
	color: 0xffffff,
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
	const x = (Math.random() - 0.5) * 2000;
	const y = (Math.random() - 0.5) * 2000;
	const z = -Math.random() * 2000;
	starVertices.push(x, y, z);
}

starGeometry.setAttribute(
	"position",
	new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const mouse = {
	x: undefined,
	y: undefined,
	pressed: false,
};

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	sphere.rotation.y += 0.005;
	sphere.rotation.x += 0.002;
	// if (mouse.pressed) {
	gsap.to(group.rotation, {
		x: -mouse.y,
		y: mouse.x,
		duration: 1,
	});
	// }
}

animate();

window.addEventListener("mousemove", (e) => {
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
// window.addEventListener("mousedown", (e) => {
// 	mouse.pressed = true;
// });
// window.addEventListener("mouseup", (e) => {
// 	mouse.pressed = false;
// });
