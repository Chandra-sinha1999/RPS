const { start } = require("repl");

class Rpsgame {
    constructor(p1,p2) {
        this._players = [p1,p2];
        this._scores = [0,0];
        this._turns = [null,null];
        this._recMessage = ["",""];
        this._sendMessage('Here the Game starts');

        this._players.forEach((player,idx) => {
            player.on('turn',(turn) => {
                this._onTurn(idx,turn);
            });
        });

        this._players.forEach((player,idx) => {
            player.on('recm',(recm) => {
                this._sendMessage(recm);
            });
        });
    }

    _sendToPlayer(playerIdx,msg) {
        this._players[playerIdx].emit('message',msg);
    }
    _sendMessage(msg) {
        this._players.forEach((player) => {
            player.emit('message',msg);
        });
    }

    _onTurn(playerIdx,turn) {
        this._turns[playerIdx] = turn;
        this._sendToPlayer(playerIdx,`You selected ${turn}`);
        this._checkGameOver();
    }

    _checkGameOver() {
        const turns = this._turns;
        if(turns[0] && turns[1]) {
            this._sendMessage('Game over ' + turns.join(' : '));
            this._gameResult();
            this._turns = [null,null];
            this._sendMessage('Next Round!!!');
        }
    }

    _gameResult() {
        const p1 = this._decodeTurns(this._turns[0]);
        const p2 = this._decodeTurns(this._turns[1]);
        const val = (p2 - p1 + 3)% 3;
        switch(val) {
            case 0: this._sendMessage('Game Draw');
            break;
            case 1:
                this._scores[0] += 1; 
                this._winMessage(this._players[0],this._players[1]);
                break;
            case 2:
                this._scores[1] += 1;
                this._winMessage(this._players[1],this._players[0]);
                break;
        }
    }

    _decodeTurns(turn) {
        switch(turn) {
            case 'rock': return 0;
            case 'scissors': return 1;
            case 'paper' : return 2;
            default: 
                throw new Error(`could not decode turn ${turn}`);
        }
    }

    _winMessage(winner,looser) {
        winner.emit('message','You won');
        looser.emit('message','You lost');
        this._displayScore();
    }

    _displayScore(){
        const scr = "Score : ";
        const resultOne = scr + this._scores[0] + " : " + this._scores[1];
        const resultTwo = scr + this._scores[1] + " : " + this._scores[0];
        this._players[0].emit('score', resultOne); 
        this._players[1].emit('score', resultTwo);
    }
}

module.exports = Rpsgame;