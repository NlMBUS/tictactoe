import { Link } from  'react-router-dom';
const NotFound = () => {
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
            <div>
                <p>
                    Page not found.
                </p>
            </div>
        </div>
      );
}
 
export default NotFound;