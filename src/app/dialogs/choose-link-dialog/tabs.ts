/**
 * Created by ta2er on 2017-06-12.
 */
import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Tab } from './tab';

@Component({
  selector: 'tabs',
  styles: [`

  `],
  template:`
 
<md-menu #appMenu="mdMenu" >
  <button  *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active" md-menu-item>{{tab.title}}</button>
</md-menu>
<button  style=" background: white ;float: right;margin-right: 2px" md-tab-nav-bar [mdMenuTriggerFor]="appMenu">
   <label>{{title}}</label>
</button>
<br>
<div ><ng-content></ng-content></div> 
  `
})
export class Tabs implements AfterContentInit {

  @ContentChildren(Tab) tabs: QueryList<Tab>;
  title:string;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);

    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);

    }
  }
  selectTab(tab:Tab){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
    this.title=tab.title;
  }

  check_display(){
    if (this.tabs.length===0){
      return 'none'
    }
  }



}

