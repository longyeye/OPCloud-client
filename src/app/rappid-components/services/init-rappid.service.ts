import { Injectable } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { haloConfig } from '../../config/halo.config';
import { toolbarConfig } from '../../config/toolbar.config';
import { opmShapes } from '../../config/opm-shapes.config';
import { opmRuleSet } from '../../config/opm-validator';
import { linkTypeSelection } from '../../link-operating/linkTypeSelection';
import { addState } from '../../config/add-state';
import { CommandManagerService } from '../services/command-manager.service';
import { textWrapping } from '../rappid-main/textWrapping';
import { valueHandle } from '../rappid-main/valueHandle';
import { arrangeStates } from '../../config/arrangeStates';
import * as common from '../../common/commonFunctions';
//treeview imports
import { TreeViewService } from '../../services/tree-view.service';
import { processInzooming } from '../../config/process-inzooming';
// popup imports
import { linkDrawing } from '../../link-operating/linkDrawing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const joint = require('rappid');

// TODO: import specific lodash methods
const _ = require('lodash');

@Injectable()
export class InitRappidService {
  cell$ = new BehaviorSubject(null);
  dialog$ = new BehaviorSubject(null);
  graph = null;
  paper;
  commandManager;
  paperScroller;
  private keyboard;
  private clipboard;
  private selection;
  private validator;
  private navigator;
  private toolbar;
  private RuleSet;


  constructor(
    private graphService: GraphService,
    commandManagerService: CommandManagerService,
    private treeViewService: TreeViewService) {
    this.graph = graphService.getGraph();
    this.commandManager = commandManagerService.commandManager;

    joint.setTheme('modern');
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
    // This doesn't work (the event is not caught)
    this.linkHoverEvent();
  }

  createDialog(link) {
    const dialogComponentRef = {
      type: 'choose-link',
      instance: {
        newLink: link,
        linkSource: link.getSourceElement(),
        linkTarget: link.getTargetElement(),
        opmLinks: linkTypeSelection.generateLinkWithOpl(link),
        Structural_Links: [],
        Agent_Links: [],
        Instrument_Links: [],
        Effect_links: [],
        Consumption_links: [],
        Result_Link: [],
        Invocation_links: [],
        Exception_links: [],
      }
    };

    for (const link of dialogComponentRef.instance.opmLinks) {
      //Structrial Links
      if (link.name == 'Aggregation-Participation'
        || link.name == 'Generalization-Specialization'
        || link.name == 'Exhibition-Characterization'
        || link.name == 'Classification-Instantiation'
        || link.name == 'Unidirectional_Relation'
        || link.name == 'Bidirectional_Relation') {

        dialogComponentRef.instance.Structural_Links.push(link);
      }
      //Agent Links
      else if (link.name == 'Agent' || link.name == 'Event_Agent' || link.name == 'Condition_Agent') {
        dialogComponentRef.instance.Agent_Links.push(link);
      }
      //Instrument links
      else if (link.name == 'Instrument' || link.name == 'Condition_Instrument' || link.name == 'Event_Instrument') {
        dialogComponentRef.instance.Instrument_Links.push(link);
      }
      //Effect links
      else if (link.name == 'Condition_Effect' || link.name == 'Event_Effect' || link.name == 'Effect') {
        dialogComponentRef.instance.Effect_links.push(link);
        dialogComponentRef.instance.Effect_links.reverse();
      }
      //Consumption links
      else if (link.name == 'Consumption' || link.name == 'Condition_Consumption' || link.name == 'Event_Consumption') {
        dialogComponentRef.instance.Consumption_links.push(link);
      }
      //Result
      else if (link.name == 'Result') {
        dialogComponentRef.instance.Result_Link.push(link);
      }
      //Invocation
      else if (link.name == 'Invocation') {
        dialogComponentRef.instance.Invocation_links.push(link);
      }
      //Exception Links
      else if (link.name == 'Overtime_exception' || link.name == 'Undertime_exception') {
        dialogComponentRef.instance.Exception_links.push(link);
      }
    }

    this.dialog$.next(dialogComponentRef);
    return dialogComponentRef;
  }

