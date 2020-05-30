import * as React from "react";
import autobind from "autobind-decorator";
import {Button} from 'antd';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {ApolloError} from "apollo-boost";
import styles from "./Product.module.scss";
import ProductAdd from "./ProductAdd";
import Search from "antd/lib/input/Search";
import {appHistory} from "../../App";
import ProductModal from "./ProductModal";

const GET_ALL_PRODUCTS = gql`
    query {
        allProducts(orderBy: PROD_IN_STOCK_DESC) {
            nodes {
                id
                catId
                subId
                manufId
                prodManufactureByManufId {
                    manufName
                }
                fullName
                prodFirstName
                prodSecondName
                prodMass
                prodMassType
                prodInStock
                prodCost
                prodImg
            }
        }
    }
`;

interface IProductProps {
    form?: any
}

class Product extends React.Component<IProductProps, {
    mode?: string,
    activeModal?: number,
    filter: any,
    visible: boolean
}> {
    public constructor(props: IProductProps) {
        super(props);
        this.state = {
            mode: 'all',
            activeModal: 0,
            filter: undefined,
            visible: false
        };
    }

    @autobind
    private showModal(id: number) {
        this.setState({activeModal: id});
    };

    @autobind
    private handleCancel() {
        this.setState({activeModal: 0});
    };

    @autobind
    private showModalAddProduct() {
        this.setState({visible: true});
    };

    @autobind
    private cancelModalAddProduct() {
        this.setState({visible: false});
    };

    public render(): React.ReactNode {

        if (localStorage.getItem("chcd") === "1") {
            return (
                <div className={styles.pageManuf}>
                    <div className={styles.manufBlock}>
                        <div className={styles.manufAdd}>
                            <div>
                                <Button type="dashed" className="toCpButtonLittle" onClick={() => {appHistory.push("/control-panel"); window.location.reload()}}>ПАНЕЛЬ УПРАВЛЕНИЯ</Button>
                                <Button type="primary" className="addManufButton" onClick={this.showModalAddProduct}>Добавить продукт</Button>
                            </div>
                            <ProductAdd isVisible={this.state.visible} onClose={this.cancelModalAddProduct}/>
                        </div>
                        <div>
                            <Query query={GET_ALL_PRODUCTS}>
                                {({loading, error, data}: { loading: boolean, error?: ApolloError, data: any }) => {
                                    if (loading) return <span>"Загрузка...";</span>;
                                    if (error) return <span>`Ошибка ${error.message}`</span>;

                                    return (
                                        <div className={styles.manuf}>
                                            <Search className="prodSearch" placeholder="Введите искомый продукт или производителя"
                                                    enterButton="Поиск" onSearch={value => this.setState({filter: value})}/>
                                            <div className={styles.manufList}>
                                                {data.allProducts.nodes.filter((a: any) => !this.state.filter || a.fullName.toLowerCase().includes(this.state.filter.toLowerCase()) || a.prodManufactureByManufId.manufName.toLowerCase().includes(this.state.filter.toLowerCase())).map((productQuery: any) => (
                                                    <div>
                                                        {(productQuery.prodInStock) ? (
                                                            <Button type="primary" key={productQuery.id} className="prodButton" onClick={() => this.showModal(productQuery.id)}>
                                                                <div className={styles.productNameButton}>
                                                                    <span>{productQuery.prodFirstName}</span>
                                                                    <span>{productQuery.prodSecondName}</span>
                                                                    <span style={{fontSize: "16px", fontStyle: "italic", marginTop: "10px"}}>({productQuery.prodManufactureByManufId.manufName})</span>
                                                                </div>
                                                            </Button>
                                                        ) : (
                                                            <Button type="primary" key={productQuery.id} className="prodButton" onClick={() => this.showModal(productQuery.id)} danger>
                                                                <div className={styles.productNameButton}>
                                                                    <span>{productQuery.prodFirstName}</span>
                                                                    <span>{productQuery.prodSecondName}</span>
                                                                    <span style={{fontSize: "16px", fontStyle: "italic", marginTop: "10px"}}>({productQuery.prodManufactureByManufId.manufName})</span>
                                                                </div>
                                                            </Button>
                                                        )}
                                                        <ProductModal product={productQuery} isVisible={productQuery.id === this.state.activeModal} onClose={this.handleCancel}/>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }}
                            </Query>
                        </div>
                    </div>
                </div>
            );
        } else {
            appHistory.push("/");
            window.location.reload();
        }
    }
}

export default Product;