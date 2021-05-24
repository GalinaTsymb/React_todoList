
// изначальное состояние до вызывава каких либо action
const initialState = {
  fetching: true,
  todos_in_progress: null,
  todos_done: null

};

//обновляет store, вызывается каждый раз когда мы будем вызывать какое-то событие - action
//reducer - чистая функция
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_START':
      return { ...state, fetching: true };
    case 'FETCH_TODOS_END':
      return { ...state, fetching: false };

    case 'SET_TODOS':

      // если в получаемых todos нет задачи со статусом isActive = true,
      // тогда первому элементу добавляем ключ next = true, по этому ключу - во всем приложении мы знаем,
      // кокое todo следующее после активного

      const  setTodos  = action.payload;
      if(setTodos.in_progress[0].isActive === false){
        setTodos.in_progress[0].next=true;
      }

      return {...state, todos: action.payload, todos_in_progress: action.payload.in_progress, todos_done: action.payload.done};

    case 'ADD_TODO':
      const  newNameTodo            = action.payload;
      let { todos_in_progress }     = state;
      const newId                   = todos_in_progress[todos_in_progress.length-1].id + 1;

      //   если todos осталась одна - это значит у неё уже есть есть кнопки Complete and Delete.
      //   И если на данный момент, мы захотим добавить new todo,
      //   то новому todo добавляем ключ 'next = true'
      if(todos_in_progress.length === 1){
        todos_in_progress   = [...todos_in_progress, {
          id: newId,
          name: newNameTodo,
          isActive: false,
          next: true
        }];
      }
      else{
        todos_in_progress   = [...todos_in_progress, {
          id: newId,
          name: newNameTodo,
          isActive: false
        }];
      }


      return { ...state, todos_in_progress: [...todos_in_progress] };

    case 'MAKE_ACTIVE':

      const { todos_in_progress : makeTodosProgress } = state;
      const { todos_done : makeTodosDone }            = state;


      const itemIdx = makeTodosProgress.findIndex(item => item.id === +action.payload);


      if (itemIdx === -1) return state;


      const updateInProgress = makeTodosProgress.slice();
      const updateDone       = makeTodosDone.slice();


      //текущий todo, по которому произошел action
      const currentItem     = {...updateInProgress[itemIdx]};
      currentItem.isActive  = true;
      currentItem.startTime = new Date().toUTCString();
      delete currentItem.next;

      // предыдущий item (если он есть), то его удаляем из 'in_progress' и добавляем в 'done'
      let previousItem;
      if(updateInProgress[itemIdx - 1] !== undefined){

        previousItem              = {...updateInProgress[itemIdx - 1]};
        previousItem.isActive     = false;
        previousItem.finishedTime = new Date().toUTCString();

        updateDone.push(previousItem);
        updateInProgress.splice(itemIdx-1,1);

        // обрабатываем следующим item - добавляем ему ключ - next:true
        if(updateInProgress.length > 1){
          const nextItem = {...updateInProgress[itemIdx]};
          nextItem.next  = true;
          updateInProgress.splice(itemIdx, 1,nextItem );
        }

        updateInProgress.splice(itemIdx-1, 1, currentItem );

      }else{

        const nextItem  = {...updateInProgress[itemIdx+1]};
        nextItem.next   = true;

        updateInProgress.splice(itemIdx, 1, currentItem );
        updateInProgress.splice(itemIdx+1 , 1,nextItem );
      }
      return  { ...state, todos_in_progress: [...updateInProgress], todos_done: [...updateDone] };

    case 'DELETE_TODO_ITEM':

      const id = +action.payload;

      const { todos_in_progress : deleteTodos } = state;

      const itemIndex = deleteTodos.findIndex(item => item.id === id);

      if (itemIndex === -1) return state;

      //проверяем есть ли у удаляемого todo ключ 'next', если да то передаем его следующему todo
      if('next' in deleteTodos[itemIndex] && deleteTodos.length >2 ){
        deleteTodos[itemIndex+1].next = true;
      }

      // удаляем todo
      const newItems = deleteTodos.slice();
      newItems.splice(itemIndex, 1);

      return { ...state, todos_in_progress: [...newItems] };

    case 'TRANSFER_TODO_ITEM':
      const { todos_in_progress : transferInProgress } = state;
      const { todos_done : transferInDone  } = state;

      //проверяем на всякий случай, чтобы id совпадали
      const todoIdx = transferInProgress.findIndex(item => item.id === +action.payload);

      if (todoIdx === -1) return state;
      transferInProgress[todoIdx].finishedTime = new Date().toUTCString();
      transferInDone.push(transferInProgress[todoIdx]);
      transferInProgress.splice(transferInProgress[todoIdx], 1);

      return { ...state, todos_in_progress : [...transferInProgress], todos_done: [...transferInDone] };
    default:
      return state;
  }
};

export default reducer;