import * as React from "react";
import styles from "./Catalog.module.scss";
import "./Catalog.scss";
import autobind from "autobind-decorator";
import { Form, Checkbox } from "antd";

interface ICatalogProps {
    form?: any
}

export default class Catalog extends React.Component<ICatalogProps, {
    filterString: string,
    checked: boolean,
    checked2: boolean,
    checked3: boolean,
    tempFilter: string,
    numberTest: string
}>{
    public constructor(props: ICatalogProps) {
        super(props);
        this.state = {
            filterString: "",
            checked: false,
            checked2: false,
            checked3: false,
            tempFilter: "",
            numberTest: ""
        }
    }

    @autobind
    private onChangeCheckbox(testNumber: any, event: any) {
        this.setState({tempFilter: this.state.filterString})
        this.setState({checked: event.target.checked})
        if ((this.state.filterString.indexOf(testNumber) > 0) && (event.target.checked === false)){
            this.state.filterString.replace(testNumber, '')
        }
        else {
            if ((this.state.filterString.indexOf(testNumber) === 0) && (event.target.checked === true)){
                this.setState({filterString: this.state.filterString + testNumber});
            }
            else {
                this.setState({filterString: this.state.filterString + "8"});
            }
        }
            // if (event.target.checked === false) {
            //     this.setState({filterString: this.state.filterString + "1"});
            // }
            // else {
            //     this.setState({filterString: this.state.filterString + "2"});
            // }
            // if (event.target.checked === true) {
            //     this.setState({filterString: this.state.filterString + "1"});
            // }
            // else {
            //     this.setState({filterString: this.state.filterString + "2"});
            // }
    }

    @autobind
    private onChangeCheckbox2(testNumber: any, event: any) {
        this.setState({tempFilter: this.state.filterString})
        this.setState({checked2: event.target.checked})
        if ((this.state.filterString.indexOf(testNumber) > 0) && (event.target.checked === false)) {
            this.state.filterString.replace(testNumber, '')
        } else {
            if ((this.state.filterString.indexOf(testNumber) === 0) && (event.target.checked === true)) {
                this.setState({filterString: this.state.filterString + testNumber});
            } else {
                this.setState({filterString: this.state.filterString + "8"});
            }
        }
    }

    @autobind
    private onChangeCheckbox3(testNumber: string, event: any) {
        this.setState({tempFilter: this.state.filterString})
        this.setState({checked3: event.target.checked})
        if ((this.state.filterString.indexOf(testNumber) > 0) && (event.target.checked === false)) {
            this.state.filterString.replace(testNumber, '')
        } else {
            if ((this.state.filterString.indexOf(testNumber) == 0) && (event.target.checked === true)) {
                this.setState({filterString: this.state.filterString + testNumber});
            } else {
                this.setState({filterString: this.state.filterString + "8"});
            }
        }
    }

    public render() {
        // const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.pageCatalog}>
                <div style={{background: "red"}}>
                    <Checkbox onChange={event => this.onChangeCheckbox(this.setState({numberTest: "1"}), event)} name={"test"} checked={this.state.checked} className="checkbox"/>
                    <Checkbox onChange={event2 => this.onChangeCheckbox2(this.setState({numberTest: "2"}), event2)} checked={this.state.checked2} name={"test2"} className="checkbox"/>
                    <Checkbox onChange={event3 => this.onChangeCheckbox3(this.setState({numberTest: "3"}), event3)} checked={this.state.checked3} name={"test3"} className="checkbox"/>
                    {console.log(this.state.filterString)}
                </div>
                <div style={{background: "blue"}}>

                </div>
            </div>
        );
    }
}