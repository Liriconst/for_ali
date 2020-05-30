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
    mutation updateProduct ($id: BigInt!, $catId: BigInt!, $subId: BigInt!, $manufId: BigInt!, $fullName: String!, $prodFirstName: String!, $prodSecondName: String, $prodMass: Int!, $prodMassType: Boolean!, $prodInStock: Boolean!, $prodCost: Int!, $prodImg: String!) {
        updateProductById (
            input: {
                id: $id
                productPatch: {
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
    product: any
    isVisible: boolean
}

class ProductModal extends React.Component<IManufModalProps, {
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

    componentDidMount(): void {
        console.log(this.props.form);
        this.props.form.setFieldsValue(
            this.props.product
        )
    }

    openNotification = () => {
        notification.open({
            message: 'Продукт успешно изменен!',
            description:
                'Продукт был успешно изменен и вскором времени появится в списке',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 4,
        });
    };

    handleSubmit = (updateProduct: any) => {
        this.props.form.validateFields((err: any, values: any) => {
            let catIdFinish: any;
            if (this.state.catIdTemp === 0) {
                catIdFinish = this.props.product.catId;
            } else {
                catIdFinish = this.state.catIdTemp;
            }

            let subIdFinish: any;
            if (values.subId === undefined) {
                subIdFinish = this.props.product.subId;
            } else {
                subIdFinish = values.subId;
            }

            let manufIdFinish: any;
            if (this.state.manufIdTemp === 0) {
                manufIdFinish = this.props.product.manufId;
            } else {
                manufIdFinish = this.state.manufIdTemp;
            }
            if (!err) {
                console.log('Received values of form: ', values);
                updateProduct({
                    variables: {
                        id: this.props.product.id,
                        fullName: values.prodFirstName + " " + values.prodSecondName,
                        catId: catIdFinish,
                        subId: subIdFinish,
                        manufId: manufIdFinish,
                        prodFirstName: values.prodFirstName,
                        prodSecondName: values.prodSecondName,
                        prodMass: Number(values.prodMass),
                        prodMassType: values.prodMassType,
                        prodInStock: values.prodInStock,
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
                {(updateProduct: any) => (
                    <Modal
                        title="Изменение продукта"
                        visible={ isVisible }
                        onCancel={ onClose }
                        onOk={ () => {this.handleSubmit(updateProduct)} }
                        footer={[
                            <Button key="back" className="footerManufButton" onClick= { onClose }>Отмена</Button>,
                            <Button key="submit" className="footerManufButton" type="primary" onClick={() => {this.handleSubmit(updateProduct)}}>Изменить товар</Button>,
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

                                    const manufName = data.allProdManufactures.nodes.find((v: any) => (v.id === this.props.product.manufId));

                                    return (
                                        <Form.Item style={{height: "65px"}}>
                                            {getFieldDecorator('manufId', {
                                                rules: [{
                                                    required: false
                                                }],
                                            })(
                                                <Select className="productSelectMenu" placeholder="Производитель" defaultValue={manufName.manufName} onChange={(value: any) => this.changeManuf(value)}>
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

                                    const subName = data.allProdSubcategories.nodes.find((v: any) => (v.id === this.props.product.subId));

                                    return (
                                        <Form.Item style={{height: "65px"}}>
                                            {getFieldDecorator('subId', {
                                                rules: [{
                                                    required: false
                                                }],
                                            })(
                                                <Select className="productSelectMenu" placeholder="Подкатегория" defaultValue={subName.subName} onChange={(value: any) => this.changeSub(value, data.allProdSubcategories.nodes)}>
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

export default Form.create()(ProductModal) as unknown as React.ComponentClass<FormCreateKostyl<ProductModal>>;