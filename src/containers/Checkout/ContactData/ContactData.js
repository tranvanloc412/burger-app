import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
// import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
// import axios from '../../../axios-order';
import Input from '../../../components/UI/Input/Input';
// import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/order';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../../shared/utility';


const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false,
                touched: false
                
            },
            street:{
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    isNumeric: true,
                    minLength: 3
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                validation: {
                    required: false,
                },
                valid: true,
                value: 'fastest',
                touched: false,
            },
    });

    const [formIsValid, setFormIsValid] = useState(false);

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
    const loading = useSelector(state => state.order.loading);
    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.userId);

    const dispatch = useDispatch();

    const inputChangedHandler = (event, input) => {
        const updateOrderFormEL = updateObject(orderForm[input], {
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[input].validation),
            touched: true
        });

        const updateOrderForm = updateObject(orderForm,{
            [input]: updateOrderFormEL
        });
        
        let formIsValid = true;
        for (let formElementIdentifier in updateOrderForm) {
            formIsValid = updateOrderForm[formElementIdentifier].valid && formIsValid;
        };

        setFormIsValid(formIsValid);

        updateOrderForm[input] = updateOrderFormEL;
        setOrderForm(updateOrderForm);
    }


    const orderHandler = (event) => {

        event.preventDefault();

        const formData = {};
     
        for(let formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        };
        
        const order ={
            ingredients: ings,
            price: totalPrice,
            orderData: formData,
            userId: userId
        };

        dispatch(actions.purchaseBurger(order, token));
    }
  
    const formElementsArray = [];
    for (let key in orderForm) {
        formElementsArray.push({
            id: key,
            config: orderForm[key]
        });
    };

    let form = (<form onSubmit={orderHandler}>
                    {formElementsArray.map(formElement => (
                        <Input 
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            touched={formElement.config.touched}
                            shouldCheckValid={formElement.config.validation.required}
                            changed={(event) => inputChangedHandler(event, formElement.id)} />
                    ))}
                    <Button disabled={!formIsValid} btnType="Success" clicked={orderHandler}>ORDER</Button>
                </form>);

    if ( loading ) {
        form = <Spinner />;
    };
    
    return (
        <div className={classes.ContactData}>
            <h1>Please enter your Info</h1>
            {form}     
        </div>
    );
};
   

export default ContactData;