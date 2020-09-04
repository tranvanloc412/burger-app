import React from 'react';

import classes from  './Burger.css';
import BurgerIngredients from './BurgerIngredients/BurgerIngredients';

const burger = props => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(ingredient => {
            return [...Array(props.ingredients[ingredient])]
                .map((_,index) => (
                    <BurgerIngredients type={`${ingredient}`} key={`${ingredient}${index}`}/>
                ));
        })
        .reduce((acc, current) => {
            return acc.concat(current);
        },[]);
        
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding Ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredients type="bread-top" />
                {transformedIngredients}
            <BurgerIngredients type="bread-bottom"/>
        </div>
    );
};

export default burger;