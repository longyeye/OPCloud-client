import { Component, OnInit, ViewChild, ViewContainerRef,ComponentFactoryResolver,ComponentRef,Input } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { haloConfig } from '../../config/halo.config';
import { toolbarConfig } from '../../config/toolbar.config';
import { opmShapes } from '../../config/opm-shapes.config';
import { opmRuleSet } from '../../config/opm-validator';
import { MdDialog } from '@angular/material';
import { ChooseLinkDialogComponent } from '../../dialogs/choose-link-dialog/choose-link-dialog.component';
import { linkTypeSelection} from '../../link-operating/linkTypeSelection'
import { linkDrawing } from './linkDrawing'
import { addState } from '../../config/add-state';
import { CommandManagerService } from '../services/command-manager.service';
import * as common from "../../common/commonFunctions";

// popup imports
import {DialogComponent} from "../../dialogs/choose-link-dialog/Dialog.component";
import {DialogDirective} from "../../dialogs/choose-link-dialog/DialogDirective.directive";
import {OplDialogComponent} from "../../dialogs/opl-dialog/opl-dialog.component";

const joint = require('rappid');

const $ = require('jquery');
// window.jQuery = $;
const _ = require('lodash');

@Component({
  selector: 'opcloud-rappid-main',
  template: `
    <div class="rappid-main rappid" #rappidContainer>
      <!--<opcloud-rappid-toolbar></opcloud-rappid-toolbar>-->
      <opcloud-rappid-stencil [graph]="graph" [paper]="paper" [paperScroller]="paperScroller"></opcloud-rappid-stencil>
      <opcloud-rappid-paper [paper]="paper" [paperScroller]="paperScroller"></opcloud-rappid-paper>
      <opcloud-rappid-inspector [cell]="cell"></opcloud-rappid-inspector>
      <opcloud-rappid-navigator [paperScroller]="paperScroller"></opcloud-rappid-navigator>
    </div>

    <opcloud-rappid-opl [graph]="graph" [paper]="paper"></opcloud-rappid-opl>
  `,
  styleUrls: ['./rappid-main.component.css'],
  //add DialogComponent
  entryComponents: [DialogComponent]
})

export class RappidMainComponent implements OnInit {
  graph = null;
  paper;
  cell;
  commandManager;
  private snaplines;
  private paperScroller;
  private keyboard;
  private clipboard;
  private selection;
  private validator;
  private navigator;
  private toolbar;
  private RuleSet;


  @ViewChild('rappidContainer', { read: ViewContainerRef }) rappidContainer;

  constructor(private graphService:GraphService,
              commandManagerService: CommandManagerService,
              private _dialog: MdDialog,private viewContainer: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.graph = graphService.getGraph();
    this.commandManager = commandManagerService.commandManager;
  }

  ngOnInit() {
    joint.setTheme('modern');
    // this.initializeDatabase();
    this.initializePaper();
    this.initializeSelection();
    this.initializeHaloAndInspector();
    this.initializeValidator();
    this.initializeNavigator();
    this.initializeToolbar();
    this.initializeKeyboardShortcuts();
    this.initializeTooltips();
    this.handleAddLink();
    this.initializeWrapping();
 //   this.linkHoverEvent();
  }


  //Function getElementEssence(cell) receives a cell from graph and gets its essence ('Physica' or 'Informatical').
  getElementEssence(cell){
    if(cell.attributes.type==='opm.Object') var essence=cell.attributes.attrs.rect.filter.args;
    if(cell.attributes.type==='opm.Process') var essence=cell.attributes.attrs.ellipse.filter.args;
    if(essence.dx>0) return 'physical';
    if(essence.dx==0) return 'informatical';
  }

  //Function getElementAffiliation(cell) receives a cell and gets its affliation ('Environmental' or 'Informatical').
  getElementAffiliation(cell){

    if(cell.attributes.type==='opm.Object'){
      if(cell.attributes.attrs.rect["stroke-dasharray"]== '10,5') return 'environmental';
      else return 'systemic';
    }
    if(cell.attributes.type==='opm.Process'){
      if(cell.attributes.attrs.ellipse["stroke-dasharray"]== '10,5') return 'environmental';
      else return 'systemic';
    }

  }

