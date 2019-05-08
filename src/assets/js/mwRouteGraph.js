var dataPointCount = 0;
var graph;
var oldXML;
var settingsPopupBody;
var horizontal = true;
var sourceCell;   // Used as a parent cell while adding new cell in graph.
var cellLabelChanged;
var isReadOnly = false;
var newEdge;
var existingEdgesBeforeUpdate;

designRouteEditor = function (serverXml, readOnly) {
    isReadOnly = readOnly;

    // Checks if browser is supported
    if (!mxClient.isBrowserSupported()) {
        // Displays an error message if the browser is
        // not supported.
        mxUtils.error('Browser is not supported!', 200, false);
    }
    else {
        // Workaround for Internet Explorer ignoring certain styles

        var container = document.getElementById('routeRditorGrid');
        var outline = document.getElementById('routeOutlineContainer');
        var toolsContainer = document.getElementById('routeToolsContainer');

        mxEvent.disableContextMenu(container);
        if (mxClient.IS_QUIRKS) {
            document.body.style.overflow = 'hidden';
            new mxDivResizer(container);
            new mxDivResizer(outline);
            new mxDivResizer(toolsContainer);
        }
        // Sets background colour
        container.style.background = '#FFFFFF';

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

        routeSetupGraphStyles(graph);

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
        layout.interRankCellSpacing = 150;
        layout.interHierarchySpacing = 100;
        // Allows the layout to move cells even though cells
        // aren't movable in the graph
        layout.isVertexMovable = function (cell) {
            return true;
        };
        var layoutMgr = new mxLayoutManager(graph);
        layoutMgr.getLayout = function (cell) {
            if (cell.getChildCount() > 0) {
                return layout;
            }
        };
        // Installs a popupmenu handler using local function (see below).
        graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
            return routeCreatePopupMenu(graph, menu, cell, evt, horizontal);
        };
        // Fix for wrong preferred size
        var oldGetPreferredSizeForCell = graph.getPreferredSizeForCell;
        graph.getPreferredSizeForCell = function (cell) {
            var result = oldGetPreferredSizeForCell.apply(this, arguments);
            if (result != null) {
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
        graph.convertValueToString = function (cell) {
            var data = cell.getValue();

            if (data) {
                try {
                    if (data.stateCd) {
                        return data.stateCd;
                    } else if (data.eventCd) {
                        return data.eventCd;
                    }
                } catch (exception) {

                }

                return data;
            }

            return '';
        };

        cellLabelChanged = graph.cellLabelChanged;
        graph.cellLabelChanged = function (cell, newValue, autoSize) {
            var data = cell.getValue();

            if (data) {
                try {
                    if (data.eventCd) {
                        return;
                    } else if (data.stateCd) {
                        data.stateCd = newValue;
                        newValue = data;

                        cellLabelChanged.apply(this, arguments);
                        return;
                    }
                } catch (exception) {

                }
            }

            cellLabelChanged.apply(this, arguments);
        };

        if (serverXml) {
            // Reads xml for graph obtained from server and renders it
            routeParseExistingGraphXml();
        } else {
            routeCreateNewGraph(graph);
        }
    }
};

// Parse existing XML into mxGraph
function routeParseExistingGraphXml(graph, xml) {
    var doc = mxUtils.parseXml(xml);
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, graph.getModel());

    var allVertices = graph.getChildVertices(graph.getDefaultParent());
    for (var index = 0; index < allVertices.length; index++) {
        graph.traverse(allVertices[index], true, function (vertex) {
            if (index == 0) {
                // To scroll graph so that our cell would appear in center
                graph.scrollCellToVisible(vertex, true);
            }

            routeAddOverlays(graph, vertex, index != 0, horizontal);
        });
    }
}

// Create new graph, delete existing edges/vertices if any
function routeCreateNewGraph(graph) {
    var latestVertex = null;

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();
    // Adds the root vertex of the tree
    graph.getModel().beginUpdate();
    try {
        // Clear exsting edges/vertices if any
        graph.removeCells(graph.getChildVertices(parent));

        var w = graph.container.offsetWidth;
        var h = graph.container.offsetHeight;
        latestVertex = graph.insertVertex(parent, 'treeRoot',
            '', w / 2, h / 2, 50, 50, 'start'/*, 'image=assets/js/mxGraph/images/house.png'*/);
        // graph.updateCellSize(v1);
        routeAddOverlays(graph, latestVertex, false, horizontal);
    }
    finally {
        // Updates the display
        graph.getModel().endUpdate();
    }

    // To scroll graph so that our cell would appear in center
    if (latestVertex) {
        graph.scrollCellToVisible(latestVertex, true);
    }

    return latestVertex;
}

