import React, {useEffect, useState, useRef, useMemo} from 'react';
import { connect } from 'react-redux';

import List from './components/List';
import ListItem from './components/ListItem';
import Loading from "./components/Loading";
import CompleteBtn from "./components/CompleteBtn";


import { bindActionCreators } from 'redux';

import * as actions from './actions';



const App = props => {

    const { setTodos,
            todos_in_progress,
            todos_done,
            startLoad,
            fetching,
            endLoad,
            addTodo,
            makeActive,
            deleteItem,
            transferTodoItem} = props;

    const addInputRef = useRef();

   useEffect(() => {
        (async () => {
            startLoad();
            const { in_progress, done } = await fetch('/todos.json').then(res =>
                res.json()
            );
            setTodos({
                in_progress,
                done,
            });
            endLoad();
        })();

    }, []);

    const [search, setSearch] = useState("");

     const todos_inProgress    = useMemo(() => {

         if(!search || search.length <3) return todos_in_progress;

         return todos_in_progress.filter(({name}) => {
             return name.toLowerCase().search(search.toLowerCase())!== -1;
         });
     }, [search, todos_in_progress]);


    const todos_dones = useMemo(() => {
        if(!search || search.length <3)
            return todos_done;
        return todos_done.filter(({name}) => {
            return name.toLowerCase().search(search.toLowerCase())!== -1;
        });

    }, [search, todos_done]);




    const sendInputValue = () => {
        const inputValue = addInputRef.current.value;
        addTodo(inputValue);
        addInputRef.current.value = '';
    };


    // функция вызывается в каждом ListItem (render) - done
    const renderDoneItem = ({ name, finishedTime }) => (
        <>
      <span className='badge'>
        {new Date(finishedTime).toLocaleTimeString()}
      </span>
            {name}
        </>
    );

    const makeActiveitem = (event) => {
        const id = event.target.id;
        makeActive(id);
    };

    const deleteTodoItem = (event) => {
        const id = event.target.id;
        deleteItem(id);
    };

    // это отрабатывает кнопка Complete, которую Вы сказали дописать
    const transferLastItem = () => {
        const id =  todos_inProgress[0].id;
        transferTodoItem(id);
    };

    // это я уже сама дописала, кнопку удалить - когда остается последний todo, есть выбор или Complete или Delete
    const deleteLastItem = () =>{
        const id = todos_inProgress[0].id;
        deleteItem(id);
    };



    const renderInProgressItem = ({ name, id, isActive, next }) =>{
        return (
            <>
                {name}
                { (!isActive && next) &&
                    <>
                    <button type='button' id={id} onClick={makeActiveitem} className='btn btn-primary'>
                    Start
                    </button>
                    <button type='button' id={id} onClick={deleteTodoItem} className='btn btn-danger'>
                    Del
                    </button>
                    </>
                }
                {
                    (!isActive && !next) &&
                        <>
                            <button type='button'  id={id} onClick={deleteTodoItem} className='btn btn-danger'>
                                Del
                            </button>
                        </>
                }
            </>
        )
    };

    return (
        <div className='container'>
            <h1>Todo React APP</h1>
            <div className='row'>
                <div className='col-xs-12'>
                    <form>
                        <div className='form-group'>
                            <label htmlFor='addInput'>New Todo Item: </label>
                            <input
                                ref={addInputRef}
                                id='addInput'
                                type='text'
                                className='form-control'
                                placeholder='New todo name'
                                />
                        </div>
                        <button type='button' onClick={sendInputValue}  className='btn btn-success pull-right'>
                            Add New Item
                        </button>
                    </form>
                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='col-xs-12'>
                    <label htmlFor='searchInput'>Search todo: </label>
                    <input
                        id='searchInput'
                        type='text'
                        className='form-control'
                        placeholder='Search item...'
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)}
                    />

                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='col-xs-12 col-sm-6'>
                    <h3>Todos in progress</h3>
                       { fetching ? (
                            <Loading />
                            ) : (
                                <List>
                                    {
                                       todos_inProgress.map( item => {const { id } = item;


                                        return ( <ListItem key={id} item={item} render={renderInProgressItem}/>);

                                 })}
                                </List>
                        )}
                    {!fetching && todos_inProgress.length === 1 ? (<CompleteBtn transfer={transferLastItem} deleteBtn={deleteLastItem}/>): '' }
                    <p>Things to do: {!fetching ? todos_inProgress.length : 0}</p>
                </div>
                <div className='col-xs-12 col-sm-6'>
                    <h3>Done</h3>

                        {fetching ? (
                            <Loading />
                        ) : (
                            <List>
                            {todos_dones.map(({ id, ...item }) => (

                                    <ListItem key={id} item={item} render={renderDoneItem} />
                        ))}
                        </List>
                        )}

                    <p>Done: {!fetching ? todos_dones.length : 0}</p>
                </div>
            </div>
        </div>
    );
};


const mapStateToProps = state => ({
    fetching: state.fetching,
    todos_in_progress: state.todos_in_progress,
    todos_done: state.todos_done

});



const mapDispatchToProps = dispatch => {
    const { startLoad, setTodos, endLoad, addTodo, makeActive, deleteItem, transferTodoItem } = bindActionCreators(
        actions,
        dispatch
    );

    return {
        startLoad,
        endLoad,
        setTodos: list => setTodos(list),
        addTodo: inputValue => addTodo(inputValue),
        makeActive: id => makeActive(id),
        deleteItem: id => deleteItem(id),
        transferTodoItem: id => transferTodoItem(id)

    };
};
//connect - принимает список свойств (mapStateToProps), которые мы хотим получить из нашего хранилища и
// генерирует для них dispatch  функции (mapDispatchToProps) которые мы бцдем вызывать чтобы обновить наше хранилище
export default connect(mapStateToProps, mapDispatchToProps)(App);