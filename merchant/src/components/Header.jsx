import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import './css/Header.css';
import $ from 'jquery';

class Header extends Component {

    componentDidMount(){
        $(window).on("scroll", function() {
            if($(window).scrollTop() > 50) {
                $("header").addClass("active");
            } else {
               $("header").removeClass("active");
            }
        });
    }
    
    render() {
        return (
            <header>
                <Image className="logo-text" src="assets/amphere-text.svg" />

                <input id="sidebar-toggle" type="checkbox" className="checkbox" />
                <div className="sidebar-shadow"></div>
                <div className="sidebar">
                    {
                        this.props.button ? 
                        <div className="sidebar-banner">
                            <div className="sidebar-banner-container">
                                <p>MY ACCOUNT</p>
                                <h2>Hey {this.props.name}!</h2>
                                <p>+91 {this.props.phone}</p>
                            </div>
                            
                        </div>
                        : console.log()
                    }
                    <nav className="sidebar-nav">
                        <ul>
                            <li><a>HOME</a></li>
                            <li><a>CONTACT</a></li>
                            <li><a>ABOUT</a></li>
                        </ul>
                    </nav>
                </div>
                <label htmlFor="sidebar-toggle" className="hamburger"></label>
                {
                    this.props.button ? 
                        <button className="button btn-small btn-noborder" 
                                onClick={()=>this.props.logoutWorker()}>Logout
                        </button> 
                        : console.log()
                }
            </header>
        );
    }
}

export default Header;