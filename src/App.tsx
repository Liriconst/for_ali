import * as React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, withRouter} from "react-router-dom";

import styles from './App.module.scss';
import "./App.scss";

import { ApolloProvider, Query } from "react-apollo";
import { ApolloError } from "apollo-boost";
import { gql } from 'apollo-boost';

import { createBrowserHistory } from 'history';
import { client } from "./index";

import { Input, Button, Menu, Dropdown } from 'antd';
import SubMenu from "antd/lib/menu/SubMenu";

import WrappedAuthorization from "./components/user/Authorization";
import WrappedRegistration from "./components/user/Registration";

import Catalog from "./components/catalog/Catalog";
import Home from "./components/home/Home";
import Cart from "./components/cart/Cart";
import autobind from 'autobind-decorator';
import WrappedFullCart from "./components/cart/fullCart";
import Manufacture from "./components/Manufacture/Manufacture";
import Product from "./components/Product/Product";
import Order from "./components/Order/Order";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import Profile from "./components/user/Profile";
import MyOrders from "./components/user/MyOrders";
import DeliveryAndPay from "./components/catalog/DeliveryAndPay";

const { Search } = Input;

const GET_CATEGORIES = gql`
    query {
        allProdCategories {
            nodes {
                prodSubcategoriesByCatId {
                    nodes {
                        id
                        subName
                    }
                }
                catFirstName
                catSecondName
            }
        }
    }
`;

class AppHeaderInner extends React.Component<{location: any}, {
    visible: boolean,
    catId: string
}> {
    public constructor(props: {}) {
    // @ts-ignore
        super(props);
        this.state = {
            visible: false,
            catId: ""
        };
    }

    @autobind
    private showModal() {
        this.setState({visible: true});
    };

    @autobind
    private handleCancel() {
        this.setState({visible: false});
    };

    @autobind
    private pageReload() {
        window.location.reload();
    };

    @autobind
    private openProfile() {
        if ((localStorage.getItem('email') !== "") && (localStorage.getItem('email') !== undefined)) {
            appHistory.push("/profile");
            window.location.reload();
        } else {
            appHistory.push("/authorization");
            window.location.reload();
        }
    }

  public render(): React.ReactNode {

    return (
      <div className={styles.appBar}>
        <div className={styles.appHeaderBlock}>
            <div className={styles.appBarHeader}>
                <div className={styles.appHeaderInfo}>
                    <span className={styles.appHeaderTextBold}>
                        Санкт-Петербург, пр. Обуховской Обороны 45
                    </span>
                    <span className={styles.appHeaderTextNormal}>
                        Пн-Пт: 9:00 - 21:00
                    </span>
                </div>
                <div className={styles.appHeaderContacts}>
                    <span className={styles.appHeaderTextNormal} style={{height: "17px", alignSelf: "center"}}>
                        <Button type="link" className={styles.appHeaderLink} onClick={() => {appHistory.push("/delivery-and-pay"); window.location.reload()}}>Оплата и Доставка</Button>
                    </span>
                    <div className={styles.appHeaderTextBold} style={{alignItems: "center"}}>
                        <span>+7 (812) 317-18-34</span>
                    </div>
                </div>
            </div>
            <span className={styles.appHeaderSeparator}/>
        </div>
        <div className={styles.appMiddleBlock}>
            <div className={styles.appBarMiddle}>
                <Button type="link" className={styles.appMiddleLogo} onClick={() => {appHistory.push("/"); window.location.reload()}}>
                    <img src="/static/img/logo-name.png" alt=""/>
                    <img src="/static/img/logo-finish.png" alt=""/>
                </Button>
                <div className={styles.appMiddleSearchProfile}>
                    <div className={styles.appMiddleSearch}>
                        <span className={styles.appMiddleText}>{localStorage.getItem('fullName')}</span>
                        <div className={styles.appMiddleText} style={((localStorage.getItem('chcd') === "") || (localStorage.getItem('chcd') === undefined)) ? {color: "white"} : {color: "#c0c0c0"}}>{localStorage.getItem('email')}&nbsp;&nbsp;|&nbsp;&nbsp;{localStorage.getItem('company')}</div>
                    </div>
                    <div className={styles.appMiddleProfile}>
                        <Button className={"appMeddleButton"} onClick={this.openProfile}>
                            <div className={styles.appButtonContent}>
                                <span className={"appButtonText"}>ПРОФИЛЬ</span>
                                <div className={styles.appButtonImg}>
                                    <img src="/static/svg/profile.svg" alt=""/>
                                </div>
                            </div>
                        </Button>
                        <Button className="appMeddleButton" disabled={(localStorage.getItem('chcd') === '0') ? false : true } onClick={this.showModal}>
                            <div className={styles.appButtonContent}>
                                <span className={"appButtonText"}>КОРЗИНА</span>
                                <div className={styles.appButtonImg}>
                                    {(localStorage.getItem('chcd') === '0') ?
                                        <img src="/static/svg/basket.svg" alt=""/>
                                     :
                                        <img src="/static/svg/basket_disable.svg" alt=""/>
                                    }
                                </div>
                            </div>
                        </Button>
                        <Cart isVisible={this.state.visible} onClose={this.handleCancel}/>
                    </div>
                </div>
            </div>
            <span className={styles.appHeaderSeparator}/>
        </div>
        <div className={styles.appFooterBlock}>
                <div className={styles.appBarFooter}>
                <Query query={GET_CATEGORIES}>
                    {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                        if (loading) return <span>"Загрузка категорий...";</span>
                        if (error) return <span>`Ошибка! ${error.message}`</span>;
                        console.log(data);
                        return (
                            <div className={styles.appBarFooterInserted}>
                                {data.allProdCategories.nodes.map((categoryQuery: any) => (
                                    <div className={styles.appBarFooterDoubleInserted}>
                                        <span className={styles.appFooterSeparator}/>
                                        <Menu className={"appFooterMenu"} mode="horizontal">
                                            <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"}
                                                 title={<div className="submenu-title-wrapper">
                                                     <span>{categoryQuery.catFirstName}</span>
                                                     <span>{categoryQuery.catSecondName}</span>
                                                 </div>}
                                            >
                                                <Menu.ItemGroup className={styles.appFooterMenuGroup}>
                                                    {categoryQuery.prodSubcategoriesByCatId.nodes.map((subQuery: any) => (
                                                    <div style={{display: "flex", flexDirection: "column", borderRadius: "25px"}}>
                                                        <Button className={"appButtonSubcategory"} onClick={() => this.pageReload()}><Link to={`/catalog/${subQuery.id}`}>{subQuery.subName}</Link></Button>
                                                    </div>
                                                    ))}
                                                </Menu.ItemGroup>
                                            </SubMenu>
                                        </Menu>
                                    </div>
                                ))}
                            </div>
                        );
                    }}
                </Query>
                <span className={styles.appFooterSeparator}/>
            </div>
            <span className={styles.appFooterGradientSeparator}/>
        </div>
      </div>
    );
  };
}