  //update OPL for a link when link is added or changed
  updateLinkOPL(cell){
    var src=cell.getSourceElement();
    var tgt=cell.getTargetElement();
    // cell.attributes.opl=linkTypeSelection.generateOPL(src,tgt,cell.attributes.name);
  }
  //update OPL for an Object when object is added or changed
  updateObjectOPL(cell){
    var essence=this.getElementEssence(cell);
    var affiliation=this.getElementAffiliation(cell);
    var objectName=cell.attributes.attrs.text.text;

    // cell.attributes.opl=`<!--<b class="object">${objectName}</b> is <i>${affiliation}</i> and <i>${essence}</i><b>.</b>-->`;

  }
  //update OPL for a Process when process is added or changed
  updateProcessOPL(cell){
    var essence=this.getElementEssence(cell);
    var affiliation=this.getElementAffiliation(cell);
    var processName=cell.attributes.attrs.text.text;

    // cell.attributes.opl=`<b class="process">${processName}</b> is <i>${affiliation}</i> and <i>${essence}</i><b>.</b>`;

  }

  /*
   * popup Links Dialog
   * Input (DialogComponent , link)
   * set linkSource/Target data from link object
   * Return Dialog Component View
   *
   * */
  createDialog(dialogComponent: { new(): DialogComponent},link): ComponentRef<DialogComponent> {

    this.viewContainer.clear();

    let dialogComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(dialogComponent);


    let dialogComponentRef = this.viewContainer.createComponent(dialogComponentFactory);
    dialogComponentRef.instance.newLink = link;
    dialogComponentRef.instance.linkSource=link.getSourceElement() ;
    dialogComponentRef.instance.linkTarget=link.getTargetElement();
    dialogComponentRef.instance.opmLinks=linkTypeSelection.generateLinkWithOpl(link);

    dialogComponentRef.instance.close.subscribe(result => {
      dialogComponentRef.destroy();
      // link.attributes.opl=result.opl;
    });


    return dialogComponentRef;
  }

  //Opl popup when user hovers on a link
  createOplDialog(OplDialogComponent: { new(): OplDialogComponent},linkView): ComponentRef<OplDialogComponent> {

    this.viewContainer.clear();

    let OplDialogComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(OplDialogComponent);

    let OplDialogComponentRef = this.viewContainer.createComponent(OplDialogComponentFactory);
    OplDialogComponentRef.instance.link = linkView.model;
    return OplDialogComponentRef;
  }
/*
  linkHoverEvent(){
    var oplDialog;
    this.paper.on('cell:mouseover', (cellView,evt)=>{
      this.createOplDialog(OplDialogComponent, cellView);
      console.log("mouse on link");
      cellView.highlight();
    });
    this.paper.on('link:mouseleave', (cellView,evt)=>{
      oplDialog.close();
      console.log("mouse leave link");
    });
  }
*/
//Check Changes. This function has been modified to update opl for each cell once graph is changed
  handleAddLink() {
    this.graph.on('add', (cell) => {

      if (cell.attributes.type === 'opm.Link') {
        cell.attributes.name='';
        cell.on('change:target change:source', (link) => {
          if (link.attributes.source.id && link.attributes.target.id) {

            var relevantLinks = linkTypeSelection.generateLinkWithOpl(link);
            if (relevantLinks.length > 0){

              this.createDialog(DialogComponent,link);
            }
          }
        });
      }

      if (cell.attributes.type === 'opm.Object') {
        this.updateObjectOPL(cell);
      }

      if (cell.attributes.type === 'opm.Process') {
        this.updateProcessOPL(cell);
      }

      if (cell.attributes.type === 'opm.StateNorm'){

      }
    });

    this.graph.on('change', (cell) => {
      console.log(cell);

      if (cell.attributes.type === 'opm.Object') {
        this.updateObjectOPL(cell);
      }

      if (cell.attributes.type === 'opm.Process') {
        this.updateProcessOPL(cell)
      }

      if (cell.attributes.type != 'opm.Link'){
        var pt;
        var outboundLinks=this.graph.getConnectedLinks(cell,{ outbound: true });
        for ( pt in outboundLinks){
          this.updateLinkOPL(outboundLinks[pt]);
        }
        var inboundLinks=this.graph.getConnectedLinks(cell,{ inbound: true});
        for (pt in inboundLinks){
          this.updateLinkOPL(inboundLinks[pt]);
        }
      }

      if (cell.attributes.type === 'opm.Link' && cell.attributes.opl){
        this.updateLinkOPL(cell);
      }
    });
  }



