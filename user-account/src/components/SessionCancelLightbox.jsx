import React, { Component } from 'react';
import './css/SessionCancelLightbox.css';

class SessionCancelLightbox extends Component {
    render() {
        return (
            <div className="lightbox-shadow">
                <div className="cancel-lightbox">
                    <div className="cancel-container">
                        <h1>CANCEL SESSION</h1>
                        <p>Are you sure you want to cancel this session?</p>

                        <button className="button btn-thin" onClick={this.props.decline}>CLOSE</button>
                        <button className="button btn-thin confirm" onClick={this.props.confirm}>CONFIRM</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SessionCancelLightbox;