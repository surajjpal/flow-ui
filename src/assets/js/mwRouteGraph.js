var routeGraph;
var horizontal = true;

designRouteEditor = function (route, readOnly) {
  // Checks if browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is
    // not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else {
    // Workaround for Internet Explorer ignoring certain styles

    var container = document.getElementById('routeEditorGrid');
    var outline = document.getElementById('routeOutlineContainer');

    mxEvent.disableContextMenu(container);
    if (mxClient.IS_QUIRKS) {
      document.body.style.overflow = 'hidden';
      new mxDivResizer(container);
      new mxDivResizer(outline);
    }
    // Sets background colour
    container.style.background = '#FFFFFF';

    // document.body.appendChild(container);
    // Creates the graph inside the given container
    routeGraph = new mxGraph(container);

    // Enables automatic sizing for vertices after editing and
    // panning by using the left mouse button.
    routeGraph.setCellsMovable(false);
    routeGraph.setConnectable(false);
    routeGraph.setAutoSizeCells(true);
    routeGraph.setPanning(true);
    routeGraph.centerZoom = false;
    routeGraph.panningHandler.useLeftButtonForPanning = true;
    // Displays a popupmenu when the user clicks
    // on a cell (using the left mouse button) but
    // do not select the cell when the popup menu
    // is displayed
    routeGraph.panningHandler.popupMenuHandler = false;
    // Creates the outline (navigator, overview) for moving
    // around the graph in the top, right corner of the window.
    var outln = new mxOutline(routeGraph, outline);

    // Disables tooltips on touch devices
    routeGraph.setTooltips(!mxClient.IS_TOUCH);

    routeSetupGraphStyles(routeGraph);

    // Enables automatic layout on the graph and installs
    // a tree layout for all groups who's children are
    // being changed, added or removed.
    // var layout = new mxCompactTreeLayout(graph, true);
    var layout = new mxHierarchicalLayout(routeGraph, mxConstants.DIRECTION_WEST);
    layout.useBoundingBox = true;
    layout.edgeRouting = false;
    layout.levelDistance = 100;
    layout.nodeDistance = 50;

    // Hierarchical Layout Properties
    layout.edgeStyle = mxHierarchicalEdgeStyle.CURVE;
    layout.intraCellSpacing = 100;
    layout.parallelEdgeSpacing = 100;
    layout.interRankCellSpacing = 150;
    layout.interHierarchySpacing = 100;
    // Allows the layout to move cells even though cells
    // aren't movable in the graph
    layout.isVertexMovable = function (cell) {
      return true;
    };
    var layoutMgr = new mxLayoutManager(routeGraph);
    layoutMgr.getLayout = function (cell) {
      if (cell.getChildCount() > 0) {
        return layout;
      }
    };
    // Installs a popupmenu handler using local function (see below).
    routeGraph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
      return routeCreatePopupMenu(routeGraph, menu, cell, evt, readOnly);
    };
    // Fix for wrong preferred size
    var oldGetPreferredSizeForCell = routeGraph.getPreferredSizeForCell;
    routeGraph.getPreferredSizeForCell = function (cell) {
      var result = oldGetPreferredSizeForCell.apply(this, arguments);
      if (result != null) {
        result.width = Math.max(120, result.width);
      }
      return result;
    };

    // Cell label from custom object
    // graph.setHtmlLabels(true);
    routeGraph.convertValueToString = function (cell) {
      var data = cell.getValue();

      if (data) {
        try {
          if (data.routeStepName) {
            return data.routeStepName;
          } else if (data.conditionName) {
            return data.conditionName;
          }
        } catch (exception) {

        }

        return data;
      }

      return '';
    };

    renderRouteGraph(route, readOnly);
  }
};

function renderRouteGraph(route, readOnly) {
  var routeEmpty = !route || route.length <= 0;
  var treeRoot = routeCreateNewGraph(routeGraph, routeEmpty, readOnly);

  if (!routeEmpty) {
    constructRoute(routeGraph, route, treeRoot, null, readOnly);
  }
}