  initializePaper() {

    this.graph.on('add', (cell, collection, opt) => {
      if (opt.stencil) {
        this.cell = cell;
      }
    });

    this.commandManager = new joint.dia.CommandManager({ graph: this.graph });

    var paper = this.paper = new joint.dia.Paper({
      linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
      width: 1000,
      height: 1000,
      gridSize: 10,
      drawGrid: true,
      model: this.graph,
      defaultLink: new opmShapes.Link,
    });


    paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
    paper.on('cell:mousewheel', this.onMousewheel, this);


    var paperScroller = this.paperScroller = new joint.ui.PaperScroller({
      paper: paper,
      autoResizePaper: true,
      cursor: 'grab'
    });

    /// $('.paper-container').append(paperScroller.el);
    paperScroller.render().center();


  }

  initializeKeyboardShortcuts() {

    this.keyboard = new joint.ui.Keyboard();
    this.keyboard.on({

      'ctrl+c': function () {
        // Copy all selected elements and their associated links.
        this.clipboard.copyElements(this.selection.collection, this.graph);
      },

      'ctrl+v': function () {

        var pastedCells = this.clipboard.pasteCells(this.graph, {
          translate: { dx: 20, dy: 20 },
          useLocalStorage: true
        });

        var elements = _.filter(pastedCells, function (cell) {
          return cell.isElement();
        });

        // Make sure pasted elements get selected immediately. This makes the UX better as
        // the user can immediately manipulate the pasted elements.
        this.selection.collection.reset(elements);
      },

      'ctrl+x shift+delete': function () {
        this.clipboard.cutElements(this.selection.collection, this.graph);
      },

      'delete backspace': function (evt) {
        evt.preventDefault();
        this.graph.removeCells(this.selection.collection.toArray());
      },

      'ctrl+z': function () {
        this.commandManager.undo();
        this.selection.cancelSelection();
      },

      'ctrl+y': function () {
        this.commandManager.redo();
        this.selection.cancelSelection();
      },

      'ctrl+a': function () {
        this.selection.collection.reset(this.graph.getElements());
      },

      'ctrl+plus': function (evt) {
        evt.preventDefault();
        this.paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
      },

      'ctrl+minus': function (evt) {
        evt.preventDefault();
        this.paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
      },

      'keydown:shift': function (evt) {
        this.paperScroller.setCursor('crosshair');
      },

      'keyup:shift': function () {
        this.paperScroller.setCursor('grab');
      }

    }, this);
  }

  initializeSelection() {

    this.clipboard = new joint.ui.Clipboard();
    this.selection = new joint.ui.Selection({ paper: this.paper });

    // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
    // Otherwise, initiate paper pan.
    this.paper.on('blank:pointerdown', function (evt, x, y) {

      if (this.keyboard.isActive('shift', evt)) {
        this.selection.startSelecting(evt);
      } else {
        this.selection.cancelSelection();
        this.paperScroller.startPanning(evt, x, y);
      }

    }, this);

    this.paper.on('element:pointerdown', function (elementView, evt) {

      // Select an element if CTRL/Meta key is pressed while the element is clicked.
      if (this.keyboard.isActive('ctrl meta', evt)) {
        this.selection.collection.add(elementView.model);
      }

    }, this);

    this.selection.on('selection-box:pointerdown', function (elementView, evt) {

      // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
      if (this.keyboard.isActive('ctrl meta', evt)) {
        this.selection.collection.remove(elementView.model);
      }

    }, this);
  }

