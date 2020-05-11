import * as React from "react";
import styles from "./Catalog.module.scss";
import "./Catalog.scss";
import autobind from "autobind-decorator";
import { Form, Checkbox } from "antd";

interface ICatalogProps {
    form?: any
}

export default class Catalog extends React.Component<ICatalogProps, {
    filters: string[],
}>{
    public constructor(props: ICatalogProps) {
        super(props);
        this.state = {
            filters: []
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
        // const { getFieldDecorator } = this.props.form;
        console.log(this.state.filters);
        const checkboxes = ["test1", "test2", "test3"];
        return (
            <div className={styles.pageCatalog}>
                <div style={{background: "red"}}>
                    {checkboxes.map(it => (
                        <Checkbox onChange={event => this.onChangeCheckbox(it, event)} key={it} checked={this.state.filters.includes(it)} className="checkbox"/>
                    ))}
                </div>
                <div style={{background: "blue"}}>

                </div>
            </div>
        );
    }
}
