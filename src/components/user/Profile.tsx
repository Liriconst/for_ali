import React from "react";
import styles from "./User.module.scss";
import Button from "antd/lib/button";
import {appHistory} from "../../App";

export default class Profile extends React.Component<{}, {

}>{
    public constructor(props: any) {
        super(props);
        this.state = {

        }
    }

// <span>{localStorage.getItem('usrId')}</span>
// <span>{localStorage.getItem('chcd')}</span>

    openLinkProfile() {
        if (localStorage.getItem('chcd') === "1") {
            appHistory.push("/control-panel");
            window.location.reload();
        } else {
            appHistory.push("/my-orders");
            window.location.reload();
        }
    }

    logOut() {
        localStorage.setItem('email', "");
        localStorage.setItem('company', "");
        localStorage.setItem('usrId', "");
        localStorage.setItem('chcd', "");
        localStorage.setItem('password', "");
        localStorage.setItem('fullName', "");
        appHistory.push("/authorization");
        window.location.reload();
    }

    public render() {

        if ((localStorage.getItem("chcd") !== "") && (localStorage.getItem("chcd") !== undefined)) {
            return (
                <div className={styles.pageProfile}>
                    <div className={styles.profile}>
                        <span className={styles.profileTitle}>ПРОФИЛЬ</span>
                        <span className={styles.profileText}>{localStorage.getItem('fullName')}</span>
                        <span className={styles.profileText}>Компания: {localStorage.getItem('company')}</span>
                        <span className={styles.profileText}>Email: {localStorage.getItem('email')}</span>
                        <span className={styles.profileText}>Роль: {(localStorage.getItem('chcd') === "1") ? "Администратор" : "Клиент"}</span>
                        <Button type="primary" className="profileButton" style={{marginTop: "25px"}} onClick={this.openLinkProfile}>{(localStorage.getItem('chcd') === "1") ? "ПАНЕЛЬ УПРАВЛЕНИЯ" : "МОИ ЗАКАЗЫ"}</Button>
                        <Button type="primary" className="profileButton" style={{marginTop: "10px"}} onClick={this.logOut} danger>ВЫЙТИ ИЗ АККАУНТА</Button>
                        <Button type="link" className="profileLinkButton" style={{marginTop: "5px"}} onClick={() => {appHistory.push("/"); window.location.reload()}}>Перейти на главную страницу</Button>
                    </div>
                </div>
            );
        } else {
            appHistory.push("/");
            window.location.reload();
        }
    }
}