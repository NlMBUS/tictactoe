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
            const move = { letter, id }; 
            fetch('http://localhost:8000/moves/' + idData, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(move)
            })
        }
    }

    const check = () => {
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
                fetch('http://localhost:8000/moves', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(move)
                })
            }
        }
        setLetter('X')
        setTurn(0);
    }

    
    const restart = () => {
        setHistory([]);
        setMoves([]);
        setTurn(0);
        setLetter(' ')
        for (let i = 1; i <= moves.length; i++){
            fetch('http://localhost:8000/moves/' + moves[i-1].id, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json"},
            })
        }

    }

    const undo = () => {
        if (turn > 0 && check() === false){           
            let historyData = history[history.length-1].idData+1;
            let tempLetter = letter;
            moves[historyData-1].letter = ' ';
            const move = { letter, id };   
            fetch('http://localhost:8000/moves/' + historyData, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(move)
            })
            setLetter(other);
            setOther(tempLetter);
            history.pop();
            setTurn(turn-1);
        }
    }

    const save = () => {
        if (check()){
            const move = { other, turn, moves };
            fetch('http://localhost:8000/moves', {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(move)
            })
        }
    }

    useEffect(() => {
        fetch('http://localhost:8000/moves')
        .then((res) => res.json())
        .then(data => {
            if (window.onbeforeunload != null){
                setMoves(data);
                setTurn(turn+1);
            }
        })
        return () => {
            window.onbeforeunload = null;
            restart();
        };
      }, []);



    return (
        <div>
            <div className="actions">
                <button onClick={ (e) => {start(e);}} >Start</button>
                <button onClick={ (e) => {restart(e);}} >Restart</button>
                <button onClick={ (e) => {undo(e);}} >Undo</button>
                <button onClick={ (e) => {save(e);}} >Save</button>
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
                            <button id={ `square${singleMove.id}` } hover="true" onClick={ (e) => {enter(e, singleMove.id-1, singleMove.letter)}} >{ singleMove.letter }</button> 
                            }
                        
                        </div>
                    </li>
                ))}
            <br />
            <div>
                <p id="status">{ check() }</p>
                { !check() && moves.length > 0 && <p id="status">{ `It's ${letter}'s turn.` }</p>}
                { !check() && turn > 0 && <p>{ `Last Move: ${other} went row ${history[history.length-1].row}, column ${history[history.length-1].col}.` }</p>}
            </div>
        </div>
        
    );
}
 
export default Game;