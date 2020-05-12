import * as React from "react";
import styles from "./Catalog.module.scss";
import "./Catalog.scss";
import autobind from "autobind-decorator";
import {Button, Checkbox} from "antd";
import {ApolloError, gql} from "apollo-boost";
import {Link} from "react-router-dom";
import {Query} from "react-apollo";

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

const GET_PRODUCTS = gql`
    query {
        allProducts {
            nodes {
                id
                subId
                manufId
                prodFirstName
                prodSecondName
            }
        }
    }
`;

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
        const checkboxes = ["компания 1", "компания 2", "компания 3"];
        return (
            <div className={styles.pageCatalog}>
                <div style={{background: "red"}}>
                    {checkboxes.map(it => (
                        <Checkbox onChange={event => this.onChangeCheckbox(it, event)} key={it} checked={this.state.filters.includes(it)} className="checkbox"/>
                    ))}
                </div>
                <div style={{background: "blue"}}>
                    <Query query={GET_PRODUCTS}>
                        {({loading, error, data}: {loading: boolean, error?: ApolloError, data: any}) => {
                            if (loading) return <span>"Загрузка категорий...";</span>
                            if (error) return <span>`Ошибка! ${error.message}`</span>;
                            console.log(data);
                            return (
                                <div>
                                    {data.allProducts.nodes.map((prodQuery: any) => (
                                        <span>{prodQuery.prodFirstName}{prodQuery.prodSecondName}</span>
                                    ))}
                                </div>
                            );
                        }}
                    </Query>
                </div>
                {console.log(localStorage.subCategoryId)}
            </div>
        );
    }
}