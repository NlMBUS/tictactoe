import { useState, useEffect } from "react";
import { Link } from  'react-router-dom';

const Archive = () => {

    const [archives, setArchives] = useState([]);

    useEffect(() => {
        //useEffect to fetch only on page load
        fetch('http://localhost:8000/moves')
        .then((res) => res.json())
        .then(data => {
            setArchives(data);
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
                <h1>Tic-Tac-Toe</h1>
            </div>
            <table className="gameArchives">
                <thead>
                    <tr>
                        <th>Winner</th>
                        <th>Turns</th>
                        <th>Game</th>
                    </tr>
                </thead>
                { archives.map((singleArchive) => (
                    <tbody key={ `board${singleArchive.id}` }>
                        <tr>
                            { 
                            <td
                                id={ `board${singleArchive.id}` } >{ singleArchive.turn === 9 ? 'Tied' : singleArchive.other }
                            </td> 
                            }
                            { 
                            <td 
                                id={ `board${singleArchive.id}` } >{ singleArchive.turn }
                            </td> 
                            }
                            {
                            <td id="showBoard">
                                <Link to ={`/archive/${singleArchive.id}`}>
                                    Show
                                </Link>
                            </td>
                            }
                        </tr>
                    </tbody>
                ))}
            </table>
            <br />
        </div>
    );
}
 
export default Archive;
