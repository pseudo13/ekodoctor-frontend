import { SickcaseEditable } from "./SickcaseEditable";
import { SickcaseReadonly } from "./SickcaseReadonly";
import React, { PureComponent } from "react";

export const SickcaseView = ({ sickcase, update }) => {
  return (
    <ViewToggle onSubmit={update}>
      {({ isEditable, toggle, submit }) => (
        <div className="column is-one-third123 sickcase-view">
          <div className="card">
            {isEditable ? (
              <SickcaseEditable
                sickcase={sickcase}
                submit={submit}
                toggle={toggle}
              />
            ) : (
              <SickcaseReadonly sickcase={sickcase} />
            )}
            <div className="has-text-right buttons-padding">
              <a className="button is-primary" onClick={toggle}>
                {isEditable ? "Close" : "Edit"}
              </a>
            </div>
          </div>
        </div>
      )}
    </ViewToggle>
  );
};

class ViewToggle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = this.initialState;
  }

  initialState = { isEditable: false };

  toggle = () => {
    this.setState((currentState) => {
      return { isEditable: !currentState.isEditable };
    });
  };

  submit = (formData, sickcase) => {
    this.props.onSubmit({ formData, sickcase }, () => this.toggle());
  };

  render() {
    return this.props.children({
      isEditable: this.state.isEditable,
      toggle: this.toggle,
      submit: this.submit,
    });
  }
}
