import React, { useContext, useEffect, useState } from 'react'


class SnapShots{
    constructor(props){
        this.gameUpdates = [];
        this.gameStart = 0;
        this.firstServerTimestamp = Date.now();
        this.getCurrentState = this.getCurrentState.bind(this)
    }
    
    processGameUpdate(update) {
       
        if (!this.firstServerTimestamp) {
            this.firstServerTimestamp = update.t;
            this.gameStart = Date.now();
        }
        this.gameUpdates.push(update);

        // Keep only one game update before the current server time
        const base = this.getBaseUpdate();
        if (base > 0) {
            this.gameUpdates.splice(0, base);
        }
    }
    currentServerTime() {
        return this.firstServerTimestamp + (Date.now() - this.gameStart) - 50;
    }

    // Returns the index of the base update, the first game update before
    // current server time, or -1 if N/A.
    getBaseUpdate() {
        const serverTime = this.currentServerTime();
        for (let i = this.gameUpdates.length - 1; i >= 0; i--) {
            if (this.gameUpdates[i].t <= serverTime) {
                return i;
            }
        }
        return -1;
    }
    getCurrentState() {
 
        if (!this.firstServerTimestamp) {
            return {};
        }

        const base = this.getBaseUpdate();
        const serverTime = this.currentServerTime();
        if (base < 0) {
            return this.gameUpdates[this.gameUpdates.length - 1];
        } else if (base === this.gameUpdates.length - 1) {
            return this.gameUpdates[base];
        } else {
            const baseUpdate = this.gameUpdates[base];
            const next = this.gameUpdates[base + 1];
            const r = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t)
            return {
                base: baseUpdate,
                next: next,
                r: r
            }
        }
    }
    
}

export default SnapShots