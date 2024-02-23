import React from 'react';
import PostCreate from './PostCreate';
import PostList from'./PostList' ;

const App = () =>{
    return (
        <>
            <div className='container'>
                <h1>BLOG APP</h1>
                <PostCreate />
            </div>
            <hr />
            <div className = 'container'>
                <h1> POSTS </h1>
                <PostList />
            </div>
        </>

    )
};

export default App;