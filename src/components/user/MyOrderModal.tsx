import * as React from "react";
import {Button, Modal} from "antd";
import Form from "@ant-design/compatible/lib/form";
import "../Order/Order.scss";
import styles from "../Order/Order.module.scss";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {FormCreateKostyl} from "../../utils";
import moment from "moment";

interface IOrderModalProps {
    onClose(): void
    form?: any
    order: any
    isVisible: boolean
}

class MyOrderModal extends React.Component<IOrderModalProps, {
    mode?: string,
    orderStatusTemp: any,
    arrManuf: any
}> {
    public constructor(props: IOrderModalProps) {
        super(props);
        this.state = {
            mode: 'all',
            orderStatusTemp: undefined,
            arrManuf: undefined
        };
    }

    componentDidMount(): void {
        console.log(this.props.form);
        this.props.form.setFieldsValue(
            this.props.order
        )
    }

    render() {
        const { isVisible, onClose } = this.props;
        const orderContent = JSON.parse(this.props.order.order);
        console.log("textx", this.props.order)

        return (
            <div>
                <Modal
                    title={"Редактирование заказа #" + this.props.order.orderNumber + " от " + moment(this.props.order.orderDate).format('DD.MM.YYYY hh:mm:ss') + ":"}
                    visible={ isVisible }
                    onCancel={ onClose }
                    onOk={ onClose }
                    className="orderModal"
                    footer={[
                        <Button key="back" className="footerManufButton" onClick= { onClose }>Отмена</Button>,
                        <Button key="submit" className="footerManufButton" type="primary" onClick={ onClose }>Сохранить</Button>,
                    ]}
                >
                    <div className={styles.orderInnerModal}>
                        <div>
                            {Object.keys(orderContent).map((orderContentTemp) => {
                                return (
                                    <div className={styles.orderPosition}>
                                        <span className={styles.orderPositionNote} style={{justifyContent: "flex-start"}}>{orderContent[orderContentTemp].prodFirstName}&nbsp;{orderContent[orderContentTemp].prodSecondName}</span>
                                        <span style={{color: "#767676"}}>|</span>
                                        <span className={styles.orderPositionNote}>{orderContent[orderContentTemp].prodManufactureByManufId.manufName}</span>
                                        <span style={{color: "#767676"}}>|</span>
                                        <span className={styles.orderPositionNote}>{orderContent[orderContentTemp].count} шт</span>
                                        <span style={{color: "#767676"}}>|</span>
                                        <span className={styles.orderPositionNote} style={{justifyContent: "flex-end"}}>{orderContent[orderContentTemp].prodCost * orderContent[orderContentTemp].count} руб.</span>
                                    </div>
                                );
                            })}
                            <div className={styles.orderPrice}>
                                <span>Итого:&nbsp;</span>
                                <span style={{fontWeight: "bolder", color: "#1890ff"}}>{this.props.order.orderPrice}</span>
                                <span>&nbsp;руб.</span></div>
                        </div>
                        <span className={styles.orderSeparator}/>
                        <Form className={styles.orderFormModal}>
                            <span className={styles.orderModalTitle} style={{color: "#1890ff"}}>{this.props.order.fullName}</span>
                            <span className={styles.orderModalContact} style={{lineHeight: "1.5"}}>Телефон: {this.props.order.phone}</span>
                            <span className={styles.orderModalContact} style={{marginBottom: "15px"}}>Email: {this.props.order.email}</span>
                            <span className={styles.orderModalTitle}>{(this.props.order.delivery) ? "Самовывоз по адресу:" : "Доставка по адресу:"}</span>
                            <span className={styles.orderModalContact} style={{lineHeight: "1.15", marginBottom: "15px"}}>{this.props.order.address}</span>
                            <div className={styles.orderModalTitle}>Актуальный статус заказа:</div>
                            <span className={styles.orderModalStatus}
                                style={(this.props.order.orderStatus === null) ? {
                                    color: "#faad14"
                                } : ((this.props.order.orderStatus === false) ? {
                                    color: "#ff4d4f"
                                } : {
                                    color: "#237804"
                                })}
                            >
                                {(this.props.order.orderStatus === null) ? (
                                    "На рассмотрении"
                                ) : (
                                 (this.props.order.orderStatus === false) ? (
                                     "Отклонён"
                                ) : (
                                     "Подтверждён"
                                ))}
                            </span>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(MyOrderModal) as unknown as React.ComponentClass<FormCreateKostyl<MyOrderModal>>;