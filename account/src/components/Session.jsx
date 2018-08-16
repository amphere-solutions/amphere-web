import React, { Component } from 'react';
import './css/Session.css';
import SessionCancelLightbox from './SessionCancelLightbox';

import SessionUtil from '../util/session';
import SessionFirebase from '../util/Database';
var Timer = SessionFirebase.firebase.database();

class Session extends Component {

    constructor() {
        super();
        this.state = {
            sid: null,
            mid: null,
            device: null,
            duration: null,
            activated: false,
            expired: false,
            startTime: 0,
            timeRemain: 0,
            cancelLightboxOpen: false,
            amount: 10
        }
    }    

    componentWillMount() {
        this.setState({
            sid: this.props.sid,
            mid: this.props.mid,
            device: this.props.device,
            duration: this.props.duration,            
            timeRemain: this.props.duration,
            startTime: this.props.startTime,
            activated: this.props.activated,
            expired: this.props.expired
        });
    }

    componentDidMount() {
        SessionFirebase.firebase.database().ref().child('sessions').orderByChild('sid').equalTo(this.state.sid)
        .once('child_changed', (session, prevChildKey)=>{
            if(session.val().activated===true){
                this.setState({
                    startTime: session.val().startTime,
                    activated: true
                });
                Timer.ref('time').on('value', (time) => this.TimingFunction(time.val()));
                this.CalculateAmount(this.state.duration - this.state.timeRemain);
            } 
            if(session.val().expired===true){
                this.expire();
            } 
            if(session.val().isDeleted===true){
                this.props.complete();
            }
        });

        if(this.state.activated===true) Timer.ref('time').on('value', (time) => this.TimingFunction(time.val()));
    }

    expire = () => {
        Timer.ref('time').off('value');
        this.CalculateAmount(this.state.duration - this.state.timeRemain);
        this.setState({
            expired: true,
            activated : false,
            timeRemain: 0
        });
    }
    
    cancelSession = () => {
        this.cancelConfirmationDialog(false);
        if(this.state.activated===true){
            if(this.state.timeRemain <= (this.state.duration - 5)){
                alert("Session cannot be cancelled after more than 5 minutes of activation");
            } else {
                this.setState({ activated : false });
                Timer.ref('time').off('value');
                this.CalculateAmount(this.state.duration - this.state.timeRemain);
                SessionUtil.CancelActiveSession({
                    "sid": this.state.sid
                }).then((res)=>{
                    if(res.cancelled===true){
                        this.props.cancel();
                    }
                }).catch((err)=>{
                    alert(err);
                });
            }
        } else if(this.state.expired===true){
            alert("Session has already expired");
        } else {
            Timer.ref('time').off('value');
            SessionUtil.CancelSession({
                "sid": this.state.sid,
                "exp": "USER-CANCELLED"
            }).then((res)=>{
                if(res.cancelled===true){
                    this.props.cancel();
                }
            }).catch((err)=>{
                alert(err);
            });
        }
    }

    cancelConfirmationDialog = (state) =>  this.setState({ cancelLightboxOpen: state });

    //  ================================== SESSION TIMING FUNCTION ================================== //
        
    TimingFunction = (time) => {
        let timeElapsed = time - this.state.startTime;
        let _timeRemain = this.state.duration - timeElapsed;
        this.CalculateAmount(timeElapsed);
        if(_timeRemain>0){
            this.setState({timeRemain: _timeRemain});
        } else {
            this.expire();
        }
    }

    //  ================================== AMOUNT CALCULATION ================================== //

    CalculateAmount = (timeElapsed) => {
        let amt;

        let activated = this.state.activated;
        let device = this.state.device;
        let duration = this.state.duration;

        if(activated) {
            if(timeElapsed<=5) {
                amt = 10;
            } else {
                if(device==="iOS") {
                    if(duration < 50 ) amt = 30;
                    else amt = 40
                } else if (device==="microUSB" || device==="USB-C") {
                    if(duration < 50 ) amt = 20;
                    else amt = 30
                }
            }
        } else {
            amt = 0;
        }

        this.setState({ amount : amt });
    }

    render() {
        return (
            <div className="session">

                <div className="session-details-container">
                    <div className="session-number">
                        <strong>{this.state.device} SESSION</strong>
                    </div>                    
                    
                    <button className="session-cancel-button" onClick={() => this.cancelConfirmationDialog(true)}>Cancel</button>
                    
                    <p className="session-detail-location"><b>Location Code:</b> {this.state.mid}</p>
                    <p className="session-detail-duration"><b>Duration:</b> {this.state.duration} mins</p>

                    <div className="session-detail-time">
                        <p className="session-time-counter"><b>{this.state.timeRemain}</b></p>
                        <p className="session-time">min<br/>left</p>
                    </div>

                </div>

                {
                    this.state.activated ? <div className="active purda"><p>Your session is running</p></div> : (
                        this.state.expired ? <div className="expiry purda"><p>Your session has expired. <b>Amount: Rs.{this.state.amount}</b></p></div> : (
                            <div className="prestart purda"><p>Give your OTP to start session</p></div>
                        ) 
                    )
                }

                {
                    this.state.cancelLightboxOpen ? (
                        <SessionCancelLightbox 
                            confirm={()=>this.cancelSession()} 
                            decline={() => this.cancelConfirmationDialog(false)}
                            active={this.state.activated}
                            amount={this.state.amount}/>
                    ) : console.log()
                }
            </div>
        );
    }
}

export default Session;