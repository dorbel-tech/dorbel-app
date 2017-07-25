import React from 'react';
import { shallow } from 'enzyme';

import MyDocuments from './MyDocuments';
import DocumentRow from '~/components/Documents/DocumentRow';

describe('MyDocuments', () => {
  const props = {
    appProviders: {
      utils: {
        sortListingImages: jest.fn().mockReturnValue([ { url: 'bla' } ]),
        isMobile: jest.fn()
      }
    }
  };
  const mockListing = { id: 7, documents: [], apartment: { building: { city: {} } } };

  const myDocuments = () => shallow(<MyDocuments.wrappedComponent {...props} />);

  it('should render total empty state when there are no listing', () => {
    const wrapper = myDocuments();
    wrapper.setState({ listings: [] });

    expect(wrapper.find('.my-properties-text').text()).toContain('אין לכם נכסים קיימים');
  });

  it('should render empty state when there is a listing without documents', () => {
    const wrapper = myDocuments();
    wrapper.setState({ listings: [ mockListing ] });

    expect(wrapper.find('ListGroup')).toHaveLength(1);
    expect(wrapper.find('.my-documents-listing-sub-header').find('.gray-mid-light-text').children().text()).toContain('אין מסמכים שמורים');
  });

  it('should render document when it is there', () => {
    const wrapper = myDocuments();
    const mockDoc = { id: 2393 };
    mockListing.documents = [ mockDoc ];
    wrapper.setState({ listings: [ mockListing ] });

    expect(wrapper.find(DocumentRow)).toHaveLength(1);
  });
});
