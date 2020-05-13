import * as React from "react";
import styles from "./Catalog.module.scss";
import "./Catalog.scss";
import autobind from "autobind-decorator";
import {Button, Checkbox} from "antd";
import {ApolloError, gql} from "apollo-boost";
import {Link} from "react-router-dom";
import {Query} from "react-apollo";
import {WaitData} from "../sui/WaitData";

// const GET_PRODUCTS = gql`
//     query {
//         allProducts(filter: {subId: {in: "1"}}) {
//             nodes {
//                 id
//                 subId
//                 manufId
//                 prodFirstName
//                 prodSecondName
//             }
//         }
//     }
// `;


//ВОТ ТУТ НУЖЕН КАСТОМНЫЙ ФИЛЬТР. Вызов Query - 87 строка
//manufId - это id компании, по которым нужен дополнительный фильтр, речь об этом сообщении в телеге:
//-------------------------------------------------------
//Фильтр должен работать в таких вариантах:
// фильтр: только id
// фильтр: id, id производителя [компания 1, компания 2]
//allProducts(filter: $ВОТ_ТУТ_НУЖЕН_КАСТОМНЫЙ_ФИЛЬТР) {
//-------------------------------------------------------


interface ICatalogProps {
    form?: any
}

export default class Catalog extends React.Component<ICatalogProps, {
    filters: string[],
    dateLocalStorage: string
}>{
    public constructor(props: ICatalogProps) {
        super(props);
        this.state = {
            filters: [],
            dateLocalStorage: ""
        }
    }

    @autobind
    private onChangeCheckbox(name: string, event: any) {
        if(event.target.checked) {
            this.setState({filters: [...this.state.filters, name]});
        } else {
            this.setState({filters: this.state.filters.filter(it => it !== name)});
        }

    }

    public render() {
        if (this.state.dateLocalStorage !== localStorage.subCategoryId) {
            this.setState({dateLocalStorage: localStorage.subCategoryId})
        }
        console.log(this.state.filters)
        return (
            <div className={styles.pageCatalog}>
                <div style={{background: "red"}}>
                    <WaitData
                        query={`{
                            allProdManufactures {
                                nodes {
                                    id
                                    manufName
                                }
                            }
                        }`}
                        extractKeysLevel={2}
                        alwaysUpdate={true}
                    >
                        {(manufactures) => manufactures.map((it: any) => (
                            <div>{it.manufName} <Checkbox onChange={event => this.onChangeCheckbox(it.id, event)} key={it.id} checked={this.state.filters.includes(it.id)} className="checkbox"/></div>
                        ))}
                    </WaitData>
                </div>
                <div style={{background: "blue"}}>
                    <WaitData
                        query={`{
                            allProducts${this.state.filters.length ? `(filter: {manufId: {in: ${JSON.stringify(this.state.filters)}}})` : ''} {
                                nodes {
                                  id
                                  subId
                                  manufId
                                  prodFirstName
                                  prodSecondName
                                }
                            }
                        }`}
                        extractKeysLevel={2}
                        alwaysUpdate={true}
                    >
                        {(products) => {
                            console.log(products);
                            return (
                                <div>
                                    {products.map((product: any) => (
                                        <span>{product.prodFirstName} {product.prodSecondName}</span>
                                    ))}
                                </div>
                            );
                        }}
                    </WaitData>
                </div>
            </div>
        );
    }
}
