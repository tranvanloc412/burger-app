import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../axios-order';
import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner'    


const Orders = props  => {
    const orders = useSelector(state => state.order.orders);
    const loading = useSelector(state => state.order.loading);
    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.userId);

    const dispatch = useDispatch();
    
    useEffect( () => {
        dispatch(actions.fetchOrders(token, userId));;
    }, [dispatch, token, userId]);
        
    let order = null;

    if(loading) {
        order= <Spinner /> 
    };

    if (orders) {
        order = (orders.map(order => <Order 
                    key={order.id} 
                    ingredients={order.ingredients}
                    price={+order.price}/>
                    )
                );
    };

    return (
        <div>
            {order}
        </div>
    );
};

export default withErrorHandler(Orders, axios);