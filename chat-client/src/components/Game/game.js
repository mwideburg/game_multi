
import ReactDOM from "react-dom";
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Box, Flex, Heading, IconButton, Text, Menu, Button, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import * as THREE from "three";
import Chat from '../Chat/Chat'
import Scene from './scene'
import { Socket } from "socket.io-client";
function Game() {
    const { name, room, setName, setRoom } = useContext(MainContext)
    const { users } = useContext(UsersContext)
    const socket = useContext(SocketContext)
    const [scene, setScene] = useState(new Scene())
    useEffect(() =>{
       
        users && users.forEach(user => {
            if(user.game === undefined){
                socket.on('addGame', {room, scene})
            }else{
                setScene(user.game)
            }
            
        })
    })
    
    return (
        <Flex align="center" flexDirection="row" width={{ base: "100%" }} height={{ base: "100%", sm: "auto" }}>
            {scene} 
            <Chat />
        </Flex>

    )
}

export default Game
