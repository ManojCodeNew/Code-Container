import React, { useEffect, useState } from 'react';
// import {NavLink} from 'react-router-dom';
import "./View.css";
export default function View() {
  const [codeFile, setcodeFile] = useState([]);
  const [edit, setEdit] = useState(false);
  const [currentEditFileId, setCurrentEditFileId] = useState(null);

// Fetch Files
  useEffect(() => {
    view();
  }, [])

  const view = async () => {
    const response = await fetch("http://127.0.0.1:3000/viewcode");
    const encodedResult = await response.json();
    setcodeFile(encodedResult);
    console.log("encodedResult", encodedResult);

  }

  const deleteFile = async (e) => {
    const clickedFile_id = e.target.id;
    const response = await fetch('http://127.0.0.1:3000/viewcode/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clickedFile_id }),
    });
    const result = await response.json();
    if (result.msg === "deleted successfully") {
      view();
    }

  }

  const editFile = (e) => {
    setEdit(true);
    localStorage.setItem('editFile_id', e.target.id)
    window.location.href = `/codeEditor?id=${e.target.id}`;
  }

  const editFileName = (e) => {
    let currentClickedId = e.target.id;
    setCurrentEditFileId(currentClickedId);
  }

  const saveFileName = async () => {
    let editFileName = document.getElementsByClassName('editfilename-box');
    let currentFileName = editFileName[0].value;
    let uniqueFileName = codeFile.some((file) => file.filename === currentFileName);
    if (uniqueFileName) {
      alert(currentFileName + " already exists.");
    } else {
      let fileNameUpdateData = {
        id: currentEditFileId,
        updatedFileName: { filename: currentFileName }
      }
      let result = await sendToBackend(fileNameUpdateData, "updateFileName");
      // console.log("file name saved",result.modifiedCount);
      if (result.modifiedCount === 1) {
        window.location.reload();
      }

    }





  }
  const sendToBackend = async (data, path) => {
    const response = await fetch(`http://127.0.0.1:3000/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let result = await response.json();
    return result;
  }




  return (
    <div>
      Files
      <div className="codeFolder-container" >
        {codeFile.map((file) => (
          <div className='codeFolder-box' id={`file-${file._id}`} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" fill="currentColor"><path d="M22 8V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7H21C21.5523 7 22 7.44772 22 8ZM12.4142 5H2V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5Z"></path></svg>

            {currentEditFileId === file._id ? '' :
              <div className='codeFolder-name' onDoubleClick={editFileName} id={file._id} >{file.filename}</div>
            }

            {
              currentEditFileId === file._id && (

                <div className={file._id} id="editfilename-container">
                  <input type="text" className='editfilename-box' defaultValue={file.filename} />
                  <button className='save-editablefilename' onClick={saveFileName}>save</button>
                </div>
              )}


            <div className="modification-btn">
              <button type="submit" className='edit-btn' onClick={editFile} id={file._id}> Edit
              </button>
              <button type="submit" className='delete-btn' onClick={deleteFile} id={file._id}>Delete</button>
            </div>
          </div>
        ))}

      </div>

    </div>
  )
}
