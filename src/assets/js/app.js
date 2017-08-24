graphRendererFunction =  function (container,statemachineid,stateflowimageurl)
{
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported())
  {
    // Displays an error message if the browser is not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else
  {
    mxConstants.SHADOWCOLOR = '#e0e0e0';
    
    // Creates the graph inside the given container
    var graph = createGraph(container);
    var url = stateflowimageurl+statemachineid;

   jQuery(document).ready(function ($) {
         $.ajax({
                url: url,
                success: function(data) {
                    console.log(data);
                    var doc = mxUtils.parseXml(data);
                    var codec = new mxCodec(doc);
                    codec.decode(doc.documentElement, graph.getModel());
                }
            });
    });
   
            
  }
  
  // Creates a button to invoke the refresh function
  /*document.body.appendChild(mxUtils.button('Update', function(evt)
  {
    // XML is normally fetched from URL at server using mxUtils.get - this is a client-side
    // string with randomized states to demonstrate the idea of the workflow monitor
    var xml = '<process><update id="ApproveClaim" state="'+getState()+'"/><update id="AuthorizeClaim" state="'+getState()+'"/>'+
      '<update id="CheckAccountingData" state="'+getState()+'"/><update id="ReviewClaim" state="'+getState()+'"/>'+
      '<update id="ApproveReviewedClaim" state="'+getState()+'"/><update id="EnterAccountingData" state="'+getState()+'"/></process>';
    update(graph, xml);
  }));*/
};

/**
 * Updates the display of the given graph using the XML data
 */
function update(graph, xml)
{
  if (xml != null && xml.length > 0)
  {
    var doc = mxUtils.parseXml(xml);
    
    if (doc != null && doc.documentElement != null)
    {
      var model = graph.getModel();
      var nodes = doc.documentElement.getElementsByTagName('update');
      
      if (nodes != null && nodes.length > 0)
      {
        model.beginUpdate();

        try
        {
          for (var i = 0; i < nodes.length; i++)
          {
            // Processes the activity nodes inside the process node
            var id = nodes[i].getAttribute('id');
            var state = nodes[i].getAttribute('state');
            
            // Gets the cell for the given activity name from the model
            var cell = model.getCell(id);
            
            // Updates the cell color and adds some tooltip information
            if (cell != null)
            {
              // Resets the fillcolor and the overlay
              graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, 'white', [cell]);
              graph.removeCellOverlays(cell);
  
              // Changes the cell color for the known states
              if (state == 'Running')
              {
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#f8cecc', [cell]);
              }
              else if (state == 'Waiting')
              {
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#fff2cc', [cell]);
              }
              else if (state == 'Completed')
              {
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#d4e1f5', [cell]);
              }
              
              // Adds tooltip information using an overlay icon
              if (state != 'Init')
              {
                // Sets the overlay for the cell in the graph
                graph.addCellOverlay(cell, createOverlay(graph.warningImage, 'State: '+state));
              }
            }
          } // for
        }
        finally
        {
          model.endUpdate();
        }
      }
    }
  }
};

/**
 * Creates an overlay object using the given tooltip and text for the alert window
 * which is being displayed on click.
 */
function createOverlay(image, tooltip)
{
  var overlay = new mxCellOverlay(image, tooltip);

  // Installs a handler for clicks on the overlay
  overlay.addListener(mxEvent.CLICK, function(sender, evt)
  {
    mxUtils.alert(tooltip + '\nLast update: ' + new Date());
  });
  
  return overlay;
};

/**
 * Creates and returns an empty graph inside the given container.
 */
