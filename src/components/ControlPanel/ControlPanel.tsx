import React from "react";
import {Button} from "antd";
import {appHistory} from "../../App";
import styles from "./ControlPanel.module.scss";
import "./ControlPanel.scss";

export default class ControlPanel extends React.Component<{}, {

}>{
    public constructor(props: any) {
        super(props);
        this.state = {

        }
    }

    public render() {
        if (localStorage.getItem("chcd") === "1") {
            return (
                <div className={styles.controlPanelPage}>
                    <span className={styles.cpTitle}>ПАНЕЛЬ УПРАВЛЕНИЯ</span>
                    <Button type="primary" className="cpButton" onClick={() => {appHistory.push("/manufacture"); window.location.reload()}}>ПРОИЗВОДИТЕЛИ</Button>
                    <Button type="primary" className="cpButton" onClick={() => {appHistory.push("/product"); window.location.reload()}}>ТОВАРЫ</Button>
                    <Button type="primary" className="cpButton" onClick={() => {appHistory.push("/order-list"); window.location.reload()}}>ЗАКАЗЫ</Button>
                    <Button type="primary" className="cpButton" onClick={() => {appHistory.push("/"); window.location.reload()}} danger>НА ГЛАВНУЮ</Button>
                </div>
            );
        } else {
            appHistory.push("/");
            window.location.reload();
        }
    }
}