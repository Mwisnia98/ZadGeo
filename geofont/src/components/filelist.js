import React from 'react'
import '../style/dropzone.css'

const filelist = ({item, onRemove}) => {




    return (
        <li className="text-sm-left p-1 oneList">
                  <p>{item.name}</p>
                  <button className="butt" type="button"  title="Remove file" onClick={() =>onRemove(item)}>remove</button>
        </li>
    )
}

export default filelist