function routeGetEdgesByStateCd(source) {
    var sourceEdges = [];
    var edges = graph.getChildEdges(graph.getDefaultParent());
  
    for (var edge of edges) {
      if (source.id == "treeRoot") {
        if (edge.source.id == source.id) {
          sourceEdges.push(edge);
        }
      } else if (edge != null && edge.value != null && edge.source != null && edge.source.value != null && !(typeof edge.source.value === 'string' || edge.source.value instanceof String) && !(typeof edge.value === 'string' || edge.value instanceof String)) {
        if (edge.source.value.stateId == source.value.stateId) {
          sourceEdges.push(edge);
        }
      }
    }
  
    return sourceEdges;
  }

// Function to create the entries in the popupmenu
function routeCreatePopupMenu(graph, menu, cell, evt, horizontal) {
    var model = graph.getModel();
    if (!isReadOnly && cell != null) {
        if (cell.id != 'treeRoot' && model.isVertex(cell) && cell.value && !(typeof cell.value === "string" || cell.value instanceof String)) {
            menu.addItem('Delete', './assets/js/mxGraph/images/delete.gif', function () {
                // Send event to typescript to delete selected vertex (state)
            });

            menu.addItem('Edit', '', function () {
                try {
                    sourceCell = cell;

                    var state = cell.value;
                    if (state && (typeof state === 'string' || state instanceof String)) {
                        state = null;
                    }

                    existingEdgesBeforeUpdate = routeGetEdgesByStateCd(sourceCell);

                    window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.updateState(state); })
                    showModal("stateModal");
                } catch (exception) {
                    // console.log(exception);
                }
            });
        }
        menu.addSeparator();
    }
    menu.addItem('Fit', './assets/js/mxGraph/images/zoom.gif', function () {
        graph.fit();
    });
    menu.addItem('Actual', './assets/js/mxGraph/images/zoomactual.gif', function () {
        graph.zoomActual();
    });
    menu.addSeparator();
    menu.addItem('Print', './assets/js/mxGraph/images/print.gif', function () {
        var scale = mxUtils.getScaleForPageCount(1, graph);
        var preview = new mxPrintPreview(graph, scale);
        preview.open();
    });
    menu.addItem('Poster Print', './assets/js/mxGraph/images/print.gif', function () {
        var pageCount = mxUtils.prompt('Enter maximum page count', '1');
        if (pageCount != null) {
            var scale = mxUtils.getScaleForPageCount(pageCount, graph);
            var preview = new mxPrintPreview(graph, scale);
            preview.open();
        }
    });
};

function routeAddOverlays(graph, cell, addDeleteIcon, horizontal) {
    graph.removeCellOverlays(cell);

    if (!isReadOnly && cell.style != 'end') {
        var overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/add.png', 24, 24), 'Add child');

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
                sourceCell = cell;

                if (sourceCell.id == 'treeRoot') {
                    var existingEdges = routeGetEdgesByStateCd(sourceCell);
                    if (existingEdges == 0) {
                        window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.addState(null); });
                        showModal("stateModal");
                        return;
                    } else {
                        window['appComponentRef'].zone.run(() => {
                            window['appComponentRef'].component.
                                showAppJSWarning("Not Allowed", "Root state can only have one child state. You can't create more than one child for root state.");
                        });
                        showModal("warningModal");
                        return;
                    }
                } else {
                    let parentState = sourceCell.value;
                    var existingEdges = routeGetEdgesByStateCd(sourceCell);
                    var sourceEvents = [];

                    for (var event of parentState.events) {
                        var unique = true;
                        for (var edge of existingEdges) {
                            if (event.eventCd == edge.value.eventCd) {
                                unique = false;
                                break;
                            }
                        }

                        if (unique) {
                            sourceEvents.push(event);
                        }
                    }

                    if (sourceEvents && sourceEvents.length > 0) {
                        window['flowComponentRef'].zone.run(() => { window['flowComponentRef'].component.addState(sourceEvents); });
                        showModal("stateModal");
                        return;
                    }
                }

                window['appComponentRef'].zone.run(() => {
                    window['appComponentRef'].component.
                        showAppJSWarning("No Events Left", "There aren't any source events from which the new state can be created.");
                });
                showModal("warningModal");
                return;
            } catch (exception) {

            }
        }));
        graph.addCellOverlay(cell, overlay);
    }

    if (!isReadOnly && addDeleteIcon) {
        overlay = new mxCellOverlay(new mxImage('./assets/js/mxGraph/images/close.png', 30, 30), 'Delete');
        overlay.cursor = 'hand';
        // overlay.offset = new mxPoint(-4, 8);
        overlay.align = mxConstants.ALIGN_RIGHT;
        overlay.verticalAlign = mxConstants.ALIGN_TOP;
        overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
            // Send event to typescript to delete selected vertex (state)
        }));

        graph.addCellOverlay(cell, overlay);
    }
};

