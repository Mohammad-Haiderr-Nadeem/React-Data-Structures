import React from "react";
import styles from './Button.module.css'

export default function Button(props){
    return(
        <main>
            <button className={styles.myButton} onClick={props.handleOnClick}>
                {props.name}
            </button>
        </main>
    );
}