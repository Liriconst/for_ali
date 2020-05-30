import * as React from "react";
import {Button, InputNumber, Modal} from "antd";
import autobind from "autobind-decorator";
import styles from "./Cart.module.scss";
import "./Cart.scss";
import {Icon} from "@ant-design/compatible";
import {appHistory} from "../../App";

interface ICartProps {
    onClose(): void
    isVisible: boolean
}

export default class Cart extends React.Component<ICartProps, {

}>{
    public constructor (props: ICartProps) {
        super (props);
        this.state = {

        }
    }

    @autobind
    private changeCount(inputValue: number, tempContent: any) {
        if (inputValue >= 0) {
            localStorage.setItem("tempCart", JSON.stringify({
                ...JSON.parse(
                    localStorage.getItem("tempCart")||"{}"
                ),
                [tempContent.id]: {
                    ...tempContent,
                    "count": inputValue
                }
            }));
            this.forceUpdate();
        }
    }

    @autobind
    private deletePosition(tempContent: any) {
        console.log(tempContent)
        const parseData = {
            ...JSON.parse(
            localStorage.getItem("tempCart")||"{}"
            )
        };
        delete parseData[tempContent.id];
        localStorage.setItem("tempCart", JSON.stringify(parseData));
        this.forceUpdate();
    }

    toOrder = () => {
        appHistory.push("/create-order");
        window.location.reload();
    }

    public render() {
        const { isVisible, onClose } = this.props;
        const countContent = JSON.parse(localStorage.getItem("tempCart")||"{}")
        {console.log("text", Object.keys(countContent).length)}

        let totalCount = 0;
        Object.keys(countContent).forEach((contentTotalCount) => {
            totalCount += (countContent[contentTotalCount].prodCost * countContent[contentTotalCount].count);
        });

        return (
            <Modal
                title={"Корзина"}
                visible={ isVisible }
                onCancel={ onClose }
                onOk={this.toOrder}
                footer={[
                    <Button key="back" className="footerButton" onClick= { onClose }>Закрыть</Button>,
                    <Button key="submit" className="footerButton" type="primary" disabled={(Object.keys(countContent).length === 0) ? true : false} onClick={this.toOrder}>Оформить заказ</Button>,
                ]}
                className={styles.modalCart}
            >
                <div className={styles.modalCart}>
                    {Object.keys(countContent).map((tempContent) => {
                        return (
                            <div key={tempContent} className={styles.cartPosition}>
                                <span>{countContent[tempContent].prodFirstName}&nbsp;{countContent[tempContent].prodSecondName}</span>
                                <span className={styles.cartPositionSeparator}/>
                                <span style={{display: "flex", justifyContent: "center"}}>{countContent[tempContent].prodCost} руб/шт</span>
                                <span className={styles.cartPositionSeparator}/>
                                <span style={{display: "flex", justifyContent: "center", alignItems: "center"}} ><InputNumber className="productCount" min={1} max={20} defaultValue={countContent[tempContent].count} onChange={(inputValue: any) => this.changeCount(inputValue, countContent[tempContent])}/>&nbsp;шт</span>
                                <span className={styles.cartPositionSeparator}/>
                                <span style={{display: "flex", justifyContent: "center"}}>{countContent[tempContent].prodCost * countContent[tempContent].count} руб.</span>
                                <span className={styles.cartPositionSeparator}/>
                                <Button type="link" className="buttonDeleteOrder" onClick={() => this.deletePosition(countContent[tempContent])}><Icon type="close-circle" className="buttonDeleteOrderIcon"/></Button>
                            </div>
                        );
                    })}
                    <span className={styles.totalCount}>Итого: {totalCount} руб.</span>
                </div>
            </Modal>
        );
    }
}