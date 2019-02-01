import React, { Component } from 'react'

const isEmpty = (prop) => (
    prop === null ||
    prop === undefined ||
    (prop.constructor === Object && Object.keys(prop).length === 0)
);

const ErrorHOC = (errorMsg) => (WrappedComponent) => {
    return class ErrorHOC extends Component {
        render() {
            if (!isEmpty(this.props[errorMsg])) {
                return (<div className='status-error'>{this.props[errorMsg].message}</div>);
              }
            return <WrappedComponent { ...this.props } {...this.state} />
        }
    }
}

export default ErrorHOC


