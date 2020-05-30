import * as React from "react";
import styles from "./Catalog.module.scss";
import "./Catalog.scss";
import autobind from "autobind-decorator";
import {Checkbox, InputNumber, Button, notification} from "antd";
import {WaitData} from "../sui/WaitData";
import { Icon } from "@ant-design/compatible";
import {appHistory} from "../../App";
import Search from "antd/lib/input/Search";


interface ICatalogProps {
    form?: any
}

export default class Catalog extends React.Component<ICatalogProps, {
    filters: string[],
    tempCount: number,
    filter: any
}>{
    public constructor(props: ICatalogProps) {
        super(props);
        this.state = {
            filters: [],
            tempCount: 0,
            filter: undefined
        }
    }

    openNotificationError = () => {
        notification.open({
            message: 'Ошибка!',
            description: 'Пожалуйста, укажите количество товара!',
            icon: <Icon type="close-circle" style={{ color: '#d50000' }} />,
            duration: 6,
        });
    };

    openNotificationAccess = () => {
        notification.open({
            message: 'Корзина пополнена!',
            description: 'Товар был успешно добавлен в корзину!',
            icon: <Icon type="check-circle" style={{ color: '#52c41a' }} />,
            duration: 6,
        });
    };

    @autobind
    private onChangeCheckbox(name: string, event: any) {
        if(event.target.checked) {
            this.setState({filters: [...this.state.filters, name]});
        } else {
            this.setState({filters: this.state.filters.filter(it => it !== name)});
        }

    }

    @autobind
    private setCart(product: any) {
        if (this.state.tempCount <= 0) {
            this.openNotificationError();
        } else {
            localStorage.setItem("tempCart", JSON.stringify({
                ...JSON.parse(
                    localStorage.getItem("tempCart")||"{}"
                ),
                [product.id]: {
                    ...product,
                    "count": this.state.tempCount

                }
            }));
            this.forceUpdate();
            this.openNotificationAccess();
        }
    }

    public render() {
        const countContent = JSON.parse(localStorage.getItem("tempCart")||"{}")

        if (appHistory.location.pathname !== "/catalog") {
            return (
                <div className={styles.pageCatalog}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <span className={styles.manufHeader}>Производители:</span>
                        <WaitData
                            query={`{
                                allProducts(filter: {subId: {equalTo: "${window.location.pathname.substr(9)}"}}) {
                                    nodes {
                                        prodManufactureByManufId {
                                            id
                                            manufName
                                        }
                                    }
                                }
                            }`}
                            extractKeysLevel={2}
                            alwaysUpdate={true}
                        >
                            {(manufactures) => [...manufactures.reduce((acc: any, cur: any) => {acc.set(cur.prodManufactureByManufId.id, cur); return acc}, new Map()).values()].map((it: any) => (
                                <Checkbox onChange={event => this.onChangeCheckbox(it.prodManufactureByManufId.id, event)}
                                          checked={this.state.filters.includes(it.prodManufactureByManufId.id)}
                                          key={it.prodManufactureByManufId.id} className="manufCheck"
                                >
                                    <span className={styles.manufName}>{it.prodManufactureByManufId.manufName}</span>
                                </Checkbox>
                            ))}
                        </WaitData>
                    </div>
                    <div>
                        <WaitData
                            query={`{
                                allProducts${this.state.filters.length ? `(condition: {prodInStock: true}, filter: {subId: {equalTo: "${window.location.pathname.substr(9)}"}, manufId: {in: ${JSON.stringify(this.state.filters)}}})` : `(condition: {prodInStock: true}, filter: {subId: {equalTo: "${window.location.pathname.substr(9)}"}})`} {
                                    nodes {
                                        id
                                        subId
                                        manufId
                                        prodManufactureByManufId {
                                            manufName
                                        }
                                        prodFirstName
                                        prodSecondName
                                        prodMass
                                        prodMassType
                                        prodInStock
                                        prodCost
                                        prodImg
                                    }
                                }
                            }`}
                            extractKeysLevel={2}
                            alwaysUpdate={true}
                        >
                            {(products) => {
                                console.log(localStorage.getItem("tempCart"));
                                return (
                                    <div>
                                        <div className={styles.catalogWithSearch}>
                                        <Search className="catalogSearch" placeholder="Введите название товара в данной категории"
                                                enterButton="Поиск" onSearch={value => this.setState({filter: value})}/>
                                        </div>
                                        <div className={styles.fullCatalog}>
                                            {products.filter((a: any) => !this.state.filter || a.prodFirstName.toLowerCase().includes(this.state.filter.toLowerCase()) || a.prodSecondName.toLowerCase().includes(this.state.filter.toLowerCase())).map((product: any) => (
                                                <div className={styles.productCard}>
                                                    <div className={styles.productCardMain}>
                                                        <span className={styles.productImg}><img alt="icon" src={product.prodImg}/></span>
                                                        <div className={styles.productInfo}>
                                                            <span className={styles.productText} style={{fontWeight: "bolder"}}>{product.prodFirstName}</span>
                                                            <span className={styles.productText} style={{fontWeight: "normal"}}>{product.prodSecondName}</span>
                                                            <span/>
                                                            <span className={styles.productText} style={{fontStyle: "italic"}}>{product.prodManufactureByManufId.manufName}</span>
                                                            <span/>
                                                            <span className={styles.productText}>{(product.prodMassType) ? "Вес" : "Объем"}: {product.prodMass}{(product.prodMassType) ? "гр" : "мл"}</span>
                                                            <span className={styles.productText}>Цена: {product.prodCost} руб.</span>
                                                        </div>
                                                    </div>
                                                    <span/>
                                                    {(Object.keys(countContent).indexOf(product.id) >= 0) ?
                                                        (
                                                            <span className={styles.productCardBuy} style={{fontStyle: "italic", color: "#1890ff"}}>Товар добавлен в корзину</span>
                                                        ) : (
                                                            <div className={styles.productCardBuy}>
                                                                <span style={{marginRight: "10px"}}>Количество:</span>
                                                                <InputNumber className={styles.productCount} min={0} max={20} defaultValue={0} onChange={(inputValue: any) => this.setState({tempCount: inputValue})}/>
                                                                <Button type="primary" className="productBuyButton" onClick={() => this.setCart(product)}><Icon type="shopping-cart" className="buttonBuyIcon"/></Button>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }}
                        </WaitData>
                    </div>
                </div>
            );
        } else {
            appHistory.push("/")
        }

    }
}
