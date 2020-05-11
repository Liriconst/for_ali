import * as React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, withRouter} from "react-router-dom";
import styles from './App.module.scss';
import "./App.scss";
import { ApolloProvider } from "react-apollo";
import { createBrowserHistory } from 'history';
import { client } from "./index";
import { Input, Button, Select, Menu, Dropdown } from 'antd';
import SubMenu from "antd/lib/menu/SubMenu";

import Home from "./components/home/Home";
import Authorization from "./components/authorization/Authorization";
import Catalog from "./components/catalog/Catalog";

const { Search } = Input;
const { Option } = Select;

function handleChange(value: any) {
    console.log(`selected ${value}`);
}

class AppHeaderInner extends React.Component<{location: any}, {
  visible: boolean
}> {
    public constructor(props: {}) {
    // @ts-ignore
        super(props);
        this.state = {
            visible: false
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
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Овощи и</span><span>фрукты</span></div>}>
                            <Menu.Item key="setting:1">Option 1</Menu.Item>
                            <Menu.Item key="setting:2">Option 2</Menu.Item>
                            <Menu.Item key="setting:3">Option 3</Menu.Item>
                            <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Молоко</span><span>и яйца</span></div>}>
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Хлеб и</span><span>выпечка</span></div>}>
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Мясные</span><span>продукты</span></div>}>
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Море-</span><span>продукты</span></div>}>
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Вода и</span><span>напитки</span></div>}>
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Бакалея,</span><span>чай, кофе</span></div>}>
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
                <span className={styles.appFooterSeparator}/>
                <Menu className={"appFooterMenu"} mode="horizontal">
                    <SubMenu popupClassName={"appSubPopup"} className={"appSubMenu"} title={<div className="submenu-title-wrapper"><span>Снеки и</span><span>сладкое</span></div>}>
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </SubMenu>
                </Menu>
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
// export const {router, params, location, routes} = (window as any).props;

const App: React.FC = () => {
  return (
    <Router history={appHistory}>
      <ApolloProvider client={client}>
        <div className={styles.appHeader}>
          <AppHeader/>
          <Switch>
            <Route path="/authorization">
              <Authorization/>
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