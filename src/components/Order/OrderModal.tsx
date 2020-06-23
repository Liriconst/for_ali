import * as React from "react";
import {Button, Modal, notification, Radio} from "antd";
import Form from "@ant-design/compatible/lib/form";
import "./Order.scss";
import styles from "./Order.module.scss";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {FormCreateKostyl} from "../../utils";
import moment from "moment";
import Icon from "@ant-design/compatible/lib/icon";

const UPDATE_MANUF = gql`
    mutation updateOrder ($id: BigInt!, $orderStatus: Boolean!) {
        updateUserOrderById (
            input: {
                id: $id
                userOrderPatch: {
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

interface IOrderModalProps {
    onClose(): void
    form?: any
    order: any
    isVisible: boolean
}

class OrderModal extends React.Component<IOrderModalProps, {
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

    openNotification = () => {
        notification.open({
            message: 'Заказ успешно изменен!',
            description:
                'Заказ был успешно изменен и вскором времени обновится в списке',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 4,
        });
    };

    handleSubmit = (updateOrder: any) => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                console.log("Статус", this.state.orderStatusTemp);
                updateOrder({ variables: {id: this.props.order.id, orderStatus: this.state.orderStatusTemp }});
                this.props.onClose();
                this.openNotification();
                setTimeout(() => window.location.reload(),3750);
            }
        });
    };

    changeRadio(value: any) {
        if (value.target.value === null || value.target.value === undefined) {
            this.setState({orderStatusTemp: null});
        }
        else if (value.target.value === false) {
            this.setState({orderStatusTemp: false});
        }
        else if (value.target.value === true) {
            this.setState({orderStatusTemp: true});
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isVisible, onClose } = this.props;
        const orderContent = JSON.parse(this.props.order.order);
        console.log("textx", this.props.order)

        return (
            <div>
                <Mutation mutation={UPDATE_MANUF}>
                    {(updateOrder: any) => (
                        <Modal
                            title={"Редактирование заказа #" + this.props.order.orderNumber + " от " + moment(this.props.order.orderDate).format('DD.MM.YYYY hh:mm:ss') + ":"}
                            visible={ isVisible }
                            onCancel={ onClose }
                            onOk={ () => {this.handleSubmit(updateOrder)} }
                            className="orderModal"
                            footer={[
                                <Button key="back" className="footerManufButton" onClick= { onClose }>Отмена</Button>,
                                <Button key="submit" className="footerManufButton" type="primary" onClick={() => {this.handleSubmit(updateOrder)}}>Изменить заказ</Button>,
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
                                <Form onSubmit={this.handleSubmit} className={styles.orderFormModal}>
                                    <span className={styles.orderModalTitle} style={{color: "#1890ff"}}>{this.props.order.fullName}</span>
                                    <span className={styles.orderModalContact} style={{lineHeight: "1.5"}}>Телефон: {this.props.order.phone}</span>
                                    <span className={styles.orderModalContact} style={{marginBottom: "15px"}}>Email: {this.props.order.email}</span>
                                    <span className={styles.orderModalTitle}>{(this.props.order.delivery) ? "Самовывоз по адресу:" : "Доставка по адресу:"}</span>
                                    <span className={styles.orderModalContact} style={{lineHeight: "1.15", marginBottom: "15px"}}>{this.props.order.address}</span>
                                    <div className={styles.orderModalTitle}>Выберете статус заказа:</div>
                                    <Form.Item style={{marginBottom: "15px"}}>
                                        {getFieldDecorator('orderStatus')(
                                            <Radio.Group defaultValue={this.props.order.orderStatus} onChange={(value: any) => this.changeRadio(value)}>
                                                <Radio className={styles.orderModalRadio} style={{color: "#237804"}} value={true}>Подтверждён</Radio>
                                                <Radio className={styles.orderModalRadio} style={{color: "#ff4d4f"}} value={false}>Отклонён</Radio>
                                                <Radio className={styles.orderModalRadio} disabled={true} value={null}>На рассмотрении</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                </Form>
                            </div>
                        </Modal>
                    )}
                </Mutation>
            </div>
        );
    }
}

export default Form.create()(OrderModal) as unknown as React.ComponentClass<FormCreateKostyl<OrderModal>>;