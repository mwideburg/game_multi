import ReactDOM from "react-dom";
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Box, Flex, Heading, IconButton, Text, Menu, Button, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Socket } from "socket.io-client";
import Pong from './pong'

const Scene2 = () => {
    const ref = useRef();
    const { users, games, setUsers, setGames } = useContext(UsersContext)
    const { name, room, setName, setRoom } = useContext(MainContext)
    const [scene, setScene] = useState(new THREE.Scene())
    const [Game, setGame] = useState(new Pong(scene));
    const socket = useContext(SocketContext)
    
    useEffect(() => {
        
        ref.current.appendChild(Game.state.renderer.domElement);
        Game.addObjects()
        // Game.addControls({selected: "player1"});
        // console.log(Game.state.objects["player1"])
        // let controls = new PointerLockControls(Game.state.objects["player1"], Game.state.renderer.domElement);
        // Game.state.scene.add(controls.getObject());
        let moveForward = false;
        let moveBackward = false;
        

        const onKeyDown = (event) => {
            console.log(event.code)
            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    moveForward = true
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = true
                    break;
                default:
                    break;

            }

        };
        const onKeyUp = (event) => {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    moveForward =  false
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = false 
                    break;
                default:
                    break;

            }

        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        Game.animate(moveForward, moveBackward)
    })


    const handleClick = () => {
        // Game.addControls({ selected: "player1" });
    }
    const startControls = () => {
        
    }
    

    return (

        <Flex align="center" flexDirection="column" justifyContent="center" width="100%" height="auto">
            {/* <Button onClick={handleClick}>Add Player</Button> */}
            <Button onClick={startControls}>Start Player</Button>


            <Flex justifyContent="space-around" width="100%" height="100px">

               
            </Flex>


            <div ref={ref} />

        </Flex>

    )
}

export default Scene2
