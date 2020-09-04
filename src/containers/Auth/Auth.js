import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Redirect} from 'react-router-dom';

import classes from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import {updateObject, checkValidity} from '../../shared/utility';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

const Auth = props => {
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Mail Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });

    const dispatch = useDispatch();

    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);
    const isAuthenticated = useSelector(state => (state.auth.token !== null));
    const buildingBurger = useSelector(state => state.burgerBuilder.building);
    const authRedirectPath = useSelector(state => state.auth.authRedirectPath);

    const [isSignup, setIsSignup] = useState(true);

    useEffect(() => {
        if(!buildingBurger && authRedirectPath !== '/') {
            dispatch(actions.setAuthRedirectPath('/'));
        }
    }, [dispatch, buildingBurger, authRedirectPath]);

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(actions.auth(controls.email.value, controls.password.value, isSignup));
    };

    const inputChangedHandler = (event, controlName) => {
       
        const updatedControls = updateObject(controls, {
            [controlName] : updateObject(controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true,
            })
        });
        setControls(updatedControls);
    };
   

    const formElementsArray = [];
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        });
    };
    
    let form = formElementsArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    touched={formElement.config.touched}
                    shouldCheckValid={formElement.config.validation.required}                    
                    changed={(event) => inputChangedHandler(event, formElement.id)} />
            ));
    if (loading) {
        form = <Spinner />
    };

    let errorMessage = null;
    if (error) { 
        errorMessage = (
            <p>{error.message}</p>
        )
    };

    let authRedirect = null;
    if (isAuthenticated) {
        authRedirect = <Redirect to={   authRedirectPath} />
    };

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
             <form onSubmit={submitHandler}>
                {form}
                <Button  btnType="Success" clicked={submitHandler}>SUBMIT</Button>
            </form>
            <Button
            clicked={switchAuthModeHandler}
            btnType="Danger">SWITCH TO {isSignup ? 'SINGIN' : 'SIGNUP'}</Button>
        </div>
    )
};

export default Auth;