import * as React from "react";
import {Button, InputNumber, Radio, Input, notification} from "antd";
import { Form } from '@ant-design/compatible';
import {gql} from "apollo-boost";
import autobind from "autobind-decorator";
import styles from "./Cart.module.scss";
import "./Cart.scss";
import {Mutation} from "react-apollo";
import {Icon} from "@ant-design/compatible";
import TextArea from "antd/lib/input/TextArea";
import {appHistory} from "../../App";

const ADD_ORDER = gql`
    mutation addOrder($userId: BigInt!, $order: String!, $delivery: Boolean!, $address: String!, $people: Boolean!, $fullName: String!, $email: String!, $phone: String!, $orderPrice: Int!, $orderNumber: Int!, $orderStatus: Boolean) {
        createUserOrder (
            input: {
                userOrder: {
                    userId: $userId
                    order: $order
                    delivery: $delivery
                    address: $address
                    people: $people
                    fullName: $fullName
                    email: $email
                    phone: $phone
                    orderPrice: $orderPrice
                    orderNumber: $orderNumber
                    orderStatus: $orderStatus
                }
            }
        ) {
            userOrder {
                id
            }
        }
    }
`;

interface IFullCartProps {
    form?: any
}

class FullCart extends React.Component<IFullCartProps, {
    checkDelivery: boolean,
    checkClient: boolean,
    orderNumber: number
}>{
    public constructor (props: IFullCartProps) {
        super (props);
        this.state = {
            checkDelivery: true,
            checkClient: true,
            orderNumber: Math.floor(Math.random() * (1999999 - 1234567)) + 1234567
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
        const parseData = {
            ...JSON.parse(
                localStorage.getItem("tempCart")||"{}"
            )
        };
        delete parseData[tempContent.id];
        localStorage.setItem("tempCart", JSON.stringify(parseData));
        this.forceUpdate();
    }

    openNotification = () => {
        notification.open({
            message: 'Успешный заказ!',
            description: 'Заказ был успешно оформлен. Скоро с вами свяжется менеджер!',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 6,
        });
    };

    handleSubmit = (createOrder: any, totalCount: number) => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                let tempAddress = "";
                let tempFullName = "";
                let tempEmail = "";

                if (this.state.checkDelivery) {
                    tempAddress = "Санкт-Петербург, ул. Зои Космодемьянской, д. 1";
                } else {
                    tempAddress = values.address;
                }
                if (this.state.checkClient) {
                    tempFullName = localStorage.getItem('fullName')||"";
                    tempEmail = localStorage.getItem('email')||"";
                } else {
                    tempFullName = values.fullName;
                    tempEmail = values.email;
                }
                createOrder({
                    variables: {
                        userId: localStorage.getItem('usrId'),
                        order: localStorage.getItem('tempCart'),
                        delivery: this.state.checkDelivery,
                        address: tempAddress,
                        people: this.state.checkClient,
                        fullName: tempFullName,
                        email: tempEmail,
                        phone: values.phone,
                        orderPrice: totalCount,
                        orderNumber: this.state.orderNumber,
                        orderStatus: null
                    }
                });
                localStorage.setItem("tempCart", "{}");
                this.props.form.resetFields();
                this.openNotification();
                appHistory.push("/");
                window.location.reload();
            }
        });
    }

    toHome = () => {
        appHistory.push("/");
        window.location.reload();
    }

    changeDelivery = (e: any) => {
        if (e.target.value === true) {
            this.setState({checkDelivery: true});
        } else {
            this.setState({checkDelivery: false});
        }
    };

    changeClient = (u: any) => {
        if (u.target.value === true) {
            this.setState({checkClient: true});
        } else {
            this.setState({checkClient: false});
        }
    };

    validatorAddress = (rule: any, str: string, callback: any) => {
        if (this.state.checkDelivery) {
            if (localStorage.getItem("email") === "") callback('Пожалуйста, заполните поле!');
        }
        if ((!this.state.checkDelivery) && ((str === undefined) && (str !== ""))) callback('Пожалуйста, заполните поле!');
        callback()
    };

    validatorFIO = (rule: any, str: string, callback: any) => {
        if (this.state.checkClient) {
            if (localStorage.getItem("email") === "") callback('Пожалуйста, заполните поле!');
        }
        if ((!this.state.checkClient) && ((str === undefined) && (str !== ""))) callback('Пожалуйста, заполните поле!');
        callback()
    };

    validatorEmail = (rule: any, str: string, callback: any) => {
        if (this.state.checkClient) {
            if (localStorage.getItem("email") === "") callback('Пожалуйста, заполните поле!');
        }
        if ((!this.state.checkClient) && ((str === undefined) && (str !== ""))) callback('Пожалуйста, заполните поле!');
        if (((str !== undefined) && (str !== "")) && (!/^([a-z0-9_.-]+\.)*[a-z0-9_.-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,20}$/.test(str))) callback('Некорректный email!');
        callback()
    };

    validatorPhone = (rule: any, str: string, callback: any) => {
        if ((str === undefined) || (str === "")) callback('Пожалуйста, заполните поле!');
        else if (((str !== undefined) && (str !== "")) && (!/[+0-9]/.test(str))) callback('Разрешены только цифры и символ "+". Проверьте данные!');
        callback()
    };

    public render() {
        const { getFieldDecorator } = this.props.form;
        const countContent = JSON.parse(localStorage.getItem("tempCart")||"{}")

        let totalCount = 0;
        Object.keys(countContent).forEach((contentTotalCount) => {
            totalCount += (countContent[contentTotalCount].prodCost * countContent[contentTotalCount].count);
        });

        return (
            <Mutation mutation={ADD_ORDER}>
                {(createOrder: any) => (
                    <div className={styles.pageCreateOrder}>
                        <span className={styles.createOrderHeader}>ОФОРМЛЕНИЕ ЗАКАЗА</span>
                        <div className={styles.createOrder}>
                            <div>
                                {Object.keys(countContent).map((tempContent) => {
                                return (
                                    <div key={tempContent} className={styles.cartFullPosition}>
                                        <span>{countContent[tempContent].prodFirstName}&nbsp;{countContent[tempContent].prodSecondName}</span>
                                        <span className={styles.cartPositionSeparator}/>
                                        <span style={{display: "flex", justifyContent: "center"}}>{countContent[tempContent].prodCost} руб/шт</span>
                                        <span className={styles.cartPositionSeparator}/>
                                        <span style={{display: "flex", justifyContent: "center", alignItems: "center"}} ><InputNumber className="productCountFull" min={1} max={20} defaultValue={countContent[tempContent].count} onChange={(inputValue: any) => this.changeCount(inputValue, countContent[tempContent])}/>&nbsp;шт</span>
                                        <span className={styles.cartPositionSeparator}/>
                                        <span style={{display: "flex", justifyContent: "center"}}>{countContent[tempContent].prodCost * countContent[tempContent].count} руб.</span>
                                        <span className={styles.cartPositionSeparator}/>
                                        <Button type="link" className="buttonDeleteOrder" onClick={() => this.deletePosition(countContent[tempContent])}><Icon type="close-circle" className="buttonDeleteOrderIcon"/></Button>
                                    </div>
                                );
                            })}
                            </div>
                            <span className={styles.createOrderSeparator}/>
                            <Form>
                                <span className={styles.deliveryTitle}>Как получить:</span>
                                <Form.Item>
                                    {getFieldDecorator('delivery')(
                                        <Radio.Group className={styles.deliveryRadioGroup} onChange={this.changeDelivery} defaultValue={true}>
                                            <Radio className={styles.deliveryRadio} value={true}>Самовывоз</Radio>
                                            <Radio className={styles.deliveryRadio} value={false}>Доставка</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                <Form.Item className="orderInputCheck" style={{marginBottom: "50px"}}>
                                    {getFieldDecorator('address', {
                                        rules: [{
                                            required: false,
                                            validator: this.validatorAddress
                                        }],
                                    })(
                                        <Input className="orderInput" disabled={this.state.checkDelivery} placeholder="Санкт-Петербург, ул. Зои Космодемьянской, д. 1"/>
                                    )}
                                </Form.Item>
                                <span className={styles.deliveryTitle}>Контактное лицо:</span>
                                <Form.Item>
                                    {getFieldDecorator('profile')(
                                        <Radio.Group className={styles.deliveryRadioGroup} onChange={this.changeClient} defaultValue={true}>
                                            <Radio className={styles.deliveryRadio} value={true}>Из профиля</Radio>
                                            <Radio className={styles.deliveryRadio} value={false}>Другой человек</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                <Form.Item className="orderInputCheck" style={{marginBottom: "10px"}}>
                                    {getFieldDecorator('fullName', {
                                        rules: [{
                                            required: false,
                                            validator: this.validatorFIO
                                        }],
                                    })(
                                        <Input className="orderInput" disabled={this.state.checkClient} placeholder={localStorage.getItem("fullName")||""}/>
                                    )}
                                </Form.Item>
                                <Form.Item className="orderInputCheck" style={{marginBottom: "50px"}}>
                                    {getFieldDecorator('email', {
                                        rules: [{
                                            required: false,
                                            validator: this.validatorEmail
                                        }],
                                    })(
                                        <Input className="orderInput" disabled={this.state.checkClient} placeholder={localStorage.getItem("email")||""}/>
                                    )}
                                </Form.Item>
                                <span className={styles.deliveryTitle}>Контактный телефон:</span>
                                <Form.Item className="orderInputCheck">
                                    {getFieldDecorator('phone', {
                                        rules: [{
                                            required: true,
                                            validator: this.validatorPhone
                                        }],
                                    })(
                                        <Input className="orderInput" minLength={11} maxLength={12} placeholder={"+79991234567"}/>
                                    )}
                                </Form.Item>
                            </Form>
                        </div>
                        <div className={styles.createOrderFooter}>
                            <span className={styles.createOrderFooterTitle}>ИТОГО: {totalCount} РУБ.</span>
                            <span className={styles.createOrderFooterSeparator}/>
                            <Button type="default" className="footerFullButton" style={{marginRight: "15px"}} onClick={this.toHome}>На главную</Button>
                            <Button type="primary" className="footerFullButton" disabled={(Object.keys(countContent).length === 0) ? true : false} onClick={() => this.handleSubmit(createOrder, totalCount)}>Оформить заказ</Button>
                        </div>
                    </div>
                )}
            </Mutation>
        );
    }
}

const WrappedFullCart = Form.create({name: 'fullCart'})(FullCart);
export default WrappedFullCart;