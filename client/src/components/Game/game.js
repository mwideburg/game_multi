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


const Game = () => {
    const { name, room, game, setName, setRoom, setGame } = useContext(MainContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const socket = useContext(SocketContext);
    const [score, setScore] = useState([0, 0])
    const [winner, setWinner] = useState("")
    useEffect(() => {
        
        socket.on("scored", score => {
                setScore(score)
                
        })
        socket.on("winner", winner => {
            setWinner(winner)
            onOpen()
            
        })
        
    })
    
    function startGame(){
        socket.emit("start", room)
    }
    function resetGame(){
        socket.emit("reset", room)
        setScore([0, 0])
        onClose()
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
            <Button onClick={startGame}>Start Game</Button>
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