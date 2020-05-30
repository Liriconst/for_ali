import * as React from "react";
import {Button, Input, Modal, notification, Radio, Select} from "antd";
import Form from "@ant-design/compatible/lib/form";
import "./Product.scss";
import styles from "./Product.module.scss";
import gql from "graphql-tag";
import {Mutation, Query} from "react-apollo";
import { FormCreateKostyl } from "../../utils";
import Icon from "@ant-design/compatible/lib/icon";
import {ApolloError} from "apollo-boost";
import {resolveAny} from "dns";

const { Option } = Select;

const GET_MANUF = gql`
    query {
        allProdManufactures {
            nodes {
                id
                manufName
            }
        }
    }
`;

const GET_SUB_CATEGORY = gql`
    query {
        allProdSubcategories {
            nodes {
                id
                catId
                subName
            }
        }
    }
`;

const UPDATE_PRODUCT = gql`
    mutation createProduct ($catId: BigInt!, $subId: BigInt!, $manufId: BigInt!, $fullName: String!, $prodFirstName: String!, $prodSecondName: String, $prodMass: Int!, $prodMassType: Boolean!, $prodInStock: Boolean!, $prodCost: Int!, $prodImg: String!) {
        createProduct (
            input: {
                product: {
                    fullName: $fullName
                    catId: $catId
                    subId: $subId
                    manufId: $manufId
                    prodFirstName: $prodFirstName
                    prodSecondName: $prodSecondName
                    prodMass: $prodMass
                    prodMassType: $prodMassType
                    prodInStock: $prodInStock
                    prodCost: $prodCost
                    prodImg: $prodImg
                }
            }
        ) {
             product {
                id
            }
        }
    }
`;

interface IManufModalProps {
    onClose(): void
    form?: any
    isVisible: boolean
}

