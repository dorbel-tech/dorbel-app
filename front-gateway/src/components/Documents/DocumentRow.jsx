import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Col, Row, ListGroup, ListGroupItem, Checkbox, Dropdown, MenuItem, Badge } from 'react-bootstrap';

import './DocumentRow.scss';

@inject('appProviders')
export default class DocumentRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    document: React.PropTypes.object,
    appProviders: React.PropTypes.object
  }

  static getEmptyDocumentList() {
    return (
      <ListGroup>
        <ListGroupItem>
          <Row>
            <Col sm={1}>
              <Checkbox checked={false} disabled />
            </Col>
            <Col sm={5}>
              מסמך שהועלה
            </Col>
            <Col sm={3}>
              תאריך
            </Col>
            <Col sm={3}>
              גודל קובץ
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    );
  }

  getSizeLabel(bytes) {
    // borrowed from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    if (bytes < 1024) { return bytes + 'B'; }
    else if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + 'KB'; }
    else if (bytes < 1073741824) { return (bytes / 1048576).toFixed(1) + 'MB'; }
    else { return (bytes / 1073741824).toFixed(1) +' GB'; }
  }

  deleteDocument() {
    this.props.appProviders.documentProvider.deleteDocument(this.props.document);
  }

  getNameAndExtenstion(fullFilename) {
    const split = fullFilename.split('.');
    return {
      ext: split.pop(),
      name: split.join('.')
    };
  }

  render() {
    const doc = this.props.document;
    const downloadLink = this.props.appProviders.documentProvider.getDownloadLink(doc);
    const dateLabel = this.props.appProviders.utils.formatDate(doc.created_at);
    const sizeLabel = this.getSizeLabel(doc.size);
    const filename = this.getNameAndExtenstion(doc.filename);

    return (
      <Row className="document-row">
        <Col sm={1} className="text-center"><Checkbox checked={false} disabled /></Col>
        <Col sm={5}>{filename.name}</Col>
        <Col sm={1}><Badge>{filename.ext}</Badge></Col>
        <Col sm={2}>{dateLabel}</Col>
        <Col sm={2}>{sizeLabel}</Col>
        <Col sm={1}>
            <Dropdown id={'document' + doc.id} className="pull-left">
              <Dropdown.Toggle noCaret bsStyle="link"><i className="fa fa-ellipsis-v" /></Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-left">                                
                <MenuItem href={downloadLink} download={doc.filename}>הורד מסמך</MenuItem>
                <MenuItem onClick={this.deleteDocument}>מחק מסמך</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
      </Row>
    );
  }
}