function createGraph(container)
{
  var graph = new mxGraph(container);
  graph.setTooltips(true);
  graph.setEnabled(false);
  
  // Disables folding
  graph.isCellFoldable = function(cell, collapse)
  {
    return false;
  };

  // Creates the stylesheet for the process display
  var style = graph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_FONTSIZE] = 11;
  style[mxConstants.STYLE_FONTCOLOR] = 'black';
  style[mxConstants.STYLE_STROKECOLOR] = '#808080';
  style[mxConstants.STYLE_FILLCOLOR] = 'white';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_EAST;
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_SHADOW] = true;
  style[mxConstants.STYLE_FONTSTYLE] = 1;
  
  style = graph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
  style[mxConstants.STYLE_STROKECOLOR] = '#808080';
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_SHADOW] = true;
          
  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_STROKECOLOR] = '#a0a0a0';
  style[mxConstants.STYLE_FONTCOLOR] = '#606060';
  style[mxConstants.STYLE_FILLCOLOR] = '#E0E0DF';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_STARTSIZE] = 30;
  style[mxConstants.STYLE_ROUNDED] = false;
  style[mxConstants.STYLE_FONTSIZE] = 12;
  style[mxConstants.STYLE_FONTSTYLE] = 0;
  style[mxConstants.STYLE_HORIZONTAL] = false;
  // To improve text quality for vertical labels in some old IE versions...
  style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#efefef';

  graph.getStylesheet().putCellStyle('swimlane', style);
  
  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
  style[mxConstants.STYLE_STROKECOLOR] = '#91BCC0';
  style[mxConstants.STYLE_FONTCOLOR] = 'gray';
  style[mxConstants.STYLE_FILLCOLOR] = '#91BCC0';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = 16;
  graph.getStylesheet().putCellStyle('step', style);
  
  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
  style[mxConstants.STYLE_FONTCOLOR] = 'gray';
  style[mxConstants.STYLE_FILLCOLOR] = '#A0C88F';
  style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
  style[mxConstants.STYLE_STROKECOLOR] = '#A0C88F';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_FONTSIZE] = 16;
  graph.getStylesheet().putCellStyle('start', style);
  
  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
  style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
  graph.getStylesheet().putCellStyle('end', style);

  style = graph.getStylesheet().getDefaultVertexStyle();
  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#f8cecc';
  style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
  graph.getStylesheet().putCellStyle('CLOSED', style);

  style = graph.getStylesheet().getDefaultVertexStyle();
  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#9ceda9';
  style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
  graph.getStylesheet().putCellStyle('ACTIVE', style);

  style = graph.getStylesheet().getDefaultVertexStyle();
  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#c4cdff';
  style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
  graph.getStylesheet().putCellStyle('FLOW', style);
  
  return graph;
};

/**
 * Returns a random state.
 */
function getState()
{
  var state = 'Init';
  var rnd = Math.random() * 4;
  
  if (rnd > 3)
  {
    state = 'Completed';
  }
  else if (rnd > 2)
  {
    state = 'Running';
  }
  else if (rnd > 1)
  {
    state = 'Waiting';
  }
  
  return state;
};

