import React from "react";


export default function CompleteBtn({transfer,deleteBtn}) {
    return(
        <>
            <button type='button' onClick={() => transfer()} className='btn btn-primary'>
                Complete
            </button>
            <button type='button' onClick={() => deleteBtn()} className='btn btn-danger'>
            Delete
            </button>
            </>

    )
}