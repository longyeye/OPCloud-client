import { Component, OnInit, ViewChild, ViewContainerRef,ComponentFactoryResolver,ComponentRef,Input } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { haloConfig } from '../../config/halo.config';
import { toolbarConfig } from '../../config/toolbar.config';
import { opmShapes } from '../../config/opm-shapes.config';
import { opmRuleSet } from '../../config/opm-validator';
import { MdDialog } from '@angular/material';
import { linkTypeSelection} from '../../link-operating/linkTypeSelection'
import { addState } from '../../config/add-state';
import { CommandManagerService } from '../services/command-manager.service';
import { textWrapping } from './textWrapping';
import { valueHandle } from './valueHandle';
import {arrangeStates} from '../../config/arrangeStates';
import * as common from "../../common/commonFunctions";

//treeview imports
import {TreeViewService} from '../../services/tree-view.service';
import { processInzooming } from '../../config/process-inzooming';

// popup imports
import {DialogComponent} from "../../dialogs/choose-link-dialog/Dialog.component";
import {OplDialogComponent} from "../../dialogs/opl-dialog/opl-dialog.component";
import {linkDrawing} from "../../link-operating/linkDrawing";

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
    <div id="block_container">
      <opcloud-opd-hierarchy id="opd-block"></opcloud-opd-hierarchy>
      <opcloud-rappid-opl id="opl-block"[graph]="graph" [paper]="paper"></opcloud-rappid-opl>
    </div>
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
              private componentFactoryResolver: ComponentFactoryResolver,private treeViewService:TreeViewService) {
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
    this.initializeTextEditing();
    this.initializeAttributesEvents();
    this.handleRemoveElement();
 //   this.linkHoverEvent();
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
    dialogComponentRef.instance.linkSource=link.getSourceElement();
    dialogComponentRef.instance.linkTarget=link.getTargetElement();
    dialogComponentRef.instance.opmLinks=linkTypeSelection.generateLinkWithOpl(link);
    for(let link of dialogComponentRef.instance.opmLinks){
      if(link.name =="Unidirectional_Relation"
        || link.name =="Bidirectional_Relation"){
        dialogComponentRef.instance.Relation_Links.push(link)
      }
      //Structrial Links
      else if(link.name =="Aggregation-Participation"
        || link.name =="Generalization-Specialization"
        || link.name =="Exhibition-Characterization"
        || link.name =="Classification-Instantiation"
       ) {

          dialogComponentRef.instance.Structural_Links.push(link);
        }
        //Agent Links
       else if(link.name =="Agent" || link.name =="Event_Agent" || link.name =="Condition_Agent")
        {
          dialogComponentRef.instance.Agent_Links.push(link);
        }
        //Instrument links
       else if(link.name == "Instrument" || link.name =="Condition_Instrument" || link.name == "Event_Instrument")
        {
          dialogComponentRef.instance.Instrument_Links.push(link);
        }
        //Effect links
       else if( link.name=="Condition_Effect" || link.name =="Event_Effect" || link.name == "Effect")
        {
          dialogComponentRef.instance.Effect_links.push(link);
          dialogComponentRef.instance.Effect_links.reverse()
        }
        //Consumption links
      else if(link.name == "Consumption" || link.name=="Condition_Consumption" || link.name =="Event_Consumption")
      {
        dialogComponentRef.instance.Consumption_links.push(link);
      }
      //Result
     else if(link.name == "Result")
      {
        dialogComponentRef.instance.Result_Link.push(link);
      }
      //Invocation
     else if(link.name=="Invocation")
      {
        dialogComponentRef.instance.Invocation_links.push(link);
      }
      //Exception Links
     else if(link.name == "Overtime_exception" || link.name=="Undertime_exception")
      {
        dialogComponentRef.instance.Exception_links.push(link);
      }
    }
    dialogComponentRef.instance.close.subscribe((result) => {
      dialogComponentRef.destroy();
      link.attributes.opl=result.opl;
    });

    return dialogComponentRef;
  }

  //Opl popup dialog when user hovers on a link
  createOplDialog(OplDialogComponent: { new(): OplDialogComponent},linkView): ComponentRef<OplDialogComponent> {

    this.viewContainer.clear();

    let OplDialogComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(OplDialogComponent);

    let OplDialogComponentRef = this.viewContainer.createComponent(OplDialogComponentFactory);
    OplDialogComponentRef.instance.link = linkView.model;
    return OplDialogComponentRef;
  }

  linkHoverEvent(){
    var oplDialog;
    this.paper.on('link:mouseover', (cellView,evt)=>{
      this.createOplDialog(OplDialogComponent, cellView);
      console.log("mouse over link");
      cellView.highlight();
    });
    this.paper.on('link:mouseleave', (cellView,evt)=>{
      oplDialog.close();
      console.log("mouse leave link");
    });
  }

  handleRemoveElement() {
    var _this = this;
    this.graph.on('remove', (cell) => {
      if (cell.attributes.type === 'opm.Process') {
        _this.treeViewService.removeNode(cell.id);
      }
      if (cell.attributes.type === 'app.TriangleAgg') {
        _.each(cell.attributes.linkId, function (linkToRemove) {
          if (_this.graph.getCell(linkToRemove))
            _this.graph.getCell(linkToRemove).remove();
        });
      }
      if(cell.attributes.type === 'devs.Link'){
          if(_this.graph.getCell(cell.get('target').id).attributes.type === 'app.TriangleAgg')
            _this.graph.getCell(cell.get('target').id).remove();
          if(_this.graph.getCell(cell.get('source').id).attributes.type === 'app.TriangleAgg'){
            var triangle = _this.graph.getCell(cell.get('source').id);
            var numberOfTargets = triangle.get('numberOfTargets');
            if(numberOfTargets>1){
              triangle.set('numberOfTargets', (numberOfTargets-1));
            }
            else
              triangle.remove();
          }
      }
      if (cell.attributes.type === 'opm.StateNorm') {
        let fatherObject = _this.graph.getCell(cell.get('father'));
        let cellView = _this.paper.findViewByModel(fatherObject);
        if (fatherObject.get('embeds').length == 0) {
          fatherObject.attributes.attrs.text["ref-x"] = '0.5';
          fatherObject.attributes.attrs.text["ref-y"] = '0.5';
          cellView.render();
        }
      }
    });
  }

