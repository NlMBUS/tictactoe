//npm run start 
//npx json-server --watch data/db.json --port 8000
import { useState, useEffect } from "react";
import { Link } from  'react-router-dom';

const Game = () => {

    const [turn, setTurn] = useState(0);
    let [id, setId] = useState(0);
    const [moves, setMoves] = useState([]);
    const [history, setHistory] = useState([]);
    const [letter, setLetter] = useState(' ');
    const [other, setOther] = useState(' ');
    const [saved, setSaved] = useState(false);

    const enter = (e, idData, letterData) => {
        if (letterData === ' ' && check() == false){
            moves[idData].letter = letter;
            
            setTurn(turn+1);

            let row = ~~(idData / 3)+1;
            let col = idData % 3;
            col += 1;
            const lastMove = { row, col, idData };
            history.push(lastMove);

            if (turn % 2 === 1){
                setLetter('X');
                setOther('O');
            } else {
                setLetter('O');
                setOther('X');
            }

            idData = idData+1;
        }
    }

    const check = () => {
        //Checks win conditions, but also returns text displaying who wins
        if (moves.length === 9){
            if(
                (moves[0].letter === moves[1].letter && moves[1].letter === moves[2].letter && moves[0].letter !== ' ') ||
                (moves[3].letter === moves[4].letter && moves[4].letter === moves[5].letter && moves[3].letter !== ' ') ||
                (moves[6].letter === moves[7].letter && moves[7].letter === moves[8].letter && moves[6].letter !== ' ') ||
                (moves[0].letter === moves[3].letter && moves[3].letter === moves[6].letter && moves[0].letter !== ' ') ||
                (moves[1].letter === moves[4].letter && moves[4].letter === moves[7].letter && moves[1].letter !== ' ') ||
                (moves[2].letter === moves[5].letter && moves[5].letter === moves[8].letter && moves[2].letter !== ' ') ||
                (moves[0].letter === moves[4].letter && moves[4].letter === moves[8].letter && moves[0].letter !== ' ') ||
                (moves[2].letter === moves[4].letter && moves[4].letter === moves[6].letter && moves[2].letter !== ' ')
            ){
                return `${other} wins in ${turn} turns!`;
            } else{
                if (turn < 9){
                    return false;
                } else{
                    return 'Tied.';
                }
            }
        }
    }

    const start = () => {
        if (moves.length === 0 ){
            for (let i = 1; i <= 9; i++){
                id = i;
                setId(id);
                const move = { letter, id };
                moves.push(move);
            }
            setLetter('X')
            setTurn(0);
            setSaved(false);
        }
    }

    const restart = () => {
        setHistory([]);
        setMoves([]);
        setTurn(0);
        setSaved(false);
        setLetter(' ')
    }

    const undo = () => {
        if (turn > 0 && check() === false){           
            let historyData = history[history.length-1].idData+1;
            let tempLetter = letter;
            moves[historyData-1].letter = ' ';
            setLetter(other);
            setOther(tempLetter);
            history.pop();
            setTurn(turn-1);
        }
    }

    const save = () => {
        if (check() && saved == false){
            setSaved(true);
            const move = { other, turn, moves };
            fetch('http://localhost:8000/moves', {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(move)
            })
        }
    }

    return (
        <div>
            <div className="actions">
                {/*Greys out the button depending on conditions*/}
                <button id={ moves.length == 0 ? "colored" : "grey" } onClick={ (e) => {start(e);}} >Start</button>
                <button id={ moves.length > 0 ? "colored" : "grey" } onClick={ (e) => {restart(e);}} >Restart</button>
                <button id={ !check() && turn > 0 ? "colored" : "grey" } onClick={ (e) => {undo(e);}} >Undo</button>
                <button id={ check() && !saved && turn > 0 ? "colored" : "grey" } onClick={ (e) => {save(e);}} >Save</button>
                <button>
                <Link to ='/archive'>
                    Archive
                </Link>
                </button>
                <h1>Tic-Tac-Toe</h1>
            </div>
                { moves.map((singleMove) => (
                    <li key={ `game${singleMove.id}` }>
                        <div className="squares">
                            { 
                            <button id={ singleMove.letter == " " && !check() ? `square${singleMove.id}` : `square${singleMove.id}grey` } onClick={ (e) => {enter(e, singleMove.id-1, singleMove.letter)}} >{ singleMove.letter }</button> 
                            }
                        </div>
                    </li>
                ))}
            <br />
            <div>
                {/*Displays text depending on conditions*/}
                <p id="status">{ check() }</p>
                { !check() && moves.length > 0 && <p id="status">{ `It's ${letter}'s turn.` }</p>}
                { !check() && turn > 0 && <p>{ `Last Move: ${other} went row ${history[history.length-1].row}, column ${history[history.length-1].col}.` }</p>}
                { check() && !saved && turn > 0 && <p>{ 'Want to save the game to the archive? Click Save!' }</p>}
                { check() && saved && turn > 0 && <p>{ 'Game Saved!' }</p>}
            </div>
        </div>
        
    );
}
 
export default Game;