closeModal = function(){
   $('#detailsModal').modal("hide");
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var dataPointCount = 0;
var graph;
var oldXML;
var settingsPopupBody;
var horizontal = true;
var sourceCell;   // Used as a parent cell while adding new cell in graph.
var cellLabelChanged;

designFlowEditor =  function (serverXml)
{
// Checks if browser is supported
if (!mxClient.isBrowserSupported())
{
// Displays an error message if the browser is
// not supported.
mxUtils.error('Browser is not supported!', 200, false);
}
else
{
// Workaround for Internet Explorer ignoring certain styles

var container = document.getElementById('editorGrid');
// container.style.position = 'absolute';
// container.style.overflow = 'hidden';
// container.style.left = '0px';
// container.style.top = '0px';
// container.style.right = '0px';
// container.style.bottom = '0px';
var outline = document.getElementById('outlineContainer');
var toolsContainer = document.getElementById('toolsContainer');
mxEvent.disableContextMenu(container);
if (mxClient.IS_QUIRKS)
{
  document.body.style.overflow = 'hidden';
  new mxDivResizer(container);
  new mxDivResizer(outline);
  new mxDivResizer(toolsContainer);
}
// Sets a gradient background
  if (mxClient.IS_GC || mxClient.IS_SF)
  {
    container.style.background = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFFFFF), to(#E7E7E7))';
  }
  else if (mxClient.IS_NS)
  {
    container.style.background = '-moz-linear-gradient(top, #FFFFFF, #E7E7E7)';  
  }
  else if (mxClient.IS_IE)
  {
    container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
              'StartColorStr=\'#FFFFFF\', EndColorStr=\'#E7E7E7\', GradientType=0)';
  }
// document.body.appendChild(container);
// Creates the graph inside the given container
graph = new mxGraph(container);

// Enables automatic sizing for vertices after editing and
// panning by using the left mouse button.
graph.setCellsMovable(false);
graph.setConnectable(true);
graph.setAutoSizeCells(true);
graph.setPanning(true);
graph.centerZoom = false;
graph.panningHandler.useLeftButtonForPanning = true;
// Displays a popupmenu when the user clicks
// on a cell (using the left mouse button) but
// do not select the cell when the popup menu
// is displayed
graph.panningHandler.popupMenuHandler = false;
// Creates the outline (navigator, overview) for moving
// around the graph in the top, right corner of the window.
var outln = new mxOutline(graph, outline);

// Disables tooltips on touch devices
graph.setTooltips(!mxClient.IS_TOUCH);
// Set some stylesheet options for the visual appearance of vertices
var style = graph.getStylesheet().getDefaultVertexStyle();
style[mxConstants.STYLE_SHAPE] = 'label';

style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
style[mxConstants.STYLE_SPACING_LEFT] = 15;
style[mxConstants.STYLE_SPACING_RIGHT] = 35;
style[mxConstants.STYLE_SPACING_TOP] = 25;
style[mxConstants.STYLE_SPACING_BOTTOM] = 25;

style[mxConstants.STYLE_STROKECOLOR] = 'black';
style[mxConstants.STYLE_FILLCOLOR] = 'white';

style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
style[mxConstants.STYLE_FONTSIZE] = '12';
style[mxConstants.STYLE_FONTSTYLE] = '1';

style[mxConstants.STYLE_SHADOW] = '0';
style[mxConstants.STYLE_ROUNDED] = '1';
style[mxConstants.STYLE_GLASS] = '0';

style = [];
style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

style[mxConstants.STYLE_STROKECOLOR] = 'black';
style[mxConstants.STYLE_FILLCOLOR] = 'white';

style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
style[mxConstants.STYLE_FONTSIZE] = '12';
style[mxConstants.STYLE_FONTSTYLE] = '1';

style[mxConstants.STYLE_SHADOW] = '0';
style[mxConstants.STYLE_GLASS] = '0';

graph.getStylesheet().putCellStyle('decision', style);

style = [];
style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

style[mxConstants.STYLE_STROKECOLOR] = 'black';
style[mxConstants.STYLE_FILLCOLOR] = 'white';

style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
style[mxConstants.STYLE_FONTSIZE] = '12';
style[mxConstants.STYLE_FONTSTYLE] = '1';

style[mxConstants.STYLE_SHADOW] = '0';
style[mxConstants.STYLE_GLASS] = '0';

graph.getStylesheet().putCellStyle('start', style);

style = mxUtils.clone(style);
style[mxConstants.STYLE_STROKEWIDTH] = '3';
graph.getStylesheet().putCellStyle('end', style);

// style[mxConstants.STYLE_IMAGE] = 'assets/js/mxGraph/images/dude3.png';
// style[mxConstants.STYLE_IMAGE_WIDTH] = '48';
// style[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
// style[mxConstants.STYLE_SPACING] = 8;
// Sets the default style for edges
style = graph.getStylesheet().getDefaultEdgeStyle();
style[mxConstants.STYLE_ROUNDED] = true;
style[mxConstants.STYLE_STROKEWIDTH] = 3;
// style[mxConstants.STYLE_EXIT_X] = 1.0; // right
// style[mxConstants.STYLE_EXIT_Y] = 0.5; // center
style[mxConstants.STYLE_EXIT_PERIMETER] = 1; // disabled
// style[mxConstants.STYLE_ENTRY_X] = 0; // left
// style[mxConstants.STYLE_ENTRY_Y] = 0.5; // center
style[mxConstants.STYLE_ENTRY_PERIMETER] = 1; // disabled

// Disable the following for straight lines
style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;

style = mxUtils.clone(style);
style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
graph.getStylesheet().putCellStyle('multipleParents', style);

// Stops editing on enter or escape keypress
var keyHandler = new mxKeyHandler(graph);
keyHandler.bindKey(46, function(evt)
{
  if (graph.isEnabled())
  {
    var selectedCells = graph.selectionModel.cells;
    for (var index = 0; index < selectedCells.length; index++) {
      var cell = selectedCells[index];
      if (cell.edge) {
        var targetCell = cell.target;
        var allEdges = graph.getChildEdges(graph.getDefaultParent());
        var keepTargetCell = false;
        for (var edge of allEdges) {
          if (edge != cell && edge.target == targetCell) {
            keepTargetCell = true;
            break;
          }
        }

        if (!keepTargetCell) {
          deleteSubtree(graph, cell.target);
        }
      }

      if (cell.style != 'start') {
        deleteSubtree(graph, selectedCells[index]);
      }
    }
    //deleteSubtree()
    // graph.removeCells();
  }
});
// Enables automatic layout on the graph and installs
// a tree layout for all groups who's children are
// being changed, added or removed.
// var layout = new mxCompactTreeLayout(graph, true);
var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
layout.useBoundingBox = true;
layout.edgeRouting = false;
layout.levelDistance = 100;
layout.nodeDistance = 50;

// Hierarchical Layout Properties
layout.edgeStyle = mxHierarchicalEdgeStyle.CURVE;
layout.intraCellSpacing = 100;
layout.parallelEdgeSpacing = 100;
layout.interRankCellSpacing = 100;
layout.interHierarchySpacing = 100;
// Allows the layout to move cells even though cells
// aren't movable in the graph
layout.isVertexMovable = function(cell)
{
  return true;
};
var layoutMgr = new mxLayoutManager(graph);
layoutMgr.getLayout = function(cell)
{
  if (cell.getChildCount() > 0)
  {
    return layout;
  }
};
// Installs a popupmenu handler using local function (see below).
graph.popupMenuHandler.factoryMethod = function(menu, cell, evt)
{
  return createPopupMenu(graph, menu, cell, evt, horizontal);
};
// Fix for wrong preferred size
var oldGetPreferredSizeForCell = graph.getPreferredSizeForCell;
graph.getPreferredSizeForCell = function(cell)
{
  var result = oldGetPreferredSizeForCell.apply(this, arguments);
  if (result != null)
  {
    result.width = Math.max(120, result.width);
  }
  return result;
};

// Sets the maximum text scale to 1
/*graph.cellRenderer.getTextScale = function(state)
{
  return Math.min(1, state.view.scale);
};*/
// Dynamically adds text to the label as we zoom in
// (without affecting the preferred size for new cells)
/*graph.cellRenderer.getLabelValue = function(state)
{
  var result = state.cell.value;
  
  if (state.view.graph.getModel().isVertex(state.cell))
  {
    if (state.view.scale > 1)
    {
      result += '\nDetails 1';
    }
    
    if (state.view.scale > 1.3)
    {
      result += '\nDetails 2';
    }
  }
  
  return result;
};*/

// Cell label from custom object
// graph.setHtmlLabels(true);
graph.convertValueToString = function(cell)
{
  if (cell.getValue())
  {
    var state = cell.getValue();
    try {
      if (state.name) {
        return state.name;
      }
    } catch (exception) {
      console.log(exception);
    }
    
    return 'No label found';
  }
};

cellLabelChanged = graph.cellLabelChanged;
graph.cellLabelChanged = function(cell, newValue, autoSize)
{
  if (cell.getValue()) {
    var state = cell.getValue();
    try {
      if (state.name) {
        state.name = newValue;
        newValue = state;

        cellLabelChanged.apply(this, arguments);
      }
    } catch (exception) {
      console.log(exception);
    }
  }
};

if (serverXml) {
  // Reads xml for graph obtained from server and renders it
  var doc = mxUtils.parseXml(serverXml);
  var codec = new mxCodec(doc);
  codec.decode(doc.documentElement, graph.getModel());

  var allVertices = graph.getChildVertices(graph.getDefaultParent());
  for (var index = 0; index <allVertices.length; index++) {
    graph.traverse(allVertices[index], true, function(vertex)
    {
      if (index == 0) {
        // To scroll graph so that our cell would appear in center
        graph.scrollCellToVisible(vertex, true);
      }

      addOverlays(graph, vertex, index != 0, horizontal);
    });
  }
} else {
  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();
  // Adds the root vertex of the tree
  graph.getModel().beginUpdate();
  try
  {
    var w = graph.container.offsetWidth;
    var h = graph.container.offsetHeight;
    var v1 = graph.insertVertex(parent, 'treeRoot',
      '', w/2, h/2, 50, 50, 'start'/*, 'image=assets/js/mxGraph/images/house.png'*/);
    // graph.updateCellSize(v1);
    addOverlays(graph, v1, false, horizontal);
  }
  finally
  {
    // Updates the display
    graph.getModel().endUpdate();
  }

  // To scroll graph so that our cell would appear in center
  graph.scrollCellToVisible(v1, true);
}


var content = document.createElement('div');
content.style.padding = '4px';
var tb = new mxToolbar(content);
tb.addItem('View XML', '/assets/js/mxGraph/images/zoom_in32.png',function(evt)
{
  var encoder = new mxCodec();
  var node = encoder.encode(graph.getModel());
  var xml = mxUtils.getXml(node);
  mxUtils.popup(xml, true);

  try{
    window['flowComponentRef'].zone.run(() => {window['flowComponentRef'].component.saveGraphXml(xml);})
  }catch(exception){
    console.log(exception);
  }
});
tb.addItem('Settings', '/assets/js/mxGraph/images/zoom_in32.png',function(evt)
{
  $('#settignsModal').modal();
});
tb.addItem('Zoom In', '/assets/js/mxGraph/images/zoom_in32.png',function(evt)
{
  graph.zoomIn();
});
tb.addItem('Zoom Out', '/assets/js/mxGraph/images/zoom_out32.png',function(evt)
{
  graph.zoomOut();
});

tb.addItem('Actual Size', '/assets/js/mxGraph/images/view_1_132.png',function(evt)
{
  graph.zoomActual();
});
tb.addItem('Print', '/assets/js/mxGraph/images/print32.png',function(evt)
{
  var preview = new mxPrintPreview(graph, 1);
  preview.open();
});
tb.addItem('Poster Print', '/assets/js/mxGraph/images/press32.png',function(evt)
{
  var pageCount = mxUtils.prompt('Enter maximum page count', '1');
  if (pageCount != null)
  {
    var scale = mxUtils.getScaleForPageCount(pageCount, graph);
    var preview = new mxPrintPreview(graph, scale);
    preview.open();
  }
});
wnd = new mxWindow('Tools', content, 0, 0, 200, 110, true, false, toolsContainer);
wnd.setMaximizable(false);
wnd.setScrollable(false);
wnd.setResizable(false);
wnd.setVisible(true);
}
};

// Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt, horizontal)
{
var model = graph.getModel();
if (cell != null)
{
if (model.isVertex(cell))
{
  menu.addItem('Add child', '/assets/js/mxGraph/images/check.png', function()
  {
    addChild(graph, cell, horizontal);
  });
}
menu.addItem('Edit label', '/assets/js/mxGraph/images/text.gif', function()
{
  graph.startEditingAtCell(cell);
});
if (cell.id != 'treeRoot' &&
  model.isVertex(cell))
{
  menu.addItem('Delete', '/assets/js/mxGraph/images/delete.gif', function()
  {
    deleteSubtree(graph, cell);
  });

  menu.addItem('Edit', '', function() {
    try{
      sourceCell = cell;
      window['flowComponentRef'].zone.run(() => {window['flowComponentRef'].component.addState(cell.value, cell.source.value);})
      $("#stateModal").modal();
    }catch(exception){
      console.log(exception);
    }
  });
}
menu.addSeparator();
}
menu.addItem('Fit', '/assets/js/mxGraph/images/zoom.gif', function()
{
graph.fit();
});
menu.addItem('Actual', '/assets/js/mxGraph/images/zoomactual.gif', function()
{
graph.zoomActual();
});
menu.addSeparator();
menu.addItem('Print', '/assets/js/mxGraph/images/print.gif', function()
{
var preview = new mxPrintPreview(graph, 1);
preview.open();
});
menu.addItem('Poster Print', '/assets/js/mxGraph/images/print.gif', function()
{
var pageCount = mxUtils.prompt('Enter maximum page count', '1');
if (pageCount != null)
{
  var scale = mxUtils.getScaleForPageCount(pageCount, graph);
  var preview = new mxPrintPreview(graph, scale);
  preview.open();
}
});
};

function addOverlays(graph, cell, addDeleteIcon, horizontal)
{
if (cell.style != 'end') {
var overlay = new mxCellOverlay(new mxImage('/assets/js/mxGraph/images/add.png', 24, 24), 'Add child');
var cellId = cell.id;
overlay.cursor = 'hand';
if (horizontal) {
  overlay.align = mxConstants.ALIGN_RIGHT;
  overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
} else {
  overlay.align = mxConstants.ALIGN_CENTER;
  overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
}

overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt)
{
  try{
    window['flowComponentRef'].zone.run(() => {window['flowComponentRef'].component.addState(null, cell.value);})
    sourceCell = cell;
  }catch(exception){
    console.log(exception);
  }
  $("#stateModal").modal();
}));
graph.addCellOverlay(cell, overlay);
}

