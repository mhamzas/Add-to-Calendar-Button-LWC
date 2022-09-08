import { LightningElement,api,track } from 'lwc';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle } from 'lightning/platformResourceLoader';
export default class AddtoCal extends LightningElement {

    MS_IN_MINUTES = 60 * 1000;
    @api title = 'Get on the front page of HN';
    @api start = 'December 15, 2020 19:00';
    @api end = 'December 15, 2020 23:00';
    @api address = '';
    @api description = 'Get on the front page of HN, then prepare for world domination.';
    @api classname = 'slds-align_absolute-center';
    @track linkstyle='font-size: 1.5rem';

    @track googleurl;
    @track icalurl;
    @track yahoo;
    @track outlook;
    @track showbuttons = false;

    connectedCallback() {
        console.log(FontAwesome + '/fontawesome-free-5.13.0-web/css/all.css');
        Promise.all([loadStyle(this, FontAwesome + '/fontawesome-free-5.13.0-web/css/all.css')])
        .then(() => {
            console.log('done');
            this.init();
        })
        .catch(error => {
            console.log('error'+ JSON.stringify(error));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading D3',
                    message: error.message,
                    variant: 'error'
                })
            );
        });
        
    }

    init(){
        let startTime = new Date(this.start).toISOString().replace(/-|:|\.\d+/g, '');
            let endTime = new Date(this.end).toISOString().replace(/-|:|\.\d+/g, '');
            
            //Google Url
            this.googleurl= encodeURI([
                'https://www.google.com/calendar/render',
                '?action=TEMPLATE',
                '&text=' + (this.title || ''),
                '&dates=' + (startTime || ''),
                '/' + (endTime || ''),
                '&details=' + (this.description || ''),
                '&location=' + (this.address || ''),
                '&sprop=&sprop=name:'
            ].join(''));

            // Outlook or iCal
            this.icalurl = encodeURI(
                'data:text/calendar;charset=utf8,' + [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                'DTSTART:' + (startTime || ''),
                'DTEND:' + (endTime || ''),
                'SUMMARY:' + (this.title || ''),
                'DESCRIPTION:' + (this.description || ''),
                'LOCATION:' + (this.address || ''),
                'END:VEVENT',
                'END:VCALENDAR'].join('\n'));

            //Outlook
            this.outlook= encodeURI([
                'https://outlook.live.com/owa/?path=/calendar/action/compose&rru=addevent',
                '&subject=' + (this.title || ''),
                '&startdt=' + (startTime || ''),
                '&enddt=' + (endTime || ''),
                '&body=' + (this.description || ''),
                '&location=' + (this.address || ''),
                '&allday=false'
            ].join(''));
            
            // let startt = new Date(this.start);
            // let endt = new Date(this.end);
            // Yahoo
            // Yahoo dates are crazy, we need to convert the duration from minutes to hh:mm
            const eventDuration = (new Date(this.end).getTime() - new Date(this.start).getTime())/ this.MS_IN_MINUTES;
            const yahooHourDuration = eventDuration < 600 ? '0' + Math.floor((eventDuration / 60)) : Math.floor((eventDuration / 60)) + '';
            const yahooMinuteDuration = eventDuration % 60 < 10 ? '0' + eventDuration % 60 : eventDuration % 60 + '';
            const yahooEventDuration = yahooHourDuration + yahooMinuteDuration;

            // Remove timezone from event time
            const st = new Date(new Date(this.start) - (new Date(this.start).getTimezoneOffset() * this.MS_IN_MINUTES)).toISOString().replace(/-|:|\.\d+/g, '') || '';

            this.yahoo = encodeURI([
            'http://calendar.yahoo.com/?v=60&view=d&type=20',
            '&title=' + (this.title || ''),
            '&st=' + st,
            '&dur=' + (yahooEventDuration || ''),
            '&desc=' + (this.description || ''),
            '&in_loc=' + (this.address || '')
            ].join(''));

    }

    buttonhandler(event){
        if(this.showbuttons){
            this.showbuttons = false;
        } else {
            this.showbuttons = true;
        }
    }
}
