export const setTodos = todoItems => {
    return {
        type: 'SET_TODOS',
        payload: todoItems,
    };
};

export const addTodo = inputValue => {
    return {
        type: 'ADD_TODO',
        payload: inputValue,
    };
};

export const makeActive = id => ({
    type: 'MAKE_ACTIVE',
    payload: id,
});

export const deleteItem = id => ({
    type: 'DELETE_TODO_ITEM',
    payload: id
});

export const transferTodoItem = id => ({
    type: 'TRANSFER_TODO_ITEM',
    payload: id
});

export const startLoad = () => ({
    type: 'FETCH_TODOS_START',
});

export const endLoad = () => ({
    type: 'FETCH_TODOS_END',
});