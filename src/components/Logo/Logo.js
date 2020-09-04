import React from 'react';

import classes from './Logo.css';
import burgerLogo from '../../assets/images/burger-logo.png';
import {NavLink} from 'react-router-dom';

const logo = props => {
    return (
        <div className={classes.Logo}>
            <NavLink to='/' exact >
                <img src={burgerLogo} alt="Logo" />
            </NavLink> 
        </div>  
    );
};

export default logo;