  //Opl popup dialog when user hovers on a link
  createOplDialog(linkView) {
    const oplDialogComponentRef = {
      type: 'opl',
      instance: {
        link: linkView.model
      }
    };
    this.dialog$.next(oplDialogComponentRef);
  }

  linkHoverEvent() {
    let oplDialog;
    this.paper.on('link:mouseover', (cellView, evt) => {
      this.createOplDialog(cellView);
      console.log('mouse over link');
      cellView.highlight();
    });
    this.paper.on('link:mouseleave', (cellView, evt) => {
      oplDialog.close();
      this.dialog$.next('close-opl');
      console.log('mouse leave link');
    });
  }

  handleRemoveElement() {
    const _this = this;
    this.graph.on('remove', (cell) => {
      if (cell.attributes.type === 'opm.Process') {
        _this.treeViewService.removeNode(cell.id);
      }
      if (cell.attributes.type === 'opm.TriangleAgg') {
        _.each(cell.attributes.linkId, function (linkToRemove) {
          if (_this.graph.getCell(linkToRemove))
            _this.graph.getCell(linkToRemove).remove();
        });
      }
      if (cell.attributes.type === 'opm.StructLink') {
        if (_this.graph.getCell(cell.get('target').id).attributes.type === 'opm.TriangleAgg')
          _this.graph.getCell(cell.get('target').id).remove();
        if (_this.graph.getCell(cell.get('source').id).attributes.type === 'opm.TriangleAgg') {
          const triangle = _this.graph.getCell(cell.get('source').id);
          const numberOfTargets = triangle.get('numberOfTargets');
          if (numberOfTargets > 1) {
            triangle.set('numberOfTargets', (numberOfTargets - 1));
          }
          else
            triangle.remove();
        }
      }
      if (cell.attributes.type === 'opm.State') {
        const fatherObject = _this.graph.getCell(cell.get('father'));
        if (fatherObject.get('embeds').length == 0) {
          common.CommonFunctions.arrangeStatesParams(fatherObject, 0.5, 0.5, 'middle', 'middle', 'bottom', 0, 0);
          textWrapping.updateTextAndSize(fatherObject);
        }
      }
    });
  }

  //Check Changes. This function has been modified to update opl for each cell once graph is changed
  handleAddLink() {
    let _thisObj=this;
    this.graph.on('add', (cell) => {
      if (cell.attributes.type === 'opm.Link') {
        this.paper.on('cell:pointerup ', function (cellView) {
          const cell = cellView.model;
          //If it is a new link and is not connected to any element - deleting it. Otherwise it will be reconnected to
          //the previous element
          if (cell.isLink() && !cell.attributes.target.id && !cell.get('previousTargetId')) {
            cell.remove();
          }
        });
        cell.on('change:target change:source', (link,a, b) => {
          if (link.attributes.source.id && link.attributes.target.id) {
            if (link.attributes.source.id != link.attributes.target.id) {
              if (!link.get('previousTargetId') || (link.get('previousTargetId') != link.attributes.target.id)) {
                const relevantLinks = linkTypeSelection.generateLinkWithOpl(link);
                if (relevantLinks.length > 0) {
                  link.set('previousTargetId', link.attributes.target.id);
                  link.set('graph', this.graph);
                  if (!b.cameFromInZooming)
                  this.createDialog(link);
                }
              }
            }
          }
        });
      }
    });
  }


