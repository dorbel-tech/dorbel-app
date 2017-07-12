import utils from '../../../providers/utils';
import moment from 'moment';
import _ from 'lodash';

const ROOM_IN_TLV_VALUE = 900000;
const ROOM_OUTSIDE_TLV_VALUE = 500000;
const TLV_CITY_ID = 1;
const ONE_MILLION = 1000000;
const CURRENCY_SIGN = '₪';

class LeaseStatsVM {
  constructor(listing, month, year) {
    this.listing = _.clone(listing); // Clone in order to not change by mistake

    this.leaseStart = moment(this.listing.lease_start);
    this.leaseEnd = moment(this.listing.lease_end);
    this.reportDate = this.getReportDate(month, year);
    this.monthList = this.getMonthList(this.leaseStart, this.leaseEnd);
    this.currentMonthIndex = this.getCurrentMonthIndex(this.reportDate, this.leaseStart);
    this.monthsToLeaseEnd = this.getMonthsToLeaseEnd(this.reportDate, this.leaseEnd);

    this.monthlyRent = this.listing.monthly_rent;
    this.monthlyRentFormatted = this.formatMoneyValue(this.monthlyRent);
    this.propertyValue = this.getPropertyValue(this.listing, true);
    this.propertyValueFormatted = this.formatMoneyValue(this.propertyValue);
    this.totalIncome = this.getTotalIncome(this.listing, this.monthList.length);
    this.totalIncomeFormatted = this.formatMoneyValue(this.totalIncome);
    this.rentPayed = this.getRentPayed(this.monthlyRent, this.currentMonthIndex);
    this.rentRemaining = this.getRentRemaining(this.monthlyRent, this.monthsToLeaseEnd);

    this.totalYield = this.getTotalYield(listing);
  }

  getReportDate(month, year) {
    // In moment JS december is represented as 0 and in case it is 0, the year will go year-1 
    let momentJsMonth = month;
    let momentJsYear = year;
    if (month == 12) {
      momentJsMonth = 0;
      momentJsYear = parseInt(year) + 1;
    }

    return moment({ year: momentJsYear, month: momentJsMonth });
  }

  getMonthList(leaseStart, leaseEnd) {
    const startClone = leaseStart.clone(); // cloning because it will be manipulated
    let monthList = [];
    while (leaseEnd.diff(startClone, 'month')) {
      monthList.push({
        month: startClone.month() + 1,
        year: startClone.year()
      });
      
      startClone.add(1, 'month');
    }

    return monthList;
  }

  getCurrentMonthIndex(reportDate, leaseStart) {
    return reportDate.diff(leaseStart, 'months');
  }

  getMonthsToLeaseEnd(reportDate, leaseEnd) {
    return leaseEnd.diff(reportDate, 'months');
  }

  getPropertyValue(listing) {
    let propertyValue;
    if (listing.property_value) {
      propertyValue = listing.property_value;
    }
    else {
      const roomValue = listing.apartment.building.city_id == TLV_CITY_ID ? ROOM_IN_TLV_VALUE : ROOM_OUTSIDE_TLV_VALUE;
      propertyValue = roomValue * listing.apartment.rooms;
    }

    return propertyValue;
  }

  getTotalIncome(listing, totalMonths) {
    const totalIncome = listing.monthly_rent * totalMonths;
    return totalIncome;
  }

  getRentPayed(monthlyRent, currentMonthIndex) {
    return this.formatMoneyValue((currentMonthIndex + 1) * monthlyRent);
  }

  getRentRemaining(monthlyRent, monthsToLeaseEnd) {
    return this.formatMoneyValue(monthlyRent * monthsToLeaseEnd);
  }

  getTotalYield(listing) {
    const propertyValue = this.getPropertyValue(listing);
    const totalIncome = this.getTotalIncome(listing, this.monthList.length);
    const percentage = utils.getPercentageOfTotal(propertyValue, totalIncome);
    return utils.decimalToPercision(percentage, 2) + '%';
  }

  formatMoneyValue(value) {
    if (value >= ONE_MILLION) {
      const formattedValue = utils.decimalToPercision((value / ONE_MILLION), 1);
      return `${formattedValue} מ'${CURRENCY_SIGN}`;
    }
    else { return `${CURRENCY_SIGN}${value.toLocaleString()}`; }
  }
}

export default LeaseStatsVM;
