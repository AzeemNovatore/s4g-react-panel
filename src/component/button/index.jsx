import React from "react";

const Button= ({text,img,buttonClass,handleClick,type,...props})=>{
    return (
        <>
          <div className={buttonClass} onClick={handleClick}>
          <button type={type}>
            <img src={img} alt="" />
            {text}
          </button>
        </div>
       </>
    )
}
export default Button