  initializePaper() {
    this.graph.on('add', (cell, collection, opt) => {
      if (opt.stencil) {
        this.cell$.next(cell);
      }
    });
    const paper = this.paper = new joint.dia.Paper({
      linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
      width: 1000,
      height: 1000,
      gridSize: 5,
      drawGrid: true,
      model: this.graph,
      defaultLink: new opmShapes.Link,
      multiLinks: false,
      selectionCollection: null
    });


    paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
    paper.on('cell:mousewheel', this.onMousewheel, this);
    // When the dragged cell is dropped over another cell, let it become a child of the
    // element below.
    paper.on('cell:pointerup', function (cellView, evt, x, y) {
      const cell = cellView.model;
      if (cell.attributes.type == 'opm.Process') {
        const cellViewsBelow = paper.findViewsFromPoint(cell.getBBox().center());
        if (cellViewsBelow.length) {
          // Note that the findViewsFromPoint() returns the view for the `cell` itself.
          const cellViewBelow = _.find(cellViewsBelow, function (c) {
            return c.model.id !== cell.id;
          });
          // Prevent recursive embedding.
          if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
            cellViewBelow.model.embed(cell);
            /* Ahmad commented this line because it blocks the pointerdblclick event
               for the subprocesses of in-zoomed process. It was replaced by
               another line that roughly does the same functionality as toFront.
            */
            // cell.toFront();
            cell.set('z', cellViewBelow.model.attributes.z  + 1);
            common.CommonFunctions.updateObjectSize(cellViewBelow.model);
          }
        }
      }
    });

    const paperScroller = this.paperScroller = new joint.ui.PaperScroller({
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

        const pastedCells = this.clipboard.pasteCells(this.graph, {
          translate: { dx: 20, dy: 20 },
          useLocalStorage: true
        });

        const elements = _.filter(pastedCells, function (cell) {
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
    this.selection = new joint.ui.Selection({paper: this.paper});

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
        this.paper.selectionCollection = this.selection.collection;
      }

    }, this);

    this.selection.on('selection-box:pointerdown', function (elementView, evt) {
      // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
      if (this.keyboard.isActive('ctrl meta', evt)) {
        this.selection.collection.remove(elementView.model);
        this.paper.selectionCollection = this.selection.collection;
      }
    }, this);

    this.selection.removeHandle('rotate');
    this.selection.addHandle({ name: 'link', position: 'n', icon: '../../assets/OPM_Links/StructuralAgg.png' });
 //   this.selection.on('action:link:pointerdown', function(evt) {
 //     evt.stopPropagation()
 //     alert('My custom action.');
 //   });
  }

  initializeTextEditing() {
    let lastEnteredText;
    let currentCellView;
    this.paper.on('cell:pointerdblclick', function (cellView, evt) {
      lastEnteredText = cellView.model.attributes.attrs.text.text;
      currentCellView = cellView.model;
      joint.ui.TextEditor.edit(evt.target, {
        cellView: cellView,
        textProperty: cellView.model.isLink() ? 'labels/attrs/text/text' : 'attrs/text/text',
        placeholder: true
      });
    }, this);
    this.graph.on('change:attrs', function (cell) {
      if ((cell.get('type') != 'opm.Link') && (cell.attr('text/text') != lastEnteredText) &&
        !cell.attributes.attrs.wrappingResized) {  //if the text was changed
        const textString = cell.attr('text/text');
        let newParams = { width: cell.get('minSize').width, height: cell.get('minSize').height, text: '' };    //No
                                                                                                                 // empty
                                                                                                                 // name
                                                                                                                 // is
                                                                                                                 // allowed
        if (textString.trim() != '') { //if there is areal text - not spaces
          newParams = textWrapping.calculateNewTextSize(textString, cell);
        }
        cell.attributes.attrs.wrappingResized = true;
        cell.attr({ text: { text: newParams.text } });
        if (!((newParams.width <= cell.get('size').width) && (newParams.height <= cell.get('size').height) && cell.attributes.attrs.manuallyResized)) {
          cell.resize(newParams.width, newParams.height);
          cell.attributes.attrs.manuallyResized = false;
        }
        cell.attributes.attrs.wrappingResized = false;
      }
    }, this);

    this.paper.on('blank:pointerdown', function (cellView, evt) {
      if (currentCellView && !currentCellView.isLink()) {
        const currentText = currentCellView.attributes.attrs.text.text;
        if (currentText == '') {
          currentCellView.attr({ text: { text: lastEnteredText } });
        }
        joint.ui.TextEditor.close();
      }
    }, this);

    this.graph.on('change:size', _.bind(function (cell, attrs) {
      if (cell.attributes.attrs.text && !cell.attributes.attrs.wrappingResized) { //resized manually
        textWrapping.wrapTextAfterSizeChange(cell);
      }
    }, this));
  }

