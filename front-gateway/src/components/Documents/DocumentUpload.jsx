import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Button } from 'react-bootstrap';
import './DocumentUpload.scss';

let ReactFilestack = 'div';

const FILESTACK_OPTIONS = { 
  fromSources: [ 'local_file_system','gmail','googledrive','dropbox','box' ], 
  disableTransformer: true, 
  maxFiles: 10 
};

if (process.env.IS_CLIENT) {
  ReactFilestack = require('filestack-react').default;
}

@inject('appProviders')
export default class DocumentUpload extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    appProviders: React.PropTypes.object,
    className: React.PropTypes.string,
    listing_id: React.PropTypes.number.isRequired
  }

  onDocumentUploaded(response) {
    response.filesUploaded.forEach(file => this.props.appProviders.documentProvider.saveDocument(this.props.listing_id, file));
  }

  renderButton({ onPick }) {
    return <Button onClick={onPick} className={this.props.className}>הוסף מסמך</Button>;
  }

  render() {
    if (!process.env.FILESTACK_API_KEY) {
      return null;
    }
    
    return (
      <ReactFilestack
        apikey={process.env.FILESTACK_API_KEY}
        onSuccess={this.onDocumentUploaded}
        render={this.renderButton}
        options={FILESTACK_OPTIONS}
      />
    );
  }
}
