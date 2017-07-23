import React from 'react';
import { shallow } from 'enzyme';

import MyDocuments from './MyDocuments';
import DocumentRow from '~/components/Documents/DocumentRow';

describe('MyDocuments', () => {
  let props;



  beforeEach(() => {
    const mockListing = { id: 7, apartment: { building: { city: {} } } };

    props = {
      appStore: {
        searchStore: {
          searchResults: jest.fn().mockReturnValue([ mockListing ])
        },
        documentStore: {
          getDocumentsByListing: jest.fn()
        }
      },
      appProviders: {
        utils: {
          sortListingImages: jest.fn().mockReturnValue([ { url: 'bla' } ]),
          isMobile: jest.fn()
        }
      }
    };
  });

  const myDocuments = () => shallow(<MyDocuments.wrappedComponent {...props} />);

  it('should render total empty state when there are no listing', () => {
    props.appStore.searchStore.searchResults.mockReturnValue([]);

    const wrapper = myDocuments();

    expect(wrapper.find('.my-properties-text').text()).toContain('אין לכם נכסים קיימים');
  });

  it('should render empty state when there is a listing without documents', () => {
    props.appStore.documentStore.getDocumentsByListing.mockReturnValue([]);

    const wrapper = myDocuments();

    expect(wrapper.find('ListGroup')).toHaveLength(1);
    expect(wrapper.find('.my-documents-listing-sub-header').find('.gray-mid-light-text').children().text()).toContain('אין מסמכים שמורים');
  });

  it('should render document when it is there', () => {
    const mockDoc = { id: 2393 };
    props.appStore.documentStore.getDocumentsByListing.mockReturnValue([ mockDoc ]);

    const wrapper = myDocuments();

    expect(wrapper.find(DocumentRow)).toHaveLength(1);
  });
});
