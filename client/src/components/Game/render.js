import React, { useContext, useEffect, useState } from 'react'


const Render = ({can, con}) => {
    const canvas = can
    const context = con
    let renderInterval = setInterval(renderMainMenu, 1000 / 60);
    setCanvasDimensions()
    function renderMainMenu() {
            
        const t = Date.now() / 7500;

        renderBackground();
    }

    function setCanvasDimensions() {
            // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
            // 800 in-game units of width.
        const scaleRatio = Math.max(1, 800 / window.innerWidth);
        canvas.width = 800;
        canvas.height = 500;
    }

        // // window.addEventListener('resize', debounce(40, setCanvasDimensions));
    function render() {
            // const { me, others, bullets } = getCurrentState();
            // if (!me) {
            //     return;
            // }

            // Draw background
        renderBackground();
            
            
            
    }
        

    function renderBackground() {
        context.fillStyle = "blue"
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
        
    function startRender() {
        clearInterval(renderInterval);
        renderInterval = setInterval(render, 1000 / 60);

    }
    function stopRender() {
        clearInterval(renderInterval);
        renderInterval = setInterval(renderMainMenu, 1000 / 60);
    }

  
    

   
}

export default Render;