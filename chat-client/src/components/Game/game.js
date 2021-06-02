
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
    const scene = Scene();
    const history = useHistory()
    useEffect(() => { if (!name) return history.push('/') }, [history, name])
    const logout = () => {
        setName(''); setRoom('');
        history.push('/')
        history.go(0)
    }
    return (
        <>
        <Flex justifyContent="flex-end" width="100%">
        <Button color='gray.500' margin="10px" fontSize='sm' onClick={logout}>Logout</Button>

        </Flex>
        <Flex className="game" align="center" flexDirection="row" width={{ base: "100%" }} height={{ base: "100%", sm: "auto" }}>
            {scene} 
            {/* <Chat /> */}
        </Flex>
        </>

    )
}

export default Game
