import * as React from "react";
import {ApolloError, gql} from "apollo-boost";
import {Button, Input, notification} from "antd";
import Icon from "@ant-design/compatible/lib/icon";
import { Form } from '@ant-design/compatible';
import styles from "./User.module.scss";
import "./User.scss";
import {Link} from "react-router-dom";
import {Query, Mutation} from "react-apollo";
import autobind from "autobind-decorator";
import {appHistory} from "../../App";

const GET_USER = gql`
    query {
        allUsrs {
            nodes {
                email
            }
        }
    }
`;

const ADD_USER = gql`
    mutation addUser ($email: String!, $firstName: String!, $secondName: String!, $patronymicName: String, $company: String, $password: String!, $role: Boolean!) {
        createUsr (
            input: {
                usr: {
                    email: $email
                    firstName: $firstName
                    secondName: $secondName
                    patronymicName: $patronymicName
                    company: $company
                    password: $password
                    role: $role
                }
            }
        ) {
            usr {
                id
            }
        }
    }
`;

interface IRegistrationProps {
    form?: any
}

class Registration extends React.Component<IRegistrationProps, {
    arrEmail: any
}>{
    public constructor(props: IRegistrationProps) {
        super(props);
        this.state = {
            arrEmail: undefined
        }
    }

    openNotification = () => {
        notification.open({
            message: 'Успешная регистрация!',
            description: 'Вы были успешно зарегистрированы и можете войти под своими учетными даными',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 4,
        });
    };

    handleSubmit = (createReview: any) => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                createReview({ variables: { firstName: values.firstName, secondName: values.secondName, patronymicName: values.patronymicName, email: values.email, company: values.company, password: values.password, role: false}});
                this.openNotification();
                this.props.form.resetFields();
                appHistory.push("/authorization");
                setTimeout(() => window.location.reload(),3750);
            }
        });
    };

    validatorEmail = (rule: any, str: string, callback: any) => {
        const userDate = this.state.arrEmail.find((v: any) => (v.email === str));
        if (str === "") callback('Пожалуйста, заполните поле!');
        else if (!/^([a-z0-9_.-]+\.)*[a-z0-9_.-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,20}$/.test(str)) callback('Введены некорректные данные!');
        else if (userDate !== undefined) callback('Данный email уже занят!');
        callback()
    };

    refreshLink = () => {
        window.location.reload()
    };

    public render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Query query={GET_USER}>
                {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                    if (loading) return  <span>"загрузка"</span>
                    if (error) return  <span>'Ошибочка ${error.message}'</span>;

                    if (!this.state.arrEmail) {
                        this.setState({arrEmail: data.allUsrs.nodes})
                    }

                    console.log("text")
                    console.log(this.state.arrEmail)

                    return (

                        <div className={styles.userPage}>
                            <Mutation mutation={ADD_USER}>
                                {(createReview: any) => (
                                    <Form className={styles.regForm}>
                                        <div className={styles.registrationSection}>
                                            <div>
                                                <div style={{marginTop: "0px"}} className={styles.userTitle}>Введите вашу фамилию:</div>
                                                <Form.Item className={"regCheck"}>
                                                    {getFieldDecorator('firstName', {
                                                        rules: [{
                                                            required: true,
                                                            message: 'Пожалуйста, заполните поле'
                                                        }],
                                                    })(<Input className={"userInput"} placeholder="Фамилия"/>)}
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <div className={styles.userTitle}>Введите ваше имя:</div>
                                                <Form.Item className={"regCheck"}>
                                                    {getFieldDecorator('secondName', {
                                                        rules: [{
                                                            required: true,
                                                            message: 'Пожалуйста, заполните поле'
                                                        }],
                                                    })(<Input className={"userInput"} placeholder="Имя"/>)}
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <div className={styles.userTitle}>Введите ваше отчество:</div>
                                                <Form.Item>
                                                    {getFieldDecorator('patronymicName', {
                                                        rules: [{
                                                            required: false
                                                        }],
                                                    })(<Input className={"userInput"} placeholder="Отчество (необязательно)"/>)}
                                                </Form.Item>
                                            </div>
                                            <span className={styles.userSeparator}/>
                                            <div className={styles.registrationLinks}>
                                                <div className={styles.registrationLinkBlock}>
                                                    <span>Уже зарегистрированы?</span>
                                                    <Button className={"userLinkButton"} style={{width: "120px"}} onClick={() => {this.refreshLink()}}><Link to="/authorization">Авторизоваться</Link></Button>
                                                </div>
                                                <div className={styles.registrationLinkBlock} style={{alignItems: "flex-end"}}>
                                                    <span>Вернуться</span>
                                                    <Button className={"userLinkButton"} onClick={() => {this.refreshLink()}}><Link to="/">На главную</Link></Button>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={styles.userSeparator} style={{marginTop: "270px", marginBottom: "79px"}}/>
                                        <div className={styles.registrationSection}>
                                            <div>
                                                <div className={styles.userTitle}>Введите ваш email:</div>
                                                <Form.Item className={"regCheck"}>
                                                    {getFieldDecorator('email', {
                                                        rules: [{
                                                            required: true,
                                                            validator: this.validatorEmail
                                                        }],
                                                    })(<Input className={"userInput"} placeholder="example@gmail.com"/>)}
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <div className={styles.userTitle}>Введите ваш пароль:</div>
                                                <Form.Item className={"regCheck"}>
                                                    {getFieldDecorator('password', {
                                                        rules: [{
                                                            required: true,
                                                            message: 'Пожалуйста, заполните поле'
                                                        }],
                                                    })(<Input className={"userInput"} placeholder="Пароль"/>)}
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <div className={styles.userTitle}>Введите название вашей компании:</div>
                                                <Form.Item>
                                                    {getFieldDecorator('company', {
                                                        rules: [{
                                                            required: false
                                                        }],
                                                    })(<Input className={"userInput"} placeholder="Компания"/>)}
                                                </Form.Item>
                                            </div>
                                            <span className={styles.userSeparator}/>
                                            <Button className={"userButton"} style={{marginTop: "20px"}} key="submit" type="primary" onClick={() => {this.handleSubmit(createReview)}}>Зарегистрироваться</Button>
                                        </div>
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

const WrappedRegistration = Form.create({ name: 'registration' })(Registration);
export default WrappedRegistration;