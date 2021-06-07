
import ReactDOM from "react-dom";
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Flex, Button, } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import { useToast } from "@chakra-ui/react"

import Scene from './scene'
import Chat from '../Chat/Chat.js'

import { Socket } from "socket.io-client";
function Game() {
    const { name, room, setName, setRoom } = useContext(MainContext)
    const { users } = useContext(UsersContext)
    const socket = useContext(SocketContext)
    const scene = Scene();
    const history = useHistory()
    const toast = useToast()
    window.onpopstate = e => logout()
    useEffect(() => { if (!name) return history.push('/') }, [history, name])
    useEffect(() => {
        

        socket.on("notification", notif => {
            console.log(notif)
            if (!toast.isActive(notif.id)) {
                toast({
                    id: notif.id,
                    position: "top",
                    title: notif?.title,
                    description: notif?.description,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            }
        })
    }, [socket, toast])
    const logout = () => {
        setName(''); setRoom('');
        history.push('/')
        history.go(0)
    }

    return (
        <>
        
        <Flex className="game" align="center" flexDirection="row" width={{ base: "100%" }} height={{ base: "100%", sm: "auto" }}>
            {scene} 
            <Chat />
        </Flex>
        </>

    )
}

export default Game