// Create new graph, delete existing edges/vertices if any
function routeCreateNewGraph(routeGraph, routeEmpty, readOnly) {
  var treeRoot;
  var recenter = false;
  var model = routeGraph.getModel();

  model.beginUpdate();
  try {
    if (model.getCell('treeRoot')) {
      treeRoot = model.getCell('treeRoot');
      // Clear child edges/vertices of treeRoot (if any)
      routeGraph.removeCells(routeGraph.getChildVertices(treeRoot));
    } else {
      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      recenter = true;
      
      var parent = routeGraph.getDefaultParent();
      // Adds the root vertex of the tree

      // Clear exsting edges/vertices if any
      routeGraph.removeCells(routeGraph.getChildVertices(parent));

      var w = routeGraph.container.offsetWidth;
      var h = routeGraph.container.offsetHeight;
      treeRoot = routeGraph.insertVertex(parent, 'treeRoot',
        '', w / 2, h / 2, 50, 50, 'start');
    }
  } finally {
    // Updates the display
    model.endUpdate();
  }

  // To scroll graph so that our cell would appear in center
  if (treeRoot && recenter) {
    routeGraph.scrollCellToVisible(treeRoot, true);
  }

  if (routeEmpty) {
    // Keeping out of model update cycle since the same is being handled internally
    routeAddOverlays(routeGraph, treeRoot, false, true, false, horizontal, readOnly);
  } else {
    model.beginUpdate();
    try {
      routeGraph.clearCellOverlays(treeRoot);
    } finally {
      model.endUpdate();
    }
  }

  return treeRoot;
}

function constructRoute(routeGraph, route, previousRouteStep, conditionName, readOnly) {
  var routeStep = null;
  var routeData = null;
  var routeType = null;

  for (var index = 0; index < route.length; index++) {
    routeStep = route[index];
    routeData = {
      routeStepId: routeStep.routeStepId,
      routeStepName: routeStep.routeStepName
    };
    routeType = routeStep['@type'] && routeStep['@type'] == 'ChoiceRouteStep' ? 'decision' : 'normal';

    previousRouteStep = routeAddChild(routeGraph, previousRouteStep, routeData, routeType, conditionName, true, index == route.length - 1, readOnly);
    conditionName = null;

    if (routeType == 'decision' && routeStep.conditions && routeStep.conditions.length > 0) {
      for (var condition of routeStep.conditions) {
        if (condition && condition.conditionName && condition.routeSteps && condition.routeSteps.length > 0) {
          constructRoute(routeGraph, condition.routeSteps, previousRouteStep, condition.conditionName, readOnly)
        }
      }
    }
  }
}

