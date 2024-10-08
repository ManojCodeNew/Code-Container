import React from 'react';
import './Notification.css';

export default function Notification() {
    return (
        <div className='Parent'>
            <div className="notification-container">
                <div className="notification-close">
                    X
                </div>
                <div className="notification-msg">
                    File Saved Succussfully!!!
                </div>
            </div>
        </div>
    )
}
