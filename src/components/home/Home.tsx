import * as React from "react";
import {Button, Carousel} from "antd";
import styles from "./Home.module.scss";
import "./Home.scss";
import {appHistory} from "../../App";

export default class Home extends React.Component<{}, {

}>{
    public constructor(props: any) {
        super(props);
        this.state = {

        }
    }

    public render() {
        console.log(localStorage.getItem('chcd'))

        return (
            <div className={styles.pageHome}>
                <Carousel className={styles.homeCarousel} autoplay>
                        <img src="/static/img/milk.png" alt=""/>
                        <img src="/static/img/fairy-farm.jpg" alt=""/>
                        <img src="/static/img/farm.jpg" alt=""/>
                    </Carousel>
                <div className={styles.homeSales}>
                    <Button className={"homeButtonSales"} type={"primary"} onClick={() => {appHistory.push("/catalog/1"); window.location.reload()}}>Посмотреть весь каталог</Button>
                </div>
                <span className={styles.homeNewProducts}>Некоторые наши товары:</span>
                <div className={styles.homeProductCardBlock}>
                    <div className={styles.homeProductCards}>
                        <Button className={"homeProductButton"}>
                            <div className={styles.homeProductCard}>
                                <div className={styles.homeProductImg}>
                                    <img src="/static/img/milk_but.png" alt=""/>
                                </div>
                                <div className={styles.homeProductInfo}>
                                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                        <span>"Простоквашино",</span>
                                        <span>молоко</span>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                                        <span>Вес/объём: 1000 мл</span>
                                        <span>Количество: 10 шт</span>
                                    </div>
                                    <span style={{display: "flex", height: "100%", alignItems: "flex-end"}}>Цена: 50 руб.</span>
                                </div>
                            </div>
                        </Button>
                        <span className={styles.homeProductSeparator}/>
                        <Button className={"homeProductButton"}>
                            <div className={styles.homeProductCard}>
                                <div className={styles.homeProductImg}>
                                    <img src="/static/img/meat.png" alt=""/>
                                </div>
                                <div className={styles.homeProductInfo}>
                                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                        <span>Окорок</span>
                                        <span>"По-Тамбовски"</span>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                                        <span>Вес/объём: 300 гр</span>
                                        <span>Количество: 10 шт</span>
                                    </div>
                                    <span style={{display: "flex", height: "100%", alignItems: "flex-end"}}>Цена: 350 руб.</span>
                                </div>
                            </div>
                        </Button>
                        <span className={styles.homeProductSeparator}/>
                        <Button className={"homeProductButton"}>
                            <div className={styles.homeProductCard}>
                                <div className={styles.homeProductImg}>
                                    <img src="/static/img/bread.png" alt=""/>
                                </div>
                                <div className={styles.homeProductInfo}>
                                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                        <span>"Хлебный дом",</span>
                                        <span>батон нарезной</span>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                                        <span>Вес/объём: 400 гр</span>
                                        <span>Количество: 10 шт</span>
                                    </div>
                                    <span style={{display: "flex", height: "100%", alignItems: "flex-end"}}>Цена: 55 руб.</span>
                                </div>
                            </div>
                        </Button>
                    </div>
                </div>
                <span/>
            </div>
        );
    }
}