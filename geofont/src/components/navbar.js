import { Link } from 'react-router-dom'
import '../style/navbar.css'

const navbar = () => {



    return (
        <header className="navigations">
            <Link to="/" ><p className="BackToHome">Home</p> </Link>
            <div className="navdiv">
                
                <Link to="/import">
                    <button className="btnss">
                        Import
                    </button>
                </Link>
            </div>
        </header>
    )
}

export default navbar