if (addDeleteIcon)
{
overlay = new mxCellOverlay(new mxImage('/assets/js/mxGraph/images/close.png', 30, 30), 'Delete');
overlay.cursor = 'hand';
// overlay.offset = new mxPoint(-4, 8);
overlay.align = mxConstants.ALIGN_RIGHT;
overlay.verticalAlign = mxConstants.ALIGN_TOP;
overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt)
{
  deleteSubtree(graph, cell);
}));

graph.addCellOverlay(cell, overlay);
}
};

function addChild(graph, cell, horizontal)
{
var model = graph.getModel();
var parent = graph.getDefaultParent();
var vertex;
model.beginUpdate();
try
{
vertex = graph.insertVertex(parent, null, 'Double click to set name');
var geometry = model.getGeometry(vertex);
// Updates the geometry of the vertex with the
// preferred size computed in the graph
var size = graph.getPreferredSizeForCell(vertex);
geometry.width = size.width;
geometry.height = size.height;
// Adds the edge between the existing cell
// and the new vertex and executes the
// automatic layout on the parent
var edge = graph.insertEdge(parent, null, '', cell, vertex);
// Configures the edge label "in-place" to reside
// at the end of the edge (x = 1) and with an offset
// of 20 pixels in negative, vertical direction.
edge.geometry.x = 1;
edge.geometry.y = 0;
edge.geometry.offset = new mxPoint(0, -20);
addOverlays(graph, vertex, true, horizontal);
}
finally
{
model.endUpdate();
}

return vertex;
};

