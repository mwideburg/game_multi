import ReactDOM from "react-dom";
import React, { useContext, useEffect, useState, useRef } from 'react'
import {
    Flex,
    Heading,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react"

import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import World from './World'
import SnapShots from "./snapShots";
import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


const MultiWorldScene = () => {
    const ref = useRef();
    const { name, room, setName, setRoom } = useContext(MainContext)

    const [scene, setScene] = useState(new THREE.Scene())
    const { users, setUsers } = useContext(UsersContext);
    const socket = useContext(SocketContext)
    const history = useHistory()
    const [pressedKeys, setPressedKeys] = useState([]);
    const [score, setScore] = useState([0, 0])
    const ALLOWED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

    useEffect(() => { if (!name) return history.push('/') }, [history, name])

    useEffect(() => {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        // const player = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 700
        camera.position.y = 10


        // Make initial scene
        scene.background = new THREE.Color(0xcce0ff);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(850, 500);
        scene.background = new THREE.Color(0xcce0ff);
        // Fog will make the 750 distance blurry
        scene.fog = new THREE.Fog(0xcce0ff, 0, 900);

        // Add hmisphere light
        let light = new THREE.HemisphereLight(0xcce0ff, 0xcce0ff, 0.75);
        light.position.set(0.5, 1, 0.75);
        scene.add(light);

        // Add a little spot light near stairs
        light = new THREE.SpotLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(20, 10, 100);
        scene.add(light);
        ref.current.appendChild(renderer.domElement);
        const spotEn = new THREE.PointLight("white", 10, 100);
        spotEn.position.x = 100
        spotEn.position.y = 10
        spotEn.position.z = 180
        scene.add(spotEn)
        let objects = []
        World().forEach(obj => {
            scene.add(obj)
            objects.push(obj)
        })
        console.log(scene)

        //Controls
        const controls = new PointerLockControls(camera, document.body);
        scene.add(controls.getObject());
        let moveForward = false
        let moveBackward = false
        let moveRight = false
        let moveLeft = false
        let canJump = true
        let wait
        let keyDown = false
        let run = false
        let velocity = new THREE.Vector3();
        var direction = new THREE.Vector3();
        let gameUpdates = [];
        let gameStart = 0;
        let firstServerTimestamp = 0;
        const Updates = new SnapShots
        socket.on("updateMulti", me => {
            
            if (me === null) return;

            Updates.processGameUpdate(me)
            
        })
        const onKeyDown = (event) => {
                switch (event.keyCode) {
                    case 38: // up
                    case 87: // w

                        keyDown = true
                        moveForward = true;
                        break;
                    case 37: // left
                    case 65: // a

                        moveLeft = true; break;
                    case 40: // down
                    case 83: // s
                        moveBackward = true;
                        break;
                    case 39: // right
                    case 68: // d
                        moveRight = true;
                        break;
                    case 16: // d
                        wait = performance.now()
                        run = true;
                        break;
                    case 32: // space
                        if (canJump === true) velocity.y += 350;
                        canJump = false;
                        break;
                }
                
            const me = handleInput(velocity, direction)
            socket.emit("updatePlayer", me)
        };
        const onKeyUp = (event) => {



            switch (event.keyCode) {
                case 38: // up
                case 87: // w
                    keyDown = false
                    moveForward = false;
                    break;
                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
                case 16: // d

                    run = false;
                    break;
            }
            const me = handleInput(velocity, direction)
            socket.emit("updatePlayer", me)

        };
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
        const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
        const mouse = new THREE.Vector2();
        let last = Date.now()
        let showControl = 0
        const handleInput = (velocity, direction) => {
            const me = {
                id: socket.id,
                room: room,
                x: controls.getObject().position.x,
                y: controls.getObject().position.y,
                quaternion: controls.getObject().quaternion,
                rotation: controls.getObject().rotation,


                // 100.0 = mass
                velocityx: velocity.x - velocity.x * 10.0,
                velocityz: velocity.z - velocity.z * 10.0,
                velocityy: velocity.y - 9.8 * 100.0, // 100.0 = mass
                directionz: Number(moveForward) - Number(moveBackward),
                directionx: Number(moveRight) - Number(moveLeft),
                direction: direction.normalize() // 

            }
            if (moveForward || moveBackward) me.velocityz -= me.directionz * 400.0;
            if (moveLeft || moveRight) me.velocityx -= me.directionx * 400.0;
            const intersections = raycaster.intersectObjects(objects);
            const isOnObject = intersections.length > 0;
            if (isOnObject === true) {

                velocity.y = Math.max(0, velocity.y);
                canJump = true;

            }
            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
                canJump = true;
            }
            if (run) {
                if (moveForward || moveBackward) velocity.z -= direction.z * 400.0;
                if (moveLeft || moveRight) velocity.x -= direction.x * 400.0;
            }
            
           
           return me
            
        }
        console.log(Updates)
        const animate = function () {
            requestAnimationFrame(animate);
            let now = Date.now()
            let delta = (now - last) / 1000
            raycaster.ray.origin.copy(controls.getObject().position);

            raycaster.ray.origin.y -= 10;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
            const intersections = raycaster.intersectObjects(objects);
            const isOnObject = intersections.length > 0;
            if(Updates.getCurrentState != undefined){
                
               const obj = Updates.getCurrentState()
               
                if (obj != undefined ) {
                    
                    controls.moveRight(- obj.velocityx * obj.r);
                    controls.moveForward(- obj.velocityz * obj.r);
                    controls.getObject().position.y += (obj.velocityy * obj.r);
                }

           }
            
            
            

            
            // const me = handleInput(velocity, direction, delta)
           
            // direction.z = Number(moveForward) - Number(moveBackward);
            // direction.x = Number(moveRight) - Number(moveLeft);
            // direction.normalize(); // this ensures consistent movements in all directions

            // if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
            // if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

            // if (isOnObject === true) {

            //     velocity.y = Math.max(0, velocity.y);
            //     canJump = true;

            // }
            // if (controls.getObject().position.y < 10) {
            //     velocity.y = 0;
            //     controls.getObject().position.y = 10;
            //     canJump = true;
            // }
            // if (run) {
            //         if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
            //         if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
            // }
            // controls.moveRight(- velocity.x * delta);
            // controls.moveForward(- velocity.z * delta);
            // controls.getObject().position.y += (velocity.y * delta);
            renderer.render(scene, camera);

            last = now
        };
        addPointerLock(controls, animate)
        
        animate();
        
        return () => {
            // Callback to cleanup three js, cancel animationFrame, etc
        }
    }, []);

    const addPointerLock = (constrols, animate) => {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if (havePointerLock) {
            let element = document.body;
            let pointerlockchange = function (event) {
                
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                    
                    constrols.enabled = true;
                } else {
                    cancelAnimationFrame(animate)
                    constrols.enabled = false;
                }
            };
            let pointerlockerror = function (event) {
                animate()
            };
            // Hook pointer lock state change events
            document.addEventListener('pointerlockchange', pointerlockchange, false);
            document.addEventListener('mozpointerlockchange', pointerlockchange, false);
            document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
            document.addEventListener('pointerlockerror', pointerlockerror, false);
            document.addEventListener('mozpointerlockerror', pointerlockerror, false);
            document.addEventListener('webkitpointerlockerror', pointerlockerror, false);


            console.log('THIRD')
            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            if (/Firefox/i.test(navigator.userAgent)) {
                var fullscreenchange = function (event) {
                    if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                        document.removeEventListener('fullscreenchange', fullscreenchange);
                        document.removeEventListener('mozfullscreenchange', fullscreenchange);
                        element.requestPointerLock();
                    }
                };
                document.addEventListener('fullscreenchange', fullscreenchange, false);
                document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();
            } else {
                console.log('FORTH')

                element.requestPointerLock();
            }
        }
        
    }

    return (
        <>
            <Flex align="center" flexDirection="column" justifyContent="center" >

                <div ref={ref} />

            </Flex>

        </>
    )
}

export default MultiWorldScene
