import * as React from "react";
import {Button, Input, notification} from "antd";
import gql from "graphql-tag";
import {Mutation, Query} from "react-apollo";
import Form from "@ant-design/compatible/lib/form";
import {ApolloError} from "apollo-boost";
import Icon from "@ant-design/compatible/lib/icon";
import styles from "./Manufacture.module.scss";
import "./Manufacture.scss";

const GET_MANUF = gql`
    query {
        allProdManufactures {
            nodes {
                manufName
            }
        }
    }
`;

const ADD_MANUF = gql`
    mutation createManufacture ($manufName: String!) {
        createProdManufacture (
            input: {
                prodManufacture: {
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

interface IManufactureProps {
    form?: any
}

class ManufactureAdd extends React.Component<IManufactureProps, {
    arrManuf: any
}> {
    public constructor(props: IManufactureProps) {
        super(props);
        this.state = {
            arrManuf: undefined
        };
    }

    openNotification = () => {
        notification.open({
            message: 'Производитель успешно добавлен!',
            description:
                'Производитель был успешно добавлен и вскором времени появится в списке',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 4,
        });
    };

    createManuf = (createManufacture: any) => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                createManufacture({ variables: { manufName: values.manufName }});
                this.openNotification();
                this.props.form.resetFields();
                setTimeout(() => window.location.reload(),3750);
            }
        });
    };

    validatorManufName = (rule: any, str: string, callback: any) => {
        const userDate = this.state.arrManuf.find((v: any) => (v.manufName === str));
        if ((str === "") || (str === undefined)) callback('Пожалуйста, заполните поле!');
        if (userDate !== undefined) callback('Данный прозводитель уже добавлен!');
        callback()
    };

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Query query={GET_MANUF}>
                {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                    if (loading) return  <span>"загрузка..."</span>
                    if (error) return  <span>'Ошибка ${error.message}'</span>;
                    if (!this.state.arrManuf) {
                        this.setState({arrManuf: data.allProdManufactures.nodes})
                    }

                    return (
                        <div className={styles.manufAdd}>
                            <Mutation mutation={ADD_MANUF}>
                                {(createManufacture: any) => (
                                    <Form className={styles.manufAddForm}>
                                        <Form.Item className="manufFormCheck" style={{height: "50px", marginRight: "10px"}}>
                                            {getFieldDecorator('manufName', {
                                                rules: [{
                                                    required: false,
                                                    validator: this.validatorManufName
                                                }],
                                            })(
                                                <Input className="inputManuf" placeholder="Введите название производителя"/>
                                            )}
                                        </Form.Item>
                                        <Button key="submit" type="primary" className="addManufButton" onClick={() => {this.createManuf(createManufacture)}}>Добавить производителя</Button>
                                    </Form>
                                )}
                            </Mutation>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

const WrappedManufactureAdd = Form.create({ name: 'manufacture-add' })(ManufactureAdd);
export default WrappedManufactureAdd;