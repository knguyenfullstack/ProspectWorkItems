//Kenneth Nguyen, modified by jason
import * as React from "react";
import { browserHistory } from "react-router";
import { BoxContainerHeader } from "./boxContainerHeader"
import { Scrollbars } from "react-custom-scrollbars";

interface IBoxContainerProps {

    flipIcon?: boolean,
    onFlip?: () => void
    boxHeader?: string,
    className?: string,
    style?: React.CSSProperties,
    colSpanCss?: string,
    haveStyle?: {},
    haveYScroll?: boolean,
    classNameScrollbar?: string,
    haveScrollBar?: boolean
}

export const BoxContainer: React.StatelessComponent<IBoxContainerProps> = (props) => {
    return (
        <div className={props.className}>
            <div className="an-single-component with-shadow">
                <div className="an-component-header" style={{ background: "white" }}>
                    <h6>{props.boxHeader}</h6>
                    {props.flipIcon == true ? <div className="component-header-right">
                        <i className="glyphicon glyphicon-retweet" style={{ color: "#999", fontSize: "18px", cursor: "pointer" }} onClick={props.onFlip} />
                    </div>
                        : <span />}
                </div>
                <div className={"an-component-body"}
                    style={props.style}>
                    {props.haveScrollBar == false ?
                        <span>{props.children}</span>
                        :
                        <Scrollbars autoHide>
                            {props.children}
                        </Scrollbars>}
                </div>
            </div>
        </div >
    )
}