 updateCell(cell, x, y, cornerX, cornerY){
   cell.set({
     position: { x: x, y: y },
     size: { width: cornerX - x, height: cornerY - y }
   });
 }

  wrapText(text, width, fontSize){
    var text = text.replace(/(\n\s*\n)|\n/g, "$1 ");  //remove line seperators
    var newText = joint.util.breakText(text, {width: (width-common.paddingObject*2)}, {'font-size': fontSize}); //break the text
    return newText;
  }

  updateDimensions(cell, textBox){
    var gapFromOriginalY = textBox.height + common.paddingObject * 2 - cell.get('originalSize').height;
    var gapFromOriginalX = textBox.width + common.paddingObject * 2 - cell.get('originalSize').width;
    if ((gapFromOriginalY > -1) || (gapFromOriginalX > -1)) {
      var newY = cell.get('originalPosition').y - gapFromOriginalY / 2;
      var newCornerY = newY + Math.max(cell.get('originalSize').height, (textBox.height + (common.paddingObject * 2)));
      var newX = cell.get('originalPosition').x - gapFromOriginalX / 2;
      var newCornerX = newX + Math.max(cell.get('originalSize').width, (textBox.width + (common.paddingObject * 2)));
     /* if(((newCornerY-newY)/(newCornerX-newX))>(5/9)){
        var widthNew = (newCornerY-newY)*9/5;
        newCornerX = newX + widthNew;
      }
      else if(((newCornerY-newY)/(newCornerX-newX))<(5/9)) {
        var heightNew = (newCornerX-newX)*5/9;
        newCornerY = newY + heightNew;
      }*/
      this.updateCell(cell, newX, newY, newCornerX, newCornerY);
      var newText = this.wrapText(cell.attributes.attrs.text.text, cell.get('size').width, cell.attributes.attrs.text['font-size']);
      cell.set('previousText', newText);
      //If needed wrapping
      if(newText != cell.attributes.attrs.text.text){ cell.attr({text: {text: newText}});  }
    }
  }

  initializeWrapping(){
    this.graph.on('change:attrs', _.bind(function (cell, attrs){
      console.log(cell.attributes.attrs);
      if (cell.previousAttributes().attrs.text && attrs.text) {
        if (cell.previousAttributes().attrs.text.text != attrs.text.text) { //test if label changed
          if (!cell.get('originalSize')) cell.set('originalSize', cell.get('size')); //store original/default size
          if (!cell.get('originalPosition')) cell.set('originalPosition', cell.get('position')); //store original/default size
          var view = this.paper.findViewByModel(cell),
            text = view.$("text"), //get shape element
            bboxText = text[0].getClientRects()[0]; //text box dimensions
          var currentText = cell.attributes.attrs.text.text;
          if (!cell.get('previousText') || (currentText != cell.get('previousText'))) {
            var newText = this.wrapText(currentText, cell.get('size').width, cell.attributes.attrs.text['font-size']);
            cell.set('previousText', newText);
            //If needed wrapping
            if (newText != currentText) { cell.attr({text: {text: newText}});}
            else {this.updateDimensions(cell, bboxText);}
          }
          else {this.updateDimensions(cell, bboxText);}
        }
      }
    }, this))

    this.graph.on('change:size', _.bind(function (cell, attrs){
      var currentText = cell.attributes.attrs.text.text;
      var newText = this.wrapText(currentText, cell.get('size').width, cell.attributes.attrs.text['font-size']);
      cell.set('previousText', newText);
      if(newText != currentText){ cell.attr({text: {text: newText}});  }
    }, this))

    this.graph.on('change:position', _.bind(function (cell, attrs){
      cell.set('originalPosition', cell.get('position'));
    }, this))
  }

