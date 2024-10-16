/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { addTodo, getTodos, deleteTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterOptions } from './types/FilterOptions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.DEFAULT,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.NO_ERROR,
  );
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isReceivingAnswer, setIsReceivingAnswer] = useState(false);


  const handleErrorReset = () => {
    setErrorMessage(ErrorMessages.NO_ERROR);
  };

  const handleErrorMessage = (error: ErrorMessages) => {
    setErrorMessage(error);
    setTimeout(handleErrorReset, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleErrorMessage(ErrorMessages.UNABLE_TO_LOAD_TODO);
      });
  }, []);

  const handleAddTodo = (newTodo: Todo) => {
    setTempTodo(newTodo);
    setIsReceivingAnswer(true);

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTitle('')
      })
      .catch(() => {
        handleErrorMessage(ErrorMessages.UNABLE_TO_ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setIsReceivingAnswer(false);
      });
  };

  const handleTodoDelete = (id: number) => {
    deleteTodo(id)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id)),
      )
      .catch(() => {
        handleErrorMessage(ErrorMessages.UNABLE_TO_DELETE_TODO);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={handleAddTodo}
          onCheckForErrors={handleErrorMessage}
          receivingAnswer={isReceivingAnswer}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={todos}
          filterOption={filterOption}
          onTodoDelete={handleTodoDelete}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            currentFilter={filterOption}
            onFilterOptionChange={setFilterOption}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onResetError={handleErrorReset}
      />
    </div>
  );
};
