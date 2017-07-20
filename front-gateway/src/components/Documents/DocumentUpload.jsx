import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import './DocumentUpload.scss';

let ReactFilestack = 'div';

const FILESTACK_OPTIONS = {
  fromSources: [ 'local_file_system','gmail','googledrive','dropbox','box' ],
  disableTransformer: true,
  maxFiles: 10,
  storeTo: {
    location: 's3',
    region: 'eu-west-1',
    container: 'dorbel-user-documents'
  }
};

if (process.env.IS_CLIENT) {
  ReactFilestack = require('filestack-react').default;
}

@inject('appProviders', 'appStore')
export default class DocumentUpload extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.uploadOptions = this.getUploadOptions(props);
  }

  static propTypes = {
    appProviders: React.PropTypes.object,
    appStore: React.PropTypes.object,
    className: React.PropTypes.string,
    listing_id: React.PropTypes.number.isRequired,
    bsSize: React.PropTypes.string
  }

  getUploadOptions(props) {
    const env = process.env.NODE_ENV;
    const user_id = props.appStore.authStore.profile.dorbel_user_id;
    const listing_id = props.listing_id;
    const uploadOptions = _.cloneDeep(FILESTACK_OPTIONS);
    uploadOptions.storeTo.path = `${env}/${user_id}/${listing_id}/`;
    uploadOptions.onClose = () => props.appProviders.utils.hideIntercom(false);
    uploadOptions.onFileUploadFinished = () => {
      props.appProviders.notificationProvider.success('המסמכים נוספו בהצלחה');
      window.analytics.track('client_filestack_document_upload', { user_id, listing_id });
    };
    return uploadOptions;
  }

  onDocumentUploaded(response) {
    response.filesUploaded.forEach(file => this.props.appProviders.documentProvider.saveDocument(this.props.listing_id, file));
  }

  openUploadModal(onPick, event) {
    const { utils } = this.props.appProviders;
    if (utils.isMobile()) {
      utils.hideIntercom(true);
    }
    onPick(event);
  }

  renderButton({ onPick }) {
    return <Button onClick={event => this.openUploadModal(onPick, event)}
                   className={this.props.className}
                   bsSize={this.props.bsSize}
                   >הוסף מסמך</Button>;
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
        options={this.uploadOptions}
      />
    );
  }
}