// Function to create the entries in the popupmenu
function routeCreatePopupMenu(routeGraph, menu, cell, evt, readOnly) {
  var model = routeGraph.getModel();
  if (!readOnly && cell != null) {
    if (cell.id != 'treeRoot' && model.isVertex(cell) && cell.value && !(typeof cell.value === "string" || cell.value instanceof String)) {
      menu.addItem('Delete All', './assets/js/mxGraph/images/delete.gif', function () {
        // Send event to typescript to delete selected vertex (route)
        window['routeComponentRef'].zone.run(() => { window['routeComponentRef'].component.deleteRouteStep(cell.value.routeStepId, true); });
      });

      menu.addItem('Edit', '', function () {
        // Send event to typescript to edit selected vertex (route)
        window['routeComponentRef'].zone.run(() => { window['routeComponentRef'].component.editRouteStep(cell.value.routeStepId); });
      });
    }
    menu.addSeparator();
  }
  menu.addItem('Fit', './assets/js/mxGraph/images/zoom.gif', function () {
    routeGraph.fit();
  });
  menu.addItem('Actual', './assets/js/mxGraph/images/zoomactual.gif', function () {
    routeGraph.zoomActual();
  });
  menu.addSeparator();
  menu.addItem('Print', './assets/js/mxGraph/images/print.gif', function () {
    var scale = mxUtils.getScaleForPageCount(1, routeGraph, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
    var preview = new mxPrintPreview(routeGraph, scale, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
    preview.open("@page { size: landscape; }");
  });
  menu.addItem('Poster Print', './assets/js/mxGraph/images/print.gif', function () {
    var pageCount = mxUtils.prompt('Enter maximum page count', '1');
    if (pageCount != null) {
      var scale = mxUtils.getScaleForPageCount(pageCount, routeGraph, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
      var preview = new mxPrintPreview(routeGraph, scale, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
      preview.open("@page { size: landscape; }");
    }
  });
};

function routeAddOverlays(routeGraph, cell, addDeleteIcon, addAddIcon, addInsertIcon, horizontal, readOnly) {
  routeGraph.getModel().beginUpdate();

  try {
    routeGraph.removeCellOverlays(cell);

    if (!readOnly && addAddIcon) {
      var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/add.png', 24, 24), 'Add Route Step');

      overlay.cursor = 'hand';
      if (horizontal) {
        overlay.align = mxConstants.ALIGN_RIGHT;
        overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
      } else {
        overlay.align = mxConstants.ALIGN_CENTER;
        overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
      }

      overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
        try {
          var clickedCell = evt.getProperty('cell')
          if (clickedCell.id == 'treeRoot') {
            window['routeComponentRef'].zone.run(() => { window['routeComponentRef'].component.addRouteStep(null); });
          } else {
            window['routeComponentRef'].zone.run(() => { window['routeComponentRef'].component.addRouteStep(clickedCell.value.routeStepId); });
          }
        } catch (exception) {
          console.error(exception);
        }
      }));
      routeGraph.addCellOverlay(cell, overlay);
    }

    if (!readOnly && addInsertIcon) {
      var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/add.png', 24, 24), 'Insert Route Step');

      overlay.cursor = 'hand';
      if (horizontal) {
        overlay.align = mxConstants.ALIGN_LEFT;
        overlay.verticalAlign = mxConstants.ALIGN_MIDDLE;
      } else {
        overlay.align = mxConstants.ALIGN_CENTER;
        overlay.verticalAlign = mxConstants.ALIGN_BOTTOM;
      }

      overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
        try {
          var clickedCell = evt.getProperty('cell')
          if (clickedCell.id == 'treeRoot') {
            // Do nothing as a fail safe. Icon shouldn't be visible for this case
          } else {
            window['routeComponentRef'].zone.run(() => { window['routeComponentRef'].component.insertRouteStep(clickedCell.value.routeStepId); });
          }
        } catch (exception) {
          console.error(exception);
        }
      }));
      routeGraph.addCellOverlay(cell, overlay);
    }

    if (!readOnly && addDeleteIcon) {
      overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/close.png', 30, 30), 'Delete');
      overlay.cursor = 'hand';
      // overlay.offset = new mxPoint(-4, 8);
      overlay.align = mxConstants.ALIGN_RIGHT;
      overlay.verticalAlign = mxConstants.ALIGN_TOP;

      overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
        try {
          // Send event to typescript to delete selected vertex (route)
          window['routeComponentRef'].zone.run(() => { window['routeComponentRef'].component.deleteRouteStep(evt.getProperty('cell').value.routeStepId, false); });
        } catch (exception) {
          console.error(exception);
        }
      }));

      routeGraph.addCellOverlay(cell, overlay);
    }
  } finally {
    routeGraph.getModel().endUpdate();
  }
};

function routeAddChild(routeGraph, sourceVertex, cellValue, routeType, conditionName, horizontal, isEnd, readOnly) {
  var model = routeGraph.getModel();
  var parent = model.getCell('treeRoot');
  var vertex;
  model.beginUpdate();
  try {
    if (routeType == 'start') { // Not in use
      vertex = routeGraph.insertVertex(parent, null, '', 0, 0, 0, 0, 'start', false);
    } else if (routeType == 'end') { // Not in use
      vertex = routeGraph.insertVertex(parent, null, cellValue, 0, 0, 0, 0, 'end', false);
    } else if (routeType == 'decision') {
      vertex = routeGraph.insertVertex(parent, null, cellValue, 0, 0, 0, 0, 'decision', false);
    } else {
      vertex = routeGraph.insertVertex(parent, null, cellValue);
    }

    vertex.value.routeId = vertex.id;

    var size = routeGraph.getPreferredSizeForCell(vertex);
    var geometry = model.getGeometry(vertex);
    geometry.width = size.width;
    geometry.height = size.height;

    var edge = null;
    if (conditionName) {
      edge = routeGraph.insertEdge(parent, null, conditionName, sourceVertex, vertex, null);
    } else {
      edge = routeGraph.insertEdge(parent, null, '', sourceVertex, vertex, null);
    }
    // Updates the geometry of the vertex with the
    // preferred size computed in the graph

    // Adds the edge between the existing cell
    // and the new vertex and executes the
    // automatic layout on the parent

    // Configures the edge label "in-place" to reside
    // at the end of the edge (x = 1) and with an offset
    // of 20 pixels in negative, vertical direction.
    edge.geometry.x = 0;
    edge.geometry.y = 0;
    edge.geometry.offset = new mxPoint(0, -15);
  }
  finally {
    model.endUpdate();
  }

  // Keeping out of model update cycle since the same is being handled internally
  routeAddOverlays(routeGraph, vertex, true, isEnd, true, horizontal, readOnly);

  return vertex;
};

