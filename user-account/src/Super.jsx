import React, { Component } from 'react';
import App from './App';
import LoginPage from './LoginPage';
import Login from './util/login';

class Super extends Component {
    constructor(){
        super();
        this.state = {
            uid: null,
            phone: null,
            name: null,
            sessions: null,
            loginValidated: true
        }
    }

    componentDidMount() {
        this.checkLoginToken();
    }

    checkLoginToken = () => {
        let token = localStorage.getItem('AMP_TK');
        if(token!==null){
            token = token.split('/');
            Login.ValidateByToken({
                "uid" : token[0],
                "hash" : token[1]
            }).then((result)=>{
                if(result.validated===true){
                    this.setState({
                        uid: result.uid,
                        phone: result.phone,
                        name: result.name,
                        loginValidated: true
                    });
                }
            });
        }
    }

    login = (loginObject) => {
        if(loginObject.validated===true){
            Login.ValidateByPhone({
                "phone" : loginObject.details.phone,
                "password" : loginObject.details.password
            }).then((result) => {
                if(result.validated===true){
                    localStorage.setItem('AMP_TK', result.token);
                    this.setState({
                        uid: result.uid,
                        phone: result.phone,
                        name: result.name,
                        loginValidated: true
                    });
                } else {
                    alert("Phone or password incorrect");
                }
            });
        }
    }

    logout = () => {
        localStorage.removeItem('AMP_TK');
        this.setState({
            loginValidated: false
        });
    }

    render() {
        return (
            <div>
            {
                this.state.loginValidated ? 
                <App phone={this.state.phone}
                     uid={this.state.uid}
                     name={this.state.name}
                     sessions={this.state.sessions}
                     logoutWorker={this.logout}/> : 
                <LoginPage onValidate={this.login}/>
            }
            </div>
        );
    }
}

export default Super;