//Check Changes. This function has been modified to update opl for each cell once graph is changed
  handleAddLink() {
    this.graph.on('add', (cell) => {
      if (cell.attributes.type === 'opm.Link') {
        this.paper.on('cell:pointerup ', function (cellView) {
          var cell = cellView.model;
          //If it is a new link and is not connected to any element - deleting it. Otherwise it will be reconnected to
          //the previous element
          if (cell.isLink() && !cell.attributes.target.id && !cell.get('previousTargetId')) {
              cell.remove();
          }
        });
        cell.on('change:target change:source', (link) => {
          if (link.attributes.source.id && link.attributes.target.id) {
            if (link.attributes.source.id != link.attributes.target.id) {
              if(!link.get('previousTargetId') || (link.get('previousTargetId')!=link.attributes.target.id)) {
                var relevantLinks = linkTypeSelection.generateLinkWithOpl(link);
                if (relevantLinks.length > 0) {
                  link.set('previousTargetId', link.attributes.target.id);
                  link.set('graph', this.graph);
                  this.createDialog(DialogComponent, link);
                }
              }
            }
          }
        });
      }
    })
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
    // When the dragged cell is dropped over another cell, let it become a child of the
    // element below.
    paper.on('cell:pointerup', function(cellView, evt, x, y) {
        var cell = cellView.model;
      if(cell.attributes.type == 'opm.Process'){
        var cellViewsBelow = paper.findViewsFromPoint(cell.getBBox().center());
        if (cellViewsBelow.length) {
          // Note that the findViewsFromPoint() returns the view for the `cell` itself.
          var cellViewBelow = _.find(cellViewsBelow, function (c) {
            return c.model.id !== cell.id
          });

          // Prevent recursive embedding.
          if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
            cellViewBelow.model.embed(cell);
            cell.toFront();
            common.CommonFunctions.updateObjectSize(cellViewBelow.model);
          }
        }
      }
    });

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

  initializeTextEditing () {
    var lastEnteredText;
    var currentCellView;
    this.paper.on('cell:pointerdblclick', function (cellView, evt) {
      lastEnteredText =  cellView.model.attributes.attrs.text.text;
      currentCellView = cellView.model;
      joint.ui.TextEditor.edit(evt.target, {
        cellView: cellView,
        textProperty: cellView.model.isLink() ? 'labels/attrs/text/text' : 'attrs/text/text'
      });
    }, this)
    this.graph.on('change:attrs', function (cell) {
      if(cell.attributes.type != 'opm.Link'){
        var view = this.paper.findViewByModel(cell),
          text = view.$("text"),                     // Get shape element
          bboxText = text[0].getClientRects()[0];    // Text box dimensions
        // Give the element padding on the right/bottom while keeping shape's ratio being 5/9 for process\object and 1/2 for state.
        var aspectRatio = (cell.attributes.type == 'opm.StateNorm') ? (1 / 2) : ((cell.attributes.type == 'opm.Object') ? (1 / 3) : (5 / 9));
        var padding = (cell.attributes.type == 'opm.StateNorm') ? 10 : ((cell.attributes.type == 'opm.Object') ? 15 : 35);
        var minWidth = (cell.attributes.type == 'opm.StateNorm') ? 50 : 90;
        var minHeight = (cell.attributes.type == 'opm.StateNorm') ? 25 : 50;
        var textString = cell.attributes.attrs.text.text;
        let newShapeWidth = bboxText ? (
              (cell.attributes.attrs.text['ref-x'] == '0.5') ? (bboxText.width + padding) :
                (bboxText.width / (0.2 + Math.abs(0.5 - cell.attributes.attrs.text['ref-x'])) + padding)) : 0,
          newShapeHeight = bboxText ? (
              (cell.attributes.attrs.text['ref-y'] == '0.5') ? (bboxText.height + padding) :
                (bboxText.height / (0.25 + Math.abs(0.5 - cell.attributes.attrs.text['ref-y'])) + padding)) : 0,
          currentWidth = cell.get('size').width,
          currentHeight = cell.get('size').height,
          manuallyResized = cell.attributes.attrs.manuallyResized;
        // Units have to be bellow the object's name
        if (newShapeWidth >= currentWidth) {
          var lastWhiteSpace = textString.lastIndexOf(' ');
          if (lastWhiteSpace > -1)
            textString = textString.slice(0, lastWhiteSpace) + '\n' + textString.slice(lastWhiteSpace + 1);
        }
        if (textString.includes('[') && !textString.includes('\n[')) {
          textString = textString.replace('[', '\n[');
          if (textString.includes('[\n')) {
            textString = textString.replace('[\n', '[');
          }
        }
        if(textString == ''){
          textString = '\t';
        }
        if(textString != cell.attributes.attrs.text.text){
          newShapeWidth = textWrapping.getParagraphWidth(textString, cell)+padding;
          cell.attr({text: {text: textString}});
        }
        // Shape being resized to text size if not being manually resized or if being renamed after manually resize
        if ( !((newShapeWidth < currentWidth) && (newShapeHeight < currentHeight) && manuallyResized) ) {
          var division = newShapeHeight/newShapeWidth;
          var editionToWidth = 0, editionToHeight = 0;
          // Calculating the edition needed for the denominator to keep the ratio.
          if (division > aspectRatio) { editionToWidth = (1 / aspectRatio) * newShapeHeight - newShapeWidth; }
          // Calculating the edition needed for the numerator to keep the ratio.
          else if (division < aspectRatio) { editionToHeight = aspectRatio * newShapeWidth - newShapeHeight; }
          // Flag signals the wrapper that auto-resizing is being performed

          var newWidthForUpdate = Math.max(newShapeWidth + editionToWidth, minWidth);
          var newHeightForUpdate = Math.max(newShapeHeight + editionToHeight ,minHeight);
          cell.attributes.attrs.wrappingResized = true;
          cell.resize(newWidthForUpdate, newHeightForUpdate);
          cell.attributes.attrs.wrappingResized = false;
          cell.attributes.attrs.manuallyResized = false;
        }
      }
    }, this)

    this.paper.on('blank:pointerdown', function(cellView, evt) {
      if(currentCellView && !currentCellView.isLink()){
        var currentText = currentCellView.attributes.attrs.text.text;
        if (currentText == '\t') {
          currentCellView.attr({text: {text: lastEnteredText}});
        }
        joint.ui.TextEditor.close();
      }
      }, this)

    this.graph.on('change:size', _.bind(function (cell, attrs){
      if (cell.attributes.attrs.text && !cell.attributes.attrs.wrappingResized) { //resized manually
        textWrapping.wrapTextAfterSizeChange(cell);
      }
    }, this))
  }

  initializeAttributesEvents(){
    this.graph.on('change:attrs', _.bind(function (cell, attrs){
      //If value of an object was changed - add/modify a state according to it
      if (cell.isElement() && attrs.value){
        // console.log('if - value');
        valueHandle.updateCell(this.graph, cell);
      }
    }, this))

    this.graph.on('change:position', _.bind(function(cell){
      if (cell.attributes.type === 'opm.Link') {
        linkDrawing.linkUpdating(cell);
      }
    }, this));
  }

  initializeHaloAndInspector() {
     var _this = this;
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
            let hasStates = cell.getEmbeddedCells().length;
            halo.addHandle({
              name: 'add_state', position: 'sw', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Click to add state to the object',
                  'data-tooltip-position': 'right',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:add_state:pointerup', function () {
              hasStates = true;
              halo.$handles.children('.arrange_up').toggleClass('hidden', !hasStates);
              halo.$handles.children('.arrange_down').toggleClass('hidden', !hasStates);
              halo.$handles.children('.arrange_left').toggleClass('hidden', !hasStates);
              halo.$handles.children('.arrange_right').toggleClass('hidden', !hasStates);
              addState.call(this);
            });
            let side = 'top';
            halo.addHandle({
              name: 'arrange_up', position: 'n', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states at the top inside the object',
                  'data-tooltip-position': 'bottom',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_up:pointerup', function () {
              side = 'top';
              arrangeStates.call(this, side);
            });
            halo.addHandle({
              name: 'arrange_down', position: 's', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states at the bottom inside the object',
                  'data-tooltip-position': 'top',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_down:pointerup', function () {
              side = 'bottom';
              arrangeStates.call(this, side);
            });
            halo.addHandle({
              name: 'arrange_right', position: 'w', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states to the right inside the object',
                  'data-tooltip-position': 'right',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_right:pointerup', function () {
              side = 'right';
              arrangeStates.call(this, side);
            });
            halo.addHandle({
              name: 'arrange_left', position: 'e', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states to the left inside the object',
                  'data-tooltip-position': 'left',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_left:pointerup', function () {
              side = 'left';
              arrangeStates.call(this, side);
            });
            halo.$handles.children('.arrange_up').toggleClass('hidden', !hasStates);
            halo.$handles.children('.arrange_down').toggleClass('hidden', !hasStates);
            halo.$handles.children('.arrange_left').toggleClass('hidden', !hasStates);
            halo.$handles.children('.arrange_right').toggleClass('hidden', !hasStates);
          }
           if (cell.attributes.type === 'opm.Process') {
            halo.addHandle({
              name: 'add_state', position: 'sw', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Click to In-zoom the process',
                  'data-tooltip-position': 'left',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:add_state:pointerdown', function(evt,x,y){
              let cellModel=this.options.cellView.model;
              let CellClone=cell.clone();
              var textString = cell.attributes.attrs.text.text;
              CellClone.set('id',cellModel.id);
              CellClone.attr({text: {text: textString}});
              _this.treeViewService.insertNode(cellModel);
              let elementlinks=_this.graphService.graphLinks;
               processInzooming(evt, x, y,this,CellClone,elementlinks);
            });
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