  initializeAttributesEvents() {
    const _this = this;
    this.paper.on('cell:pointerup blank:pointerclick ', function (cellView) {
      _this.graphService.updateJSON();
    });
    this.paper.on('cell:pointerdown', function (cellView) {
      const cell = cellView.model;
      cell.on('cell:pointerup', function (cellView) {
        _this.graphService.updateJSON();
      });
    });
    this.graph.on('change:attrs', _.bind(function (cell, attrs) {
      // If value of an object was changed - add/modify a state according to it
      if (cell.isElement() && attrs.value) {
        // console.log('if - value');
        valueHandle.updateCell(this.graph, cell);
      }
    }, this));

    this.graph.on('change:position', _.bind(function (cell) {
      const outboundLinks = this.graph.getConnectedLinks(cell, { outbound: true });
      const inboundLinks = this.graph.getConnectedLinks(cell, { inbound: true });
      common._.each(outboundLinks, function (linkToUpdate) {
        linkDrawing.linkUpdating(linkToUpdate);
      });
      common._.each(inboundLinks, function (linkToUpdate) {
        linkDrawing.linkUpdating(linkToUpdate);
      });
    }, this));
  }

  initializeHaloAndInspector() {
    const _this = this;
    this.paper.on('element:pointerup link:options', function (cellView) {

      const cell = cellView.model;

      if (!this.selection.collection.contains(cell)) {

        if (cell.isElement()) {

          new joint.ui.FreeTransform({
            cellView: cellView,
            allowRotation: false,
            preserveAspectRatio: false,
            allowOrthogonalResize: true,
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
            halo.addHandle({
              name: 'arrange_up', position: 'n', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states at the top inside the object',
                  'data-tooltip-position': 'top',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_up:pointerup', function () {
              arrangeStates.call(this, 'top');
            });
            halo.addHandle({
              name: 'arrange_down', position: 's', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states at the bottom inside the object',
                  'data-tooltip-position': 'bottom',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_down:pointerup', function () {
              arrangeStates.call(this, 'bottom');
            });
            halo.addHandle({
              name: 'arrange_right', position: 'w', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states to the left inside the object',
                  'data-tooltip-position': 'left',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_right:pointerup', function () {
              arrangeStates.call(this, 'left');
            });
            halo.addHandle({
              name: 'arrange_left', position: 'e', icon: null, attrs: {
                '.handle': {
                  'data-tooltip-class-name': 'small',
                  'data-tooltip': 'Arrange the states to the right inside the object',
                  'data-tooltip-position': 'right',
                  'data-tooltip-padding': 15
                }
              }
            });
            halo.on('action:arrange_left:pointerup', function () {
              arrangeStates.call(this, 'right');
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
            halo.on('action:add_state:pointerdown', function (evt, x, y) {
              const cellModel = this.options.cellView.model;
              if (cellModel.attributes.attrs.ellipse['stroke-width'] === 4) {
              _this.graphService.changeGraphModel(cellModel.id);
                return;
             }
              cellModel.attributes.attrs.ellipse['stroke-width']=4;
              const CellClone = cell.clone();
              const textString = cell.attributes.attrs.text.text;
              CellClone.set('id', cellModel.id);
              CellClone.attr({ text: { text: textString } });
              _this.treeViewService.insertNode(cellModel);
              const elementlinks = _this.graphService.graphLinks;
              processInzooming(evt, x, y, this, CellClone, elementlinks, _this);
            });
          }

          this.selection.collection.reset([]);
          this.selection.collection.add(cell, { silent: true });
        }
        this.cell$.next(cell);
      }
    }, this);
  }

  initializeValidator() {

    this.validator = new joint.dia.Validator({ commandManager: this.commandManager });
    this.RuleSet = opmRuleSet;
    this.RuleSet(this.validator, this.graph);
  }

  initializeNavigator() {

    const navigator = this.navigator = new joint.ui.Navigator({
      width: 240,
      height: 115,
      paperScroller: this.paperScroller,
      zoom: false
    });

    // $('.navigator-container').append(navigator.el);
    // navigator.render();
  }


  initializeToolbar() {

    const toolbar = this.toolbar = new joint.ui.Toolbar({
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
