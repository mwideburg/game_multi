import * as THREE from "three";
import React, {ReactComponent} from 'react'
import { render } from "react-dom";
class Pong extends React.Component{
    constructor(scene){
        super(scene)
        console.log(scene)
        //camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(850, 500);
        camera.position.z = 5;

        // RENDER
        
        this.state = {
            camera: camera,
            renderer: renderer,
            scene: scene,
        }

        this.animate = this.animate.bind(this)
        
    }
    componentDidMount(){
       
        // var scene = new THREE.Scene();

        // CAMERA

        



        // OBJECTS
        
       this.animate();
    }
       
    addSphere(){
        console.log("adding Sphere")
        var sphere = new THREE.CircleGeometry(.12, 32);
        var material = new THREE.MeshBasicMaterial({ color: "white" });
        let ball = new THREE.Mesh(sphere, material);
       this.state.scene.add(ball)
        return ball
    }

        
    animate(){
            requestAnimationFrame(this.animate);
            // console.log("hey")
            this.state.renderer.render(this.state.scene, this.state.camera);
    }
}
    
    
    


export default Pong