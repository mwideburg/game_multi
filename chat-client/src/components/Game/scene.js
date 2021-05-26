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

const Scene = () => {
    const ref = useRef();
    const { users, games, setUsers, setGames } = useContext(UsersContext)
    const { name, room, setName, setRoom } = useContext(MainContext)
    const [scene, setScene] = useState(new THREE.Scene())
    const [players, setPlayers] = useState({});
    const socket = useContext(SocketContext)
    const [keyDown, setKeyDown] = useState(0);
    const [keyPress, setKeyPress] = useState(0);
    const[player1Name, setName1] = useState("Player 1")
    const[player2Name, setName2] = useState("Player 2")

    

    const [pressedKeys, setPressedKeys] = useState([]);

    const ALLOWED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
        
    useEffect(() => {
        let objects = null;
        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;
        let canJump = false;
        let prevTime = performance.now();
        let start;
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();
        let selections = "player1";

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(850, 500);

        ref.current.appendChild(renderer.domElement);
        const Game = new Pong(scene);
        
        
        console.log(Game)
        camera.position.z = 5;
        if (objects === null) {
            objects = createPong(users);
        }

        
        socket.on('movePlayers', (newUsers) => {
            
            if (newUsers.length === 0) {
                return;
            }
            newUsers.forEach(user => {
                
                if (user.position != undefined && objects[user.selected] != undefined){
                    // update player position
                    objects[user.selected].position.set(user.position[0], user.position[1], user.position[2])
                    if(user.ball != undefined && objects["ball"] != undefined){
                        // update ball position
                        let newBall = makeBall([user.ball[0], user.ball[1], user.ball[2]])
                        scene.remove(objects["ball"])
                        objects["ball"] = newBall
                        scene.add(newBall)
                        

                    }
                }
                
            })


        })
        let controls = null;
        let selected = null;
        let computer = true;
        socket.on("selectPlayer", (obj) => {
            // selections.push(obj.selected)
            // document.getElementById(obj.selected).style.display = "none"
            
            if(player1Name === "Player 1" && obj.user.selected === "player1"){
                setName1(obj.user.name)
            }
           
            console.log(obj.user.selected)
            if(player2Name === "Player 2" && obj.user.selected === "player2"){
                setName2(obj.user.name)
                computer = false;
            }
            
            console.log(obj.selected)
            if (obj.user.selected === "full") {
                return;
            }
            if(obj.user.name != name){
                return;
            }
                selected = obj.selected
                

                console.log("selecting controls")
                
                
                controls = new PointerLockControls(objects[obj.selected], renderer.domElement);

                scene.add(controls.getObject());
                window.addEventListener('keydown', onKeyDown);
                window.addEventListener('keyup', onKeyUp);
            
        })
        socket.on("playerAdded", user => {
            console.log(user)
            // if(user.selected){
            //     return;
            // }
            
            console.log("hey")
            let game = games[room]
            if (game != undefined && game.status) {
                return;
            }
            socket.emit('playerSelected', user.id)
            

            
            // socket.emit('playerSelected', { selections, position })
        })

        Object.keys(objects).forEach((key) => {
            if(key != "ball"){
                let player = objects[key]
                scene.add(player)
            }
        })
        Game.addSphere()
        // scene.add()
        console.log(scene)
        // socket.on("playerAdded", () => {
        //     if(users.length === 0){
        //         return;
        //     }
        //     console.log("hey")
        //     if(selections === "full"){
        //         return;
        //     }
        //     if(selections === "player1"){
        //         selectPlayer("player1");
        //         selections =  "player2";
        //     }
        //     if (selections === "player2"){
        //         selectPlayer(selections)
        //         selections = "full"
        //     }
            
        // })
        socket.on("startGame", () => {
            console.log(games)
            document.getElementById("start-game").style.display = "none"
            console.log("STARTING")
            if(computer === true){
                setName2("Computer")
            }
            start = true;
        })
        console.log(start)
        
        const onKeyDown = function (event) {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    moveForward = true;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = true;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = true;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    moveRight = true;
                    break;

                case 'Space':
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;
                default:
                    break;
            }

        };
        

        const onKeyUp = function (event) {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    moveRight = false;
                    break;
                default:
                    break;

            }

        };
        const moveComputer = (player2, ball, delta) => {
          
            let dir = 0
       
            
            // console.log(player2.position)
            
            if(ballDirX < 0){
                return;
            }
            if(player2.position.y > ball.position.y){
                dir -= .03
            }
            if (player2.position.y < ball.position.y) {
                dir += .03
            }

           

            player2.translateY(dir);
        }
        const collisionCheck = (ball) => {
            // console.log(ball)
            
            if (ballDirY > ballSpeed * 2) {
                ballDirY = ballSpeed * 2;
            }
            else if (ballDirY < -ballSpeed * 2) {
                ballDirY = -ballSpeed * 2;
            }
            // if ball goes off the top side (side of table)
            if (ball.position.y >= 3) {
                ballDirY = -ballDirY;
            }

            // if ball goes off the bottom side (side of table)
            if (ball.position.y <= -3) {
                ballDirY = -ballDirY;
            }
            if (ball.position.x >= 6) {
                ballDirX = -ballDirX;
            }

            // if ball goes off the bottom side (side of table)
            if (ball.position.x <= -6) {
                ballDirX = -ballDirX;
            }
            const playArr = [objects["player1"], objects["player2"]]
            playArr.forEach(player => {
                // const top = ball.position.distanceTo(player.position)
                const tr = [player.position.x + .05, player.position.y + .5]
                const bl = [player.position.x - .05, player.position.y - .5]
                const distance = ball.position.distanceTo(player.position)
                const ballPos = ball.position
                const number1 = (tr[0] > 0) ? 0 : .2
                const number2 = (tr[0] > 0) ? -.2 : 0
                if (ballPos.x <= tr[0] + number1 && ballPos.x >= tr[0] + number2 && ballPos.y <= tr[1] && ballPos.y >= bl[1]){
                    ballDirX = -ballDirX;
                    // ballDirY = -ballDirY;
                }
            })
            ball.position.x += ballDirX * ballSpeed;
            ball.position.y += ballDirY * ballSpeed;
            
            
        }
        var ballDirX = 1, ballDirY = 1, ballSpeed = .1;
        
        const animate = function () {
            requestAnimationFrame(animate);
            
            if(controls != null && selected != null && start){
                const time = performance.now();
                const delta = (time - prevTime) / 1000;
                let dir = 0
                if (moveForward) {
                    if (controls.getObject().position.y < 3.3) {
                        dir = .13
                    }

                }

                if (moveBackward) {
                    if (controls.getObject().position.y > -3.3) {
                        dir = -.13
                    }
                }
                
                controls.getObject().position.y += (dir); // new behavior
                
                const play = objects[selected]
                const ball = objects["ball"]
                if (computer) {
                    // console.log(objects["player2"])
                    moveComputer(objects["player2"], ball, delta);
                }
               
                collisionCheck(ball)
                
                // ball.set.position(newPos.x, newPos.y, newPos.z)
                socket.emit('move', { position: [play.position.x, play.position.y, play.position.z,], id: socket.id, name: name, ball: ball.position });

                prevTime = time;

            }
            
            
            renderer.render(scene, camera);
        };
        
        animate();

        return () => {
            // Callback to cleanup three js, cancel animationFrame, etc
        }
    }, []);

    const createPong = () => {
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
        
        newPlayers["player1"] = play1
        newPlayers["player2"] = play2
        newPlayers["ball"] = ball
        
        Object.keys(users).forEach(user => {
            if(user.selected != undefined){
                let newObject = newPlayers[user.selected]
                
                newObject.position.set(user.position[0], user.position[1], user.position[2])
                newPlayers[user.selected] = newObject
            }
        })
        setPlayers(newPlayers)
        
        // console.log(players)
        return newPlayers
    }

    const makeBall = (position) => {
        var sphere = new THREE.CircleGeometry(.12, 32);
        var material = new THREE.MeshBasicMaterial({ color: "white" });
        let ball = new THREE.Mesh(sphere, material);
        ball.position.set(position[0], position[1], position[2])
       return ball
    }

    const startGame = () => {
        socket.emit("start")
        
    }
    const selectPlayer = (selected) => {
        // setVelocity(.2);
        // console.log(selected)
        console.log(users)
        const user = users.find(user => user.name === name)
        console.log(user)
        if(user.selected != null){
            return;
        }
        document.getElementById("player1").style.display = "none"
        document.getElementById("player2").style.display = "none"

        const player = players[selected]
        
      
        let position = [players[selected].position.x, players[selected].position.y, players[selected].position.z]
        socket.emit('playerSelected', {selected, position})
        
       
    } 

    return (
        
        <Flex align="center" flexDirection="column" justifyContent="center" width="100%" height="auto">
            {/* <Button onClick={handleClick}>Add Player</Button> */}
           
            
            <Flex justifyContent="space-around" width="100%" height="100px">
                
                <Button id="player1" onClick={() => selectPlayer("player1")}>{player1Name}</Button>
                <Button id="start-game" onClick={() => startGame()}> Start</Button>
                <Button id="player2" onClick={() => selectPlayer("player2")}>{player2Name}</Button>
            </Flex>
            
            
            <div ref={ref} />

        </Flex>

    )
}

export default Scene
