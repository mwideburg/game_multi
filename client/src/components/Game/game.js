import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import {
    Flex, 
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
import Scene from './scene'
import Chat from '../Chat/Chat'
import { useToast } from "@chakra-ui/react"

const Game = () => {
    const { name, room, game, id, setName, setRoom, setGame, setID} = useContext(MainContext);
    const { users, setUsers } = useContext(UsersContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const socket = useContext(SocketContext);
    const [score, setScore] = useState([0, 0])
    const [winner, setWinner] = useState("")
    const [startButton, setStartButton] = useState(false)
    const [message, setMessage] = useState("Waiting for game to start...")
   
    const toast = useToast()
    useEffect(() => {
        
        socket.on("scored", score => {
                setScore(score)
                
        })
        socket.on("winner", winner => {
            setWinner(winner)
            onOpen()
            
        })
        users.forEach(user => {
            if(user.name === name){
                setGame(user.game)
            }
            if(user.game.player1 === name || user.game.player2 === name){
                setStartButton(true)
                
            }
            if(user.game.start){
                setMessage("GAME ON!!!")
            }
        })
        socket.on("started", () => {
            setMessage("GAME ON!!!")
            const mesEle = document.getElementById("message")
            const sBtn = document.getElementById("start")
            
            if(sBtn){
                sBtn.style.display = "none"
            }
            if(mesEle){
                mesEle.style.display = "flex"
            }
        })
        socket.on("resetGame", () => {
            const sBtn = document.getElementById("start")
            const mesEle = document.getElementById("message")
            setInterval(() => {
                onClose()
            }, 100)
            setScore([0, 0])
            if (sBtn) {
                sBtn.style.display = "flex"
            }
            if (mesEle) {
                mesEle.style.display = "none"
            }
        })
        
    })
    
    function startGame(){
        socket.emit("start", room)
        document.getElementById("start").style.display = "none"
        setMessage("GAME ON!!!")
        const mesEle = document.getElementById("message")
        if (mesEle) {
            mesEle.style.display = "flex"
        }
    }
    function resetGame(){
        socket.emit("reset", room)
        document.getElementById("start").style.display = "flex"
        const mesEle = document.getElementById("message")
        if (mesEle) {
            mesEle.style.display = "none"
        }
        setScore([0, 0])
        setInterval(() => {
            onClose()
        }, 100)
    }
    return (
        <div width="100%" height="100%">
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex justifyContent="center" alignItems="center" flexDirection="column" height="300px" padding="25px">
                                
                                <Text fontSize="4xl">{winner.slice(0, 1).toUpperCase() + winner.slice(1)} WINS!</Text>
                                <Text fontSize="2xl">SCORE:</Text>  
                                <Text fontSize="2xl">{score[0]} : {score[1]}</Text>

                                
                            </Flex>
                            
                        </ModalBody>

                        <ModalFooter justifyContent="space-around">
                            <Button color="blue.300" mr={3} onClick={resetGame}>
                                Close
                            </Button>

                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
            <Flex align="center" flexDirection="column" justifyContent="center"  width="100vw" >
                {startButton &&
                <>
                    <Button id="start" onClick={startGame} style={{height: "60px" }}>Start Game</Button>
                    <Text id="message" fontSize="2xl" marginTop="20px" color="blue" style={{display: "none", height:"60px", margin:"0px"}}>
                        {message}
                    </Text>
                </>
                }
                {(!startButton) &&
                    <Text fontSize="2xl" marginTop="20px" color="blue">
                        {message}
                    </Text>
                }
                
                
            
                <Flex align="center" justifyContent="space-between" width="800px" >
                    <Text fontSize="2xl" marginTop="20px">
                        {game && game.player1.slice(0, 1).toUpperCase() + game.player1.slice(1)}
                    </Text>
                    <Text fontSize="2xl" marginTop="20px">
                        {game && game.player2.slice(0, 1).toUpperCase() + game.player2.slice(1)}
                    </Text>
                    
                </Flex>
            <Text fontSize="2xl" marginTop="20px">{score[0]} : {score[1]}</Text>
            </Flex>
            <Flex className="game" align="center" flexDirection="row" width={{ base: "100%" }} height={{ base: "100%", sm: "auto" }}>
            <Scene />
            {/* <Chat /> */}
            </Flex>
        </div>
    )
}

export default Game