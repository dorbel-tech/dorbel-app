import React from 'react';
import { shallow } from 'enzyme';
import DocumentRow from './DocumentRow';

describe('Document Row', () => {
  let props;

  beforeEach(() => {
    props = {
      appProviders: {
        documentProvider: {
          getDownloadLink: jest.fn()
        },
        utils: {
          formatDate: jest.fn()
        }
      },
      document: {
        filename: 'bla.bla'
      }
    };
  });

  const documentRow = () => shallow(<DocumentRow.wrappedComponent {...props} />);
  const assertColWithText = (row, text) => expect(row.find('Col').findWhere(col => col.text() === text)).toHaveLength(1);


  it('should render file name without extenstion', () => {
    const filename = 'this is.the_file-name';
    props.document = { filename: filename + '.ext' };
    
    const row = documentRow();

    assertColWithText(row, filename);
  });

  it('should render extension in badge', () => {
    const extenstion = 'bazinga';
    props.document = { filename: 'what a file.' + extenstion };
    
    const row = documentRow();

    expect(row.find('Badge').children().text()).toBe(extenstion);
  });

  it('should render formatted date label', () => {
    const mockDateLabel = 'sadfljkasdflkajd';
    props.document.created_at = 'shoes';
    props.appProviders.utils.formatDate.mockReturnValue(mockDateLabel);

    const row = documentRow();

    expect(props.appProviders.utils.formatDate).toHaveBeenCalledWith(props.document.created_at);
    assertColWithText(row, mockDateLabel);
  });

  it('should render formatted size label for KB', () => {
    props.document.size = 987874;
    const row = documentRow();
    assertColWithText(row, '964.7KB');
  });

  it('should render formatted size label for MB', () => {
    props.document.size = 1987874;
    const row = documentRow();
    assertColWithText(row, '1.9MB');
  });

  it('should render menu item for downloading file', () => {
    const mockDownloadLink = 'httz://uuu.fazehook.con/document';
    props.appProviders.documentProvider.getDownloadLink.mockReturnValue(mockDownloadLink);
    
    const downloadMenuItem = documentRow().find('MenuItem').first();
    
    expect(downloadMenuItem.prop('download')).toBe(props.document.filename);
    expect(downloadMenuItem.prop('href')).toBe(mockDownloadLink);
    expect(props.appProviders.documentProvider.getDownloadLink).toHaveBeenCalledWith(props.document);
  });

  it('should render menu item for delete and call provider when clicked', () => {
    props.appProviders.documentProvider.deleteDocument = jest.fn();

    const deleteMenuItem = documentRow().find('MenuItem').at(1);
    deleteMenuItem.simulate('click');
    
    expect(deleteMenuItem).toHaveLength(1);
    expect(props.appProviders.documentProvider.deleteDocument).toHaveBeenCalledWith(props.document);
  });

});
