import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  CREATE_POST,
  FETCH_POSTS,
  FETCH_POST,
  DELETE_POST,
  UPDATE_POST
 } from './types';

import authReducer from '../reducers/auth_reducer';
import postReducer from '../reducers/reducer-posts';

const ROOT_URL = 'http://localhost:3000';

let config;

function setHeader() {
  config = { headers: { authorization: localStorage.getItem('token') } };
}

export function signinUser({ email, password }){
	return function(dispatch){
		axios.post(`${ROOT_URL}/signin`, {email, password})
 			.then(response => {
 				dispatch({ type: AUTH_USER });
 				localStorage.setItem('token', response.data.token);
 				browserHistory.push('/newitem');
      	setHeader();
      })
      .catch(response =>  dispatch(authError("There was a something wrong with your request.")));
	}
}

export function signoutUser(){
   localStorage.removeItem('token');
   return {type: UNAUTH_USER};
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    // Submit email/password to the server
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({type: AUTH_USER});
          //update the token
          localStorage.setItem('token', response.data.token);
          setHeader();
          browserHistory.push('/items');
      })
      .catch(response => dispatch(authError(response.data.error)));
  }
}


export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function createPost(props) {
  setHeader();
  return function(dispatch) {
    axios.post(`${ROOT_URL}/newitem`, { props }, config )
    .then(response => {
        dispatch({
          type: CREATE_POST,
          payload: response
        });
      browserHistory.push('/items');
    });
  }
}

export function updatePost(props, id) {
  return function(dispatch) {
    axios.put(`${ROOT_URL}/items/${id}`, { props }, config)
      .then(response => {
        dispatch({
          type: UPDATE_POST,
          payload: response
        });
        browserHistory.push('/items');
      });
  }
}

export function fetchPosts() {
  setHeader();
  return function(dispatch) {
    axios.get(`${ROOT_URL}/items`, config)
      .then(response => {
        dispatch({
          type: FETCH_POSTS,
          payload: response
        });
      });
  }
}

export function fetchPost(id) {
  setHeader();
  return function(dispatch) {
    axios.get(`${ROOT_URL}/items/${id}`, config)
      .then(response => {
        dispatch({
          type: FETCH_POST,
          payload: response
        });
      });
  }
}

export function deletePost(id) {
  setHeader();
  return function(dispatch) {
    axios.delete(`${ROOT_URL}/items/${id}`, config)
      .then(response => {
        dispatch({
          type: DELETE_POST,
          payload: response
        });
        browserHistory.push('/items');
      });
  }
}
