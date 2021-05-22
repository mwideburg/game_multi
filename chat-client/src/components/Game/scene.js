import ReactDOM from "react-dom";
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Box, Flex, Heading, IconButton, Text, Menu, Button, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import * as THREE from "three";
import { Socket } from "socket.io-client";


function Scene() {
    const ref = useRef();
    const { users } = useContext(UsersContext)
    const { name, room, setName, setRoom } = useContext(MainContext)
    const [scene, setScene] = useState(new THREE.Scene())
    const [players, setPlayers] = useState({})
    
    const socket = useContext(SocketContext)
    let playing = false;
    let objects = null;
    useEffect(() => {
       
        // socket.on('player', player => {
            
        //     const newPlayers = []
        //     var geometry = new THREE.BoxGeometry(player.object.geometry[0], player.object.geometry[1], player.object.geometry[2]);
        //     var material = new THREE.MeshBasicMaterial(player.object.material);
        //     var cube = new THREE.Mesh(geometry, material);
            
        //     players.push(cube)
      
        //     setPlayer(players.length - 1)
        //     playing = true;
        // })
        // const oldObjects = Object.assign(objects, {})
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(850, 500);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        ref.current.appendChild(renderer.domElement);


        camera.position.z = 5;

        // var geometry = new THREE.BoxGeometry(1, 1, 1);
        // var material = new THREE.MeshBasicMaterial({color: "blue"});
            
        // var cube = new THREE.Mesh(geometry, material);
        
        
        // players.push({name: name, cube: cube})
        
        
        socket.on('movePlayers', (newUsers) => {
            if (newUsers.length === 0) {
                return;
            }
            newUsers.forEach(user => {
                
                if (objects[user.name] != undefined){
                    const player = (objects[user.name])
                    player.cube.position.set(user.position[0], user.position[1], user.position[2])
                }else{
                    const newPlayer = makeObjects([user])
                    objects[user.name] = newPlayer[user.name]
                }
                
            })


        })
        if(objects === null){
            objects = makeObjects(users)
        }
        socket.on('playerAdded', user => {
            console.log("playerAdded")
            const newPlayer = makeObjects([user])
            objects[user.name] = newPlayer[user.name]
            scene.add(newPlayer[user.name].cube)
        })
        socket.on('deleteUser', (user) => {
            if (objects[user.name] === undefined){
                return;
            }
            scene.remove(objects[user.name].cube)
            delete objects[user.name]
            console.log("DELETED")
        })
        Object.keys(objects).forEach((key) => {
            let player = objects[key]
            scene.add(player.cube)

            player.cube.rotation.x += 0.01;
            player.cube.rotation.y += 0.01;
        })
        const animate = function () {
            requestAnimationFrame(animate);
            Object.keys(objects).forEach((key) => {
                let player = objects[key]
                
                player.cube.rotation.x += 0.01;
                player.cube.rotation.y += 0.01;
            })

            renderer.render(scene, camera);
        };
        
        animate();
        

        return () => {
            // Callback to cleanup three js, cancel animationFrame, etc
        }
    }, []);
    
    const makeObjects = (objects) => {
        const newPlayers = {}
        objects.forEach(player => {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshBasicMaterial({ color: "blue" });

            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(player.position[0], player.position[1], player.position[2])
            newPlayers[player.name] = { name: player.name, cube: cube, position: player.position }
        })
        return newPlayers
    }
    
    
    const startGame = () => {

        document.addEventListener('keydown', (e) => {

           movePlayer(e.which);
        })
        
        
    }

    
    const movePlayer = (key) => {
        
        const newPos = new THREE.Vector3(2, 2, 2)
        const play = objects[name]
        switch (key) {
            case 87:
                play.cube.position.y += .2
                break;
            case 83:
                play.cube.position.y -= .2
                break;
            case 68:
                play.cube.position.x += .2
                break;
            case 65:
                play.cube.position.x -= .2
                break;
            default:
                break;
        }
        
        
        // let lerpedPos = new THREE.Vector3();
        // lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos.x, 0.3);
        // lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos.y, 0.3);
        // lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos.z, 0.3);
        socket.emit('move', [play.cube.position.x, play.cube.position.y, play.cube.position.z ]);
    }
    return (
        <Flex align="center" justifyContent="center" width="100%" height="auto">
            {/* <Button onClick={handleClick}>Add Player</Button> */}
            <Button onClick={startGame}>start Game</Button>
            <div ref={ref} />

        </Flex>

    )
}

export default Scene
