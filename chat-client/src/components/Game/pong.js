// import * as THREE from "three";
const THREE = require("three") 
function Pong(){
    const init = () => {
        var scene = new THREE.Scene();

        // CAMERA
        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // RENDER
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);


        // OBJECTS
        var geometry = new THREE.SphereGeometry(5, 32, 32);
        var material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        var sphere = new THREE.Mesh(geometry, material);
        // controls = new THREE.PointerLockControls(camera, renderer.domElement);
        // controls.addEventListener('change', render)
        var cube = new THREE.Mesh(geometry, material);


        scene.add(sphere);
        scene.add(cube);
        const animate = () => {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
        }
        animate();
    }
    
    
}

export default Pong