function addChild(graph, cell, customObject, horizontal, stateCode, stateLabel, stateType)
{
var model = graph.getModel();
var parent = graph.getDefaultParent();
var vertex;
model.beginUpdate();
try
{
if (!stateLabel || stateLabel.length == 0) {
  stateLabel = 'Double click to set name';
}

var circleSize = 50;
if (stateType == 'Start') {
  vertex = graph.insertVertex(parent, null, '', 0, 0, 0, 0, 'start', false);
  var geometry = model.getGeometry(vertex);
  geometry.width = circleSize;
  geometry.height = circleSize;
} else if (stateType == 'Decision State' || (customObject && customObject.events && customObject.events.length > 1)) {
  vertex = graph.insertVertex(parent, null, customObject, 0, 0, 0, 0, 'decision', false);
  var size = graph.getPreferredSizeForCell(vertex);
  var geometry = model.getGeometry(vertex);
  geometry.width = size.width;
  geometry.height = size.height;
} else if (stateType == 'End') {
  vertex = graph.insertVertex(parent, null, '', 0, 0, 0, 0, 'end', false);
  var geometry = model.getGeometry(vertex);
  geometry.width = circleSize;
  geometry.height = circleSize;
} else {
  vertex = graph.insertVertex(parent, null, customObject);
  var size = graph.getPreferredSizeForCell(vertex);
  var geometry = model.getGeometry(vertex);
  geometry.width = size.width;
  geometry.height = size.height;
}

// vertex.source = cell;

var edge;
if (getSourceEdgesCount(graph, vertex) > 1) {
  edge = graph.insertEdge(parent, null, '', cell, vertex, 'multipleParents');
} else {
  edge = graph.insertEdge(parent, null, '', cell, vertex, 'multipleParents');
}
// Updates the geometry of the vertex with the
// preferred size computed in the graph


// Adds the edge between the existing cell
// and the new vertex and executes the
// automatic layout on the parent

// Configures the edge label "in-place" to reside
// at the end of the edge (x = 1) and with an offset
// of 20 pixels in negative, vertical direction.
edge.geometry.x = 1;
edge.geometry.y = 0;
edge.geometry.offset = new mxPoint(0, -20);
addOverlays(graph, vertex, true, horizontal);
}
finally
{
model.endUpdate();
}

return vertex;
};

