import * as React from "react";
import { Button, Input, Modal } from "antd";
import Form from "@ant-design/compatible/lib/form";
import "./Manufacture.scss";
import styles from "./Manufacture.module.scss";
import gql from "graphql-tag";
import {Mutation, Query} from "react-apollo";
import { FormCreateKostyl } from "../../utils";
import {ApolloError} from "apollo-boost";

const GET_MANUF = gql`
    query {
        allProdManufactures {
            nodes {
                manufName
            }
        }
    }
`;

const UPDATE_MANUF = gql`
    mutation updateManuf ($id: BigInt!, $manufName: String!) {
        updateProdManufactureById (
            input: {
                id: $id
                prodManufacturePatch: {
                    manufName: $manufName
                }
            }
        ) {
            prodManufacture {
                id
            }
        }
    }
`;

interface IManufModalProps {
    onClose(): void
    form?: any
    manuf: any
    isVisible: boolean
}

class ManufactureModal extends React.Component<IManufModalProps, {
    mode?: string,
    visible?: boolean,
    visible2?: boolean,
    loading?:boolean,
    arrManuf: any
}> {
    public constructor(props: IManufModalProps) {
        super(props);
        this.state = {
            mode: 'all',
            visible: false,
            visible2: false,
            loading: false,
            arrManuf: undefined
        };
    }

    componentDidMount(): void {
        console.log(this.props.form);
        this.props.form.setFieldsValue(
            this.props.manuf
        )
    }

    handleSubmit = (updateManuf: any) => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                updateManuf({ variables: {id: this.props.manuf.id, manufName: values.manufName }});
                this.props.onClose();
            }
        });
    };

    validatorManufName = (rule: any, str: string, callback: any) => {
        const userDate = this.state.arrManuf.find((v: any) => (v.manufName === str));
        if ((str === "") || (str === undefined)) callback('Пожалуйста, заполните поле!');
        if (userDate !== undefined) callback('Данный прозводитель уже добавлен!');
        callback()
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isVisible, onClose } = this.props;

        return (
            <Query query={GET_MANUF}>
                {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                    if (loading) return  <span>"загрузка..."</span>
                    if (error) return  <span>'Ошибка ${error.message}'</span>;
                    if (!this.state.arrManuf) {
                        this.setState({arrManuf: data.allProdManufactures.nodes})
                    }

                    return (
                        <Mutation mutation={UPDATE_MANUF}>
                            {(updateManuf: any) => (
                                <Modal
                                    title="Смена названия"
                                    visible={ isVisible }
                                    onCancel={ onClose }
                                    onOk={ () => {this.handleSubmit(updateManuf)} }
                                    footer={[
                                        <Button key="back" className="footerManufButton" onClick= { onClose }>Отмена</Button>,
                                        <Button key="submit" className="footerManufButton" type="primary" onClick={() => {this.handleSubmit(updateManuf)}}>Изменить производителя</Button>,
                                    ]}
                                >
                                    {console.log("test", this.props.manuf)}
                                    <Form onSubmit={this.handleSubmit} className="login-form">
                                        <div className={styles.editManufTitle}>Введите название производителя:</div>
                                        <Form.Item className="manufFormCheck">
                                            {getFieldDecorator('manufName', {
                                                rules: [{
                                                    required: false,
                                                    validator: this.validatorManufName
                                                }],
                                            })(
                                                <Input className="editManufInput" placeholder="Название производителя"/>
                                            )}
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export default Form.create()(ManufactureModal) as unknown as React.ComponentClass<FormCreateKostyl<ManufactureModal>>;