routeGraphTools = function (choice) {
  switch (choice) {
    case 'ZOOM_IN': // Zoom In
      routeGraph.zoomIn();
      break;
    case 'ZOOM_OUT': // Zoom Out
      routeGraph.zoomOut();
      break;
    case 'ZOOM_ACTUAL': // Zoom Actual
      routeGraph.zoomActual();
      break;
    case 'PRINT_PREVIEW': // Print Preview
      var scale = mxUtils.getScaleForPageCount(1, routeGraph, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
      var preview = new mxPrintPreview(routeGraph, scale, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
      preview.open("@page { size: landscape; }");
      break;
    case 'POSTER_PRINT': // Poster Print
      var pageCount = prompt('Enter maximum page count', '1');
      if (pageCount != null) {
        var scale = mxUtils.getScaleForPageCount(pageCount, routeGraph, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
        var preview = new mxPrintPreview(routeGraph, scale, mxConstants.PAGE_FORMAT_A4_LANDSCAPE);
        preview.open("@page { size: landscape; }");
      }
      break;
  }
}

routeSetupGraphStyles = function (routeGraph) {
  // Set some stylesheet options for the visual appearance of vertices
  style = routeGraph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
  style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff';
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
  style[mxConstants.STYLE_FONTSIZE] = '12';
  style[mxConstants.STYLE_FONTSTYLE] = '1';
  style[mxConstants.STYLE_OVERFLOW] = 'width';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

  var style = routeGraph.getStylesheet().getDefaultVertexStyle();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_SPACING_LEFT] = 20;
  style[mxConstants.STYLE_SPACING_RIGHT] = 20;
  style[mxConstants.STYLE_SPACING_TOP] = 25;
  style[mxConstants.STYLE_SPACING_BOTTOM] = 25;
  style[mxConstants.STYLE_OVERFLOW] = 'width';
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
  style[mxConstants.STYLE_FONTSIZE] = '12';
  style[mxConstants.STYLE_FONTSTYLE] = '1';
  style[mxConstants.STYLE_SHADOW] = '1';
  style[mxConstants.STYLE_ROUNDED] = '1';
  style[mxConstants.STYLE_GLASS] = '0';
  style[mxConstants.STYLE_FOLDABLE] = '0';

  style = mxUtils.clone(style);
  routeGraph.getStylesheet().putCellStyle('PENDING_STATE', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  routeGraph.getStylesheet().putCellStyle('ACTIVE_STATE', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  routeGraph.getStylesheet().putCellStyle('CLOSED_STATE', style);

  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';

  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
  style[mxConstants.STYLE_FONTSIZE] = '12';
  style[mxConstants.STYLE_FONTSTYLE] = '1';

  style[mxConstants.STYLE_SHADOW] = '0';
  style[mxConstants.STYLE_GLASS] = '0';

  routeGraph.getStylesheet().putCellStyle('decision', style);

  style = mxUtils.clone(style);
  routeGraph.getStylesheet().putCellStyle('PENDING_DECISION', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#007BFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#FFFFFF';
  routeGraph.getStylesheet().putCellStyle('ACTIVE_DECISION', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#007BFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#FFFFFF';
  routeGraph.getStylesheet().putCellStyle('CLOSED_DECISION', style);

  style = [];
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';

  style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
  style[mxConstants.STYLE_FONTSIZE] = '12';
  style[mxConstants.STYLE_FONTSTYLE] = '1';

  //style[mxConstants.STYLE_SHADOW] = '1';
  //style[mxConstants.STYLE_GLASS] = '0';

  routeGraph.getStylesheet().putCellStyle('start', style);

  style = mxUtils.clone(style);
  routeGraph.getStylesheet().putCellStyle('PENDING_START', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  routeGraph.getStylesheet().putCellStyle('ACTIVE_START', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  routeGraph.getStylesheet().putCellStyle('CLOSED_START', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_STROKEWIDTH] = '2';
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  routeGraph.getStylesheet().putCellStyle('end', style);

  style = mxUtils.clone(style);
  routeGraph.getStylesheet().putCellStyle('PENDING_END', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  routeGraph.getStylesheet().putCellStyle('ACTIVE_END', style);

  style = mxUtils.clone(style);
  style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
  style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
  routeGraph.getStylesheet().putCellStyle('CLOSED_END', style);

  // Sets the default style for edges
  style = routeGraph.getStylesheet().getDefaultEdgeStyle();
  style[mxConstants.STYLE_ROUNDED] = true;
  style[mxConstants.STYLE_STROKEWIDTH] = 2;
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
  routeGraph.getStylesheet().putCellStyle('multipleParents', style);
}