import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '@/redux/slices/counterSlice';
import { RootState } from '@/redux/store';

const Counter: React.FC = () => {
    const count = useSelector((state: RootState) => state.counter.count);
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);

    return (
        <div>
            <h1>Counter: {count}</h1>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>

            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
            />
            <button onClick={() => dispatch(incrementByAmount(amount))}>
                Increment by {amount}
            </button>
        </div>
    );
};

export default Counter;