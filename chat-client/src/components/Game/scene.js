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

    const [scene, setScene] = useState(new THREE.Scene())
    const [players, setPlayer] = useState([])
    const socket = useContext(SocketContext)
    useEffect(() => {
        
        socket.on('player', player => {
            const newPlayers = []
            console.log(player.user)
            console.log(player.object.geometry)
            var geometry = new THREE.BoxGeometry(player.object.geometry[0], player.object.geometry[1], player.object.geometry[2]);
            var material = new THREE.MeshBasicMaterial(player.object.material);
            var cube = new THREE.Mesh(geometry, material);
            players.push(cube)
            // newPlayers.push(player.object.cube)
            
            setPlayer(newPlayers)
            console.log(players.length)
        })
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        ref.current.appendChild(renderer.domElement);


        camera.position.z = 5;
        players.forEach(play => scene.add(play))
        const animate = function () {
            requestAnimationFrame(animate);
            players.forEach((cube) => {
                scene.add(cube)
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
            })

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            // Callback to cleanup three js, cancel animationFrame, etc
        }
    }, []);
    const handleClick = (name, room) => {
        var geometry = [-1, -1, -1]
        var material = { color: "white" };
        var object = {geometry: geometry, material: material}
        
        socket.emit('addPlayer', object)
        
       


    }
    return (
        <Flex align="center" justifyContent="center" width="100%" height="auto">
            <Button onClick={handleClick}>Add Player</Button>
            <div ref={ref} />

        </Flex>

    )
}

export default Scene
