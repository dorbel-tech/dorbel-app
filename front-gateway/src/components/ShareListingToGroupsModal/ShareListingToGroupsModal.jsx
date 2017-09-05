import React from 'react';
import autobind from 'react-autobind';
import { Button } from 'react-bootstrap';
import Clipboard from 'clipboard';

const link = (href, name, members) => (
  <a href={'https://www.facebook.com/groups/' + href} target="_blank">
    {name}
    {members} חברים בקבוצה
  </a>
);

export default class AddTenantModal extends React.Component {
  static title = (
    <div>
      שתפו את המודעה לדיירים שמחפשים דירה ממש עכשיו!
    </div>
  );

  componentDidMount() {
    new Clipboard('#bar');
  }

  render() {

    return (
      <div>
        <span>הגיעו במהירות לעשות דיירים איכותיים</span><br/>
        <span>1 .העתיקו את הטקסט</span>
        <span>(ניתן לשנות אותו בהמשך)</span><br/>
        <textarea id="foo" value="זה הטקסט שתרצו לפרסם אחים שלי" />
        <Button id="bar" data-clipboard-target="#foo">
          Copy That
        </Button>
        <h6>2. שתפו אותו בקבוצות הבאות:</h6>
        { link('35819517694', 'דירות מפה לאוזן בת"א', '136,000') }
        { link('dirotTA', 'דירות שלמות ריקות בתל אביב *ללא תיווך', '57,000') }


      </div>
    );
  }
}
