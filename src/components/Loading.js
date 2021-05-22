import React from "react";

//пока загружаются данные, показывает Loading
//выносим в отдельный компонент, так как может использоваться по всему проекту
export default function Loading() {
    return(
        <p>Loading...</p>
    )
}