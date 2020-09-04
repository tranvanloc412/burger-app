import React from 'react';

import Button from '../../UI/Button/Button'

const orderSummary = props => {
 
    const ingredientSummary =Object.keys(props.ingredients) 
    .map(ingredient => {
        return <li key={ingredient}>
            <span style={{textTransform: 'capitalize'}}>
                {ingredient} : {props.ingredients[ingredient]}
            </span>
        </li>
    });
    return (
        <React.Fragment>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>
                <strong>Total Price: {props.price}</strong>  
            </p>
            <p>Continue to check out</p>
            <Button clicked={props.purchaseCancelled} btnType="Danger">CANCEL</Button>
            <Button clicked={props.purchaseContinued} btnType="Success">CONTINUE</Button>
        </React.Fragment>
    )

};

export default orderSummary; 