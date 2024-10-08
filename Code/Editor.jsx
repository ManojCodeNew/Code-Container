import React, { useEffect } from 'react'
import { useState, useRef } from "react";
import Notification from './Notification';
// import LoadingBar from './LoadingBar';
// import {useLocation} from 'react-router-dom';
import "./Editor.css";
export default function Editor() {
    const [htmlcode, sethtmlcode] = useState('');
    const [csscode, setcsscode] = useState('');
    const [jscode, setjscode] = useState('');
    const [active, setActive] = useState('html-page');
    const [filename, setfilename] = useState('');
    const [editPage, setEditPage] = useState(false);

    const htmlPage = document.getElementById("html-page");
    const cssPage = document.getElementById("css-page");
    const jsPage = document.getElementById("js-page");
    const save_PopUpModal = document.getElementById('save-PopUpModal_id');

    // useRef() Hook which is used to store the reference of the new tab So it will help us to persist already opened output page it every run. 
    const outputWindowRef = useRef(null);

    useEffect(() => {
        // This will retrieve the queryString of the url
        let urlQueryString = window.location.search;
        if (urlQueryString) {
            setEditPage(true);
            editFile(urlQueryString);
        }
        else {
            setEditPage(false);

        }


    }, [])
    const editFile = async () => {
        let editFileId = getCurrentEditFileId();
        let fileId = {
            id: editFileId
        };
        let result = await sendtobackend(fileId, 'editFile');
        sethtmlcode(result.htmlcode);
        setcsscode(result.csscode);
        setjscode(result.jscode);

    }

    // Get editFile Id
    const getCurrentEditFileId = () => {
        let urlQueryString = window.location.search;
        // This will remove the ?() symbol in urlQuerytring
        let queryParams = new URLSearchParams(urlQueryString);
        let editFileId = queryParams.get('id');
        return editFileId;
    }
    // send data to the backend 
    const sendtobackend = async (data, path) => {
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

    const updateFile = async () => {
        let updatedCode = {
            htmlcode: htmlcode,
            csscode: csscode,
            jscode: jscode
        }
        let editFileData = {
            id: getCurrentEditFileId(),
            code: updatedCode
        }
        let result = await sendtobackend(editFileData, 'updateFile');
        console.log("Update", result);


    }
    const run = () => {
        const completeCode = `
        <html>
            <head>
                <style>${csscode}</style>
            </head>
            <body>
                ${htmlcode}
                <script>${jscode}</script>
            </body>
        </html>
        `;

        if (!outputWindowRef.current || outputWindowRef.current.closed) {
            outputWindowRef.current = window.open();
        }
        outputWindowRef.current.document.open();
        outputWindowRef.current.document.write(completeCode);
        outputWindowRef.current.document.close();

        // while you hit run button it will open existed output page
        outputWindowRef.current.focus();

        outputWindowRef.current.document.title = "MCode Output";

    }
    // Key handler

    useEffect(() => {
        const handleKeyAction = (event) => {
            if (event.ctrlKey) {
                if (event.key === 's') {
                    event.preventDefault();
                } else if (event.key === "r") {
                    run();
                    event.preventDefault();
                }
            }
        }
        window.addEventListener('keydown', handleKeyAction);
        return () => {
            window.removeEventListener('keydown', handleKeyAction);
        }
        // eslint-disable-next-line
    }, [htmlcode, csscode, jscode])

    const codeSaveBtn = (e) => {
        // hanging Save text to Update
        if (e.target.value === "Update") {
            updateFile();
        } else {
            if (save_PopUpModal) {
                if (save_PopUpModal.style.display === "none") {
                    save_PopUpModal.style.display = "block";
                } else {
                    save_PopUpModal.style.display = "none";
                }
            } else {
                alert("No PopUpModel");
            }
        }
    }

    // save code
    const saveCodeBtn = async () => {
        const response = await fetch('http://127.0.0.1:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: filename,
                htmlcode: htmlcode,
                csscode: csscode,
                jscode: jscode
            }),
        });
        const result = await response.json();
        if (result.msg) {
            save_PopUpModal.style.display = "none";
        }
    }
    // code save cancel
    const saveCancelBtn = () => {
        save_PopUpModal.style.display = "none";
    }

    // Page title click action
    const codePageClick = (e) => {
        const page_id = e.target.className;
        pageVisibleHandle(page_id);
    }
    // HTML CSS JS page visible 
    const pageVisibleHandle = (page_id) => {

        if (page_id === htmlPage.id) {
            setActive(page_id);
            htmlPage.style.display = "block";
            cssPage.style.display = "none";
            jsPage.style.display = "none";

        } else if (page_id === cssPage.id) {
            setActive(page_id);
            cssPage.style.display = "block";
            htmlPage.style.display = "none";
            jsPage.style.display = "none";
        } else if (page_id === jsPage.id) {
            setActive(page_id);
            jsPage.style.display = "block";
            cssPage.style.display = "none";
            htmlPage.style.display = "none";
        }
    }

    return (
        <>

            <Notification />
            <div className="viewCode">
                <a href="http://localhost:3001/viewCode">viewCode</a>
            </div>
            {/* <LoadingBar/> */}
            <button className='codesave-button' onClick={codeSaveBtn} value={editPage ? "Update" : "Save"}>{editPage ? "Update" : "Save"}</button>
            <div onClick={run} className='coderun-button'>
                RUN
            </div>
            <div className="container">
                <div className="codePage-title" onClick={codePageClick}>
                    <label id='title-Html' className='html-page' style={{ 'backgroundColor': active === "html-page" ? 'gray' : 'black' }}>HTML</label>
                    <label id='title-Css' className='css-page' style={{ 'backgroundColor': active === "css-page" ? 'gray' : 'black' }}>CSS</label>
                    <label id='title-Js' className='js-page' style={{ 'backgroundColor': active === "js-page" ? 'gray' : 'black' }}>JavaScript</label>
                </div>

                <div className="Pages">
                    <textarea
                        id='html-page'
                        placeholder='Enter the code'
                        value={htmlcode}
                        onChange={(e) => sethtmlcode(e.target.value)}
                    >
                    </textarea>

                    <textarea
                        id='css-page'
                        placeholder='Enter the code'
                        value={csscode}
                        onChange={(e) => setcsscode(e.target.value)}>
                    </textarea>

                    <textarea
                        id='js-page'
                        placeholder='Enter the code'
                        value={jscode}
                        onChange={(e) => setjscode(e.target.value)}>
                    </textarea>
                </div>

            </div>
            {/* Pop Up model */}
            <div
                className="save-PopUpModal"
                id='save-PopUpModal_id'>
                <div className="folderIcon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" fill="black" id='folder-Icon'><path d="M22 8V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7H21C21.5523 7 22 7.44772 22 8ZM12.4142 5H2V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5Z"></path></svg>
                </div>
                <div className="folderName-container">
                    <label className='folderName-title'>File name :  </label>
                    <input type="text" name="folderName-Box" className='folderName-Box' onChange={(e) => setfilename(e.target.value)} />
                </div>
                <div className="savecancel-btn">
                    <button type="submit" className='cancel-btn' onClick={saveCancelBtn}>Cancel</button>
                    <button type="submit" className='save-btn' onClick={saveCodeBtn}>Save</button>
                </div>
            </div>

        </>
    )
}
