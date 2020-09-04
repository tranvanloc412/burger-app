import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/BuildControls/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);
    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.order.error);
    const isAuthenticated = useSelector(state =>  state.auth.token !== null);

    const dispatch = useDispatch();
    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const disabledInfo = {
        ...ings
    };

    for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
    };

    const updatePurchaseState = ingredients =>  {

        const sum = Object.keys(ingredients)
            .map(ingredient => {
                return ingredients[ingredient];
            })
            .reduce((acc, current) => acc + current, 0);
        
        return sum > 0;
    };

    const purchaseHandler = () => {
        if (isAuthenticated){
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler =() => {
        onInitPurchase();
        props.history.push('/Checkout');
    };

    let orderSummary = null;

    let burger = error ? <p>ingredients can't be loaded</p> : <Spinner />;

    if (ings) {
        burger = (
            <React.Fragment>
                <Burger ingredients={ings}/>
                <BuildControls 
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved} 
                    price={totalPrice}
                    isAuth={isAuthenticated}
                    purchasable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    disabled={disabledInfo}/>
            </React.Fragment>
        );
        orderSummary = (
            <OrderSummary
                    ingredients={ings}
                    price={totalPrice}
                    purchaseCancelled={purchaseCancelHandler}
                    purchaseContinued={purchaseContinueHandler} />
        )
    };

    return (
        <React.Fragment>
            {burger}            
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
        </React.Fragment>
    );
};

export default withErrorHandler(BurgerBuilder, axios);