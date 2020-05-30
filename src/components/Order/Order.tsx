import * as React from "react";
import {ApolloError, gql} from "apollo-boost";
import {Query} from "react-apollo";
import Search from "antd/lib/input/Search";
import {Button} from "antd";
import styles from "./Order.module.scss";
import "./Order.scss";
import autobind from "autobind-decorator";
import moment from "moment";
import OrderModal from "./OrderModal";
import {appHistory} from "../../App";

const GET_ALL_ORDERS = gql`
    query {
        allUserOrders(orderBy: [ORDER_DATE_DESC, ORDER_STATUS_DESC]) {
            nodes {
                id
                userId
                orderDate
                order
                orderPrice
                delivery
                address
                phone
                fullName
                email
                orderNumber
                people
                orderStatus
            }
        }
    }
`;

export default class Order extends React.Component<{}, {
    filter: any,
    activeModal?: number,
}> {
    public constructor(props: any) {
        super(props);
        this.state = {
            filter: undefined,
            activeModal: 0
        }
    }

    @autobind
    private showModal(id: number) {
        this.setState({activeModal: id});
    };

    @autobind
    private handleCancel() {
        this.setState({activeModal: 0});
    };

    public render() {
        if (localStorage.getItem("chcd") === "1") {
            return (
                <div className={styles.ordersPage}>
                    <div className={styles.ordersMainTitle}>
                        <span className={styles.orderListTitle}>ВСЕ ЗАКАЗЫ</span>
                        <Button type="dashed" className="toCpButton" onClick={() => {appHistory.push("/control-panel"); window.location.reload()}}>ПАНЕЛЬ УПРАВЛЕНИЯ</Button>
                    </div>
                    <div>
                        <Query query={GET_ALL_ORDERS}>
                            {({loading, error, data}: { loading: boolean, error?: ApolloError, data: any }) => {
                                if (loading) return <span>"Загрузка...";</span>;
                                if (error) return <span>`Ошибка ${error.message}`</span>;

                                return (
                                    <div>
                                        <div className={styles.searchBlock}>
                                            <Search className="orderSearch" placeholder="Введите ФИО или номер заказа"
                                                    enterButton="Поиск" onSearch={value => this.setState({filter: value})}/>
                                        </div>
                                        <div className={styles.orderList}>
                                            {data.allUserOrders.nodes.filter((a: any) => !this.state.filter || a.fullName.toLowerCase().includes(this.state.filter.toLowerCase()) || String(a.orderNumber).includes(this.state.filter)).map((ordersQuery: any) => (
                                                <div>
                                                    <Button type="default" key={ordersQuery.id} className="orderSmallInfoButton" onClick={() => this.showModal(ordersQuery.id)}>
                                                        <div className={styles.productNameButton}>
                                                            <span style={{color: "#1890ff"}}>{ordersQuery.fullName}</span>
                                                            <span style={{color: "#393939"}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                                            <span style={{color: "#393939"}}>{moment(ordersQuery.orderDate).format('DD.MM.YYYY hh:mm:ss')}</span>
                                                            <span style={{color: "#393939"}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                                            <span style={{color: "#393939"}}>#{ordersQuery.orderNumber}</span>
                                                            <span style={{color: "#393939"}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                                            {(ordersQuery.orderStatus === null) ? (
                                                                <span style={{fontWeight: "bolder", color: "#faad14"}}>На рассмотрении</span>
                                                            ) : (
                                                            (ordersQuery.orderStatus === false) ? (
                                                                <span style={{fontWeight: "bolder", color: "#ff4d4f"}}>Отклонён</span>
                                                            ) : (
                                                                <span style={{fontWeight: "bolder", color: "#237804"}}>Одобрен</span>
                                                            ))}
                                                        </div>
                                                    </Button>
                                                    <OrderModal order={ordersQuery} isVisible={ordersQuery.id === this.state.activeModal} onClose={this.handleCancel}/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }}
                        </Query>
                    </div>
                </div>
            );
        } else {
            appHistory.push("/");
            window.location.reload();
        }
    }
}