class ProductAdd extends React.Component<IManufModalProps, {
    mode?: string,
    visible?: boolean,
    visible2?: boolean,
    loading?: boolean,
    manufIdTemp?: number,
    catIdTemp?: number
}> {
    public constructor(props: IManufModalProps) {
        super(props);
        this.state = {
            mode: 'all',
            visible: false,
            visible2: false,
            loading: false,
            manufIdTemp: 0,
            catIdTemp: 0
        };
    }

    openNotification = () => {
        notification.open({
            message: 'Товар успешно добавлен!',
            description:
                'Товар был успешно добавлен и вскором времени появится в списке',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 4,
        });
    };

    handleSubmit = (createProduct: any) => {
        this.props.form.validateFields((err: any, values: any) => {
            let prodMassTypeTemp: any;
            if (values.prodMassType === undefined) {
                prodMassTypeTemp = true;
            } else {
                prodMassTypeTemp = values.prodMassType;
            }

            let prodInStockTemp: any;
            if (values.prodInStock === undefined) {
                prodInStockTemp = true;
            } else {
                prodInStockTemp = values.prodInStock;
            }

            if (!err) {
                console.log('Received values of form: ', values);
                createProduct({
                    variables: {
                        fullName: values.prodFirstName + " " + values.prodSecondName,
                        catId: this.state.catIdTemp,
                        subId: values.subId,
                        manufId: this.state.manufIdTemp,
                        prodFirstName: values.prodFirstName,
                        prodSecondName: values.prodSecondName,
                        prodMass: Number(values.prodMass),
                        prodMassType: prodMassTypeTemp,
                        prodInStock: prodInStockTemp,
                        prodCost: Number(values.prodCost),
                        prodImg: values.prodImg
                    }
                });
                this.props.onClose();
                this.openNotification();
                setTimeout(() => window.location.reload(),3750);
            }
        });
    };

    validatorName = (rule: any, str: string, callback: any) => {
        if ((str === "") || (str === undefined)) callback('Пожалуйста, заполните поле!');
        callback()
    };

    changeManuf(value: any) {
        this.setState({manufIdTemp: value})
    }

    changeSub(value: any, dataTemp: any) {
        const subTemp = dataTemp.find((v: any) => (v.id === value));
        this.setState({catIdTemp: subTemp.catId})
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isVisible, onClose } = this.props;

        return (
            <Mutation mutation={UPDATE_PRODUCT}>
                {(createProduct: any) => (
                    <Modal
                        title="Добавление товара"
                        visible={ isVisible }
                        onCancel={ onClose }
                        onOk={ () => {this.handleSubmit(createProduct)} }
                        footer={[
                            <Button key="back" className="footerManufButton" onClick= { onClose }>Отмена</Button>,
                            <Button key="submit" className="footerManufButton" type="primary" onClick={() => {this.handleSubmit(createProduct)}}>Добавить товар</Button>,
                        ]}
                    >
                        <Form>
                            <div className={styles.editProductTitle}>Первая часть названия:</div>
                            <Form.Item className="productFormCheck">
                                {getFieldDecorator('prodFirstName', {
                                    rules: [{
                                        required: false,
                                        validator: this.validatorName
                                    }],
                                })(
                                    <Input className="editManufInput" placeholder="Первая часть"/>
                                )}
                            </Form.Item>
                            <div className={styles.editProductTitle}>Вторая часть названия:</div>
                            <Form.Item className="productFormCheck">
                                {getFieldDecorator('prodSecondName', {
                                    rules: [{
                                        required: false
                                    }],
                                })(
                                    <Input className="editManufInput" placeholder="Вторая часть (необязательно)"/>
                                )}
                            </Form.Item>
                            <div className={styles.editProductTitle}>Производитель:</div>
                            <Query query={GET_MANUF}>
                                {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                                    if (loading) return <span>"Загрузка категорий...";</span>
                                    if (error) return <span>`Ошибка! ${error.message}`</span>;

                                    return (
                                        <Form.Item className="productFormCheck" style={{height: "65px"}}>
                                            {getFieldDecorator('manufId', {
                                                rules: [{
                                                    required: true,
                                                    message: 'Пожалуйста, выберете производителя!'
                                                }],
                                            })(
                                                <Select className="productSelectMenu" placeholder="Производитель" onChange={(value: any) => this.changeManuf(value)}>
                                                    {data.allProdManufactures.nodes.map((manufQuery: any) => (
                                                        <Option className={styles.productButtonSelectSub} value={manufQuery.id}>{manufQuery.manufName}</Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    );
                                }}
                            </Query>
                            <div className={styles.editProductTitle}>Подкатегория:</div>
                            <Query query={GET_SUB_CATEGORY}>
                                {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                                    if (loading) return <span>"Загрузка категорий...";</span>
                                    if (error) return <span>`Ошибка! ${error.message}`</span>;

                                    return (
                                        <Form.Item className="productFormCheck" style={{height: "65px"}}>
                                            {getFieldDecorator('subId', {
                                                rules: [{
                                                    required: true,
                                                    message: 'Пожалуйста, выберете подкатегорию!'
                                                }],
                                            })(
                                                <Select className="productSelectMenu" placeholder="Подкатегория" onChange={(value: any) => this.changeSub(value, data.allProdSubcategories.nodes)}>
                                                    {data.allProdSubcategories.nodes.map((subQuery: any) => (
                                                        <Option className={styles.productButtonSelectSub} value={subQuery.id}>{subQuery.subName}</Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    );
                                }}
                            </Query>
                            <div className={styles.editProductTitleRadio}>Единицы измерения:</div>
                            <Form.Item className="productFormRadio">
                                {getFieldDecorator('prodMassType')(
                                    <Radio.Group className={styles.productRadioGroup} defaultValue={true}>
                                        <Radio className={styles.productRadio} value={true} style={{marginRight: "20px"}}>граммы</Radio>
                                        <Radio className={styles.productRadio} value={false}>миллилитры</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                            <div className={styles.editProductTitle}>Масса/объем:</div>
                            <Form.Item className="productFormCheck">
                                {getFieldDecorator('prodMass', {
                                    rules: [{
                                        required: false,
                                        validator: this.validatorName
                                    }],
                                })(
                                    <Input className="editManufInput" placeholder="Масса/объем цифрами"/>
                                )}
                            </Form.Item>
                            <div className={styles.editProductTitle}>Цена товара:</div>
                            <Form.Item className="productFormCheck">
                                {getFieldDecorator('prodCost', {
                                    rules: [{
                                        required: false,
                                        validator: this.validatorName
                                    }],
                                })(
                                    <Input className="editManufInput" placeholder="Цена товара цифрами"/>
                                )}
                            </Form.Item>
                            <div className={styles.editProductTitle}>Фотография товара:</div>
                            <Form.Item className="productFormCheck">
                                {getFieldDecorator('prodImg', {
                                    rules: [{
                                        required: false,
                                        validator: this.validatorName
                                    }],
                                })(
                                    <Input className="editManufInput" placeholder="example.jpg"/>
                                )}
                            </Form.Item>
                            <div className={styles.editProductTitleRadio}>Товар в наличии:</div>
                            <Form.Item>
                                {getFieldDecorator('prodInStock')(
                                    <Radio.Group className={styles.productRadioGroup} defaultValue={true}>
                                        <Radio className={styles.productRadio} value={true} style={{marginRight: "20px"}}>Да</Radio>
                                        <Radio className={styles.productRadio} value={false}>Нет</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Form>
                    </Modal>
                )}
            </Mutation>
        );
    }
}

export default Form.create()(ProductAdd) as unknown as React.ComponentClass<FormCreateKostyl<ProductAdd>>;