  initializeHaloAndInspector() {
    this.paper.on('element:pointerup link:options', function (cellView) {

      var cell = cellView.model;

      if (!this.selection.collection.contains(cell)) {

        if (cell.isElement()) {

          new joint.ui.FreeTransform({
            cellView: cellView,
            allowRotation: false,
            preserveAspectRatio: !!cell.get('preserveAspectRatio'),
            allowOrthogonalResize: cell.get('allowOrthogonalResize') !== false
          }).render();

          const halo = new joint.ui.Halo({
            cellView: cellView,
            type: 'surrounding',
            handles: haloConfig.handles
          }).render();

          if (cell.attributes.type === 'opm.Object') {
            halo.addHandle({
              name: 'add_state', position: 's', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Click to add state to the object',
                  'data-tooltip-position': 'left',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:add_state:pointerdown', addState);
          }

          this.selection.collection.reset([]);
          this.selection.collection.add(cell, { silent: true });
        }

        this.cell = cell;
      }
    }, this);
  }

  initializeValidator() {

    this.validator = new joint.dia.Validator({commandManager: this.commandManager});
    this.RuleSet = opmRuleSet;
    this.RuleSet(this.validator, this.graph);
  }

  initializeNavigator() {

    var navigator = this.navigator = new joint.ui.Navigator({
      width: 240,
      height: 115,
      paperScroller: this.paperScroller,
      zoom: false
    });

    // $('.navigator-container').append(navigator.el);
    // navigator.render();
  }


  initializeToolbar() {

    var toolbar = this.toolbar = new joint.ui.Toolbar({
      groups: toolbarConfig.groups,
      tools: toolbarConfig.tools,
      references: {
        paperScroller: this.paperScroller,
        commandManager: this.commandManager
      }
    });

    toolbar.on({
      'svg:pointerclick': _.bind(this.openAsSVG, this),
      'png:pointerclick': _.bind(this.openAsPNG, this),
      'fullscreen:pointerclick': _.bind(joint.util.toggleFullScreen, joint.util, document.body),
      'to-front:pointerclick': _.bind(this.selection.collection.invoke, this.selection.collection, 'toFront'),
      'to-back:pointerclick': _.bind(this.selection.collection.invoke, this.selection.collection, 'toBack'),
      'layout:pointerclick': _.bind(this.layoutDirectedGraph, this),
      // 'snapline:change': _.bind(this.changeSnapLines, this),
      'clear:pointerclick': _.bind(this.graph.clear, this.graph),
      'print:pointerclick': _.bind(this.paper.print, this.paper),
      'grid-size:change': _.bind(this.paper.setGridSize, this.paper)
    });

    // $('.toolbar-container').append(toolbar.el);
    // toolbar.render();
  }


  changeSnapLines(checked) {

    /*if (checked) {
     this.snaplines.startListening();
     this.stencil.options.snaplines = this.snaplines;
     } else {
     this.snaplines.stopListening();
     this.stencil.options.snaplines = null;
     }*/
  }


  initializeTooltips() {

    new joint.ui.Tooltip({
      rootTarget: document.body,
      target: '[data-tooltip]',
      direction: 'auto',
      padding: 10
    });
  }

  openAsSVG() {

    this.paper.toSVG(function (svg) {
      new joint.ui.Lightbox({
        title: '(Right-click, and use "Save As" to save the diagram in SVG format)',
        image: 'data:image/svg+xml,' + encodeURIComponent(svg)
      }).open();
    }, { preserveDimensions: true, convertImagesToDataUris: true });
  }


  openAsPNG() {

    this.paper.toPNG(function (dataURL) {
      new joint.ui.Lightbox({
        title: '(Right-click, and use "Save As" to save the diagram in PNG format)',
        image: dataURL
      }).open();
    }, { padding: 10 });
  }


  onMousewheel(cellView, evt, x, y, delta) {

    if (this.keyboard.isActive('alt', evt)) {
      this.paperScroller.zoom(delta / 10, { min: 0.2, max: 5, ox: x, oy: y });
    }
  }


  layoutDirectedGraph() {

    joint.layout.DirectedGraph.layout(this.graph, {
      setLinkVertices: true,
      rankDir: 'TB',
      marginX: 100,
      marginY: 100
    });

    this.paperScroller.centerContent();
  }




}