function deleteSubtree(graph, cell)
{
// Gets the subtree from cell downwards
var cells = [];
graph.traverse(cell, true, function(vertex)
{
cells.push(vertex);

return true;
});
graph.removeCells(cells);
};

function getSourceEdgesCount(graph, cell) {
if (cell.isVertex) {
var allEdges = graph.getChildEdges(graph.getDefaultParent());
var sourceEdgesCount = 0;
for (var edge of allEdges) {
  if (edge.target == cell) {
    sourceEdgesCount++;
  }
}
return sourceEdgesCount;
} else {
return 0;
}
}

graphTools = function(choice) {
switch(choice) {
case 'ZOOM_IN': // Zoom In
  graph.zoomIn();
  break;
case 'ZOOM_OUT': // Zoom Out
  graph.zoomOut();
  break;
case 'ZOOM_ACTUAL': // Zoom Actual
  graph.zoomActual();
  break;
case 'PRINT_PREVIEW': // Print Preview
  var preview = new mxPrintPreview(graph, 1);
  preview.open();
  break;
case 'POSTER_PRINT': // Poster Print
  var pageCount = prompt('Enter maximum page count', '1');
  if (pageCount != null)
  {
    var scale = mxUtils.getScaleForPageCount(pageCount, graph);
    var preview = new mxPrintPreview(graph, scale);
    preview.open();
  }
  break;
}
}

