import * as React from "react";
import autobind from "autobind-decorator";
import {Button} from 'antd';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {ApolloError} from "apollo-boost";
import styles from "./Manufacture.module.scss";
import WrappedManufactureAdd from "./ManufactureAdd";
import Search from "antd/lib/input/Search";
import ManufactureModal from "./ManufactureModal";
import {appHistory} from "../../App";

const GET_ALL_MANUF = gql`
    query {
        allProdManufactures {
            nodes {
                id
                manufName
            }
        }
    }
`;

class Manufacture extends React.Component<{}, {
    mode?: string,
    activeModal?: number,
    filter: any
}> {
    public constructor(props: {}) {
        super(props);
        this.state = {
            mode: 'all',
            activeModal: 0,
            filter: undefined
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

    public render(): React.ReactNode {

        if (localStorage.getItem("chcd") === "1") {
            return (
                <div className={styles.pageManuf}>
                    <div className={styles.manufBlock}>
                        <WrappedManufactureAdd/>
                        <div>
                            <Query query={GET_ALL_MANUF}>
                                {({loading, error, data}: { loading: boolean, error?: ApolloError, data: any }) => {
                                    if (loading) return <span>"Загрузка...";</span>;
                                    if (error) return <span>`Ошибка ${error.message}`</span>;

                                    return (
                                        <div className={styles.manuf}>
                                            <div className={styles.manufSearchButtons}>
                                                <div className={styles.manufSearchBlock}>
                                                    <Search className="manufSearch" placeholder="Введите искомое наименование"
                                                    enterButton="Поиск" onSearch={value => this.setState({filter: value})}/>
                                                </div>
                                                <Button type="dashed" className="toCpButtonSmall" onClick={() => {appHistory.push("/control-panel"); window.location.reload()}}>УПРАВЛЕНИЕ</Button>
                                            </div>
                                            <div className={styles.manufList}>
                                                {data.allProdManufactures.nodes.filter((a: any) => !this.state.filter || a.manufName.toLowerCase().includes(this.state.filter.toLowerCase())).map((manufQuery: any) => (
                                                    <div>
                                                        <Button type="primary" key={manufQuery.id} className="manufButton"
                                                                onClick={() => this.showModal(manufQuery.id)}>{manufQuery.manufName}</Button>
                                                        <ManufactureModal manuf={manufQuery}
                                                                          isVisible={manufQuery.id === this.state.activeModal}
                                                                          onClose={this.handleCancel}/>
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

export default Manufacture;