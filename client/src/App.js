import { HashRouter, Router, Route, Switch, Redirect } from 'react-router-dom'
import React, { Component, useContext } from 'react'
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
import { SocketProvider } from './socketContext'
import { MainProvider } from './mainContext'
import './App.css'
import { ChakraProvider, Flex } from "@chakra-ui/react"
import { UsersProvider } from './usersContext'

import DefaultPage from './components/DefaultPage'
import Game from './components/Game/game'
var is_mobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
function App() {
  if(!is_mobile){
    return (
      <ChakraProvider>
        <MainProvider>
          <UsersProvider>
            <SocketProvider>
              <Flex className="App" align='center' flexDirection="column" justifyContent='center'>
                <HashRouter>
                  <Switch>
                    <Route exact path='/' component={Login} />
  
                    <Route exact path='/game/:room' component={Game} />
                    <Route exact path='/chat/:room' component={Chat} />
                    <Route component={DefaultPage} />
                  </Switch>
                </HashRouter>
              </Flex>
            </SocketProvider>
          </UsersProvider>
        </MainProvider>
      </ChakraProvider>
    );

  }else{
    return(
      <Flex className="Mobile" align='center' flexDirection="column" justifyContent='center'>
        Sorry, this app is not yet supported on mobile or tablets
        <a href="https://mwideburg.github.io/"> Michael Wideburg's Portfolio</a>
      </Flex>
    )
  }
}

export default App;
