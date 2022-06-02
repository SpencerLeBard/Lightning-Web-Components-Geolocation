import {LightningElement, track, api} from 'lwc';
import setLocation from "@salesforce/apex/GeolocationController.setLocation";
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class Geolocation extends LightningElement {

  @track location = {};
  @track loading = false;
  @track showButton = false;

  //api parameters
  @api strTitle = 'Choose Current Location';
  @api objectApiName;
  @api latFieldApiName;
  @api longFieldApiName;
  @api recordId;

  /**
   * Method to run geolocation tag & gather current position
   */
  getLocation() {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.latitude = position.coords.latitude;
        this.location.longitude = position.coords.longitude;
        this.loading = false;
        if (this.objectApiName && this.latFieldApiName && this.longFieldApiName && this.recordId) {
          this.showButton = true;
        }
      });
    } else {
      this.loading = false;
      const evt = new ShowToastEvent({
        title: 'Geolocation is not supported by browser',
        message: 'Check your browser options or use another browser',
        variant: 'error',
      });
      this.dispatchEvent(evt);
    }
  }

  /**
   * Method to save location to fields of object
   */
  setLocation() {
    this.loading = true;
    let location = {};
    location[this.latFieldApiName] = this.location.latitude;
    location[this.longFieldApiName] = this.location.longitude;
    setLocation({
      objectApiName: this.objectApiName,
      location: location,
      recordId: this.recordId
    }).then(() => {
      const evt = new ShowToastEvent({
        title: 'Geolocation set successfully',
        message: 'Reload page to reflect the changes',
        variant: 'success',
      });
      this.dispatchEvent(evt);
      this.loading = false;
    });
  }

  mapMarkers = [
    {
        location: {
            Street: '1 Market St',
            City: 'San Francisco',
            Country: 'USA',
        },
        title: 'The Landmark Building',
        description:
            'Historic <b>11-story</b> building completed in <i>1916</i>',
    },
];
}