function addChild(graph, cell, customObject, horizontal, stateCode, stateLabel, stateType) {
    var model = graph.getModel();
    var parent = graph.getDefaultParent();
    var vertex;
    model.beginUpdate();
    try {
      if (!stateLabel || stateLabel.length == 0) {
        stateLabel = 'Double click to set name';
      }
  
      var stateTrigger = null;
      if (customObject && customObject.trigger) {
        stateTrigger = customObject.trigger;
        customObject.trigger = null;
      }

      var routeType = route['@type'];
  
      var circleSize = 50;
      if (stateType == 'Start') {
        vertex = graph.insertVertex(parent, null, '', 0, 0, 0, 0, 'start', false);
        var cellId = vertex.id;
        var stateData = vertex.value;
        stateData.stateId = cellId;
        vertex.value = stateData;
  
        var geometry = model.getGeometry(vertex);
        geometry.width = circleSize;
        geometry.height = circleSize;
      } else if (routeType == 'ChoiceRouteStep') {
        vertex = graph.insertVertex(parent, null, customObject, 0, 0, 0, 0, 'decision', false);
        var cellId = vertex.id;
        var stateData = vertex.value;
        stateData.stateId = cellId;
        vertex.value = stateData;
  
        var size = graph.getPreferredSizeForCell(vertex);
        var geometry = model.getGeometry(vertex);
        geometry.width = size.width;
        geometry.height = size.height;
  
        if (sourceCell != null) {
          vertex.source = sourceCell;
        }
      } else if (stateType == 'End' || (customObject && customObject.events && customObject.events.length == 0)) {
        vertex = graph.insertVertex(parent, null, customObject, 0, 0, 0, 0, 'end', false);
        var cellId = vertex.id;
        var stateData = vertex.value;
        stateData.stateId = cellId;
        vertex.value = stateData;
  
        var geometry = model.getGeometry(vertex);
        geometry.width = circleSize;
        geometry.height = circleSize;
  
        if (sourceCell != null) {
          vertex.source = sourceCell;
        }
      } else {
        vertex = graph.insertVertex(parent, null, customObject);
        var cellId = vertex.id;
        var stateData = vertex.value;
        stateData.stateId = cellId;
        vertex.value = stateData;
  
        var size = graph.getPreferredSizeForCell(vertex);
        var geometry = model.getGeometry(vertex);
        geometry.width = size.width;
        geometry.height = size.height;
  
        if (sourceCell != null) {
          vertex.source = sourceCell;
        }
      }
  
      // vertex.source = cell;
  
      var edge = null;
      if (stateTrigger) {
        edge = graph.insertEdge(parent, null, stateTrigger, cell, vertex, null);
      } else {
        edge = graph.insertEdge(parent, null, '', cell, vertex, null);
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
      addOverlays(graph, vertex, true, horizontal);
    }
    finally {
      model.endUpdate();
    }
  
    return vertex;
  };
  
  routeGraphTools = function (choice) {
    switch (choice) {
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
        var scale = mxUtils.getScaleForPageCount(1, graph);
        var preview = new mxPrintPreview(graph, scale);
        preview.open();
        break;
      case 'POSTER_PRINT': // Poster Print
        var pageCount = prompt('Enter maximum page count', '1');
        if (pageCount != null) {
          var scale = mxUtils.getScaleForPageCount(pageCount, graph);
          var preview = new mxPrintPreview(graph, scale);
          preview.open();
        }
        break;
    }
  }

routeSetupGraphStyles = function (graph) {
    // Set some stylesheet options for the visual appearance of vertices
    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff';
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_FONTFAMILY] = 'Raleway';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_FONTSTYLE] = '1';
    style[mxConstants.STYLE_OVERFLOW] = 'width';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;

    var style = graph.getStylesheet().getDefaultVertexStyle();
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

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_STATE', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('ACTIVE_STATE', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('CLOSED_STATE', style);

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

    graph.getStylesheet().putCellStyle('decision', style);

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_DECISION', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#007BFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#FFFFFF';
    graph.getStylesheet().putCellStyle('ACTIVE_DECISION', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#007BFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#FFFFFF';
    graph.getStylesheet().putCellStyle('CLOSED_DECISION', style);

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

    graph.getStylesheet().putCellStyle('start', style);

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_START', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('ACTIVE_START', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('CLOSED_START', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_STROKEWIDTH] = '2';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    graph.getStylesheet().putCellStyle('end', style);

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('PENDING_END', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('ACTIVE_END', style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#007BFF';
    graph.getStylesheet().putCellStyle('CLOSED_END', style);

    // Sets the default style for edges
    style = graph.getStylesheet().getDefaultEdgeStyle();
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
    graph.getStylesheet().putCellStyle('multipleParents', style);
}