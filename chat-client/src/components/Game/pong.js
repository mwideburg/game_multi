import * as THREE from "three";
import React, {ReactComponent} from 'react'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { render } from "react-dom";
class Pong extends React.Component{
    constructor(scene){
        super(scene)
      
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
        
        const objects = this.createPong()
        
        this.state = {
            camera: camera,
            renderer: renderer,
            scene: scene,
            objects: objects,
            moveForward: false,
            moveBackward: false,
            controls: null,
        }

        this.animate = this.animate.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
        
    }
    componentDidMount(){
       
        // var scene = new THREE.Scene();

        // CAMERA

        



        // OBJECTS
        
       this.animate();
    }
    createPong = () => {
        const newPlayers = {}
        var geometry = new THREE.BoxGeometry(.2, 1, 0);
        var sphere = new THREE.CircleGeometry(.12, 32);
        var material = new THREE.MeshBasicMaterial({ color: "white" });

        let play1 = new THREE.Mesh(geometry, material);
        let play2 = new THREE.Mesh(geometry, material);
        let ball = new THREE.Mesh(sphere, material);
        ball.position.set(0, 0, 0)
        play1.position.set(-5, 0, 0);
        play2.position.set(5, 0, 0);
        return {player1: play1, player2: play2, ball: ball}
    }
    addObjects(){
        let objects = this.state.objects
        this.state.scene.add(objects["player1"])
        this.state.scene.add(objects["player2"])
        this.state.scene.add(objects["ball"])
    }
       
    movePlayer(user){
        const objects = this.state.objects
        this.state.objects[user.selected].position.set(user.position[0], user.position[1], user.position[2])
        if (user.ball != undefined && objects["ball"] != undefined){
        this.state.objects[user.ball].position.set(user.ball[0], user.ball[1], user.ball[2])
        }
    }
    addControls(obj){
        const objects = this.state.objects
        let controls = new PointerLockControls(objects[obj.selected], this.state.renderer.domElement);
        this.state.scene.add(controls.getObject());
        this.setState({controls})
        
        

    }
    startControls(){
       
    }
    onKeyDown(event) {
        
        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.setState({ moveForward: true})
                break;
            
            case 'ArrowDown':
            case 'KeyS':
                this.setState({ moveForward: true })
                break;
            default:
                break;
        }

    };


    onKeyUp(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.setState({ moveForward: false })
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.setState({ moveForward: false })
                break;
            default:
                break;

        }

    };
    
    animate(moveForward, moveBackward, controls){
            requestAnimationFrame(this.animate);
            let dir = 0
        if (moveForward) {
           
            if (this.state.objects["player1"].position.y < 3.3) {
                dir = .13
            }

        }

        if (moveBackward) {
            if (controls.getObject().position.y > -3.3) {
                dir = -.13
            }
        }
            this.state.renderer.render(this.state.scene, this.state.camera);
    }
}
    
    
    


export default Pong