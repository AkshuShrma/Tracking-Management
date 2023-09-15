import { createReducer, on } from "@ngrx/store";
import { Logout, saveNewLoginAPISucess } from "../actions/login.actions";

export const initialState= {
  data:null,
  logout:false
};
 
export const loginReducer = createReducer(
    initialState,
    on(saveNewLoginAPISucess, (state, { newLogin,logout }) => {
      var previousState = {...state};
      previousState.data = newLogin;
      previousState.logout = logout;
      //console.log(previousState)
      return previousState;
    }),
    on(Logout,(state,{data})=>{
      let newState = {...state};
       newState.data = data.result;
       newState.logout = data.logout;
       return newState;
   })
  );