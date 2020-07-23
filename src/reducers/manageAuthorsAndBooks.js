// New Modular Reducer
import { combineReducers} from 'redux';
import uuid from 'uuid';

// MY ESTIMATE:
// combineReducers is being passed a precursor to the new state:
// an object with keys pointing to the function definitions that when INVOKED
// will produce the return values that will be the correct property values in the new state
// so presumably combineReducers is just going to iterate over this object invoking its values
// building a new object where those return values are the new property values
// and then returning that entire thing as the new state

// ANOTHER OBSERVATION:
// Eric said using combine reducers will change the structure of your state object
// so maybe this is what he meant.
// I'm noticing that the previous monolith reducer's case statement looked thus:
//     case "ADD_BOOK":
//       return {
//         ...state,
//         authors: [...state.authors],
//         books: [...state.books, action.book]

// WHEREAS THE NEW ONE LOOKS THUS:
//   case 'ADD_BOOK':
//     return [...state, action.book];

// so it looks like we are somehow returning 'substates' but still calling them state?
// we are returning state properties, or really property values; how has the state variable changed so much?

const rootReducer = combineReducers({
  authors: authorsReducer,
  books: booksReducer
});

export default rootReducer

function booksReducer(state = [], action) {
  let idx;

  switch ( action.type ) {
    case 'ADD_BOOK':
      return [...state, action.book];

    case 'REMOVE_BOOK':
      idx = state.findIndex( book => 
        book.id === action.id);
      return [...state.slice(0, idx), ...state.slice(idx+1)];
    
    default:
      return state;
  }
}

function authorsReducer(state = [], action) {
  let idx;

  switch (action.type) {
    case 'ADD_AUTHOR':
      return [...state, action.author]
      
    case 'REMOVE_AUTHOR':
      idx = state.findIndex(author => author.id === action.id);
      return [...state.slice(0, idx), ...state.slice(idx+1)];
    
    case 'ADD_BOOK':
      let existingAuthor = state.filter (
        author => author.authorName === action.book.authorName
      );
      if (existingAuthor.length > 0) {
        return state;
      } else {
        return [ ...state, {authorName: action.book.authorName, id: uuid() }];
      }
    
    default: 
      return state; 
  }  
}




// Old Single Reducer
// export default function bookApp(
//   // state and action are just parameters in the function definition
//   state = {
//     authors: [],
//     books: []
//   },
//   action
// ) { // this is the code block executed by the function

//   let idx; // declare but don't define idx, this is so that the same idx 
//   // is altered in any case and is available in the broader scope 

//   switch (action.type) {
//     // first case, if action.type === "ADD_BOOK" then clone state and add the book to the books array and return that whole new object
//     case "ADD_BOOK":
//       return {
//         ...state,
//         authors: [...state.authors],
//         books: [...state.books, action.book]
//       };
//     // 2nd case: to remove the book, first determine the index of the book to remove in the books array and assign to idx
//     // use .slice array method to slice from 0 up to idx (terminus not included) and again to slice from idx+1
//     // (need to go one ahead since start index is included) through the end of the array. subarrays combined with spread ops
//     case "REMOVE_BOOK":
//       idx = state.books.findIndex(book => book.id === action.id);
//       return {
//         ...state,
//         authors: [...state.authors],
//         books: [...state.books.slice(0, idx), ...state.books.slice(idx + 1)]
//       };
//       // same as with books but now with authors
//     case "ADD_AUTHOR":
//       return {
//         ...state,
//         books: [...state.books],
//         authors: [...state.authors, action.author]
//       };
//       // same as with books but now with authors
//     case "REMOVE_AUTHOR":
//       idx = state.authors.findIndex(author => author.id === action.id);
//       return {
//         ...state,
//         books: [...state.books],
//         authors: [...state.authors.slice(0, idx), ...state.authors.slice(idx + 1)]
//       };

//     default:
//       return state;
//   }
// }