saveStateObject = function(state) {
var vertex = addChild(graph, sourceCell, state, horizontal, '', '', '');
}

updateStateObject = function(state) {
if (sourceCell) {
graph.getModel().beginUpdate();
try {
  sourceCell.setValue(state);
  graph.getView().clear(cell, false, false);
  graph.getView().validate();
  graph.cellSizeUpdated(sourceCell, false);
} finally {
  graph.getModel().endUpdate();
}
}
}

initializeGraphOnInit = function(){

try{init_sparklines();}catch(e){}
try{init_flot_chart();}catch(e){}
try{init_sidebar();}catch(e){}
try{init_wysiwyg();}catch(e){}
try{init_InputMask();}catch(e){}
try{init_JQVmap();}catch(e){}
try{init_cropper();}catch(e){}
try{init_knob();}catch(e){}
try{init_IonRangeSlider();}catch(e){}
try{init_ColorPicker();}catch(e){}
try{init_TagsInput();}catch(e){}
try{init_parsley();}catch(e){}
try{init_daterangepicker();}catch(e){}
try{init_daterangepicker_right();}catch(e){}
try{init_daterangepicker_single_call();}catch(e){}
try{init_daterangepicker_reservation();}catch(e){}
try{init_SmartWizard();}catch(e){}
try{init_EasyPieChart();}catch(e){}
try{init_charts();}catch(e){}
try{init_echarts();}catch(e){}
try{init_morris_charts();}catch(e){}
try{init_skycons();}catch(e){}
try{init_select2();}catch(e){}
try{init_validator();}catch(e){}
try{init_DataTables();}catch(e){}
try{init_chart_doughnut();}catch(e){}
try{init_gauge();}catch(e){}
try{init_PNotify();}catch(e){}
try{init_starrr();}catch(e){}
try{init_calendar();}catch(e){}
try{init_compose();}catch(e){}
try{init_CustomNotification();}catch(e){}
try{init_autosize();}catch(e){}
try{init_autocomplete();}catch(e){}   
}