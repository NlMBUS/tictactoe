import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from  'react-router-dom';

const BoardList = () => {

    let { id } = useParams();
    const [turn, setTurn] = useState(0);
    const [boards, setBoards] = useState([]);
    const [letter, setLetter] = useState(' ');
    const navigate = useNavigate();

    const check = () => {
        if (turn < 9){
            return `${letter} won in ${turn} turns.`;
        } else{
            return 'Game ended in a tie.';
        }
    }

    const remove = () => {
        fetch(`http://localhost:8000/moves/${Number(id)+9}` , {
            method: 'DELETE'
        }).then(() => {
            navigate('/archive');
        })
    }

    useEffect(() => {
        fetch('http://localhost:8000/moves')
        .then((res) => res.json())
        .then(data => {
            const tempBoard = data.filter(data => data.id === Number(id)+9)
            setBoards(tempBoard[0].moves);
            setTurn(tempBoard[0].turn);
            setLetter(tempBoard[0].other);
        })
      }, []);
    
    return (
        <div>
            <div className="actions">
                <button>
                <Link to ='/'>
                    Home
                </Link>
                </button>
                <button>
                <Link to ='/archive'>
                    Archive
                </Link>
                </button>
                <button onClick={ (e) => {remove(e)}}>
                    Remove
                </button>
                <h1>{ `Game ${id}` }</h1>
                <h1>Tic-Tac-Toe</h1>
            </div>
            <br />
                { boards.map((singleBoard) => (
                    <li key={ `archive${singleBoard.id}` }>
                        <div className="archiveSquares">
                        { 
                        <button id={ `square${singleBoard.id}` } >{ singleBoard.letter }</button> 
                        }
                        </div>
                    </li>
                ))}
            <br />
            <div>
                <p id="status">{ check() }</p>
            </div>
        </div>
      );
}
 
export default BoardList;