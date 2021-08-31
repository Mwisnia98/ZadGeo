
import 'react-dropzone-uploader/dist/styles.css'
import '../style/dropzone.css'
import axios from 'axios'
import { useState } from 'react'
import React from "react";
import Filelist from './filelist'
import { useHistory  } from "react-router-dom";




const MyDropzone = () => {
  const history = useHistory();

  const [file,setFile] = useState([]);


  const onChange = (event) =>  {
    event.preventDefault();
    let list = [];
    for (let g = 0; g < event.target.files.length; g++) {
      list.push(event.target.files[g])
      
    }
    setFile(prev => [...prev,...list])

  }
  const remove = (i) => {
    setFile(file.filter((f) => f.name !== i.name))
    if(file.length === 1){

      setFile([])
    }
    
  }
  const dragover = (event) => {
    event.preventDefault();
    // Add some visual fluff to show the user can drop its files
    if (!event.currentTarget.classList.contains('bg-green-300')) {
      event.currentTarget.classList.remove('bg-gray-100');
      event.currentTarget.classList.add('bg-green-300');
    }
  }
  const dragleave = (event) => {
    // Clean up
    event.currentTarget.classList.add('bg-gray-100');
    event.currentTarget.classList.remove('bg-green-300');
  }
  const drop = (event) => {
    event.preventDefault();
    setFile(prev => [...prev,...event.dataTransfer.files])

  }


      const SendToApi = async() => {
        const formData = new FormData();
        file.forEach(z=> formData.append('files',z))


        const resp = await axios.post('https:localhost:5001/import',formData, {headers: {'Content-Type': 'multipart/form-data'}})
        //logika dla zapisu jsona z resp dla setJsonObject i przeslanie jej do link

        history.push({
          pathname: '/',
          state: { jsonObj: resp.data}
        })



        
    }

    
    

    
      return (
        <div className=" main" id="app">
          <div className="0 spaceupload" onDragOver={dragover} onDragLeave={dragleave} onDrop={drop}>
            <input type="file" multiple name="fields[assetsFieldHandle][]" id="assetsFieldHandle" 
              className=" inputclass" onChange={onChange}  accept=".shp,.shx,.dbf,.prj" />
          
            <label  className="lab">
              <div>
                Wrzuć pliki lub
                <span className="underline"> kliknij tutaj</span> aby dolaczyc pliki
              </div>
            </label>
            <ul className="mt-4 listofFile">
              {file.map((files,i) => (
                  
                    <Filelist key={i} item={files} onRemove={remove} />
              
                 ))}

            </ul>
            <div className="uploadtoapi">
              <button className="btn btn-primary" onClick={SendToApi}>Submit</button>
            </div>
          </div>
        </div>
      )
  }

export default MyDropzone