const AppHeader = withRouter(AppHeaderInner);

export const appHistory = createBrowserHistory();

const App: React.FC = () => {
    return (
        <Router history={appHistory}>
            <ApolloProvider client={client}>
            <div className={styles.appHeader}>
                {((appHistory.location.pathname === "/registration") ||
                  (appHistory.location.pathname === "/authorization") ||
                  (appHistory.location.pathname === "/create-order") ||
                  (appHistory.location.pathname === "/manufacture") ||
                  (appHistory.location.pathname === "/order-list") ||
                  (appHistory.location.pathname === "/control-panel") ||
                  (appHistory.location.pathname === "/my-orders") ||
                  (appHistory.location.pathname === "/profile") ||
                  (appHistory.location.pathname === "/product")) ?
                  (null) : (<AppHeader/>)
                }
                <Switch>
                    <Route path="/authorization">
                        <WrappedAuthorization/>
                    </Route>
                    <Route path="/registration">
                        <WrappedRegistration/>
                    </Route>
                    <Route path="/catalog">
                        <Catalog/>
                    </Route>
                    <Route path="/delivery-and-pay">
                        <DeliveryAndPay/>
                    </Route>
                    <Route path="/create-order">
                        <WrappedFullCart/>
                    </Route>
                    <Route path="/control-panel">
                        <ControlPanel/>
                    </Route>
                    <Route path="/manufacture">
                        <Manufacture/>
                    </Route>
                    <Route path="/order-list">
                        <Order/>
                    </Route>
                    <Route path="/my-orders">
                        <MyOrders/>
                    </Route>
                    <Route path="/product">
                        <Product/>
                    </Route>
                    <Route path="/profile">
                        <Profile/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </div>
            </ApolloProvider>
        </Router>
    );
};

export default App;