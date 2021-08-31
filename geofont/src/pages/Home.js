import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Openlayer from '../components/openlayer.js'

const Home = (props) => {

const [obj, setobj] = useState(null);

    useEffect(()=> {
        if(props.location.state !==undefined)
            setobj(props.location.state.jsonObj)

        else 
        {
            setobj(null);
        } 
    },[props.location])

    return (
        <div className = "maps">
            { obj !== null? 
            <Openlayer jsonObj={obj} />
            : <Link to="/import"> <h2 className="Message"> Przejdz do import </h2> </Link>
            }

        </div>
    )
}

export default Home
