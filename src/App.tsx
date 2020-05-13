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

  public render(): React.ReactNode {
    const {location} = this.props;

    return (
      <div className={styles.appBar}>
        <div className={styles.appHeaderBlock}>
            <div className={styles.appBarHeader}>
                <div className={styles.appHeaderInfo}>
                    <span className={styles.appHeaderTextBold}>
                        Санкт-Петербург, ул. Зои Космодемьянской, д. 1
                    </span>
                    <span className={styles.appHeaderTextNormal}>
                        Пн-Пт: 9:00 - 21:00
                    </span>
                </div>
                <div className={styles.appHeaderContacts}>
                    <span className={styles.appHeaderTextNormal} style={{height: "17px", alignSelf: "center"}}>
                        <div className={styles.appHeaderLink}><Link to="/authorization">Оплата и Доставка</Link></div>
                    </span>
                    <div className={styles.appHeaderTextBold} style={{alignItems: "center"}}>
                        <span>+7 (921) 472-38-12</span>
                    </div>
                </div>
            </div>
            <span className={styles.appHeaderSeparator}/>
        </div>
        <div className={styles.appMiddleBlock}>
            <div className={styles.appBarMiddle}>
                <div className={styles.appMiddleLogo}>
                    <img src="/static/img/logo.png" alt=""/>
                </div>
                <div className={styles.appMiddleSearchProfile}>
                    <div className={styles.appMiddleSearch}>
                        <Search
                            className={"appSearch"}
                            placeholder="Поиск"
                            onSearch={value => console.log(value)}
                            style={{ width: 300 }}
                        />
                    </div>
                    <div className={styles.appMiddleProfile}>
                        <Button className={"appMeddleButton"}>
                            <div className={styles.appButtonContent}>
                                <span className={"appButtonText"}>ПРОФИЛЬ</span>
                                <div className={styles.appButtonImg}>
                                    <img src="/static/svg/profile.svg" alt=""/>
                                </div>
                            </div>
                        </Button>
                        <Button className={"appMeddleButton"}>
                            <div className={styles.appButtonContent}>
                                <span className={"appButtonText"}>КОРЗИНА</span>
                                <div className={styles.appButtonImg}>
                                    <img src="/static/svg/basket.svg" alt=""/>
                                </div>
                            </div>
                        </Button>
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
                                                        <Button className={"appButtonSubcategory"}><Link to={`/catalog/${subQuery.id}`}>{subQuery.subName}</Link></Button>
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
                {((window.location.href == "http://localhost:3000/registration") ||
                  (window.location.href == "http://localhost:3000/authorization")) ?
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