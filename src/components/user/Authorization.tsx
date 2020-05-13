import * as React from "react";
import {ApolloError, gql} from "apollo-boost";
import {Button, Input, notification} from "antd";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Form } from '@ant-design/compatible';
import styles from "./User.module.scss";
import "./User.scss";
import {Link} from "react-router-dom";
import {Query, Mutation} from "react-apollo";
import autobind from "autobind-decorator";

const GET_USER = gql`
    query {
        allUsrs {
            nodes {
                email
            }
        }
    }
`;

interface IAuthorizationProps {
    form?: any
}

class Authorization extends React.Component<IAuthorizationProps, {
    arrEmail: string[]
}>{
    public constructor(props: IAuthorizationProps) {
        super(props);
        this.state = {
            arrEmail: []
        }
    }

    openNotification = () => {
        notification.open({
            message: 'Успешная регистрация!',
            description: 'Вы были успешно зарегистрированы и можете войти под своими учетными даными',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 6,
        });
    };

    handleSubmit = (createReview: any) => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                createReview({ variables: { firstName: values.firstName, secondName: values.secondName, patronymicName: values.patronymicName, email: values.email, company: values.company, password: values.password}});
                this.openNotification();
                this.props.form.resetFields();
            }
        });
    };

    validatorEmail = (rule: any, str: string, callback: any) => {
        if (str === "") callback('Пожалуйста, заполните поле!');
        else if (!/^([a-z0-9_.-]+\.)*[a-z0-9_.-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,20}$/.test(str)) callback('Разрешены только буквы русского алфавита. Пожалуйста, проверьте введёные данные.');
        callback()
    };

    refreshLink = () => {
        window.location.reload()
    };

    public render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={styles.userPage}>
                <Query query={GET_USER}>
                    {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                        if (loading) return <span>"Загрузка категорий...";</span>
                        if (error) return <span>`Ошибка! ${error.message}`</span>;
                        console.log(data);
                        return (
                            <>
                                {((localStorage.usr_email === "") || (localStorage.usr_email === undefined)) ? (
                                    <Form className={styles.regForm}>
                                        <div className={styles.registrationSection}>
                                            <div>
                                                <div style={{marginTop: "0px"}} className={styles.userTitle}>Введите вашу фамилию:</div>
                                                <Form.Item className={"regCheck"}>
                                                    {getFieldDecorator('secondName', {
                                                        rules: [{
                                                            required: true,
                                                            message: 'Пожалуйста, заполните поле'
                                                        }],
                                                    })(<Input className={"userInput"} placeholder="Фамилия"/>)}
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <div className={styles.userTitle}>Введите ваше имя:</div>
                                                <Form.Item>
                                                    {getFieldDecorator('firstName', {
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
                                                    <span className={"userLinkButton"}><Link to="/">На главную</Link></span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={styles.userSeparator} style={{marginTop: "270px", marginBottom: "79px"}}/>
                                        <div className={styles.registrationSection}>
                                            <div>
                                                <div className={styles.userTitle}>Введите ваш email:</div>
                                                <Form.Item>
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
                                                <Form.Item>
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
                                                    })(<Input className={"userInput"} placeholder="Компания (необязательно)"/>)}
                                                </Form.Item>
                                            </div>
                                            <span className={styles.userSeparator}/>
                                            <Button className={"userButton"} style={{marginTop: "20px"}} key="submit" type="primary">Войти на сайт</Button>
                                        </div>
                                        {data.allUsrs.nodes.map((usrQuery: any) => (
                                            <span/>
                                        ))}
                                    </Form>
                                ) : (window.location.href = "http://localhost:3000")}
                            </>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

const WrappedAuthorization = Form.create({ name: 'registration' })(Authorization);
export default WrappedAuthorization;