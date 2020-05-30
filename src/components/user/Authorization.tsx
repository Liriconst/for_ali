import * as React from "react";
import {ApolloError, gql} from "apollo-boost";
import {Button, Input} from "antd";
import {Form} from '@ant-design/compatible';
import styles from "./User.module.scss";
import "./User.scss";
import {Query} from "react-apollo";
import autobind from "autobind-decorator";
import {appHistory} from "../../App";

const GET_USER = gql`
    query {
        allUsrs {
            nodes {
                id
                firstName
                secondName
                patronymicName
                email
                password
                company
                role
            }
        }
    }
`;

interface IRegistrationProps {
    form?: any
}

class Authorization extends React.Component<IRegistrationProps, {
    arrUsr: any[],
    res: any[],
    test: string,
    textErrorFirst: string,
    textErrorSecond: string
}>{
    public constructor(props: IRegistrationProps) {
        super(props);
        this.state = {
            arrUsr: [],
            res: [],
            test: "",
            textErrorFirst: "",
            textErrorSecond: ""
        }
    }

    handleSubmit = () => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }

            const userDate = this.state.arrUsr.find(v => (v.email === values.email) && (v.password === values.password));
            if (userDate !== undefined) {
                this.setState({res: userDate.email});
                this.setState({res: userDate.password});

                localStorage.setItem('email', values.email);
                localStorage.setItem('usrId', userDate.id);

                if (userDate.role) {
                    localStorage.setItem('chcd', '1');
                } else {
                    localStorage.setItem('chcd', '0');
                }
                localStorage.setItem('company', userDate.company);
                localStorage.setItem('password', values.password);
                localStorage.setItem('fullName', (userDate.firstName + " " + userDate.secondName + " " + userDate.patronymicName));

                appHistory.push('/');
                window.location.reload();
            } else {
                this.setState({textErrorFirst: "Ошибка! Пользователь не найден,"})
                this.setState({textErrorSecond: "или учетные данные некорректны"})

                localStorage.setItem('email', "");
                localStorage.setItem('company', "");
                localStorage.setItem('usrId', "");
                localStorage.setItem('chcd', "");
                localStorage.setItem('password', "");
                localStorage.setItem('fullName', "");
            }

        });
    };

    validatorEmail = (rule: any, str: string, callback: any) => {
        if (str === "") callback('Пожалуйста, заполните поле!');
        else if (!/^([a-z0-9_.-]+\.)*[a-z0-9_.-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,20}$/.test(str)) callback('Разрешена только латиница и символы @, _,.');
        callback()
    };

    @autobind
    private openLink() {
        appHistory.push("/registration");
        window.location.reload()
    }

    public render() {
        const { getFieldDecorator } = this.props.form;

        if ((localStorage.getItem('email') === "") || (localStorage.getItem('email') === undefined)) {
            return (
                <Query query={GET_USER}>
                    {({loading, error, data}: { loading: boolean, error?: ApolloError, data: any }) => {
                        if (loading) return <span>"загрузка"</span>;
                        if (error) return <span>'Ошибочка ${error.message}'</span>;
                        if (!this.state.arrUsr.length) {
                            this.setState({arrUsr: data.allUsrs.nodes})
                        }
                        console.log(localStorage.getItem('chcd'))
                        return (
                            <div className={styles.userPage}>
                                <Form className={styles.authForm}>
                                    <div className={styles.authorizationSection}>
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
                                                })(<Input className="userInput" type="password"
                                                          placeholder="Пароль"/>)}
                                            </Form.Item>
                                        </div>
                                        <span className={styles.userSeparator}/>
                                        <div className={styles.authorizationLinks} style={{marginTop: "5px"}}>
                                            <span>Ещё не зарегистрированы?&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            <Button className={"authLinkButton"} style={{marginTop: "3px"}} onClick={() => this.openLink()}>Зарегистрироваться</Button>
                                        </div>
                                        <Button className={"userButton"} style={{marginTop: "5px"}} key="submit" type="primary" onClick={() => {this.handleSubmit()}}>Войти</Button>
                                        <div className={styles.textError}>
                                            <span>{this.state.textErrorFirst}</span>
                                            <span>{this.state.textErrorSecond}</span>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        )
                    }}
                </Query>
            );
        } else {
            appHistory.push("/");
            window.location.reload()
        }
    }
}

const WrappedAuthorization = Form.create({ name: 'registration' })(Authorization);
export default WrappedAuthorization;